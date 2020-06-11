<template>
	<div class="report control">
		<grid :grid="gridData"></grid>
		<subwindow :subwindow="subSetting">
			<div slot="subSetting-footer" style="flex:1;">
				<search :search="search"></search>
      	 </div>
		</subwindow>
	</div>
</template>

<script>
import ReportGridSetting from './ReportGridSetting'
import {ReportAttr} from '@/components/js/controlAttrs'
import {Dataset,Grid,Subwindow,Search} from '@/components/js/controls'
export default {
	name:"reportgrid",
	props:{
		report:{type:Object,default:()=>{}}
	},
	data(){
		return {
			attrs:eval("("+JSON.stringify(ReportAttr)+")")
		}
	},
	beforeMount(){
		const stt=this.report.gridData;
		new Dataset (this,{
			name:"dsData",
			fields:stt.columns,
		});
		new Grid(this,{
			dataset:"dsData",
			name:"gridData",
			columns:stt.columns,
			fixed:stt.fixed,
			head:stt.head,
			footer:stt.footer,
			readonly:true,
			changepostion:false,
			isopeneditor:false,
			sortable:false,
			opensetting:false,
			rowdraggable:false,
			showfooter:stt.footer.length>0
		});
		new Search(this,{
			show:false,
			align:"right",
			buttons:{
				btnOk:{label:"确定",click:()=>{
					this.report.executeEvent("btnOk",{});
					this.subSetting.close();
				}},
				btnClose:{
					click:()=>{
						this.subSetting.close();
						return false;
				}}
			},
			showbutton:["btnOk","btnClose"]
		})
		new Subwindow(this,{
			name:"subSetting",
			icon:"el-icon-setting",
			showfooter:true,
			title:"交叉报表设置",
			component:{name:"ReportGridSetting",path:ReportGridSetting},
			width:800,
			height:600
		});
		this.gridData.addEvent("inithead",(params)=>{	
			if(params.name.indexOf("ZZZZZZI")!=-1){
				params.color=this.getColorXJ(params.name);
			}else if(params.name.indexOf("ZZZZZZR")!=-1){
				params.color=this.getColorHZ(params.name);
			}
		});
		this.gridData.addEvent("initcell",(params)=>{
			const ff=this.dsData.getField(params.name);
			const ns=ff==null||ff.tag==null||ff.tag.name==null?"":ff.tag.name;
			if(ns.indexOf("ZZZZZZI")!=-1){
				params.color=this.getColorXJ(ns);
				return false;
			}else if(ns.indexOf("ZZZZZZR")!=-1){
				params.color=this.getColorHZ(ns);
				return false;
			}
		});
		this.gridData.addEvent("initfooter",(params)=>{
				const ff=this.dsData.getField(params.name);
				const ns=ff==null||ff.tag==null||ff.tag.name==null?"":ff.tag.name;
				if(ns.indexOf("ZZZZZZI")!=-1){
					params.color=this.getColorXJ(ns);
					return false;
				}else if(ns.indexOf("ZZZZZZR")!=-1){
					params.color=this.getColorHZ(ns);
					return false;
				}
		});
		this.report.addEvent("open",()=>{this.subSetting.open({report:this.report});});
		this.subSetting.addEvent("afterclose",()=>{this.report.close();});
		this.report.addEvent("showGridData",(p)=>{
			this.dsData.attr("fields",p.columns);
			this.gridData.attr({
			 	columns:p.columns,
				 head:p.head,
				 footer:p.footer,
				 showfooter:p.footer.length>0,
				 fixed:p.fixed
			});
			this.dsData.pushData(p.rows);
		});
		this.dsData.pushData(stt.rows);
	},methods:{
		getColorHZ(s){
			//汇总颜色
			const colors=["#3CB371","#8A2BE2","#4B0082","#0000FF"];
			const ls=(s.length-s.replace(/ZZZZZZR/g,"").length)/7;
			return colors[ls];
		},
		getColorXJ(s){
			//小计颜色
			const colors=["#1E90FF","#228B22","#D2691E","#8B0000"];
			const ls=(s.length-s.replace(/ZZZZZZI/g,"").length)/7;
			return colors[ls];
		}
	}
}
</script>

<style>

</style>
