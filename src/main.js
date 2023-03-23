import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'

import Vant from 'vant';
import 'vant/lib/index.less';
// import 'vant/lib/picker/style/less';


import vView from 'vue-view-lazy'
Vue.use(vView, {
  error: 'https://img0.baidu.com/it/u=1412098720,4275359013&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1677085200&t=3835242afd2e42b8e84e53a6214281ac',
  // loading:'../../static/images/loading.gif',
  loading: 'https://img.zcool.cn/community/017ccc599d4688a80121ad7bc36541.gif',
});

Vue.use(Vant);

Vue.config.productionTip = false

// import axios from 'axios'
// axios.defaults.withCredentials = true;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')


