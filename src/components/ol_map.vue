<template>
  <div>
    <div id="map" ref="rootMap">
      <div style="position: absolute;z-index: 99;width: 80%;height: 30px">
        <el-button icon="el-icon-coordinate" plain></el-button>
        <el-button icon="el-icon-time" plain></el-button>
        <el-button icon="iconfont icon-Coordinate" plain></el-button>
        <el-button icon="iconfont icon-Line-Tool" plain></el-button>
        <el-button icon="iconfont icon-tool_polygon"
                   plain
                   @keydown.native="disActive"
                   @click="clip"
                   :disabled="isClipDisabled"
        >裁剪
        </el-button>
      </div>
      <slider
        @onthresholdchange="receiveThreshold"
        @changevalue="receive"
        @onopacitychange="receiveOpacity"
        @onselectchange="receiveColorScale"
        @onnodatavaluechange="receiveNoDataValue"
      ></slider>
    </div>
  </div>
</template>

<script>
  import 'ol/ol.css'
  import olmapConfig from '../configjs/olmapConfig.js'
  import Map from 'ol/Map'
  import View from 'ol/View'
  import {Image as ImageLayer, Vector as VectorLayer} from 'ol/layer'
  import {ImageCanvas, Vector as VectorSource} from 'ol/source'
  import {defaults} from 'ol/control'
  import Draw, {createBox} from 'ol/interaction/Draw'
  import slider from "@/components/sliders";
  import Tool_bar from "@/components/toolbar";
  import Echarts from "@/components/echarts";
  import ElCollapseTransition from "element-ui/lib/transitions/collapse-transition";
 

  export default {
    name: "ol_map",
    components: {ElCollapseTransition, Echarts, Tool_bar, slider},
    data() {
      return {
        map: null,
        yearValue: 2016,
        thresholdValue: [0, 1],
        opacity: 1.00,
        noDataValue: [0.001, 1],
        colorScale: "greys",
        tiffData: null,
        draw: null,
        screenbbox: null,
        diff_array:[]
      }
    },
    created(){

      let self=this;
      this.$bus.on("senddiffdata",function (diffData) {
        self.diff_array=diffData;
      });
      this.$bus.on("cleardiiffdata",function (res) {
        self.diff_array=res;
        self.addCanvasLayer(this.yearValue, this.thresholdValue, this.opacity, this.colorScale, this.noDataValue)
      })
    },
    props: ["isClipDisabled"],
    mounted() {
      const mapContainer = this.$refs.rootMap;
      this.map = new Map ( {
        controls: new defaults ( {attribution: false, zoom: false, rotate: false} ),
        target: mapContainer,
        layers: olmapConfig.layers (),
        view: new View ( {
          projection: "EPSG:4326",
          center: [115.05, 24.955],
          zoom: 12
        } )
      } );
      let canvasLayer = new ImageLayer ( {
        source: new ImageCanvas ( {
          canvasFunction: function () {
            return document.createElement ( "canvas" )
          }
        } )
      } );
      this.map.addLayer ( canvasLayer );
      this.addCanvasLayer ( this.yearValue, this.thresholdValue, this.opacity, this.colorScale, this.noDataValue )//初始化图层

    },
    methods: {
      addCanvasLayer: async function (yearValue, thresholdValue, opacity, colorScale, noDataValue,data) {
        let url = 'http://localhost:8081/geoserver/LingBeiNDVI/ows?' +
          'service=WCS&version=2.0.1&request=GetCoverage&CoverageId=LingBeiNDVI:' +
          yearValue +
          '&bbox=90.42732202682015,0.0,143.57267797317974,84.00816352991252' +
          '&width=485&height=768&srs=EPSG:4326&format=image/tiff';

        const response = await fetch ( url );
        const arrayBuffer = await response.arrayBuffer ();
        const tiff = await GeoTIFF.fromArrayBuffer ( arrayBuffer );
        const image = await tiff.getImage ();//绘制tif
        const resData = await image.readRasters ();
        // this.tiffData = resData;
        this.$root.vm.$emit ( "senddata", resData, yearValue );//触发事件，发送tiff像元数据
        let tiffData=null;
        if(data){
          tiffData=data
        }
        else {
          tiffData=resData[0]
        }
        let imageCanvasSource = new ImageCanvas ( {
          canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
            let map = this.map;
            //Canvas四至范围不同于当前地图四至范围，计算出南北方向与东西方向的偏移
            let mapExtent = map.getView ().calculateExtent ( map.getSize () );//当前底图视图范围的投影坐标
            let canvasOrigin = map.getPixelFromCoordinate ( [extent[0], extent[3]] );//添加到地图上的canvas图像的左上角投影坐标转
            let mapOrigin = map.getPixelFromCoordinate ( [mapExtent[0], mapExtent[3]] );
            let delta = [mapOrigin[0] - canvasOrigin[0], mapOrigin[1] - canvasOrigin[1]];

            //bbox
            let [maxx, maxy, minx, miny] = [115.15617340390186, 25.050718570270526, 114.94274414875684, 24.867893600833835];

            let [extentLeft, extentBottom, extentRight, extentTop] = extent; //坐标投影

            let screenPointLeftTop = map.getPixelFromCoordinate ( [minx, maxy] );//换算图片屏幕左上角
            let screenPointRightBottom = map.getPixelFromCoordinate ( [maxx, miny] );//换算图片屏幕右下角
            this.screenbbox = [screenPointLeftTop[0], screenPointLeftTop[1], screenPointRightBottom[0], screenPointRightBottom[1]];
            let width = Math.abs ( screenPointRightBottom[0] - screenPointLeftTop[0] );//实时计算图片的宽高
            let height = Math.abs ( screenPointLeftTop[1] - screenPointRightBottom[1] );

            let tempCanvas = document.getElementById ( 'canvas' );//缓存图像的canvas
            tempCanvas.style.display = 'none';
            let tempCtx = tempCanvas.getContext ( '2d' );//画布对象
            //在画布上绘制
            let plot = new plotty.plot ( {
              canvas: document.getElementById ( 'canvas' ),
              data: tiffData,
              height: resData.height,//665
              width: resData.width,//709
              domain: thresholdValue,
              colorScale: colorScale,
              noDataValue: noDataValue,
              useWebGL: false
            } );
            plot.render ();
            let plotImageData = tempCtx.getImageData ( 0, 0, 709, 665 );//拿到imagedata
            let canvas = document.createElement ( 'canvas' );
            canvas.width = size[0];
            canvas.height = size[1];
            let ctx = canvas.getContext ( '2d' );
            let x = (mapOrigin[0] + delta[0] + screenPointLeftTop[0]);//左上角位置
            let y = (mapOrigin[1] + delta[1] + screenPointLeftTop[1]);
            ctx.globalAlpha = opacity;
            ctx.drawImage ( tempCanvas, 0, 0, plotImageData.width, plotImageData.height, x, y, width, height );

            return canvas
          }
        } );
        this.map.getLayers ().array_[1].setSource ( imageCanvasSource )
      },
      receive: function (data) {
        this.yearValue = data;

      },
      receiveThreshold: function (data) {
        this.thresholdValue = data
      },
      receiveOpacity: function (data) {
        this.opacity = data;
      },
      receiveColorScale: function (data) {
        this.colorScale = data
      },
      receiveNoDataValue: function (data) {
        this.noDataValue = data;
      },
      clip: function () {
        const that = this;
        const map = this.map;
        if (map.getLayers ().array_.length >= 3) {
          map.removeLayer ( map.getLayers ().array_[2] )
        }
        let source = new VectorSource ( {
          wrapX: false
        } );
        let vectorLayer = new VectorLayer ( {
          source: source
        } );
        map.addLayer ( vectorLayer );
        this.draw = new Draw ( {
          source: source,
          type: "Circle",
          geometryFunction: createBox ()
        } );
        let draw = this.draw;
        map.addInteraction ( draw );

        draw.on ( 'drawend', function (geom) {

          const coords = geom.feature.values_.geometry.flatCoordinates;
          const extent = [map.getPixelFromCoordinate ( [coords[0], coords[1]] ), map.getPixelFromCoordinate ( [coords[4], coords[5]] )];
          const [minx, maxy, maxx, miny] = [Math.min ( extent[0][0], extent[1][0] ), Math.max ( extent[0][1], extent[1][1] ), Math.max ( extent[0][0], extent[1][0] ), Math.min ( extent[0][1], extent[1][1] )];
          const [left, top, right, bottom] = that.screenbbox;
          const width = that.screenbbox[2] - that.screenbbox[0];
          const height = that.screenbbox[3] - that.screenbbox[1];
          const screenExtent = [parseInt ( (minx - left) * 709 / width ), parseInt ( (miny - top) * 665 / height ),
            parseInt ( (width - (right - maxx)) * 709 / width ),
            parseInt ( (height - (bottom - maxy)) * 665 / height )];
          that.$root.vm.$emit ( "ondrawend", screenExtent );
          map.removeInteraction ( draw );
        } )
      },
      disActive: function () {
        if (this.draw !== null) {
          this.map.removeInteraction ( this.draw )
        }
      },
      show_diff:function () {
        this.$root.vm.$on("senddiffdata",function (diffdata) {

        });
      }
    },
    watch: {
      yearValue: function (nVal, oVal) {
        if(this.diff_array.length===0){
        if (nVal > 1995 && nVal < 2001) {

        } else {
          this.addCanvasLayer ( nVal, this.thresholdValue, this.opacity, this.colorScale, this.noDataValue )
        }}
        else {
          this.addCanvasLayer( this.yearValue, this.thresholdValue, this.opacity, this.colorScale, this.noDataValue ,this.diff_array)
        }
      },
      thresholdValue: function (nVal, oVal) {
        if(this.diff_array.length===0){
        this.addCanvasLayer ( this.yearValue, nVal, this.opacity, this.colorScale, this.noDataValue )}
        else {
          this.addCanvasLayer( this.yearValue, this.thresholdValue, this.opacity, this.colorScale, this.noDataValue ,this.diff_array)
        }
      },
      opacity: function (nVal, oVal) {
        if(this.diff_array.length===0){
        this.addCanvasLayer ( this.yearValue, this.thresholdValue, nVal, this.colorScale, this.noDataValue )}
        else {
          this.addCanvasLayer( this.yearValue, this.thresholdValue, this.opacity, this.colorScale, this.noDataValue ,this.diff_array)
        }
      },
      noDataValue: function (nVal, oVal) {
        if(this.diff_array.length===0){
        this.addCanvasLayer ( this.yearValue, this.thresholdValue, this.opacity, this.colorScale, nVal )}
        else {
          this.addCanvasLayer( this.yearValue, this.thresholdValue, this.opacity, this.colorScale, this.noDataValue ,this.diff_array)
        }
      },
      colorScale: function (nVal, oVal) {
        if(this.diff_array.length===0){
        this.addCanvasLayer ( this.yearValue, this.thresholdValue, this.opacity, nVal, this.noDataValue )}
        else {
          this.addCanvasLayer( this.yearValue, this.thresholdValue, this.opacity, this.colorScale, this.noDataValue ,this.diff_array)
        }
      },
      isClipDisabled: function (nVal, oVal) {
        const map=this.map;
        if (nVal === true) {
          if (map.getLayers ().array_.length >= 3) {
            map.removeLayer ( map.getLayers ().array_[2] )
          }
        }
      },
      diff_array:function (nVal, oVal) {
        this.addCanvasLayer( this.yearValue, this.thresholdValue, this.opacity, this.colorScale, this.noDataValue ,nVal)
      }
    },

  }
</script>

<style scoped>
  #map {
    position: relative;
    width: 100%;
    height: 100%;
  }

</style>
