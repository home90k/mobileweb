<template>
	<div class="tabset control" :id="tabset.key">
		<div class="tabset-title" :for="tabset.key">
			<span :name="item.name" :for="tabset.key" class="tabset-item" v-bind:class="item.name===tab?'tabset-active':''" @click="tab_click(item)" v-for="item in tabset['tabs']" :key="item.name" v-text="item.label" v-show="item.visible"></span>
		</div>
		<div class="tabset-body"  :for="tabset.key">
			<slot :name="tabset.name"></slot>
		</div>
	</div>
</template>

<script>
export default {
	name:"Tabset",
	props:{
		tabset:{type:Object,default:()=>{}}
	},
	data(){
		return {
			tab:""
		}
	},beforeMount(){
		if(this.tabset!=null){
			const view=this;
			this.tabset.addEvent("afterchange",function(item){view.tab=item.name;});
		}
	},
	mounted(){
		if(this.tabset!=null){
			 this.tabset.onload(this);
			 this.tabset.activeDefault();
		}
	},
	methods:{
		tab_click(item){
			this.tabset.setCurrentTab(item.name);
			try{this.$emit("change-tab", item);}catch(e){}
		}
	}
}
</script>

<style>

</style>