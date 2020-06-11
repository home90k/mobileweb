<template>
	<div class="pagination control">
		<el-pagination  background  layout="prev, pager, next" v-on:current-change="pagination_change"   v-bind:total="pageTotal" :pager-count="11" :page-size="pageSize"></el-pagination>
	</div>
</template>

<script>
export default {
	props:{
		dataset:{type:Object,default:()=>{}}
	},
	data(){
		return {
			pageTotal:this.dataset.pageTotal,
			pageSize:this.isNull(this.dataset.pageSize)?9999:this.dataset.pageSize
		}
	},
	beforeMount(){
		this.dataset.addEvent("attr",(p)=>{
			if(p.attrname=="pageTotal")this.pageTotal=p.value;
			else if(p.attrname=="pageSize")this.pageSize=this.isNull(p.value)?99999:p.value;
		});
	},
	methods:{
		pagination_change(v){
			this.$emit("page-change",v);
			if(this.dataset!=null)this.dataset.attr("pageIndex",v);
		}
	}
}
</script>

<style>

</style>