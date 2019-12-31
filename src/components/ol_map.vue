<template>
  <div>
    <div id="map" ref="rootMap">
      <slider
        @onthresholdchange="receiveThreshold"
        @changevalue="receive"
        @onopacitychange="receiveOpacity"
        @onselectchange="receiveColorScale"
      ></slider>
      <tool_bar></tool_bar>
    </div>
  </div>
</template>

<script>
  import 'ol/ol.css'
  import olmapConfig from '../configjs/olmapConfig.js'
  import Map from 'ol/Map'
  import View from 'ol/View'
  import {Image as ImageLayer} from 'ol/layer'
  import {ImageCanvas} from 'ol/source'
  import {defaults} from 'ol/control'
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
        colorScale: "greys",
        tiffData:null
      }
    },
    props: ["isShowPane"],
    mounted() {
      const mapContainer = this.$refs.rootMap;
      this.map = new Map ( {
        controls: new defaults ( {attribution: false, zoom: false, rotate: false} ),
        target: mapContainer,
        layers: olmapConfig.layers (),
        view: new View ( {
          projection: "EPSG:4326",
          center: [115.1, 25],
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
      this.addCanvasLayer ( this.yearValue, this.thresholdValue, this.opacity, this.colorScale )//初始化图层
    },
    methods: {
      addCanvasLayer: async function (yearValue, thresholdValue, opacity, colorScale) {
        let url = 'http://localhost:8081/geoserver/LingBeiNDVI/ows?' +
          'service=WCS&version=2.0.1&request=GetCoverage&CoverageId=LingBeiNDVI:' +
          yearValue +
          '&bbox=90.42732202682015,0.0,143.57267797317974,84.00816352991252' +
          '&width=485&height=768&srs=EPSG:4326&format=image/tiff';

        const response = await fetch ( url );
        const arrayBuffer = await response.arrayBuffer ();
        const tiff = await GeoTIFF.fromArrayBuffer ( arrayBuffer );
        const image = await tiff.getImage ();//绘制tif
        const data = await image.readRasters ();
        this.tiffData=data;
        this.$root.vm.$emit("senddata",data)//触发事件，发送tiff像元数据
        let imageCanvasSource = new ImageCanvas ( {
          canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
            let map = this.map;
            //Canvas四至范围不同于当前地图四至范围，计算出南北方向与东西方向的偏移
            let mapExtent = map.getView ().calculateExtent ( map.getSize () );//当前底图视图范围的投影坐标
            let canvasOrigin = map.getPixelFromCoordinate ( [extent[0], extent[3]] );//添加到地图上的canvas图像的左上角投影坐标转
            let mapOrigin = map.getPixelFromCoordinate ( [mapExtent[0], mapExtent[3]] );
            let delta = [mapOrigin[0] - canvasOrigin[0], mapOrigin[1] - canvasOrigin[1]];

            //bbox
            let [maxx, maxy, minx, miny] = [115.15625105321688, 25.05076432507324, 114.94282181742606, 24.86793945347697];
            let [extentLeft, extentBottom, extentRight, extentTop] = extent; //坐标投影

            let screenPointLeftTop = map.getPixelFromCoordinate ( [minx, maxy] );//换算图片屏幕左上角
            let screenPointRightBottom = map.getPixelFromCoordinate ( [maxx, miny] );//换算图片屏幕右下角
            let width = Math.abs ( screenPointRightBottom[0] - screenPointLeftTop[0] );//实时计算图片的宽高
            let height = Math.abs ( screenPointLeftTop[1] - screenPointRightBottom[1] );

            let tempCanvas = document.getElementById ( 'canvas' );//缓存图像的canvas
            tempCanvas.style.display = 'none';
            let tempCtx = tempCanvas.getContext ( '2d' );//画布对象
            //在画布上绘制
            let plot = new plotty.plot ( {
              canvas: document.getElementById ( 'canvas' ),
              data: data[0],
              height: data.height,//665
              width: data.width,//709
              domain: thresholdValue,
              colorScale: colorScale,
              noDataValue: 0,
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
      }
    },
    watch: {
      yearValue: function (nVal, oVal) {

        if (nVal > 1995 && nVal < 2001) {

        } else {
          this.addCanvasLayer ( nVal, this.thresholdValue, this.opacity, this.colorScale )
          // this.$root.vm.$emit("senddata",this.tiffData)//触发事件，发送tiff像元数据
        }
      },
      thresholdValue: function (nVal, oVal) {
        this.addCanvasLayer ( this.yearValue, nVal, this.opacity, this.colorScale )
      },
      opacity: function (nVal, oVal) {
        this.addCanvasLayer ( this.yearValue, this.thresholdValue, nVal, this.colorScale )
      },
      colorScale: function (nVal, oVal) {
        this.addCanvasLayer ( this.yearValue, this.thresholdValue, this.opacity, nVal )
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
