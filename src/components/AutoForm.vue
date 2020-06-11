<template>
<div class="auto-form control" :id="id">
	<div class="auto-form-out-body" :for="id">
		<div class="auto-form-body" :for="id">
			<editor :rowid="rowid" :editor="item" v-for="item in autoform.elements"  :key="item.name" v-bind:style="[{'margin':item.type=='group'?'0px':autoform.rowspacing+'px 0px '+autoform.rowspacing+'px 0px'}]">
				<div v-if="item.type==='group'" :slot="item.field">
					<editor :rowid="rowid" v-for="item2 in item.child" :key="item2.name" :editor="item2" v-bind:style="[{'margin':item2.type=='group'?'0px':autoform.rowspacing+'px 0px '+autoform.rowspacing+'px 0px'}]">
						<div v-if="item2.type==='element'" :slot="item2.field">
							<slot :name="autoform.name+'-'+item2.field"></slot>
						</div>
					</editor>
				</div>
				<div v-else-if="item.type==='element'" :slot="item.field">
					<slot :name="autoform.name+'-'+item.field"></slot>
				</div>
				<div v-else-if="item.type==='banner'" :slot="item.name" style="display:inline-block;">
					<slot :name="item.field"></slot>
				</div>
			</editor>
		</div>
	</div>
</div>
</template>

<script>
export default {
	props: {
		rowid:{type:String,default:""},
		autoform:{
			type:Object,
			default:()=>{
				return{
					elements:[],
					width:0,
					spacing:4,
					rowspacing:2
				}
			}
		}
	},
	data() {return {
		id:"f"+new Date().getTime()+"_K_"+Math.ceil(Math.random()*10000+1),
		w:0,
		h:0,
		ts:0
	}},
	beforeMount(){
		//console.log(this.autoform);
		
	},
	mounted(){
		const node=document.querySelector("#"+this.id);
		if(node!=null){
			const node2=node.querySelector(".auto-form-out-body[for='"+this.id+"']");
			if(this.autoform.height=='100%'){
				node.classList.add("auto-form-maximize");
				node2.classList.add("auto-form-maximize-out");
			}else{
				node.classList.remove("auto-form-maximize");
				node2.classList.remove("auto-form-maximize-out");
			}
		}
		this.begin();
	},
	components: {
		editor:() => import('@/components/Editor')
	},
	methods:{
		begin(){
			try{
				this.resize();
			}catch(e){}
			this.ts=window.requestAnimationFrame(this.begin);
		},
		resize(){
			const node=document.querySelector("#"+this.id);
			if(node==null)return;
			const ps=node.getBoundingClientRect();
			let w=ps.width,h=ps.height;
			if(this.autoform.height===0){
				const fbody=node.querySelector(".auto-form-body");
				const ps2=fbody.getBoundingClientRect();
				h=ps2.height;
			};
			if(w===this.w&&h===this.h)return;
			this.w=w;
			this.h=h;
			if(this.autoform.width!==0&&this.autoform.width!='100%'){
				w=this.autoform.width;node.style.width=w+"px";
			};
			if(this.autoform.height!='100%'){
				if(this.autoform.height!==0){
					h=this.autoform.height;
					node.style.height=h+"px";
				};
			};
			const outbody=node.querySelector(".auto-form-out-body");
			outbody.style.width=w+"px";
			const fbody=node.querySelector(".auto-form-body");
			fbody.style.width=(w-10)+"px";
			if(this.autoform.height==="100%"){
				outbody.style.height=ps.height+"px";
			}else if(this.autoform.height===0){
				node.style.height=(h+2)+"px";
				outbody.style.height=(h+2)+"px";
			}
		}
	},
	destroyed(){
		window.cancelAnimationFrame(this.ts);
	}
}
</script>

<style>

</style>
