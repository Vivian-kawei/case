// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import cse from 'components/cse/cse';
import model from 'components/model/model';
import NProgress from 'nprogress';// vue nprogress loading bar
import 'nprogress/nprogress.css';// 进度条样式
Vue.use(VueRouter);
Vue.use(VueResource);

// NProgress 进度条配置
NProgress.configure({
    minimum: 0.1, // 在开始使用的最小百分比变化
    easing: 'ease',
    speed: 1500,
    showSpinner: false // 关闭旋转圈
});

let router = new VueRouter({
  routes: [
    { path: '/', name: 'cse', component: cse },
    { path: '/cse/:id', name: 'cse_id', component: cse },
    { path: '/model/:id', name: 'model', component: model }
  ]
});

/**
*注入http请求拦截器
*使用进度条显示载入
*/
Vue.http.interceptors.push((request, next) => {
    NProgress.start();
    next((response) => {
        NProgress.done();
    });
});

window.vue = new Vue({
  router
}).$mount('#app');
