import Vue from 'vue'
import Vuex from 'vuex'
import grid_store from '@/store/modules/grid_store'
import Global from './modules/global'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

const vuex = new Vuex.Store({
	modules: {
		Global,
		grid_store,
	},
	strict: debug,
})

export default vuex