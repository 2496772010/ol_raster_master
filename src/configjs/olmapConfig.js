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
  let OSMTileLayer = new TileLayer ( {
    source: new OSM ()
  } );
  return [googleTileLayer]
};
let olMapConfig = {
  layers: layers
};

export default olMapConfig
