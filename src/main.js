import Vue from 'vue';
import App from './App';
import '@assets/css/main.less';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  render: (h) => h(App),
}).$mount('#app');

// 注册serviceWorker
// 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        console.log('serviceworker注册成功了~');
      })
      .catch(() => {
        console.log('serviceworker注册失败了~');
      });
  });
}
