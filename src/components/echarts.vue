<template>
  <div>
    <div id="globalAnalysisChart" :style="{position:'relative',width: '300px', height: '300px',display:'block'}"></div>
  </div>
</template>

<script>
  export default {
    name: "echarts",
    props: ["data"],
    data() {
      return {
        // globalAnalysisChart:thi.$echarts.init(document.getElementById("globalAnalysisChart"))
      }
    },
    mounted() {
      this.drawLine ()

    },
    methods: {
      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init ( document.getElementById ( 'globalAnalysisChart' ) );
        this.$root.vm.$on("senddata",function (data) {
          console.log(data);
          let a=0,b=0,c=0,d=0,e=0;
          let pixelArray=data[0];
          for (let i = 0; i < pixelArray.length; i ++) {
            let value=pixelArray[i]
            if(value<0){
              a++;
            }
            else if(value>0&&value<=0.25){
              b++;
            }
            else if(value>0.25&&value<=0.5){
              c++;
            }
            else if(value>0.5&&value<=0.75){
              d++;
            }
            else if (value > 0.75 && value <= 1) {
              e++;
            }
          }
          // 绘制图表
          myChart.setOption ( {
            title: {text: '全局分析'},
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: ["-1.00~0.00", "0.00~0.25", "0.25~0.50", "0.50~0.75", "0.75~1.00"]
            },
            series: [
              {
                name: 'NDVI',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {value: a, name: '-1.00~0.00'},
                  {value: b, name: '0.00~0.25'},
                  {value: c, name: '0.25~0.50'},
                  {value: d, name: '0.50~0.75'},
                  {value: e, name: '0.75~1.00'}
                ]
              }
            ]
          } );
        });

      }

    }

  }
</script>

<style scoped>

</style>
