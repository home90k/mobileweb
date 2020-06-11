<template>
<div  class="dropdown control" :id="dropdown.id" v-show="open">
	<div class="dropdown-body" style="flex:1;">
		<grid class="dropdown-grid" :grid="gridDropdown"></grid>
	</div>
	<div class="multi-body subwindow-footer subwindow-none-border" v-show="dropdown.multi">
		<el-button class="button-default" plain size="small" type="primary" @click="btnOk()">确定</el-button>
	</div>
</div>
</template>
<script>

import grid from '@/components/Grid'
import {Grid}  from '@/components/js/controls'
export default {
	name: 'DropDown',
	props:{
		dropdown:{
			type:Object,
			default:()=>{
				return{
					isopen:false,
					multi:false,
					columns:[],
					maxheight:320,
					maxwidth:1000
				}
			}
		}
	},
	data () {
		return {
			ddDataset:null,
			open:false,
		}
	},
	beforeMount:function(){
		const view=this;
		if(this.dropdown!=null&&this.dropdown.addEvent!=null){
			this.dropdown.addEvent("afteropen",function(){view.open=true;});
			this.dropdown.addEvent("afterclose",function(){view.open=false;});
		}
		view["dsDropDown"]=this.dropdown.view[this.dropdown.dataset];
		new Grid(this,{
			name:"gridDropdown",
			dataset:"dsDropDown",
			readonly:true,
			remarkstate:false,
			dataHeight:true,
			opensetting:false,
			savesetting:false,
			isOpenEditor:false,
			columns:this.dropdown.columns,
			shownumber:false
		});
		view.gridDropdown.attr("dropdown",view.dropdown);
		view.gridDropdown.addEvent("clickrow",(row)=>{
			if(view.dropdown.multi)return;
			const setting=view.dropdown;
			if(setting!=null)setting.selected2(row);
			view.dropdown.close();
		});
		this.dropdown.attr("grid",view.gridDropdown);
	},
	methods:{
		btnOk(){//多选
			if(this.dropdown==null)return;
			const view=this.dropdown.view;
			const dsDD=view[this.dropdown.dataset];
			if(dsDD==null)return;
			const rows=dsDD.getData("selected");
			if(rows.length==0){
				this.tip({type:"warning",msg:"未选择数据！"});
				return;
			};
			this.dropdown.selected2(rows);
			this.dropdown.close();
		}
	},
	components:{grid}
}
</script>
<style scoped>

</style>