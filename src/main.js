import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router/router'
import store from './store/index'
import ElementUI from 'element-ui'
import Misc from './components/js/misc.js'
import './scss/common/element-ui.scss'
import './assets/system/iconfont.css'
import {search,splitpanel, tabset, grid,autoform,subwindow, pagination,dropdown,
	editor, button,uploadImg,navmenu,switchButton,report} from '@/components/js/elements'
Vue.component('grid',grid);
Vue.component('search',search);
Vue.component('splitpanel',splitpanel);
Vue.component('tabset',tabset);
Vue.component('autoform',autoform);
Vue.component('subwindow',subwindow);
Vue.component('pagination',pagination);
Vue.component('dropdown',dropdown);
Vue.component('editor',editor);
Vue.component('view-button',button);
Vue.component('uploadImg',uploadImg);
Vue.component('navmenu',navmenu);
Vue.component('view-switch',switchButton);
Vue.component('report',report);

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(Misc);
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
