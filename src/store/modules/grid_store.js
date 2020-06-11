export default {
	state: {
		switchvalue:"",
	},
	mutations: {
		initswitchvalue (state, val) {
			state.switchvalue=val;
		},
		setSwitchValue(state,val){
			state.switchvalue=val;
			
		}
	}
}
