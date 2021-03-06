// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'
import VueWorker from "vue-worker"
Vue.use(VueWorker)
import vueBs from 'vue-bus'
Vue.use(vueBs);

Vue.prototype.$echarts=echarts;
Vue.use(ElementUI);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render:h=>h(App),
  components: { App },
  template: '<App/>',
  data(){
    return{
      vm:new Vue()//用于子组件间通信
    }
  }
});
