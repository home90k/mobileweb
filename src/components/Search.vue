<template>
<div>
	<div v-if="type=='search'" class="search control">
		<div style="flex:none;" v-bind:style="[{width:width+'px'}]"  v-show="show">
			<input :id="id" v-model="findString" v-show="show" :placeholder="placeholder"   @focus="$event.target.select()" 
				style="height:32px;line-height:32px;outline:none;padding-left:3px;float:left;border:1px solid #cccccc" v-bind:style="[{width:(width-1)+'px'}]" /></div>
		<div style="flex:none;"  v-show="show">
			<div class="search-find">
					<div class="search-find-button" style="padding:0px 10px;" v-on:click="btnClick('btnFind')">
						<i class="el-icon-search"></i>
					</div>
					<div class="search-find-button"  v-on:click="btnClick('btnHight')" v-show="search.hightaction!=''">
						<span class="search-split" style="margin-right:10px"></span>
						<i class="el-icon-more" style="margin-right:10px;"></i>
					</div>
			</div>
		</div>

		<div v-bind:style="[{'text-align':align}]" class="middle-center" style="flex:1;width:100%;padding-right:20px;display:flex;">
			<slot name="body"></slot>
			<div style="flex:1;">
					 <view-button  v-for="ns in showbutton"  :key="ns"  
					   :visible="setVisible(ns)"  
					   :disabled="buttons[ns]==null?true:buttons[ns].disabled" 
						:position="buttons[ns]==null?'left':buttons[ns].position"
						:label="buttons[ns]==null?'':buttons[ns].label" 
						:name="ns"   
						@command="handleCommand"
						:icon="buttons[ns]==null?'':buttons[ns].icon"
						@button-click="btnClick" 
						:child="buttons[ns]==null?[]:buttons[ns].child" style="margin-right:5px"></view-button>
			</div>
		</div>
	</div>
	<subwindow :subwindow="subFind">
		<div slot="subFind-body" class="slot-body">
			<autoform :autoform="formHighFind"></autoform>
			<dropdown v-for="item in dropdowns" :key="item.name" :dropdown="item.dropdown"></dropdown>
		</div>
		<div slot="subFind-footer" style="text-align:center;width:100%;padding:0px 80px;" class="textAlign">
				<el-button size="small" type="primary" plain class="gjbut" v-on:click="btnClick('btnHightOk')"><span  class="button-default">确定</span></el-button>
				<el-button size="small" type="primary" plain class="gjbut" v-on:click="btnClick('btnHightClear')"><span  class="button-default">清空</span></el-button>
				<el-button size="small" type="primary" plain class="gjbut" v-on:click="btnClick('btnHighClose')"><span  class="button-default">关闭</span></el-button>
		</div>
	</subwindow>
	
</div>
</template>

<script>
import base from '@/components/js/base.js'
import {Dataset,Subwindow,AutoForm} from '@/components/js/controls'
import multipleFind from '@/views/public/multipleFind'
import DropDownFactory from '@/views/public/dropdownFactory'
export default {
	name: "Search",
	props:{
		search:{type:Object,default:()=>{}},
	},
	data() {
		return {
			width:320,
			findString:"",
			id:"id_"+new Date().getTime()+"_N_"+Math.ceil(Math.random()*10000+1),
			type:"search",
			show:true,
			align:"left",
			toolbar:[],
			hightaction:"",
			placeholder:"请输入要查询的条件",
			showHightButton:true,
			highttitle:"高级查询",
			highticon:"el-icon-search",
			hightwidth:666,
			formHighFind:{},
			dropdowns:[],
			buttons:{
				btnFind:{label:"查询",disabled:false,visible:true,child:[],icon:"&#xe625;"},
				btnHight:{label:"高级查询",position:"left",disabled:false,visible:true,child:[],icon:"&#xe625;"},
				btnNew:{label:"新增",position:"left",disabled:false,visible:true,child:[],icon:"&#xe63d;"},
				btnClear:{label:"清空",position:"left",disabled:false,visible:true,child:[],icon:"&#xe6dc;"},
				btnDelete:{label:"删除",position:"left",disabled:false,visible:true,child:[],icon:"&#xe7b9;"},
				btnSave:{label:"保存",position:"left",disabled:true,visible:true,child:[],icon:"&#xe61d;"},
				btnCopyNew:{label:"复制新增",position:"left",disabled:false,visible:true,child:[],icon:"&#xe63e;"},
				btnAddLine:   {label:"增行",position:"left",disabled:false,visible:true,child:[],icon:"&#xe6f1;"},
				btnRemoveLine:{label:"删行",position:"left",disabled:false,visible:true,child:[],icon:"&#xe62b;"},
				btnExport:{label:"导出",position:"left",disabled:false,visible:true,child:[],icon:"&#xe636;"},
				btnImport:{label:"导入",position:"left",disabled:false,visible:true,child:[],icon:"&#xe60a;"},
				btnRefresh:{label:"刷新",position:"left",disabled:false,visible:true,child:[],icon:"&#xe61c;"},
				btnPrint:{label:"打印",position:"left",disabled:false,visible:true,child:[],icon:"&#xe609;"},
				btnCancel:{label:"撤销",position:"left",disabled:false,visible:true,child:[],icon:"&#xe601;"},
				btnClose:{label:"退出",position:"left",disabled:false,visible:true,child:[],icon:"&#xe637;"},
				btnSetting:{label:"设置",position:"left",disabled:false,visible:true,child:[],icon:"&#xe660;"}
			},
			buttonProp:{label:"",disabled:false,visible:true,child:[],position:"left"},
			hightbuttons:{
				btnFind:{name:"btnFind",label:"查询",event:function(){},icon:""},
				btnClear:{name:"btnClear",label:"清空",event:function(){},icon:""}, 
				btnClose:{name:"btnClose",label:"关闭",event:function(){},icon:""}
			},
			elements:[],
			showbutton:["btnHight","btnNew","btnDelete","btnSave","btnExport","btnImport","btnRefresh","btnClose"]
		}

	},beforeMount(){
		window.addEventListener("keydown",this.keyDownEvt);
		if(this.search.type=="toolbar"){
			const tooldata=[];
			this.showbutton.forEach(s=>{
				const b=this.buttons[s];
				b.name=s;
				tooldata.push(b);
			});
			this.toolbar=tooldata;
		};
		const view=this;
		new Subwindow(this,{
			name:"subFind",
			show:false,
			showfooter:true,
			footerheight:50,
		});
		if(this.search!=null){
			const sx={type:1,findString:1,placeholder:1,showbutton:1,hightaction:1,
			hightwidth:1,highttitle:1,highticon:1,show:1,align:1,width:1};
			const init=()=>{for(const k in sx){view[k]=sx[k];}};
			init();
			const initAttr=(attrname,value)=>{
				if(attrname=="hightaction"){
					view.showHightButton=value!=""&&value!=null;
					view.buttons.btnHight.visible=value!=""&&value!=null;
					const els=value==null||value==""?[]:multipleFind.get(value);
					view.elements=els==null?[]:els;
					if(view.elements.length>0){
						view.elements.forEach(el=>{
							if(el.dropdown!=null&&el.dropdown!=""&&view[el.dropdown]==null){
								DropDownFactory.create(view,el.dropdown,el.read,el.write);
								view.dropdowns.push({name:el.dropdown,dropdown:view[el.dropdown]});
							}else if(view.search.view[el.dropdown]!=null){
								const dd=view.search.view[el.dropdown];
								view[dd.dataset]=view.search.view[dd.dataset];
								view[el.dropdown]=view.search.view[el.dropdown];
								view.dropdowns.push({name:el.dropdown,dropdown:dd});
							}
						})
					}
				}else if(attrname=="highttitle"){
					view.subFind.attr("title",value);
				}else if(attrname=="highticon"){
					view.subFind.attr("icon",value);
				}else if(attrname=="hightwidth"){
					view.subFind.attr("width",value);
				};
			};
			const initButton=function(map){
				for(const k in map){
					const atts=map[k],btn2=view.buttons[k];
					if(btn2==null){
						const cp=eval("("+JSON.stringify(view.buttonProp)+")");
						for(let k in atts){cp[k]=atts[k];}
						view.$set(view.buttons,k,cp);
						continue;
					};
					for(const k in atts){
						if(k=="name")continue;
						btn2[k]=atts[k];
					}
				};
				initDefault();
			};
			const pp=view.search.buttonAttrs;
			const initDefault=function(){
				for(let k in view.buttons){
					const rr=view.buttons[k];
					for(const k2 in pp){
						if(k2=="name")continue;
						if(rr[k2]==null)rr[k2]=pp[k2];
					}
				}
			};
			if(view.search["buttonMap"]!=null){
				initButton(view.search["buttonMap"]);
			};
			for(const k in sx){view[k]=view.search[k];initAttr(k,view.search[k]);};
			if(view.search["addEvent"]!=null){
				view.search.addEvent("attr",dx=>{
					if(dx!=null&&sx[dx.attrname]===1){
						view[dx.attrname]=dx.value;
						initAttr(dx.attrname,dx.value);
					}
				});
				view.search.addEvent("buttonattr",dx=>{
					if(view.buttons[dx.name]==null)return;
					const btn=view.buttons[dx.name];
					view.$set(btn,dx.attrname,dx.value);
				});
				view.search.view.addEvent("modifyChange",(p)=>{
					const ismodify=p.value;
					this.buttons.btnSave.disabled=!ismodify;
				});
			};
			if(view.search.hightaction!==""){
				const parentView=view.search.view;
				new Dataset(this,{
					name:"dsHighFind",
					fields:view.elements
				});
				new AutoForm(this,{
					name:"formHighFind",
					dataset:"dsHighFind",
					width:0,
					controlwidth:220
				});
				this.dsHighFind.doAdd();
				this.search.attr("dsFind",this.dsHighFind);
			};
		};
		this.buttons.btnHight.visible=this.search!=null&&this.search.hightaction!=="";
		this.subFind.addEvent("afteropen",this.afteropen);
		this.subFind.addEvent("beforeopen",()=>{
			let isT=true;
			isT=this.search.executeEvent("beforeopen",{dsFind:this.dsHighFind});
			if(typeof(isT)!="boolean")isT=true;
			return isT;
		});
	},destroyed(){
		window.removeEventListener("keydown",this.keyDownEvt);
	},mounted(){
		if(this.search!=null&&this.search.show){const node=document.querySelector("#"+this.id);if(node!=null)node.focus();};
	},
	methods:{
		afteropen(){this.search.executeEvent("afteropen",{dsFind:this.dsHighFind});},
		handleCommand(btn){//下拉按钮事件
			const btns=this.buttons[btn.name];
			let btn2=null;
			for(let i=0;i<btns.child.length;i++){
				const anniu=btns.child[i];
				if(anniu.name==btn.child.name){
					btn2=anniu;
					break;
				}
			}
			if(btn2==null)return;
			try{if(btn2.click!=null)btn2.click(btn2);}catch(e){console.error(e);}
			this.$emit("button-click",btn2);
			this.search.executeEvent("buttonclick",btn2);
		},
		btnClick(name){//非下拉按钮事件
			let iszx=true;
			try{
				const btn=this.buttons[name];
				if(btn!=null&&btn["click"]!=null){iszx=btn.click({name:name});}
			}catch(e){console.error(e)};
			if(typeof(iszx)!="boolean")iszx=true;
			if(!iszx){
				this.search.executeEvent("buttonclick",{name:name});
			};
			if(iszx===false)return;
			
			if(name=="btnHighClose"){
				this.hightClose();
			}else if(name=="btnHightOk"){//高级查询-确认按钮
				const parentView=this.search.view;
				if(parentView==null)return;
				const rr=this.dsHighFind.getCurrent();
				const param={$opType:name};
				if(rr!=null){
					for(const k in rr){
						const v=rr[k];
						if(v==null||v=="")continue;
						param[k]=v;
					}
				};
				if(this.search!=null){
					let hightdataset=this.search.hightdataset;
					if(typeof(hightdataset)=="undefined"||hightdataset==null||hightdataset=="")hightdataset="dsData";
					const view=this,_dsData=this.search.view[hightdataset];
					if(_dsData!=null){
						_dsData.params2=param;
						_dsData.doQuery((req,dsData)=>{if(dsData.rows.length>0){view.hightClose();}});
					}
				}
			}else if(name=="btnHightClear"){
				if(this.search==null)return;
				this.dsHighFind.clearData();
				this.dsHighFind.doAdd();
			};
			if(name=="btnHight"){
				this.subFind.open();
			}else if(name=="btnClose"){
				if(this.search==null)return;
				const vv=this.search.view;
				if(vv["subwindow"]!=null)vv.subwindow.close();
				else {
					const pp=vv.$parent;
					if(pp!=null&&pp.nav!=null){
						const ns=vv.$options.name
						pp.nav.close(ns);
					}
				}
			}else if(name=="btnRefresh"){
				const dsData=this.search.view["dsData"];
				if(dsData!=null){dsData.doQuery();};
			}else if(name=="btnCancel"){
				const dsData=this.search.view["dsData"];
				if(dsData!=null){dsData.doQuery();};
			}else if(name=="btnClear"){
				const dsFind=this.search.view["dsFind"];
				if(dsFind!=null){dsFind.clearData();dsFind.doAdd();};
			}else if(name=="btnCopyNew"){
				const dsData=this.search.view["dsData"];
				if(dsData!=null){
					const r=dsData.getCurrent();
					if(r==null)return;
					const cr=eval("("+JSON.stringify(r)+")");
					if(cr[dsData.idField]!=null)cr[dsData.idField]="";
					const ab=(ds,sz)=>{
						const idField=ds.idField;
						sz.forEach(rr=>{
							rr.state="i";
							if(rr[idField]!=null)rr[idField]="";
						});
					};
					if(cr["dsLine1"]!=null&&cr.dsLine1.length>0){
						const dsLine1=this.search.view["dsLine1"]
						ab(dsLine1,cr.dsLine1);
					}
					if(cr["dsLine2"]!=null&&cr.dsLine2.length>0){
						const dsLine2=this.search.view["dsLine2"]
						ab(dsLine2,cr.dsLine2);
					}
					if(cr["dsLine3"]!=null&&cr.dsLine3.length>0){
						const dsLine3=this.search.view["dsLine3"]
						ab(dsLine3,cr.dsLine3);
					}
					dsData.doAdd(cr,"after");
				}
			}else if(name=="btnSetting"){
				if(this.search.view["rgData"]!=null){this.search.view["rgData"].open();};
			}else this.$emit("button-click",{name:name});
			base.click(this.search.view,{name:name});
			this.search.executeEvent("buttonclick",{name:name});
		},
		hightClose(){
			this.subFind.close();
		},
		keyDownEvt(e){
			if(e.keyCode===13&&this.search.show){
				const nd=document.activeElement;
				if(nd!=null&&nd.getAttribute("id")==this.id){
					this.btnClick("btnFind");
				};
			}
		},
		setVisible(ns){
			if(ns=="btnHight"){
				const v=this.search.hightaction!==""&&this.buttons[ns]!=null&&this.buttons[ns].visible;
				return v;
			}else{
				return this.buttons[ns]!=null&&this.buttons[ns].visible;
			}
		}
	},watch:{
		findString(v){
			if(this.search!=null){
				this.search.change(v);
			}
		}
	}
}
</script>

<style>
.el-button-group .el-button--primary:first-child{
	border-right:0;
}
.gjbut{
	flex:1;
	margin:0px 30px;
}
</style>
