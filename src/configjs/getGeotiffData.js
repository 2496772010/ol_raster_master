let statisticData = async function (extent) {
  let allData = [];
  let yearValue = 0;
  for (let i = 0; i < 17; i ++) {
    if (i === 0) {
      yearValue = 1995
    } else {
      yearValue = 2000 + i
    }
    let url = 'http://localhost:8081/geoserver/LingBeiNDVI/ows?' +
      'service=WCS&version=2.0.1&request=GetCoverage&CoverageId=LingBeiNDVI:' +
      yearValue +
      '&bbox=90.42732202682015,0.0,143.57267797317974,84.00816352991252' +
      '&width=485&height=768&srs=EPSG:4326&format=image/tiff';

    const response = await fetch ( url );
    const arrayBuffer = await response.arrayBuffer ();
    const tiff = await GeoTIFF.fromArrayBuffer ( arrayBuffer );
    const image = await tiff.getImage ();
    let window = [200, 0, 400, 100];
    const data = await image.readRasters ( {
     window:extent
    } );
    allData.push ( data[0] )
  }
  let allYaxis = [];

  for (let i = 0; i < allData.length; i ++) {//循环计算y轴数据
    allYaxis.push ( calculateChart ( allData[i] ) );
  }
  //转置数组
  let traverseAllYaxis = transverseArray ( allYaxis );
  return traverseAllYaxis;
};

function calculateChart(array) {
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  let e = 0;
  for (let i = 0; i < array.length; i ++) {
    let value = array[i];
    if (value < 0) {
      a ++;
    } else if (value > 0 && value <= 0.25) {
      b ++;
    } else if (value > 0.25 && value <= 0.5) {
      c ++;
    } else if (value > 0.5 && value <= 0.75) {
      d ++;
    } else if (value > 0.75 && value <= 1) {
      e ++;
    }
  }
  return [a, b, c, d, e]

}

function transverseArray(array) {
  let transverseArray = [];
  for (let i = 0; i < array[0].length; i ++) {
    transverseArray[i] = [];//为新数组开辟空间
  }
  for (let x = 0; x < array.length; x ++) {
    //遍历每一个具体值
    for (let j = 0; j < array[x].length; j ++) {
      transverseArray[j][x] = array[x][j]
    }
  }
  return transverseArray;
}
async function getData(extent){
  let allData=[];
  let yearValue=0;
  for (let i = 0; i < 17; i ++) {
    if (i === 0) {
      yearValue = 1995
    } else {
      yearValue = 2000 + i
    }
    let url = 'http://localhost:8081/geoserver/LingBeiNDVI/ows?' +
      'service=WCS&version=2.0.1&request=GetCoverage&CoverageId=LingBeiNDVI:' +
      yearValue +
      '&bbox=90.42732202682015,0.0,143.57267797317974,84.00816352991252' +
      '&width=485&height=768&srs=EPSG:4326&format=image/tiff';

    const response = await fetch ( url );
    const arrayBuffer = await response.arrayBuffer ();
    const tiff = await GeoTIFF.fromArrayBuffer ( arrayBuffer );
    const image = await tiff.getImage ();
    let window = [200, 0, 400, 100];
    const data = await image.readRasters ( {
      window:extent
    } );
    allData.push ( data[0] )
  }
  return allData
}
let getGeotiffData = {
  data: statisticData,
  getData:getData
};
export default getGeotiffData
