<template>
  <div>
    multitime_analysis
  </div>
</template>

<script>

  import getGeotiffData from "@/configjs/getGeotiffData";

  export default {
    name: "mutitime_analysis",
    data() {
      return {
        pixelBlock: []
      }
    },
    mounted() {
      getGeotiffData.getData().then(res=>{
        let vueWorker = this.$worker.run ( get (res), [res] ).then ( data => {
          console.log ( data )
        } );
      });
      function get1(res) {
        function arrSum(array) {
          // let sum = 0;
          // sum = parseFloat ( eval ( array.join ( "+" ) ) );
          // return sum
          return array.reduce ( (acc, val) => acc + val, 0 )
        }

        function standardDeviation(arr, usePopulation = false) {
          const mean = arrSum ( arr ) / arr.length;
          return Math.sqrt (
            arr.reduce ( (acc, val) => acc.concat ( (val - mean) ** 2 ), [] ).reduce ( (acc, val) => acc + val, 0 ) /
            (arr.length - (usePopulation ? 0 : 1))
          );
        }
        let rareThresholdValue = [];
        let vegThresholdValue = [];
        //阈值数组
        let minArray = [];
        let maxArray = [];
        let cvArray = [];
        let minRareYearArray = [];
        let minVegYearArray = [];
        let maxVegYearArray = [];
        let maxPreArray = [];
        let maxPostArray = [];
        let maxPreRareYearArray = [];
        let maxPreVegYearArray = [];
        let maxPostVegYearArray = [];//核心算法
        for (let i = 0; i < res[0].length; i ++) {
          const y0=res[0][i];
          const y1=res[1][i];
          const y2=res[2][i];
          const y3=res[3][i];
          const y4=res[4][i];
          const y5=res[5][i];
          const y6=res[6][i];
          const y7=res[7][i];
          const y8=res[8][i];
          const y9=res[9][i];
          const y10=res[10][i];
          const y11=res[11][i];
          const y12=res[12][i];
          const y13=res[13][i];
          const y14=res[14][i];
          const y15=res[15][i];
          const y16=res[16][i];
          let calcArray=[y0,y1,y2,y3,y4,y5,y6,y7,y8,y9,y10,y11,y12,y13,y14,y15,y16]
          const len = calcArray.length;
          let avg=arrSum(calcArray)/len;
          if (avg === 0) {
            cvArray.push ( 0 );
            minArray.push ( 0 );
            maxArray.push ( 0 );
            maxPreArray.push ( 0 );
            maxPostArray.push ( 0 );

            minRareYearArray.push ( 0 );
            minVegYearArray.push ( 0 );
            maxVegYearArray.push ( 0 );
            maxPreRareYearArray.push ( 0 );
            maxPreVegYearArray.push ( 0 );
            maxPostVegYearArray.push ( 0 );
          } else {
            let min = Math.min ( ...calcArray);
            let minIndex = calcArray.indexOf ( min )//最小值所在索引
            let preMax = Math.max ( ...calcArray.slice ( 0, minIndex ) );//扰动前最大值
            let postMax = Math.max ( ...calcArray.slice ( minIndex, len ) );//扰动后最大值
            let max = Math.max ( ...calcArray );
            let std = standardDeviation ( calcArray );
            let cv = std / avg;
            cvArray.push ( cv );
            minArray.push ( min );
            maxArray.push ( max );
            maxPreArray.push ( preMax );
            maxPostArray.push ( postMax );

            minRareYearArray.push ( rareThresholdValue[calcArray.indexOf ( min )] );
            minVegYearArray.push ( vegThresholdValue[calcArray.indexOf ( min )] );
            maxVegYearArray.push ( vegThresholdValue[calcArray.indexOf ( max )] );
            maxPreRareYearArray.push ( rareThresholdValue[calcArray.indexOf ( preMax )] );
            maxPreVegYearArray.push ( vegThresholdValue[calcArray.indexOf ( preMax )] );
            maxPostVegYearArray.push ( rareThresholdValue[calcArray.indexOf ( postMax )] )
          }
        }

        console.log ( cvArray )
      }

      function get(res) {
        function arrSum(array) {
          // let sum = 0;
          // sum = parseFloat ( eval ( array.join ( "+" ) ) );
          // return sum
           return array.reduce ( (acc, val) => acc + val, 0 )
        }

        function standardDeviation(arr, usePopulation = false) {
          const mean = arrSum ( arr ) / arr.length
          return Math.sqrt (
            arr.reduce ( (acc, val) => acc.concat ( (val - mean) ** 2 ), [] ).reduce ( (acc, val) => acc + val, 0 ) /
            (arr.length - (usePopulation ? 0 : 1))
          );
        }

        let rareThresholdValue = [];
        let vegThresholdValue = [];
        //阈值数组
        let minArray = [];
        let maxArray = [];
        let cvArray = [];
        let minRareYearArray = [];
        let minVegYearArray = [];
        let maxVegYearArray = [];
        let maxPreArray = [];
        let maxPostArray = [];
        let maxPreRareYearArray = [];
        let maxPreVegYearArray = [];
        let maxPostVegYearArray = [];//核心算法
        //进行转置
        let calcArray = getGeotiffData.transverseArray ( res );
        const len = calcArray[0].length;

        for (let i = 0; i < calcArray.length; i ++) {
          let avg = arrSum ( calcArray[i] ) / len;
          if (avg === 0) {
            cvArray.push ( 0 );
            minArray.push ( 0 );
            maxArray.push ( 0 );
            maxPreArray.push ( 0 );
            maxPostArray.push ( 0 );

            minRareYearArray.push ( 0 );
            minVegYearArray.push ( 0 );
            maxVegYearArray.push ( 0 );
            maxPreRareYearArray.push ( 0 );
            maxPreVegYearArray.push ( 0 );
            maxPostVegYearArray.push ( 0 );
          } else {
            let min = Math.min ( ...calcArray[i] );
            let minIndex = calcArray[i].indexOf ( min )//最小值所在索引
            let preMax = Math.max ( ...calcArray[i].slice ( 0, minIndex ) );//扰动前最大值
            let postMax = Math.max ( ...calcArray[i].slice ( minIndex, len ) );//扰动后最大值
            let max = Math.max ( ...calcArray[i] );
            let std = standardDeviation ( calcArray[i] );
            let cv = std / avg;
            cvArray.push ( cv );
            minArray.push ( min );
            maxArray.push ( max );
            maxPreArray.push ( preMax );
            maxPostArray.push ( postMax );

            minRareYearArray.push ( rareThresholdValue[calcArray[i].indexOf ( min )] );
            minVegYearArray.push ( vegThresholdValue[calcArray[i].indexOf ( min )] );
            maxVegYearArray.push ( vegThresholdValue[calcArray[i].indexOf ( max )] );
            maxPreRareYearArray.push ( rareThresholdValue[calcArray[i].indexOf ( preMax )] );
            maxPreVegYearArray.push ( vegThresholdValue[calcArray[i].indexOf ( preMax )] );
            maxPostVegYearArray.push ( rareThresholdValue[calcArray[i].indexOf ( postMax )] )
          }
        }
        console.log ( cvArray )
      }

      // getGeotiffData.getData ().then ( res => {
      //   let rareThresholdValue = [];
      //   let vegThresholdValue = [];
      //   //阈值数组
      //   let minArray = [];
      //   let maxArray = [];
      //   let cvArray =[];
      //   let minRareYearArray = [];
      //   let minVegYearArray = [];
      //   let maxVegYearArray = [];
      //   let maxPreArray = [];
      //   let maxPostArray = [];
      //   let maxPreRareYearArray = [];
      //   let maxPreVegYearArray = [];
      //   let maxPostVegYearArray = [];//核心算法
      //   //进行转置
      //   let calcArray = getGeotiffData.transverseArray ( res );
      //   const len = calcArray[0].length;
      //
      //   for (let i = 0; i < calcArray.length; i ++) {
      //     let avg = this.arrSum ( calcArray[i] ) / len;
      //     if(avg===0){
      //       cvArray.push ( 0 );
      //       minArray.push ( 0 );
      //       maxArray.push ( 0 );
      //       maxPreArray.push ( 0 );
      //       maxPostArray.push ( 0 );
      //
      //       minRareYearArray.push ( 0 );
      //       minVegYearArray.push ( 0 );
      //       maxVegYearArray.push ( 0 );
      //       maxPreRareYearArray.push ( 0 );
      //       maxPreVegYearArray.push ( 0 );
      //       maxPostVegYearArray.push ( 0 );
      //     }else {
      //     let min = Math.min(...calcArray[i]) ;
      //     let minIndex = calcArray[i].indexOf ( min )//最小值所在索引
      //     let preMax=Math.max(...calcArray[i].slice(0,minIndex));//扰动前最大值
      //     let postMax=Math.max(...calcArray[i].slice(minIndex,len));//扰动后最大值
      //     let max=Math.max(...calcArray[i]);
      //     let std=this.standardDeviation(calcArray[i]);
      //     let cv=std/avg;
      //     cvArray.push ( cv );
      //     minArray.push ( min );
      //     maxArray.push ( max );
      //     maxPreArray.push ( preMax );
      //     maxPostArray.push ( postMax );
      //
      //     minRareYearArray.push ( rareThresholdValue[calcArray[i].indexOf ( min )] );
      //     minVegYearArray.push ( vegThresholdValue[calcArray[i].indexOf ( min )] );
      //     maxVegYearArray.push ( vegThresholdValue[calcArray[i].indexOf ( max )] );
      //     maxPreRareYearArray.push ( rareThresholdValue[calcArray[i].indexOf ( preMax )] );
      //     maxPreVegYearArray.push ( vegThresholdValue[calcArray[i].indexOf ( preMax )] );
      //     maxPostVegYearArray.push ( rareThresholdValue[calcArray[i].indexOf ( postMax )] )
      //   }}
      //   console.log(cvArray)
      // } );
    },
    methods: {
      arrSum: function (array) {
        let sum = 0;
        sum = parseFloat ( eval ( array.join ( "+" ) ) );
        return sum
      },
      standardDeviation: function (arr, usePopulation = false) {
        const mean = this.arrSum ( arr ) / arr.length
        return Math.sqrt (
          arr.reduce ( (acc, val) => acc.concat ( (val - mean) ** 2 ), [] ).reduce ( (acc, val) => acc + val, 0 ) /
          (arr.length - (usePopulation ? 0 : 1))
        );
      }
    }
  }
</script>

<style scoped>

</style>
