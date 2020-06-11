<template>
	<div class="grid control">
		<div class="grid-body">
			<canvas :id="id" class="grid-canvas"></canvas>
		</div>
		<div class="editor-select" :id="sid" style="display:none;">
			<div @click="selectEvt(item)" v-for="item in options" :key="item.value"  
			class="select-option" v-text="item.label"></div>
		</div>

		<calendar  :calendar="calendarDate"></calendar>
		<calendar  :calendar="calendarDatetime"></calendar>

		<div :id="id+'_editor'" class="grid-editor">
			<span style='flex:1;display: inline-block;width:100%;height:100%;'><input class='grid-input'/></span>
			<span class='grid-dropdown-icon' style='display:flex;flex:none;width:18px;background-color:white;align-content: center;align-items: center;height:100%;cursor: pointer;'><i class='el-icon-caret-bottom' style='font-size:18px;'></i></span>
		</div>
		<subwindow :subwindow="gridsetting"></subwindow>
		<subwindow :subwindow="gridBigText">
			<div slot="gridBigText-body" style="width:100%;overflow:hidden;height:100%;
			display:flex;flex-direction:column;justify-content:center; align-content: center;">
				<textarea class="grid-bigtext" :id="id+'_bigtext'"></textarea>
			</div>
			<div slot="gridBigText-footer" class="gridBigText-footer">
				<el-button class="button-default" plain size="small" type="primary"  @click="clickBigText('close')" style="margin-right:10px;">关闭</el-button>
			</div>
		</subwindow>
	</div>
</template>

<script>
import {Grid} from '@/components/js/grid'
import myStore from '@/store/myStore'
import {gridStyle} from '@/scss/common/gridStyle'

import {Subwindow,Calendar} from '@/components/js/controls'
import GridSetting from '@/components/GridSetting'
let tables={};
export default {
	name:"grid",
	props:{
		grid:{type:Object,default:null},
	},
	data(){
		return {
			id:"id_"+new Date().getTime()+"_K_"+Math.ceil(Math.random()*10000+1),
			sid:"sid_"+new Date().getTime()+"_S_"+Math.ceil(Math.random()*10000+1),
			isDisabled:true,
			options:[],
			show_date:false,
			grid_date:"",
			grid_datetime:"",
			show_datetime:false,
			eids:[],
			opencol:"",
			css:gridStyle["default"],
			tableData:[],
			bigtextcol:null
		}
	},
	beforeMount(){
		new Calendar(this,{name:"calendarDate",value:"",type:"date"});
		new Calendar(this,{name:"calendarDatetime",value:"",type:"datetime"});
		const view=this;
		const key=myStore.addEvent("style",function(value,oldvalue){
			view.css=gridStyle[value];
			tables[view.id].changeStyle();
		});
		this.eids.push(key);
		const style=myStore.getItem("style")||'default';
		this.css=gridStyle[style];
		new Subwindow(this,{
			name:"gridsetting",
			width:800,
			height:500,
			modal:false,
			title:"表格设置",
			icon:"el-icon-setting",
			component:{name:"GridSetting",path:GridSetting},
			params:{grid:view.grid}
		});
		new Subwindow(this,{
			name:"gridBigText",
			width:600,
			height:400,
			modal:true,
			showfooter:true,
			title:"大文本编辑"
		});
	},
	mounted(){
		tables[this.id]=new Grid(this);
		const node2=this.gridBigText.getNode();
		const ndd=node2.querySelector(".subwindow-footer");
		if(ndd!=null){
			ndd.classList.add("subwindow-none-border");
		};
	},destroyed(){
		tables[this.id].destroyed();
		delete tables[this.id];
		myStore.removeEvent(this.eids);
	},methods:{
		clickBigText(tp){
			this.gridBigText.close();
			tables[this.id].openEditor(this.bigtextcol)
		},
		selectEvt(item){
			if(tables[this.id]==null)return;
			tables[this.id].selected(item);
			this.bigtextcol.isclose=true;
			tables[this.id].openEditor(this.bigtextcol);
		}
	},components:{
		calendar:() => import('@/components/Calendar')
	}
}
</script>

<style  scoped>
</style>