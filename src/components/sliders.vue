<template>
  <div style="
    position: absolute;
    z-index: 99;
    width: 230px;
    height: 200px;
    opacity: 0.8;
    left: 0px;
    top:50px;
    border: solid black 1px;
    border-radius: 7px;
    background: rgba(0,0,0,0.89)">
    <div style="
    position: relative;
    left:20px;
    width: 200px;
    height: 30px;">
      <el-slider
        v-model="value"
        show-stops
        :max="2016"
        :min="1995"
        @change="onValueChange"
      >
      </el-slider>
      <el-slider
        v-model="thresholdValue"
        show-stops
        range
        :min="-100"
        :format-tooltip="thresholdFormatTooltip"
        @change="onThresholdChange"
      ></el-slider>
      <el-slider
      v-model="opacityValue"
      show-stops
      :format-tooltip="opacityFormatTooltip"
      @change="onOpacityChange"
      ></el-slider>
      <el-slider
        v-model="noDataValue"
        show-stops
        range
        :min="-100"
        :format-tooltip="noDataValueFormatTooltip"
        @change="onNoDataValueChange"
      ></el-slider>
      <el-select
        @change="onSelectChange"
        v-model="defaultSelectValue">
        <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.value"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>

</template>

<script>
  export default {
    name: "slider",
    data() {
      return {
        value: 2016,
        thresholdValue: [0,100],
        opacityValue:100,
        noDataValue:[1,100],
        options:[
          {
            label:"选项1",
            value:"viridis"
          },
          {
            label:"选项2",
            value:"inferno"
          },
          {
            label:"选项3",
            value:"turbo"
          },
          {
            label:"选项4",
            value:"plasma"
          },
          {
            label:"选项5",
            value:"rainbow"
          },
          {
            label:"选项6",
            value:"jet"
          },
          {
            label:"选项7",
            value:"hsv"
          },
          {
            label:"选项8",
            value:"hot"
          },
          {
            label:"选项9",
            value:"cool"
          },
          {
            label:"选项10",
            value:"spring"
          },
          {
            label:"选项11",
            value:"summer"
          },
          {
            label:"选项12",
            value:"autumn"
          },
          {
            label:"选项13",
            value:"winter"
          },
          {
            label:"选项14",
            value:"bone"
          },
          {
            label:"选项15",
            value:"copper"
          },
          {
            label:"选项16",
            value:"greys"
          },
          {
            label:"选项17",
            value:"yignbu"
          },
          {
            label:"选项18",
            value:"greens"
          },
          {
            label:"选项19",
            value:"yiorrd"
          },
          {
            label:"选项20",
            value:"bluered"
          },
          {
            label:"选项21",
            value:"rdbu"
          },
          {
            label:"选项22",
            value:"picnic"
          },
          {
            label:"选项23",
            value:"portland"
          },
          {
            label:"选项24",
            value:"blackbody"
          },
          {
            label:"选项25",
            value:"earth"
          },
          {
            label:"选项26",
            value:"electric"
          },
          {
            label:"选项27",
            value:"magma"
          },

        ],
        defaultSelectValue:"greys"
      }
    },
    methods: {
      onValueChange: function (value) {
        this.$emit ( "changevalue", value )
      },
      onThresholdChange:function (value) {
        let thresholdValue=[value[0]/100,value[1]/100];
        this.$emit("onthresholdchange",thresholdValue)
      },
      onOpacityChange:function(val){
        this.$emit("onopacitychange",val/100)
      },
      onNoDataValueChange:function(val){
        let noDataValue=[val[0]/100,val[1]/100];
        this.$emit("onnodatavaluechange",noDataValue)
      },
      onSelectChange:function(val){
        this.$emit("onselectchange",val)
      },
      thresholdFormatTooltip:function (val) {
        return val/100
      },
      noDataValueFormatTooltip:function(val){
        return val/100
      },
      opacityFormatTooltip:function (val) {
        return val/100
      },

    }
  }
</script>

<style scoped>

</style>
