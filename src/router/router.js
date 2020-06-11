import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routers'
import store from '../store/'
Vue.use(VueRouter)
const router = new VueRouter({
	mode: 'history',
	//base:"/vue_web",
	routes: routes
})

// router.beforeEach((to, from, next) => {
//   // 在路由全局钩子beforeEach中，根据keepAlive属性，统一设置页面的缓存性
//   // 作用是每次进入该组件，就将它缓存
//   console.log('store.state.Global.',store.state.Global.keepAliveComponents,to.name)
//   const exist = store.state.Global.keepAliveComponents.indexOf(to.name)
//   if (exist!=-1) {
//     console.log("清除缓存")
//     this.$destroy()
//   }
//   next()
// })

export default router
