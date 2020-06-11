<template>
<div :id="editor.id" class="editor-item control" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
	<div v-if="editor.type==='text'||editor.type==='password'" class="editor" v-show="editor.visible" v-bind:style="[editor.rootcss]">
		<span v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]">
		</span>
		<div class="editor-input-body" v-bind:style="[editor.editorBodycss]">
			<input  :type="editor.type" autocomplete="off" @focus="focusEvt"
			:placeholder="editor.placeholder" class="editor-input" 
			:readonly="readonly" v-bind:class="(readonly?' editor-readonly ':'')+(disabled?' editor-disabled ':'')"
			:disabled="disabled"  
			v-model="value" v-bind:style="[editor.editorcss2]" @change="editorChange"/>
		</div>
	</div>

	<div v-else-if="editor.type==='textarea'" class="editor" v-show="editor.visible" v-bind:style="[editor.rootcss]">
		<span v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]">
		</span>
		<div class="editor-input-body editor-textarea" v-bind:style="[editor.editorBodycss]">
			<textarea  autocomplete="off" class="editor-input"  @focus="focusEvt"  @change="editorChange"
			:placeholder="editor.placeholder" :readonly="readonly" :disabled="disabled" 
			 v-bind:class="(readonly?' editor-readonly ':'')+(disabled?' editor-disabled ':'')" style="resize:none;" 
			 v-bind:style="[editor.editorcss2]" v-model="value"></textarea>
		</div>
	</div>

	<div v-else-if="editor.type==='checkbox'" class="editor" v-show="editor.visible" v-bind:style="[editor.rootcss]">
		<span v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]">
		</span>
		<div class="editor-input-body editor-checkbox" v-bind:style="[editor.editorBodycss]" style="border:0px;">
			<el-checkbox :readonly="readonly" :disabled="disabled" v-model="value" :true-label="onvalue" 
			:false-label="offvalue"  v-bind:style="[editor.editorcss2]"></el-checkbox>
		</div>
	</div>

	<div v-else-if="editor.type==='switch'" class="editor" v-show="editor.visible" v-bind:style="[editor.rootcss]">
		<span v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]">
		</span>
		<div class="editor-input-body editor-switch" v-bind:style="[editor.editorBodycss]" style="border:0px;">
			<switchbutton @change="executeChange" v-model="value" :options="editor.options" :readonly="readonly" :disabled="disabled"></switchbutton>
		</div>
	</div>

	<div v-else-if="editor.type==='link'" class="editor" v-show="editor.visible" v-bind:style="[editor.rootcss]">
		<span  v-show="!editor.hidelabel"  class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]">
		</span>
		<div class="editor-input-body editor-link" v-bind:style="[editor.editorBodycss]" style="border:0px;">
			<span v-text="value" v-bind:style="[editor.editorcss2]" class="editor-a" @click="valueClickEvt"></span>
		</div>
	</div>

	<div v-else-if="editor.type==='banner'" class="editor" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
		<div v-bind:style="[editor.rootcss3]" class="editor-banner">
			<div v-show="!editor.hidelabel&&editor.label!==''" class="editor-label" v-text="editor.label"></div>
			<slot :name="editor.name"></slot>
		</div>
	</div>

	<div v-else-if="editor.type==='group'" class="editor-group" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
		<slot :name="editor.field"></slot>
	</div>

	<!-- <br v-else-if="editor.type==='line'" class='editor-line' v-show="editor.visible"/> -->
	
	<div v-else-if="editor.type==='select'" class="editor" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
		<span v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]"></span>
		<div class="editor-input-body" v-bind:style="[editor.editorBodycss]" @click="click_open">
			<input type="text"  @focus="focusEvt" autocomplete="off"  @change="editorChange"
			class="editor-input" readonly="readonly" 
			:disabled="readonly||disabled" v-model="label"  v-bind:class="(readonly?' editor-readonly ':'')+(disabled?' editor-disabled ':'')" v-bind:style="[editor.editorcss2]" />
			<div  class="editor-down-icon" v-bind:style="[editor.iconcss]">
				<i v-bind:class="open?'el-icon-caret-top':'el-icon-caret-bottom'" style="font-size:16px;"></i>
			</div>
		</div>
	</div>

	<div v-else-if="editor.type==='dropdown'" class="editor" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
		<span v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]"></span>
		<div class="editor-input-body editor-dropdown" v-bind:style="[editor.editorBodycss]" >
			<input    type="text"  @focus="focusEvt" autocomplete="off" class="editor-input"  @change="editorChange"
			@click="click_auto_open" @keyup="keyupEvt" :placeholder="editor.placeholder" 
			:readonly="readonly" :disabled="disabled" v-bind:class="(readonly?' editor-readonly ':'')+(disabled?' editor-disabled ':'')" v-model="value" v-bind:style="[editor.editorcss2]" />
			<div  class="editor-down-icon" v-bind:style="[editor.iconcss]"  @click="click_open">
				<i v-bind:class="open?'el-icon-caret-top':'el-icon-caret-bottom'"  style="font-size:16px;"></i>
			</div>
		</div>
	</div>

	<div v-else-if="editor.type==='date'||editor.type==='datetime'" class="editor" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
		<span v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]"></span>
		<div class="editor-input-body" v-bind:style="[editor.editorBodycss]">
			<input type="text"  @focus="focusEvt" autocomplete="off" class="editor-input" @blur="blurEvt"  @keyup="keyupEvt"  @change="editorChange"
			:placeholder="editor.placeholder" :readonly="readonly" :disabled="disabled" v-bind:class="(readonly?' editor-readonly ':'')+(disabled?' editor-disabled ':'')" v-model="label"   v-bind:style="[editor.editorcss2]" />
			<div  class="editor-down-icon" v-bind:style="[editor.iconcss]" @click="click_open">
				<i v-bind:class="open?'el-icon-caret-top':'el-icon-caret-bottom'" style="font-size:16px;"></i>
			</div>
		</div>
	</div>

	<div v-else-if="editor.type==='radiogroup'" class="editor" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
		<span  v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]"></span>
		<div  class="editor-input-body editor-radiogroup" v-bind:style="[editor.editorBodycss]" style="border:0px;">
			<el-radio size="small" v-bind:style="[editor.editorcss2]" :disabled="readonly||disabled"  v-model="value" v-for="item in editor.options" :key="item.value" :label="item.value"><span v-text="item.label" style="margin-right:5px;"></span></el-radio>
		</div>
	</div>

	<div v-else-if="editor.type==='checkboxgroup'" class="editor" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
		<span  v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]"></span>
		<div  class="editor-input-body editor-checkboxgroup" v-bind:style="[editor.editorBodycss]" style="border:0px;">
			<el-checkbox size="small" @change="change_group(item)" :value="(','+value+',').indexOf(','+item.value+',')!=-1" v-bind:style="[editor.editorcss2]" :disabled="readonly||disabled"  v-for="item in editor.options" :key="item.value" :label="item.value"><span v-text="item.label" style="margin-right:5px;"></span></el-checkbox>
		</div>
	</div>
	<div v-else-if="editor.type==='image'" class="editor" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
		<span  v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]"></span>
		<div  class="editor-input-body editor-image" v-bind:style="[editor.editorBodycss]" @click="valueClickEvt">
			 <el-image fit="fill" :src="value" v-bind:style="[editor.editorcss2]">
				<div slot="error" class="image-slot" style="text-align:center;">
					<i class="el-icon-camera" style="font-size:30px;"></i>
				</div>
			</el-image>
		</div>
	</div>
	<div v-else-if="editor.type==='element'" class="editor" v-show="editor.visible"  v-bind:style="[editor.rootcss]">
		<span  v-show="!editor.hidelabel" class="editor-label" v-text="editor.label" v-bind:style="[editor.labelcss2]"></span>
		<div  class="editor-input-body editor-element" v-bind:style="[editor.editorBodycss]">
			<slot :name="editor.field"></slot>
		</div>
	</div>

	<div v-if="editor.type=='select'" :id="id" class="editor-select"  v-show="open">
		<div v-for="item in editor.options" :key="item.value" @click="selected(item)" v-bind:class="item.value===value?'select-active select-option':'select-option'"><span v-text="item.label"></span></div>
	</div>
	<calendar  v-if="editor.type=='date'||editor.type=='datetime'"  :calendar="calendar"></calendar>
</div>
</template>

<script>
import dropdown from '@/components/DropDown'
import {Calendar} from '@/components/js/controls'
export default {
	name: "Editor",
	props: {
		editor:{type:Object,default:()=>{
			return{
				type:"text",
				visible:true,
				onvalue:"true",
				offvalue:"false"
			}
		}},
		rowid:{type:String,default:""}
	},
	data() {
		return {
			value:"",
			label: "",
			onvalue:"true",
			offvalue:"false",
			open:false,
			readonly:false,
			disabled:false,
			id:"dd" + new Date().getTime() + "-" + Math.ceil(Math.random() * 10000 + 1)
		}
	},
	beforeMount(){
		const edtype=this.editor==null?"":this.editor.type;
		if(edtype=="checkbox"){
			const dsData=this.editor.view[this.editor.dataset];
			if(dsData==null)return;
			const f=dsData.getField(this.editor.field);
			if(f!=null&&f.datatype!="boolean"){
				this.onvalue=typeof(f.onvalue)=="boolean"?"true":f.onvalue;
				this.offvalue=typeof(f.offvalue)=="boolean"?"false":f.offvalue;
			}
		};
		if(edtype=="date"||edtype=="datetime"){
			new Calendar(this,{
				name:"calendar",
				value:this.value,
				type:edtype,
				editor:this.editor,
				rowid:this.rowid
			});
			this.calendar.addEvent("close",()=>{this.open=false;});
			this.calendar.addEvent("change",(p)=>{
				if(p.value!=null){this.value=p.value;}
				this.label=p.label;
			});
		};
		this.init();
	},
	mounted() {},
	components: {
		dropdown,
		switchbutton:() => import('@/components/SwitchButton'),
		calendar:() => import('@/components/Calendar'),
	},watch:{
		value(v,oldv){
			const type=this.editor.type;
			if(type=="checkbox"||type=="date"||type=="datetime"
			||type=="radiogroup"||type=="switch"||type=="dropdown"
			||type=="select"||type=="checkboxgroup"
			){
				this.editorChange();
			};
		}
	},methods: {
		editorChange(){
			const v=this.value;
			this.initselectlabel();
			const dsData=this.editor.view[this.editor.dataset];
			if(dsData==null)return;
			if(dsData.getCurrent()==null)return;
			const ur={};
			if(this.rowid!=null&&this.rowid!="")ur.rowId=this.rowid;
			else ur.rowId=dsData.row==null?"":dsData.row.rowId;
			const rr=dsData.getRowById(ur.rowId),ns=this.editor.field;
			const v2=dsData.getFieldValue(ns,v);
			this.value=v2;
			if(rr!=null&&rr[this.editor.field]!==v2){ur[this.editor.field]=v2;dsData.set(ur);}
			if(this.editor.type=="date"||this.editor.type=="datetime"){this.calendar.attr("value",v);};
			const r3=dsData.getRowById(ur.rowId);
			const v3=r3[ns];
			if(v3!==v2){
				this.value=v3;
			}
		},
		executeChange(v){this.value=v;},
		select_close(){this.open=false;},
		change_group(item){
			if(this.readonly||this.disabled)return;
			const sz=[];
			this.editor.options.forEach(it=>{
				if(it.value===item.value){
					if((","+this.value+",").indexOf(","+it.value+",")==-1)
						sz.push(it.value);
				}else{if((","+this.value+",").indexOf(","+it.value+",")!=-1)sz.push(it.value);}
			});
			this.value=sz.join(",");
		},
		init(){
			if(this.editor==null)return;
			const view=this;
			this.readonly=this.editor.readonly2;
			this.disabled=this.editor.disabled2;
			const type=this.editor.type;
			if(type=="banner"||type=="line"||type=="group"||this.editor["field"]==null)return;
			const dataset=this.editor.dataset;
			const dsData=this.editor.view[dataset];
			if(dsData==null)return;
			this.editor.addEvent("readonly",(p)=>{
				if(p.name==this.editor.field){
					view.readonly=p.readonly;
					view.disabled=p.disabled;
					if(this.editor.type=="date"||this.editor.type=="datetime"){
						this.calendar.attr({readonly:p.readonly,disabled:p.disabled});
					}
				};
			});
			dsData.addEvent("aftercheck",(p)=>{
					let rowid=view.rowid;
					if(view.rowid==""||view.rowid==null){const row=dsData.getCurrent();rowid=row!=null?row.rowId:"";};
					const key=rowid+"|"+view.editor.field;
					let isError=true;
					if(p[key]==null)isError=false;
					const ndd=document.querySelector("#"+view.editor.id);
					if(ndd==null)return;
					const ndd2=ndd.querySelector(".editor-input-body");
					if(ndd2!=null){
						if(isError)ndd2.classList.add("editor-error");
						else ndd2.classList.remove("editor-error");
					};
			});
			dsData.addEvent("clearerror",(k)=>{
				let rowid=view.rowid;
				if(view.rowid==""||view.rowid==null){const row=dsData.getCurrent();rowid=row!=null?row.rowId:"";};
				const key=rowid+"|"+view.editor.field;
				if(k!==key)return;
				const ndd=document.querySelector("#"+view.editor.id);
				if(ndd==null)return;
				const ndd2=ndd.querySelector(".editor-input-body");
				if(ndd2!=null){ndd2.classList.remove("editor-error");};
			});
			if(view.rowid==null||view.rowid==""){
				dsData.addEvent("afterrowchange",function(){
					const row=dsData.getCurrent();
					if(view.rowid==""||view.rowid==null){
						const _name=view.editor.field;
						let value=dsData.getFieldValue(_name,row==null?"":row[_name]);
						if(value===dsData.getFieldValue(_name,view.value))return;
						const f=dsData.getField(_name);
						if(f!=null&&f.datatype=="double"){
							view.value=dsData.getFormatValue(_name,value);
						}else{
							view.value=value;
						}
						view.initselectlabel();
					};
				});
			}else{
				dsData.addEvent("afterquery",()=>{
					const row=dsData.rowMap[view.rowid];
					let value=row==null?"":row[view.editor.field];
					if(view.value===value)return;
					view.value=value;
					view.initselectlabel();
				});
			};
			const initdefaultvalue=(row)=>{
				let ist=false;
				if(view.rowid==null||view.rowid==""){
					const curr=dsData.getCurrent();
					const r1=curr==null||curr==""?"":curr.rowId;
					const r2=row==null||row==""?"":row.rowId;
					if(r1===r2)ist=true;
				}else{
					const r2=row==null||row==""?"":row.rowId;
					if(r2===view.rowid)ist=true;
				}
				if(!ist)return;
				let value=row==null?"":row[view.editor.field];
				const f=dsData.getField(view.editor.field);
				if(f!=null&&f.datatype=="double"){
					value=dsData.getFormatValue(view.editor.field,value);
				};
				if(value===view.value)return;
				view.value=value;
				view.initselectlabel();
			};
			dsData.addEvent("afterchange",(p)=>{const row=p.row;initdefaultvalue(row);});
			initdefaultvalue(dsData.getCurrent());
			if(this.editor.type=="dropdown"){
				const ns=this.editor.dropdown;
				const dd=this.editor.view[ns];
				if(dd==null)return;
				dd.addEvent("afterclose",function(){view.open=false;});
			}
		},
		initselectlabel(){
			if(this.editor.type!="select")return;
			const map=this.editor.optionMap;
			this.label=map==null?"":map[this.value];
		},
		click_auto_open(e){
			const ns=this.editor.dropdown;
			const dd=this.editor.view[ns];
			if(dd==null)return;
			if(dd.autoopen&&!this.open){this.click_open(e);}
		},
		click_open(e){//下拉框打开
			const view=this;
			const isOpen=this.open;
			if(this.readonly||this.disabled||(this.editor.type=="select"&&this.editor.options.length==0)){
				this.close_select();
				return;
			};
			this.open=!isOpen;
			if(this.open){
				let bd=e.target;
				while(!bd.classList.contains("editor-input-body")){bd=bd.parentNode;};
				const ps=bd.getBoundingClientRect();
				if(this.editor.type=="dropdown"){//是dropdown
					const ns=this.editor.dropdown;
					const dd=this.editor.view[ns];
					if(dd==null)return;
					dd.attr("element",bd);
					dd.attr("editor",view.editor);
					dd.attr("selectclose",()=>{});
					const ww=this.editor.rootcss.width;
					dd.attr("minwidth",Number(ww.replace("px","")));
					dd.open();
				}else if(this.editor.type=="date"||this.editor.type=="datetime"){
					const fnd=document.querySelector("#"+this.editor.id);
					const nd=fnd.querySelector(".editor-input-body");
					this.calendar.attr("node",nd);
					this.calendar.open();
				}else{
					const node=document.querySelector("#"+this.id);
					let top=-1000;
					let left=0;
					const body=document.querySelector("body");
					const xx2=body.offsetWidth,yy2=body.offsetHeight;
					setTimeout(()=>{
						top=(ps.top+ps.height+1);left=ps.left;
						const ps2=node.getBoundingClientRect();
						if(ps2.height+ps.top+ps.height>yy2&&ps.top>yy2/2){
							top=ps.top-ps2.height-2;
						};
						if(ps.left+ps2.width>xx2){
							left=ps.left+ps.width-ps2.width;
						};
						node.style.top=top+"px";
						node.style.left=left+"px";
					},1);
					node.style.top=top+"px";
					node.style.left=left+"px";
					node.style.minWidth=ps.width+"px";
					const closeevt=function(e2){
						const target=e2.target;
						if(target!=bd&&!bd.contains(target)&&target!=node&&!node.contains(target)){
							document.removeEventListener("mousedown",closeevt);
							view.close_select();
						}
					};
					document.addEventListener("mousedown",closeevt);
				}
			}else{
				this.close_select();
				if(this.editor.type=="date"||this.editor.type=="datetime"){
					this.calendar.close();
				}
			}
		},
		close_select(){
			if(this.editor.type=="dropdown"){
				const ns=this.editor.dropdown;
				const dd=this.editor.view[ns];
				if(dd==null){
					this.open=false;
					return;
				}
				dd.close();
			}else{
				this.open=false;
			}
		},
		selected(item){
			if(this.readonly||this.disabled)return;
			this.value=item.value;
			this.initselectlabel();
			this.close_select();
			this.editor.executeEvent("selected",item);
		},
		keyupEvt(e){
			const type=this.editor.type;
			if(type=="dropdown"){
				const v=e.target.value;
				const ns=this.editor.dropdown;
				const dd=this.editor.view[ns];
				if(dd!=null&&dd.openfilter){dd.doFilter(v);}
			}else if(type=="date"||type=="datetime"){
				this.calendar.keyup(e);
			}
		},
		blurEvt(e){
			const type=this.editor.type;
			if(type=="date"||type=="datetime"){
				this.calendar.blur(e);
			}
		},
		valueClickEvt(){
			this.editor.executeEvent("click",{name:this.editor.field,value:this.value,editor:this.editor});
		},
		focusEvt(e){
			e.target.select();
			this.editor.executeEvent("focus",{name:this.editor.field,value:this.value,editor:this.editor});
			if(this.editor.type=="date"||this.editor.type=="datetime"){
				if(this.calendar.autoopen){this.click_open(e);}
			};
		}
	}
}
</script>

<style>
</style>
