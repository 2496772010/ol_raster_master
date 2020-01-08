import {Tile as TileLayer, Image as ImageLayer, Vector as VectorLayer} from 'ol/layer'
import {
  OSM, Raster as RasterSource, TileWMS, ImageWMS, BingMaps,
  TileArcGISRest, TileImage, XYZ, Vector as VectorSource, ImageCanvas as ImageCanvas
} from 'ol/source'
import {Stroke, Style, Fill, Circle} from 'ol/style'
import Draw, {createRegularPolygon, createBox} from 'ol/interaction/Draw';


//图层管理
let layers = function () {
  let googleTileLayer = new TileLayer ( {
    source: new XYZ ( {
      url: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
    } )
  } );//谷歌影像图层
  let bingMapsTileLayer = new TileLayer ( {
    source: new BingMaps ( {
      key: 'AlLWcZPikbKPRGmqGgngDWtCDrkjMwSerppKGvDovTZ3VEDtUGCzI-nlYtUwrwTG',
      imagerySet: 'AerialWithLabelsOnDemand'
    } )
  } );
  let TMapTileLayer=new TileLayer( {
    source: new XYZ ( {
      url: 'https://t0.tianditu.gov.cn/img_w/wmts?SER' +
        'VICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=de' +
        'fault&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b0811d4defb88fbf533bf90bb773c96e'
    } )
  });
  let urlTemplate="https://services.arcgisonline.com/arcgis/rest/services/" +
    "ESRI_Imagery_World_2D/MapServer/tile/{z}/{y}/{x}";
  let ArcgisTileLayer=new TileLayer({
    source:new XYZ({
      maxZoom:20,
      projection: "EPSG:4326",
      tileSize:512,
      tileUrlFunction: function(tileCoord) {

        return urlTemplate.replace('{z}', (tileCoord[0] - 1).toString())
          .replace('{x}', tileCoord[1].toString())
          .replace('{y}', tileCoord[2].toString());
      },
      wrapX: true
    })
  });
  let OSMTileLayer = new TileLayer ( {
    source: new OSM ()
  } );
  return [TMapTileLayer]
};
let olMapConfig = {
  layers: layers
};

export default olMapConfig
