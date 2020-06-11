let xh=0;
var myStorage = {
	setItem(key, val, ...rest){
		const oldvalue=window.localStorage.getItem(key);
		if(oldvalue!==val){
			const arr=this.methods[key];
			if(arr!=null&&arr.length>0){
				arr.forEach(dx=>{try{dx.method(val,oldvalue);}catch(e){}})
			}
			window.localStorage.setItem(key,val);
		}
	},
	getItem(key){
		return window.localStorage.getItem(key)
	},
	addEvent(name,evt){
		if(this.methods[name]==null)this.methods[name]=[];
		const key="E"+(++xh);
		this.methods[name].push({name:name,method:evt,key:key});
		return key;
	},methods:{},
	removeEvent(keys){
		const dx={},ids=","+keys.join(",")+",";
		for(const s in this.methods){
			const sz=this.methods[s];
			if(sz!=null&&sz.length>0){
				sz.forEach(obj=>{
					if(ids.indexOf(","+obj.key+",")==-1){
						if(dx[s]==null)dx[s]=[];
						dx[s].push(obj);
					}
				});
			}
		};
		this.methods=dx;
	}
}
export default myStorage
