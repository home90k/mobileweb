'use strict'
import adminServer from '@/server/server';
import { Message } from 'element-ui'
import Loading from '@/components/Loading'
import {config} from '@/scss/common/config'
import {CalendarAttr,ReportAttr} from '@/components/js/controlAttrs'
import {ReportModular} from '@/components/js/reportModular'

const Misc={};
const eves={};
const duration=1000;
const toLowerCase=(options)=>{
	if(options==null)return {};
	const rr={};for(let s in options){const s2=s.toLowerCase().trim();rr[s2]=options[s];};
	return rr;
};

const getDateFormat=(format,str)=>{
	if(Misc.isNull(str))return "";
	const fmtt=format;
	const sz=fmtt.split(/\W/g);
	const vsz=str.split(/\D/g);
	const now=new Date();
	let  year=now.getFullYear(),month="01",tian="01",hours="00",minutes="00",seconds="00";
	const bc=(v)=>{return (v<10?"0":"")+v;};
	for(let i=0;i<sz.length;i++){
		const zf=sz[i];
		let v=vsz.length<i?"":vsz[i];
		if(v=="")continue;
		const min=zf.toLowerCase();
		if(min==="yyyy"){
			year=v;
		}else if(min==="yy"){
			year=(year+"").substring(0,2)+v;
		}else if(zf==="MM"||zf=="M"){
			if(!isNaN(Number(v))){month=bc(Number(v));}
		}else if(min=="dd"||min=="d"){
			if(!isNaN(Number(v)))tian=bc(Number(v));
		}else if(min=="hh"||min=="h"){
			if(!isNaN(Number(v)))hours=bc(Number(v));
		}else if(zf=="mm"||zf=="m"){
			if(!isNaN(Number(v)))minutes=bc(Number(v));
		}else if(min=="ss"||min=="s"){
			if(!isNaN(Number(v)))seconds=bc(Number(v));
		};
	};
	const map={},sz2=fmtt.split(/\W/g);;
	for(let i=0;i<sz2.length;i++){
		const str=sz2[i],min=str.toLowerCase();
		if(min=="yyyy"){
			map[str]=year+"";
		}else if(min=="yy"){
			map[str]=(year+"").substring(2,4);
		}else if(str=="MM"||str=="M"){
			const v=str=="M"?Number(month):month;
			map[str]=v;
		}else if(min=="dd"||min=="d"){
			const v=min=="d"?Number(tian):tian;
			map[str]=v;
		}else if(min=="hh"||min=="h"){
			const v=min=="h"?Number(hours):hours;
			map[str]=v;
		}else if(str=="mm"||str=="m"){
			const v=str=="m"?Number(minutes):minutes;
			map[str]=v;
		}else if(min=="ss"||min=="s"){
			const v=min=="s"?Number(seconds):seconds;
			map[str]=v;
		}
	};
	let fmt=fmtt;
	for(let k in map){
		fmt=fmt.replace(k,map[k]);
	};
	return fmt;
};
const getDateValue=(type,str)=>{
	if(Misc.isNull(str))return "";
	const fmtt=type=="date"?config.postDateFormat:config.postDatetimeFormat;
	const sz=fmtt.split(/\W/g);
	const vsz=str.split(/\D/g);
	const now=new Date();
	let  year=now.getFullYear(),month="01",tian="01",hours="00",minutes="00",seconds="00";
	const bc=(v)=>{return (v<10?"0":"")+v;};
	for(let i=0;i<sz.length;i++){
		const zf=sz[i];
		let v=vsz.length<i?"":vsz[i];
		if(v=="")continue;
		const min=zf.toLowerCase();
		if(min==="yyyy"){
			year=v;
		}else if(min==="yy"){
			year=(year+"").substring(0,2)+v;
		}else if(zf==="MM"||zf=="M"){
			if(!isNaN(Number(v))){month=bc(Number(v));}
		}else if(min=="dd"||min=="d"){
			if(!isNaN(Number(v)))tian=bc(Number(v));
		}else if(min=="hh"||min=="h"){
			if(!isNaN(Number(v)))hours=bc(Number(v));
		}else if(zf=="mm"||zf=="m"){
			if(!isNaN(Number(v)))minutes=bc(Number(v));
		}else if(min=="ss"||min=="s"){
			if(!isNaN(Number(v)))seconds=bc(Number(v));
		};
	};
	const map={},sz2=fmtt.split(/\W/g);;
	for(let i=0;i<sz2.length;i++){
		const str=sz2[i],min=str.toLowerCase();
		if(min=="yyyy"){
			map[str]=year+"";
		}else if(min=="yy"){
			map[str]=(year+"").substring(2,4);
		}else if(str=="MM"||str=="M"){
			const v=str=="M"?Number(month):month;
			map[str]=v;
		}else if(min=="dd"||min=="d"){
			const v=min=="d"?Number(tian):tian;
			map[str]=v;
		}else if(min=="hh"||min=="h"){
			const v=min=="h"?Number(hours):hours;
			map[str]=v;
		}else if(str=="mm"||str=="m"){
			const v=str=="m"?Number(minutes):minutes;
			map[str]=v;
		}else if(min=="ss"||min=="s"){
			const v=min=="s"?Number(seconds):seconds;
			map[str]=v;
		}
	};
	let fmt=fmtt;
	for(let k in map){
		fmt=fmt.replace(k,map[k]);
	};
	return fmt;
};
const editorProp={
	name:"",
	label:"",
	field:"",
	dataset:"",
	width:220,
	height:28,
	type:"text",
	visible:true,
	dropdown:"",
	options:[],
	labelcss:{},
	editorcss:{},
	readonly:false,
	disabled:false,
	showline:true,
	placeholder:"",
	remark:"",
	colspan:1,
	rowspan:1,
	spacing:4,
	rowspacing:2,
	hidelabel:false,
	labelwidth:80,
	labelalign:"left",
	align:"left",
	child:[]
};
Misc.isNull=function(s){
	let isT=false;
	if(typeof(s)!="boolean"&&typeof(s)!="number"&&s!="true"&&s!="false"
	&&(typeof(s)=="undefined"||s=="undefined"||s==""||s==null))isT=true;
	return isT;
};
Misc.addEvent=(name,evt)=>{
	const n=name.toLowerCase().trim();
	eves[n]=evt;
};
Misc.executeEvent=(name,p)=>{
	try{
		const n=name.toLowerCase().trim();
		if(eves[n]==null)return;
		eves[n](p);
	}catch(e){console.error(e);}
};
Misc.alert=function(options){
	try{
		const key="alert_key";
		let node=document.querySelector("#"+key);
		const self={title:"提示框",type:"warning",text:"",buttontext:"确定",icon:"el-icon-warning",click:function(){}};
		 if(node==null){
			 const body=document.querySelector(".app-body");
			 node=document.createElement("div");
			 const alertNode=document.createElement("div");
			 node.setAttribute("id",key);
			 node.setAttribute("class","misc-alert");
			 alertNode.setAttribute("class","misc-alert-body");
			 alertNode.innerHTML="<div class='misc-alert-head'><div class='misc-alert-head-title'></div>"+
			 	"<div class='misc-alert-head-icon'><i class='el-icon-close'></i></div></div>"+
				"<div class='misc-alert-text'><div class='misc-alert-text-icon'><i></i></div>"+
				"<div class='misc-alert-text-body'></div>"+
				"</div><div class='misc-alert-footer'><button class='misc-button'>确定</button></div>";
			 const knode=alertNode.querySelector(".misc-alert-head-title")
			 knode.onmousedown=function(e){
				const ps=alertNode.getBoundingClientRect();
				const mvevt=function(e2){
					alertNode.style.left=(ps.left+e2.pageX-e.pageX)+"px";
					alertNode.style.top=(ps.top+e2.pageY-e.pageY)+"px";
				};
				const mupevt=function(){
					document.removeEventListener("mousemove",mvevt);
					document.removeEventListener("mouseup",mupevt);
				};
				document.addEventListener("mousemove",mvevt);
				document.addEventListener("mouseup",mupevt)
			 };
			 node.appendChild(alertNode);
			 body.appendChild(node);
		 };
		 const iconMap={warning:"el-icon-warning",info:"el-icon-info",error:"el-icon-error",success:"el-icon-success"}
		 const initoptions=()=>{
			 if(typeof(options)!="object"){
				 self.text=options+"";
			 }else{
				 options=toLowerCase(options);
				 for(const k in self){
					 if(options[k]!=null)self[k]=options[k];
				 };
				 if(options["icon"]==null&&options["type"]!=null){
					 const type=options.type.toLowerCase().trim();
					 if(iconMap[type]!=null)self.icon=iconMap[type];
				 };
				 if(Misc.isNull(self.text)&&!Misc.isNull(options.msg))self.text=options.msg;
			 };
		 };
		 const inittext=()=>{
			 const titleNode=node.querySelector(".misc-alert-head-title");
			 const closeNode=node.querySelector(".misc-alert-head-icon");
			 titleNode.innerHTML=self.title;
			 const keydownEvt=function(e){
				if(e.keyCode==13){
				  const btn=node.querySelector(".misc-button");
				  if(btn!=null)btn.click();
				}
			 };
			 const closeEvt=function(isT){
				document.removeEventListener("keyup",keydownEvt);
				if(node.style.display==="none")return;
				//if(isT){
					try{if(self.click!=null)self.click();}catch(e){console.error(e);}
				//};
				node.style.display="none";
			 };
			 document.addEventListener("keyup",keydownEvt);
			 closeNode.onclick=()=>{closeEvt(false);};
			 const textNode=node.querySelector(".misc-alert-text-body");
			 textNode.innerHTML="&nbsp;&nbsp;"+self.text;
			 const textIcon=node.querySelector(".misc-alert-text-icon");
			 textIcon.querySelector("i").setAttribute("class",self.icon);
			 let color="#909399"
			 if(self.type=="error")color="red";
			 else if(self.type=="warning")color="#e6a23c";
			 else if(self.type=="success")color="#67c23a";
			 textIcon.style.color=color;
			 const btn=node.querySelector(".misc-button");
			 btn.style.backgroundColor=color;
			 btn.innerText=self.buttontext;
			 btn.onclick=function(){closeEvt(true);};
			 btn.focus();
			 if(self.icon==""||self.icon==null)textIcon.style.display="none";
			 else textIcon.style.display="flex";
		 };
		 initoptions();
		 inittext();
		 node.style.display="flex";
	}catch(e){console.error(e)};
};
Misc.ask=function(options){
	try{
		const key="ask_key";
		let node=document.querySelector("#"+key);
		const self={
			title:"提示框",
			type:"warning",
			text:"",
			icon:"el-icon-warning",
			cancelclick:function(){},
			canceltext:"取消",
			oktext:"确认",
			okclick:function(){}
		};
		 if(node==null){
			 const body=document.querySelector(".app-body");
			 node=document.createElement("div");
			 const askNode=document.createElement("div");
			 node.setAttribute("id",key);
			 node.setAttribute("class","misc-ask");
			 askNode.setAttribute("class","misc-ask-body");
			 askNode.innerHTML="<div class='misc-ask-head'><div class='misc-ask-head-title'></div>"+
			 	"<div class='misc-ask-head-icon' style='display:none'><i class='el-icon-close'></i></div></div>"+
				"<div class='misc-ask-text'><div class='misc-ask-text-icon'><i></i></div>"+
				"<div class='misc-ask-text-body'></div>"+
				"</div><div class='misc-ask-footer'><button class='misc-button misc-button-cancel'>取消</button>"+
				"<button class='misc-button misc-button-ok'>确定</button></div>";
			 const knode=askNode.querySelector(".misc-ask-head-title")
			 knode.onmousedown=function(e){
				const ps=askNode.getBoundingClientRect();
				const mvevt=function(e2){
					askNode.style.left=(ps.left+e2.pageX-e.pageX)+"px";
					askNode.style.top=(ps.top+e2.pageY-e.pageY)+"px";
				};
				const mupevt=function(){
					document.removeEventListener("mousemove",mvevt);
					document.removeEventListener("mouseup",mupevt);
				};
				document.addEventListener("mousemove",mvevt);
				document.addEventListener("mouseup",mupevt)
			 };
			 node.appendChild(askNode);
			 body.appendChild(node);
		 };
		 const iconMap={warning:"el-icon-warning",info:"el-icon-info",error:"el-icon-error",success:"el-icon-success"}
		 const initoptions=()=>{
			 if(typeof(options)!="object"){
				 self.text=options;
			 }else{
				options=toLowerCase(options);
				 for(const k in self){
					 if(options[k]!=null)self[k]=options[k];
				 }
				 if(options["icon"]==null&&options["type"]!=null){
					 const type=options.type.toLowerCase().trim();
					 if(iconMap[type]!=null)self.icon=iconMap[type];
				 }
			 };
		 };
		 const inittext=()=>{
			 const titleNode=node.querySelector(".misc-ask-head-title");
			 const closeNode=node.querySelector(".misc-ask-head-icon");
			 titleNode.innerHTML=self.title;
			 const keydownEvt=function(e){
				if(e.keyCode==13){
				  const btn=node.querySelector(".misc-ask-button");
				  if(btn!=null)btn.click();
				}
			 };
			 const closeEvt=function(isT){
				document.removeEventListener("keyup",keydownEvt);
				if(node.style.display==="none")return;
				node.style.display="none";
				if(isT){try{if(self.click!=null)self.click();}catch(e){console.error(e);}};
			 };
			 document.addEventListener("keyup",keydownEvt);
			 closeNode.onclick=()=>{closeEvt(false);};
			 const textNode=node.querySelector(".misc-ask-text-body");
			 textNode.innerHTML="&nbsp;&nbsp;"+self.text;
			 const textIcon=node.querySelector(".misc-ask-text-icon");
			 textIcon.querySelector("i").setAttribute("class",self.icon);
			 let color="#909399";
			 if(self.type=="error")color="red";
			 else if(self.type=="warning")color="#e6a23c";
			 else if(self.type=="success")color="#67c23a";
			 textIcon.style.color=color;
			 const cancel=node.querySelector(".misc-button-cancel");
			 cancel.style.backgroundColor="#CDC9C9";
			 cancel.innerText=self.canceltext;
			 cancel.onclick=function(){
				let isT=true;
				 try{isT=self.cancelclick();}catch(e){console.error(e);};
				 if(typeof(isT)=="undefined")isT=true;
				 if(isT===false)return;
				 closeEvt(true);
			 };
			 const btn=node.querySelector(".misc-button-ok");
			 btn.style.backgroundColor=color;
			 btn.innerText=self.oktext;
			 btn.onclick=function(){
				 let isT=true;
				 try{isT=self.okclick();}catch(e){console.error(e);};
				 if(typeof(isT)=="undefined")isT=true;
				 if(isT===false)return;
				 closeEvt(true);
			};
			 btn.focus();
			 if(self.icon==""||self.icon==null)textIcon.style.display="none";
			 else textIcon.style.display="flex";
		 };
		 initoptions();
		 inittext();
		 node.style.display="flex";
	}catch(e){console.error(e);};
};
//CalendarMode
function Calendar($this,options){
	options=options==null?{}:options;
	options=toLowerCase(options);
	//let format=config.postDateFormat;
	const self={},setting={};
	self.mr={
		node:"",
		value:"",
		name:"",
		label:"",
		type:"date",
		format:"yyyy-MM-dd",
		isopen:false,
		editor:"",
		rowid:"",
		minvalue:"",
		maxvalue:"",
		position:{},
		selected:(v)=>{},
		closeevent:()=>{},
		labelshow:()=>{}
	};
	const catchError=(evt)=>{let isT=true;try{isT=evt();}catch(e){console.error(e)};if(typeof(isT)!="boolean")isT=true;return isT;};
	self.menthods={};
	setting.addEvent=(fn2,evt)=>{//添加监听事件
		const fn=fn2.toLowerCase().trim();
		if(self.menthods[fn]==null)self.menthods[fn]=[];
		self.menthods[fn].push(evt);
	};
	setting.executeEvent=(n2,param)=>{
		const n=n2.toLowerCase().trim();
		if(self.menthods[n]==null)return true;
		const sz=self.menthods[n];
		if(sz.length==0)return true;
		let isT=true;
		sz.forEach(fn=>{if(fn!=null){let isT2=catchError(()=>{return fn(param);});if(!isT2)isT=false;}});
		return isT;
	};
	const cp=eval("("+JSON.stringify(CalendarAttr)+")");
	self.init=()=>{
		for(let s in cp){setting[s]=cp[s];};
		for(let k in self.mr){
			const v=Misc.isNull(options[k])?self.mr[k]:options[k];
			setting[k]=v;
		};
		if(setting.type=="datetime"&&options.format==null){
			setting.format=config.datetimeFormat;
		};
	};
	self.exclose=function(e){
		catchError(()=>{
			const bd=setting.node;
			if(bd==null){setting.close();return;};
			const target=e.target,node=document.querySelector("#"+setting.id);
			if(target!=bd&&!bd.contains(target)&&target!=node&&!node.contains(target)){
				setting.close();
			}
		});
	};
	self.css=(nd,obj)=>{for(let k in obj){nd.style[k]=obj[k];}};
	self.checkdate=()=>{
		if(setting.editor==null)return;
		const ns=setting.editor.field;
		const ds=setting.editor.view[setting.editor.dataset];
		const field=ds.getField(ns);
		const check=field.check;
		if(Misc.isNull(check))return;
		const rowid=setting.rowid;
		let row=Misc.isNull(rowid)?ds.getCurrent():ds.getRowById(rowid);
		if(row==null)return;
		const sz=check.split(",");
		const gz={},fsz=["year","month","tian","hours","minutes","seconds"];
		const ab=(fh,bds)=>{
			const vstr=bds.replace(fh,"");
			let v="";
			if(vstr.indexOf("$(")!=-1){
				v=eval(vstr.replace("$(","(row."));
			}else if(vstr=="this.$now()"){
				v=setting.editor.view.$now();
			}else if(vstr=="this.$nowTime()"){
				v=setting.editor.view.$nowTime();
			}else if(!Misc.isNull(vstr)){
				v=vstr;
			}
			if(v=="")return;
			const sv=self.showlabel(v,false);
			sv.gz=fh;
			if(fh=="<"||fh=="<="){
				if(gz["max"]==null)gz.max=sv;
				else{
					const oldgz=gz["max"];
					for(let x=0;x<fsz.length;x++){
						const ff=fsz[x];
						if(oldgz[ff]===sv[ff])continue;
						if(oldgz[ff]>sv[ff]){gz["max"]=sv;}
						break;
					}
				}
			}else{
				if(gz["min"]==null)gz.min=sv;
				else{
					const oldgz=gz["min"];
					for(let x=0;x<fsz.length;x++){
						const ff=fsz[x];
						if(oldgz[ff]===sv[ff])continue;
						if(oldgz[ff]<sv[ff]){gz["min"]=sv;}
						break;
					}
				}
			};
			if(gz["min"]!=null||gz["max"]!=null){
				const sx={};
				if(gz["min"]!=null)sx.minvalue=gz.min;
				if(gz["max"]!=null)sx.maxvalue=gz.max;
				setting.attr(sx);
			};
		};
		for(let i=0;i<sz.length;i++){
			const bds=sz[i];
			if(Misc.isNull(bds))continue;
			if(bds.indexOf("<=")!=-1){
				ab("<=",bds);
			}else if(bds.indexOf(">=")!=-1){
				ab(">=",bds);
			}else if(bds.indexOf("<")!=-1){
				ab("<",bds);
			}else if(bds.indexOf(">")!=-1){
				ab(">",bds);
			}
		}
	};
	setting.open=()=>{
		if(setting.readonly||setting.disabled)return;
		const ndd=setting.node;
		if(ndd==null)return;
		const ps=ndd.getBoundingClientRect();
		if(ps==null)return;
		setting.attr({maxvalue:"",minvalue:""});

		self.checkdate();
		setting.isopen=true;
		self.showDate(setting.value,true);
		setting.attr("showtype","tian");
		const calendearNode=document.querySelector("#"+setting.id);
		self.css(calendearNode,{top:(ps.top+ps.height+1)+"px",left:ps.left+"px",display:"block"});
		document.addEventListener("click",self.exclose);
	};
	setting.name=options.name;
	setting.close=()=>{
		if(iserror){
			setting.editor.view.tip({type:"error",msg:"该日期不能选"});
			return;
		}
		catchError(()=>{
			setting.isopen=false;
			if(setting!=null){
				const ndd=document.querySelector("#"+setting.id);
				if(ndd!=null)ndd.style.display="none";
			};
			document.removeEventListener("click",self.exclose);
			catchError(()=>{setting.closeevent();})
			setting.executeEvent("close",{});
		});
	};
	setting.id="A" + new Date().getTime() + "-" + Math.ceil(Math.random() * 10000 + 1);
	let isfst2=false;
	setting.attr=(name,v)=>{
		const ab=(a,b)=>{
			if(a=="name")return;
			const oldvalue=setting[a];
			v=a==="type"?b.toLowerCase().trim():b;
			if(a=="month"||a=="tian"||a=="hours"||a=="minutes"||a=="seconds"){
				v=(Number(v)<10?"0":"")+Number(v);
			}
			if(a!="node"&&a!="editor"&&v==setting[a])return;
			setting[a]=v;
			setting.executeEvent("attr",{attrname:a,value:v,oldvalue:oldvalue});
			if(a==="type"){
				if(v==="datetime"&&setting.format.toLowerCase().trim()==="yyyy-mm-dd"){
					setting.attr("format","yyyy-MM-dd HH:mm");
				}else if(v==="date"&&setting.format.trim().length>10){
					setting.attr("format","yyyy-MM-dd");
				};
			};
			if(a=="value"){
				self.showlabel(b);
				if(b=="")setting.clearDate();
				else{
					if(setting.isopen)self.showDate(b,true);
				}
			};
			if(a=="year"||a=="month"){self.initdays(setting.year,setting.month);};
			if(a=="year"){self.inityears(setting.year);};
			if(!isfst2&&a=="showtype"&&(b=="year"||b=="month")){
				setTimeout(()=>{
					isfst2=true;
					const yearNode=document.querySelector(".calendar-year-items[for='"+setting.id+"']");
					const monthNode=document.querySelector(".calendar-month-items[for='"+setting.id+"']");
					const sz3=(b=="year"?yearNode:monthNode).querySelectorAll(".calendar-date-month");
					if(sz3.length>0){
						const psdd=sz3[0].getBoundingClientRect();
						const w=psdd.width;
						self.css(yearNode,{width:3*w+"px"});
						self.css(monthNode,{width:3*w+"px"});
					}
				},1);
			}
		};
		if(typeof(name)=="string"&&typeof(v)!="undefined"){
			ab(name,v);
		}else if(typeof(name)=="object"&&typeof(v)=="undefined"){
			for(let k in name){ab(k,name[k]);}
		};
	};
	
	setting.changeDate=(item)=>{
		 if(item.disabled){
			 setting.editor.view.tip({type:"error",msg:"该日期不能选"});
			 return;
		 };
		 if(setting.type=="date"){
			 const v=item.date.split("-");
			 setting.attr({year:v[0],month:v[1],tian:v[2]});
		 }else{
			self.showDate(item.date,false);
		 }
		 self.setValue(false);
		 if(setting.type=="date")setting.close();
	};
	let oldstr=null;
	setting.change=(isT)=>{
		if(typeof(isT)!="boolean")isT=true;
		return self.setValue(isT);
	};
	self.showlabel=(str,type)=>{//显示
		if(typeof(type)=="undefined")type=true;
		if(Misc.isNull(str)){return "";};
		const fmtt=setting.type=="date"?config.postDateFormat:config.postDatetimeFormat;
		const sz=fmtt.split(/\W/g);
		const vsz=str.split(/\D/g);
		const year2=new Date().getFullYear()
		let year=year2,month=1,tian=1,hours=0,minutes=0,seconds=0;
		for(let i=0;i<sz.length;i++){
			const zf=sz[i];
			let v=vsz.length<i?"":vsz[i];
			if(v=="")continue;
			const min=zf.toLowerCase();
			if(min==="yyyy"){
				year=v;
			}else if(min==="yy"){
				year=(year2+"").substring(0,2)+v;
			}else if(zf==="MM"||zf=="M"){
				if(!isNaN(Number(v)))month=Number(v);
			}else if(min=="dd"||min=="d"){
				if(!isNaN(Number(v)))tian=Number(v);
			}else if(min=="hh"||min=="h"){
				if(!isNaN(Number(v)))hours=Number(v);
			}else if(zf=="mm"||zf=="m"){
				if(!isNaN(Number(v)))minutes=Number(v);
			}else if(min=="ss"||min=="s"){
				if(!isNaN(Number(v)))seconds=Number(v);
			};
		};
		const bc=(v)=>{const v2=Number(v);return (v2<10?"0":"")+v2;};
		const map={},sz2=setting.format.split(/\W/g);;
		for(let i=0;i<sz2.length;i++){
			const str=sz2[i],min=str.toLowerCase();
			if(min=="yyyy"){
				map[str]=year;
			}else if(min=="yy"){
				map[str]=(year+"").substring(2,4);
			}else if(str=="MM"||str=="M"){
				const v=str=="M"?Number(month):bc(month);
				map[str]=v;
			}else if(min=="dd"||min=="d"){
				const v=min=="d"?Number(tian):bc(tian);
				map[str]=v;
			}else if(min=="hh"||min=="h"){
				const v=min=="h"?Number(hours):bc(hours);
				map[str]=v;
			}else if(str=="mm"||str=="m"){
				const v=str=="m"?Number(minutes):bc(minutes);
				map[str]=v;
			}else if(min=="ss"||min=="s"){
				const v=min=="s"?Number(setting.seconds):bc(setting.seconds);
				map[str]=v;
			}
		};
		if(type){
			let fmt=setting.format;
			for(let k in map){fmt=fmt.replace(k,map[k]);};
			setting.attr({label:fmt});
			setting.executeEvent("change",{label:fmt,value:str});
			catchError(()=>{setting.labelshow(fmt);});
		}else{
			return {
					 year:Number(year),
					 month:Number(month),
					 tian:Number(tian),
					 hours:Number(hours),
					 minutes:Number(minutes),
					 seconds:Number(seconds)
			}
		}
	};
	self.showDate=(str,isT)=>{//日历显示数据
		if(!setting.isopen)return;
		oldstr=str;
		const date=new Date();
		let year=date.getFullYear(),month=date.getMonth()+1,tian=date.getDate(),
			  hours=setting.type=="date"?0:date.getHours(),
			  minutes=setting.type=="date"?0:date.getMinutes(),
			  seconds=setting.type=="date"?0:date.getSeconds();
		if(!Misc.isNull(str)){
			const fmtt=setting.type=="date"?config.postDateFormat:config.postDatetimeFormat;
			const sz=fmtt.split(/\W/g);
			const vsz=str.split(/\D/g);
			for(let i=0;i<sz.length;i++){
				const zf=sz[i];
				let v=vsz.length<i?0:vsz[i];
				const min=zf.toLowerCase();
				if(min==="yyyy"){
					year=v;
				}else if(min==="yy"){
					year=(year+"").substring(0,2)+v;
				}else if(zf==="MM"||zf=="M"){
					if(!isNaN(Number(v)))month=Number(v);
				}else if(min=="dd"||min=="d"){
					if(!isNaN(Number(v)))tian=Number(v);
				}else if(min=="hh"||min=="h"){
					if(!isNaN(Number(v)))hours=Number(v);
				}else if(zf=="mm"||zf=="m"){
					if(!isNaN(Number(v)))minutes=Number(v);
				}else if(min=="ss"||min=="s"){
					if(!isNaN(Number(v)))seconds=Number(v);
				};
			};
		};
		const st={
			year:year,
			month:(month<10?"0":"")+month,
			tian:(tian<10?"0":"")+tian,
		};
		if(isT){
			st.hours=(hours<10?"0":"")+hours;
			st.minutes=(minutes<10?"0":"")+minutes;
			st.seconds=(seconds<10?"0":"")+seconds;
		};
		setting.attr(st);
		self.initdays(year,month);
		self.inityears(year);
	};
	 self.oldv="";
	 setting.blur=(e)=>{
		if(iserror)return;
		const v=e.target.value;
		if(Misc.isNull(v))return;
		const iswc=self.indatedata(e,true);
		if(iswc)return;
		setting.editor.view.tip({type:"error",msg:"["+v+"]不是日期"});
		setting.clearDate();
	 };
	 self.indatedata=(e,ist)=>{
		let iswc2=true;
		catchError(()=>{
			const target=e.target;
			const v=target.value;
			if(setting.value!==""&&Misc.isNull(v)){setting.clearDate();return;};
			if(self.oldv===v&&!ist)return;
			self.oldv=v;
			const map={};
			const str=setting.format,arr=str.split(/\W/g);
			const vstr=(v+"").replace(/\D/g,"");
			const wanc={};
			const wanMap={};
			let count=0;
			for(let i=0;i<arr.length;i++){
			  const str1=arr[i];
			  if(Misc.isNull(str1))continue;
			  if(vstr.length<=count)break;
			  const min=str1.toLowerCase();
			  if(min==="yyyy"){
				  if(vstr.length<count+4){
					  map[str1]=vstr.substring(count,vstr.length);
					  count+=vstr.length;
					  break;
				  }else{
					  map[str1]=vstr.substring(count,count+4);
					  wanc.year=Number(map[str1]);
					  count+=4;
					  wanMap[str1]=str1;
					  setting.attr("year",wanc.year);
				  }
			  }else if(min==="yy"){
				  if(vstr.length<count+2){
					  map[str1]=vstr.substring(count,vstr.length);
					  count+=vstr.length;
					  break;
				  }else{
					  const dd=new Date(),yy=dd.getFullYear()+"";
					  map[str1]=yy.substring(0,2)+vstr.substring(count,count+2);
					  wanc.year=Number(map[str1]);
					  setting.attr("year",wanc.year);
					  count+=2;
					  wanMap[str1]=str1;
				  }
			  }
			  else if(str1=="MM"||str1=="M"){
				  let mv=Number(vstr.substring(count,count+1));
				  if(mv>1){
					  map[str1]=(str1=="MM"?"0":"")+mv;
					  count+=1;
					  wanc.month=mv;
					  setting.attr("month",mv);
					  wanMap[str1]=str1;
				  }else{
					  if(vstr.length<count+2){
						  if(ist&&i==arr.length-1){
								wanMap[str1]=str1;
								map[str1]=(str1=="MM"?"0":"")+mv;
						  }else{
								map[str1]=mv;
								count+=1;
								break;
						 }
					  };
					  const mv2=Number(vstr.substring(count,count+2));
					  if(mv2<13){
						  map[str1]=(str1=="MM"&&Number(mv2)<10?"0":"")+Number(mv2);
						  wanc.month=mv2;
						  setting.attr("month",mv2);
						  count+=2;
						  wanMap[str1]=str1;
					  }else{
						  map[str1]=(str1=="MM"?"0":"")+mv;
						  wanc.month=mv;
						  setting.attr("month",mv);
						  count+=1;
						  wanMap[str1]=str1;
					  }
				  }
			  }else if(min=="dd"||str1=="d"){
				  let mv=Number(vstr.substring(count,count+1));
				  const max=wanc["month"]!=null&&wanc.month==2?2:3;
				  if(mv>max){
					  map[str1]=(min=="dd"?"0":"")+mv;
					  count+=1;
					  wanc.tian=mv;
					  setting.attr("tian",mv);
					  wanMap[str1]=str1;
				  }else{
					  if(vstr.length<count+2){
							if(ist&&i==arr.length-1){
								wanMap[str1]=str1;
								map[str1]=(min=="dd"?"0":"")+mv;
							}else{
								map[str1]=mv;
								count+=1;
								break;
							}
					  }
					  const mv2=Number(vstr.substring(count,count+2));
					  let max2=30;
					  if(wanc.month!=null){
						  if(wanc.month==1||wanc.month==3||wanc.month==5||wanc.month==7||
							  wanc.month==8||wanc.month==10||wanc.month==12)max2=31;
						  else if(wanc.month==2){
							  if(wanc.year!=null){
								  max2=wanc.year%4==0?29:28;
							  }else max2=28;
						  }
					  };
					  if(mv2<=max2){
						  map[str1]=(min=="dd"&&Number(mv2)<10?"0":"")+Number(mv2);
						  count+=2;
						  wanc.tian=mv2;
						  wanMap[str1]=str1;
						  setting.attr("tian",mv2);
					  }else{
						  map[str1]=(min=="dd"?"0":"")+mv;
						  wanc.tian=mv;
						  setting.attr("tian",mv);
						  count+=1;
						  wanMap[str1]=str1;
					  }
				  }
			  }else if(min=="hh"||min=="h"){
				  let mv=Number(vstr.substring(count,count+1));
				  if(mv>2){
					  map[str1]=mv;
					  count+=1;
					  setting.attr("hours",mv);
					  wanMap[str1]=(min=="hh"?"0":"")+str1;
				  }else{
					  if(vstr.length<count+2){
							if(ist&&i==arr.length-1){
								wanMap[str1]=str1;
								map[str1]=(min=="hh"?"0":"")+mv;
							}else{
								map[str1]=mv;count+=1;
								break;
							}
					  };
					  const mv2=Number(vstr.substring(count,count+2));
					  if(mv2<24){
						  map[str1]=(min=="hh"&&Number(mv2)<10?"0":"")+Number(mv2);
						  count+=2;
						  wanMap[str1]=str1;
						  setting.attr("hours",mv2);
					  }else{
						  map[str1]=(min=="hh"?"0":"")+mv;
						  count+=1;
						  setting.attr("hours",mv);
						  wanMap[str1]=str1;
					  }
				  }
			  }else if(str1=="mm"||str1=="m"||min=="ss"||min=="s"){
				  let mv=Number(vstr.substring(count,count+1));
				  if(mv>5){
					  map[str1]=(str1=="mm"||min=="ss"?"0":"")+mv;
					  count+=1;
					  wanMap[str1]=str1;
					  setting.attr(min=="ss"||min=="s"?"seconds":"minutes",mv);
				  }else{
					  if(vstr.length<count+2){
							if(ist&&i==arr.length-1){
								wanMap[str1]=str1;
								map[str1]=(str1=="mm"||min=="ss"?"0":"")+mv;
							}else{
								map[str1]=mv;count+=1;
								break;
							}
					  };
					  const mv2=Number(vstr.substring(count,count+2));
					  if(mv2<60){
						  map[str1]=(str1=="mm"||min=="ss"&&Number(mv2)<10?"0":"")+Number(mv2);
						  count+=2;
						  wanMap[str1]=str1;
						  setting.attr(min=="ss"||min=="s"?"seconds":"minutes",mv2);
					  }else{
						  map[str1]=(str1=="mm"||min=="ss"?"0":"")+mv;
						  count+=1;
						  wanMap[str1]=str1;
						  setting.attr(min=="ss"||min=="s"?"seconds":"minutes",mv);
					  }
				  }
			  }
			};
			let vv=setting.format,iswc=true;
			for(let i=0;i<arr.length;i++){
				const stt=arr[i];
				if(wanMap[stt]==null){
					iswc=false;
					iswc2=false;
				}
				if(map[stt]!=null){
					vv=vv.replace(stt,map[stt]);
				}else{
					vv=vv.substring(0,vv.indexOf(stt)-1);
					break;
				}
			}
			target.value=vv;
			if(iswc){
				const hf=self.getDisabled(vv);
				if(hf===true){
				  setting.editor.view.tip({type:"error",msg:"["+vv+"]不在有效范围"});
				  iserror=true;
				}else{
				  iserror=false;
				  self.setValue(true);
				};
			};
		});
		return iswc2;
	 };
	 setting.keyup=(e)=>{
		 if(setting.readonly||setting.disabled)return;
		 self.indatedata(e,false);
	 };
	 let iserror=false;
	setting.clearDate=()=>{
		iserror=false;
		const row={value:"",label:"",stop:true};
		setting.executeEvent("attr",{attrname:"value",value:"",oldvalue:setting.value});
		setting.executeEvent("attr",{attrname:"label",value:"",oldvalue:setting.label});
		setting.value="";
		setting.label="";
		setting.executeEvent("change",row);
		setting.selected(row);
		catchError(()=>{setting.labelshow("");});
	};
	self.setValue=(ist)=>{
		if(typeof(ist)!="boolean")ist=true;
	   let isok=true;
		const bc=(v)=>{const v2=Number(v);return (v2<10?"0":"")+v2;};
		const ab=(_format)=>{
			const map={},sz=_format.split(/\W/g);;
			for(let i=0;i<sz.length;i++){
				const str=sz[i],min=str.toLowerCase();
				if(min=="yyyy"){
					map[str]=setting.year;
				}else if(min=="yy"){
					map[str]=(setting.year+"").substring(2,4);
				}else if(str=="MM"||str=="M"){
					const v=str=="M"?Number(setting.month):bc(setting.month);
					map[str]=v;
				}else if(min=="dd"||min=="d"){
					const v=min=="d"?Number(setting.tian):bc(setting.tian);
					map[str]=v;
				}else if(min=="hh"||min=="h"){
					const v=min=="h"?Number(setting.hours):bc(setting.hours);
					map[str]=v;
				}else if(str=="mm"||str=="m"){
					const v=str=="m"?Number(setting.minutes):bc(setting.minutes);
					map[str]=v;
				}else if(min=="ss"||min=="s"){
					const v=min=="s"?Number(setting.seconds):bc(setting.seconds);
					map[str]=v;
				}
			};
			let fmt=_format;
			for(let k in map){fmt=fmt.replace(k,map[k]);};
			return fmt;
		};
		const label=ab(setting.format);
		const vmf=setting.type=="date"?config.postDateFormat:config.postDatetimeFormat;
		const value=ab(vmf);
		if(ist||setting.type=="date"){
			const row={value:value,label:label,stop:true};
			if(setting.type=="datetime"){
				const sx=self.showlabel(value,false);
				const str=sx.year+"-"+sx.month+"-"+sx.tian+"-"+sx.hours+"-"+sx.minutes+"-"+sx.seconds;
				const isTT=self.getDisabled(str);
				if(isTT){
					setting.editor.view.tip({type:"error",msg:"该日期不在有效范围"});
					isok=false;
					return;
				}
			};
			iserror=false;
			setting.attr(row);
			setting.executeEvent("change",row);
			setting.selected(row);
		}else{
			setting.attr({label:label});
			setting.executeEvent("change",{label:label});
		} 
		catchError(()=>{setting.labelshow(label);});
		return isok;
	};
	self.initnow=()=>{
		const date=new Date();
		setting.now=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
	};
	self.getMaxTian=(year,month)=>{
		let max=30;
		if(month==1||month==3||month==5||month==7||month==8||month==10||month==12)max=31;
		else if(month==2){max=year%4==0?29:28;};
		return max;
	};
	self.oldym="";
	self.old_years=0;
	self.inityears=(year)=>{
		if(!setting.isopen)return;
		const v=Number(year);
		if(self.old_years===v)return;
		const sz=[],min=v-6;
		for(let i=1;i<=12;i++){
			sz.push({value:min+i,label:min+i});
		};
		setting.attr("years",sz)
	};
	self.getDisabled=(str)=>{
		const min=setting.minvalue,max=setting.maxvalue;
		if(Misc.isNull(min)&&Misc.isNull(max))return false;
		else{
			let ist=false;
			const rtab=(_min,isx)=>{
				let ist2=false;
				const ss=str.split("-");
				if((isx&&Number(ss[0])<Number(_min.year))||
					(!isx&&Number(ss[0])>Number(_min.year))){
					ist2=true;
				}else if(Number(ss[0])==Number(_min.year)&&
						((isx&&Number(ss[1])<Number(_min.month))||
						(!isx&&Number(ss[1])>Number(_min.month)))
					){
					ist2=true;
				}else if(Number(ss[0])==Number(_min.year)&&
							Number(ss[1])==Number(_min.month)&&
							((isx&&Number(ss[2])<Number(_min.tian))||
							((!isx&&Number(ss[2])>Number(_min.tian))))
					){
					ist2=true;
				}else if(Number(ss[0])==Number(_min.year)&&
							Number(ss[1])==Number(_min.month)&&
							Number(ss[2])==Number(_min.tian)){
					if(isx&&_min.gz==">"&&setting.type=="date")ist2=true;	
					else if(!isx&&_min.gz=="<"&&setting.type=="date")ist2=true;	
					else if(setting.type=="datetime"){
						if((isx&&Number(ss[3])<Number(_min.hours))||
							(!isx&&Number(ss[3])>Number(_min.hours))){
							ist2=true;
						}else if(Number(ss[3])==Number(_min.hours)&&
							((isx&&Number(ss[4])<Number(_min.minutes))||
							(!isx&&Number(ss[4])>Number(_min.minutes)))){
							ist2=true;
						}else if(Number(ss[3])==Number(_min.hours)&&
									Number(ss[4])==Number(_min.minutes)&&
									((isx&&Number(ss[5])<Number(_min.seconds))||
									((!isx&&Number(ss[5])>Number(_min.seconds))))
							){
							ist2=true;
						}else if(Number(ss[3])==Number(_min.hours)&&
									Number(ss[4])==Number(_min.minutes)&&
									Number(ss[5])==Number(_min.seconds)){
							if(isx&&_min.gz==">")ist2=true;	
							else if(!isx&&_min.gz=="<")ist2=true;	
						}
					}
					else ist2=false;
				}
				return ist2;
			};
			if(!Misc.isNull(min)){const tt=rtab(min,true);if(tt==true)ist=true;};
			if(!Misc.isNull(max)){const tt=rtab(max,false);if(tt==true)ist=true;};
			return ist;
		};
	}
	self.initdays=(year2,month2)=>{
		if(!setting.isopen)return;
		const year=Number(year2),month=Number(month2);
		//if(self.oldym===year+"-"+month)return;
		self.oldym=year+"-"+month
		const sz=[];
		const max=self.getMaxTian(year,month);
		const date=new Date(year,month-1,1);
		const xq=date.getDay();
		const sztian=xq==1?7:(xq==0?6:xq-1);
		//添加上一个月的
		const pyear=month==1?(year-1):year,pmonth=month==1?12:(month-1);
		const max0=self.getMaxTian(pyear,pmonth);
		for(let i=sztian-1;i>=0;i--){
			const dd={date:pyear+"-"+pmonth+"-"+(max0-i),month:pmonth,status:"prev",label:(max0-i)};
			dd.disabled=self.getDisabled(dd.date);
			sz.push(dd);
		};
		for(let i=1;i<=max;i++){
			const dd={date:year+"-"+month+"-"+i,month:month,status:"current",label:""+i};
			dd.disabled=self.getDisabled(dd.date);
			sz.push(dd);
		}
		const sx=42-sz.length;
		const nyear=year+(month==12?1:0),nmonth=month==12?1:(month+1);
		for(let i=1;i<=sx;i++){
			const dd={date:nyear+"-"+nmonth+"-"+i,month:nmonth,status:"next",label:""+i};
			dd.disabled=self.getDisabled(dd.date);
			sz.push(dd);
		};
		setting.attr("days",sz);
	};
	self.init();
	self.initnow();
	setting.view=$this;
	$this[setting.name]=setting;
};
//DatasetMode
function Dataset(view,options){
	if(options==null)return;
	let nonullMap={};
	let nonullFields={};
	const dsData={},self={menthods:{},row:null,rowMap:{},index:0};
	self.fieldMap={};
	self.props={
		norefresh:false,//查询之不清空数据
		isnormal:true,//查询 标准模式
		disabled:false,
		readonly:false,
		disabled:false,
		selectall:false,
		showloading:true,
		showdeletedata:false,
		masterlink:"",
		server:"default",
		multi:true,
		pageSize:"",
		pageTotal:1,
		pageIndex:1,
		commitMode:"change",
		action:"",
		findDataset:"",
		stopsum:false,
		actionquery:"",
		idField:"id",
		fields:[],
		deleteMode:""//promptly
	};
	self.initattrs=()=>{for(let k in self.props){dsData[k]=options!=null&&options[k]!=null?options[k]:self.props[k];}};
	self.initattrs();
	dsData.row=null;
	self.newRow={};
	self.oldMap={};
	dsData.rows=[];
	self.sumFields={};
	dsData.rowMap={};
	const datasetName=options.name;
	dsData.name=datasetName;
	dsData.addField=(field2)=>{
		const f22=toLowerCase(field2),field= self.extend(self.mr,f22);
		self.initField(field,f22);
	};
	dsData.findById=(id)=>{
		let row=null;
		const rowid=dsData.keyMap[id];
		if(rowid!=null)row=dsData.getRowById(rowid);
		return row;
	};
	self.ds=null;
	dsData.executeSynch=()=>{
		if(self.ds==null)return;
		self.executeEvent("synchData",{});
	};
	dsData.synchData=(dataset,idfield)=>{
		self.ds=dataset;
		const ab=function(){
			const rs=dsData.getData("all");
			const cprs=eval("("+JSON.stringify(rs)+")")
			cprs.forEach(r=>{
				const key=r[idfield],rowid=dataset.keyMap[key];
				if(rowid==null){
					dataset.doAdd(r);dataset.set({state:"n"},"save");
				}else{
					r.rowId=rowid;
					r.state="n";
					dataset.set(r,"save");
				}
			});
		};
		dsData.addEvent("aftersave",ab);
		dsData.addEvent("afterdelete",(p)=>{
			const rows=p.rows;
			if(rows==null||rows.length==0)return;
			rows.forEach(r=>{
				const key=r[idfield],rowid=dataset.keyMap[key];
				if(rowid!=null)dataset.remove(dataset.getRowById(rowid));
			});
		});
		dsData.addEvent("synchData",ab);
		view.addEvent("synchData",ab);
	};
	dsData.removeField=(name)=>{
		if(self.fieldMap[name]==null)return;
		delete self.fieldMap[name];delete self.newRow[name];
		if(self.sumFields[name]!=null)delete self.sumFields[name];
	};
	const catchError=(evt)=>{let isT=true;try{isT=evt();}catch(e){console.error(e)}; if(typeof(isT)!="boolean")isT=true;return isT;};
	dsData.selectToggle=()=>{
		if(!dsData.multi||dsData.rows.length==0)return;
		catchError(()=>{
			const f=dsData.getField("select");
			if(f==null)return;
			self.changeselectall(!dsData.selectall);
			self.selectallEvt1();
			self.selectallEvt2();
		});
	};
	
	self.changeselectall=(v)=>{
		const oldv=dsData.selectall;
		if(v===oldv)return;
		dsData.selectall=v;
		self.executeEvent("attr",{attrname:"selectall",value:dsData.selectall,oldvalue:oldv});
	};
	self.starty=0;self.endy=40;
	dsData.benginLoadData=(start,end)=>{self.starty=start;self.endy=end;};
	self.selectallEvt1=function(){
		const ls=dsData.rows.length;
		let ed=self.endy<self.starty?ls-1:self.endy;
		if(ed>ls-1)ed=ls-1;
		for(let i=self.starty;i<=ed;i++){
			const r=dsData.rows[i];
			if(r==null||r.select===dsData.selectall)continue;
			dsData.set({rowId:r.rowId,select:dsData.selectall});
		};
		clearTimeout(self.isTk);
	};
	self.selectallEvt2=()=>{
		catchError(()=>{
			new Promise(function (resolve, reject) {
				const ls=dsData.rows.length;
				let end=self.endy<self.starty?ls-1:self.endy;
				if(end>ls-1)end=ls-1;
				for(let i=0;i<ls;i++){
					if(i>=self.starty&&i<=end)continue;
					const r=dsData.rows[i];
					if(r==null||r.select===dsData.selectall)continue;
					dsData.set({rowId:r.rowId,select:dsData.selectall});
					clearTimeout(self.isTk);
				}
			}).then((resolve)=>{});
		});
	};
	self.isTk=null;
	self.checkselect=()=>{
		clearTimeout(self.isTk);
		self.isTk=setTimeout(()=>{
			new Promise(function (resolve, reject) {
				let isT=true;
				const ls=dsData.rows.length;
				for(let i=0;i<ls;i++){
					const r=dsData.rows[i];
					if(r==null||r.select!==true||typeof(r.select)!="boolean"){isT=false;break;}
				};
				self.changeselectall(isT);
			}).then((resolve)=>{});
		},20);
	};
	self.initMasterlink=function(){
		if(dsData.masterlink==null)return;
		for(const ds in dsData.masterlink){
			if(view[ds]==null)continue;
			self.bindLinkEvt(view[ds],dsData.masterlink[ds],datasetName)
		};
	};
	self.bindLinkEvt=(dsHead,pp,_name)=>{
		const dsBen=dsData;
		dsHead.addField({name:_name,datatype:"array",iscommit:true,value:[],tag:{isDataset:true}});
		dsHead.addEvent("afterrowchange",function(p){
			const r=p==null||p["row"]==null?null:p.row;
			if(r==null)dsBen.clearData();
			else if(typeof(pp)=="string"){
					const sz=r[pp]==null?[]:eval("("+r[pp]+")");
					self.executeEvent("beforelink",{});
					setTimeout(()=>{dsBen.pushData(sz);self.executeEvent("afterlink",{});},20);
			}else{
				if(r[_name]!=null){dsBen.pushData(r[_name]);}
				else if(r[_name]==null){
					if(r.state=="i"){
						dsBen.clearData();
						const rr={};
						rr[_name]=[];
						dsHead.set(rr);
				}else{
					dsBen.params2={};
					for(const k in pp){
						const field=pp[k];
						dsBen.params[field]=r[k];
					};
					const oldps=dsBen.pageSize;
					dsBen.pageSize=-1;
					dsBen.doQuery();
					dsBen.pageSize=oldps;
				}};
			};
		});
		dsHead.addEvent("aftersave",(req)=>{
			const data=req.data;
			if(data==null||data.length==0)return;
			data.forEach(r=>{
				const arr=r[_name];
				if(arr!=null){
					self.execute_aftersave({data:arr});
				};
			});
			dsBen.rows.forEach(r=>{dsBen.set({rowId:r.rowId,state:"n"},"save");});
			self.oldMap=eval("("+JSON.stringify(dsBen.rowMap)+")");
		});
		const ab=()=>{
			try{
				const r={},hr=dsHead.getCurrent(),ns=typeof(pp)=="string"?pp:_name,rss=dsBen.getData("all");
				if(hr==null)return;
				r[ns]=typeof(pp)=="string"?JSON.stringify(rss):rss;
				if(typeof(pp)!="string")r.state=hr.state;
				else r.state=hr.state=="n"?"u":hr.state;
				dsHead.set(r);
				bc();
			}catch(e){console.error(e);}
		};
		const bc=()=>{
			if(typeof(pp)=="string")return;
			const hr=dsHead.getCurrent();
			if(hr==null||hr.state!="n")return;
			let ism=false;
			const els=self.node.querySelectorAll(".row");
			for(let i=0;i<els.length;i++){
				const el=els[i];
				if(el.getAttribute("state")!="n"){
					ism=true;
					break;
				}
			};
			if(ism)dsHead.set({state:"u"});
		};
		dsBen.addEvent("afterquery",()=>{ab();});
		dsBen.addEvent("aftersave",()=>{ab();});
		dsBen.addEvent("afterdelete",()=>{ab();});
		dsBen.addEvent("aftercleardata",()=>{ab();});
		dsBen.addEvent("afterinsert",()=>{ab();});
		dsBen.addEvent("rowstatechange",()=>{bc();});
		dsBen.addEvent("rowRaggable",()=>{ab();})
		dsBen.addEvent("afterset",()=>{ab();});
		view.datasetMap[_name]=false;
		dsBen.addEvent("stagechange",(p)=>{
			view.datasetMap[_name]=p.value;
			let v=p.value;
			if(!v){
				for(let s in view.datasetMap){
					if(view.datasetMap[s]===true)v=true;
				}
			};
			if(view.isModify===v)return;
			view.isModify=v;
			catchError(()=>{if(view["modifyChange"]!=null)view.modifyChange();});
			view.executeEvent("modifyChange",{value:v});
		});
	};

	self.find=function(isone,a,b){
		const fr=[],ls=dsData.rows.length;
		for(let x=0;x<ls;x++){
			const r=dsData.rows[x];
			let isFind=true;
			for(let i=0;i<a.length;i++){
				const s=a[i];
				if(r[s]===b[i])continue;
				isFind=false;
				break;
			};
			if(isFind){
				fr.push(r);
				if(isone)break;
			}
		}
		return fr;
	}
	dsData.find=function(a,b){return self.find(false,a,b);};
	dsData.findOne=function(a,b){const sz=self.find(true,a,b);return sz.length==0?null:sz[0];};
	dsData.action=options["action"]!=null?options.action:"";
	dsData.actionquery=options["actionquery"]!=null?options.actionquery:"";
	self.mr={
		name:"",label:"",type:"text",disabled:false,readonly:false,disabled:false,
		sortable:true,iskey:false,format:"",hidelabel:false,labelwidth:0,
		datatype:"string",notnull:false,format:"",options:[],supportsum:true,
		visible:true,sortable:true,align:"left",labelalign:"left",
		length:20,precision:2,dropdown:"",remark:{},check:"",colspan:1,rowspan:1,
		onvalue:true,offvalue:false,value:"",iscommit:false,updateable:true,columns:[],
		totaltype:"count",rowcount:1,sort:"asc",group:true,
		width:config.gridOtherFieldWidth,tag:{}
	};
	self.extend=function(a,b){
		const c={};
		for(const k in a){ c[k]=b[k]==null?a[k]:b[k];};
		return c;
	};
	let lineindex=0;
	self.initField=function(f,old){
		const minName=f.name.toLowerCase();
		if(f.iskey){dsData.idField=f.name;f.iscommit=true;};
		if(f.dropdown!=""){f.type="dropdown";};
		if((f.type=="checkbox"||f.type=="switch")&&old["datatype"]==null){
			if(!Misc.isNull(old["onvalue"])&&!Misc.isNull(old["offvalue"])){
				f.datatype=typeof(old.onvalue);
			}else f.datatype="boolean";
		};	
		if(f.type=="line"){
			f.iscommit=false;
			f.updateable=false;
			lineindex+=1;
			f.name+"line"+lineindex;
		};
		if(f.name=="select"){
			f.width=30;
			f.type="checkbox";
			f.datatype="boolean";
			f.onvalue=true;
			f.offvalue=false;
		}else if(minName=="version"){
			if(old["iscommit"]==null)f.iscommit=true;
			if(old["readonly"]==null)f.readonly=true;
		}else if(minName.indexOf("date")!=-1&&minName.indexOf("createdate")==-1&&minName.indexOf("modifydate")==-1){
			if(old["datatype"]==null||old["type"]==null){
				f.datatype="date";
				f.type="date";
			}else if(old["datatype"]!=null||old["type"]==null){
				f.type=old["datatype"];
			}else if(old["type"]!=null||old["datatype"]==null){
				f.datatype=old["type"];
			}
		}else if(minName=="sort"){
			if(old["label"]==null)f.label="排序";
			if(old["datatype"]==null)f.datatype="int";
		}else if(minName.indexOf("createdate")!=-1 ){
			if(old["label"]==null)f.label="创建时间";
			if(old["datatype"]==null)f.datatype=datasetName=="dsFind"?"date":"datetime";
			if(old["type"]==null)f.type=datasetName=="dsFind"?"date":"datetime";
			if(old["readonly"]==null)f.readonly=datasetName!="dsFind"&&datasetName!="dsHighFind";
		}else if(minName.indexOf("createuser")!=-1){
			if(old["label"]==null)f.label="创建人";
			if(old["readonly"]==null)f.readonly=datasetName!="dsFind"&&datasetName!="dsHighFind";
			if(minName.indexOf("createuserid")!=-1&&old["visible"]==null)f.visible=false;
		}else if(minName.indexOf("modifydate")!=-1){
			if(old["label"]==null)f.label="修改时间";
			if(old["datatype"]==null){f.datatype=datasetName=="dsFind"?"date":"datetime";};
			if(old["type"]==null){f.type=datasetName=="dsFind"?"date":"datetime";};
			if(old["readonly"]==null)f.readonly=datasetName!="dsFind"&&datasetName!="dsHighFind";
		}else if(minName.indexOf("modifyuser")!=-1 ){
			if(old["label"]==null)f.label="修改人";
			if(old["readonly"]==null)f.readonly=datasetName!="dsFind"&&datasetName!="dsHighFind";
		}else if(minName=="code"){
			if(old["label"]==null)f.label="编码";
		}else if(minName=="remark" || minName.indexOf("remark")!=-1){
			if(old["label"]==null)f.label="备注";
			if(old["width"]==null)f.width=200;
			// if(old["colspan"]==null)f.colspan=2;
			// if(old["rowspan"]==null)f.rowspan=1;
			// if(old["type"]==null&&datasetName!="dsFind"&&datasetName!="dsHighFind")f.type="textarea";
		}else if(minName=="address" || minName.indexOf("address")!=-1){
			if(old["label"]==null)f.label="地址";
			if(old["width"]==null)f.width=200;
			// if(old["colspan"]==null)f.colspan=2;
			// if(old["rowspan"]==null)f.rowspan=2;
			// if(old["type"]==null&&datasetName!="dsFind"&&datasetName!="dsHighFind")f.type="textarea";
		}else if(minName=="name"){
			if(old["label"]==null)f.label="名称";
		}else if(minName=="label"){
			if(old["label"]==null){
				if(old["name"]!=null)f.label=f.name;
				else f.label="标题";
			};
		}else if(minName.indexOf("qty")!=-1){
			if(old["label"]==null)f.label="数量";
			if(old["datatype"]==null)f.datatype="int";
			if(old["value"]==null)f.value=0;
		}else if(minName.indexOf("weight")!=-1){
			if(old["label"]==null)f.label="重量";
			if(old["datatype"]==null)f.datatype="double";
			if(old["value"]==null)f.value="0.00";
		}else if(minName.indexOf("cubage")!=-1){
			if(old["label"]==null)f.label="体积";
			if(old["datatype"]==null)f.datatype="double";
			if(old["value"]==null)f.value="0.00";
		};
		if(old["check"]==null){
			if(minName.indexOf("datefrom")!=-1){
				const dto=f.name=="dateFrom"?"dateTo":f.name.replace("DateFrom","DateTo");
				f.check="<=$("+dto+")";
			}else if(minName.indexOf("dateto")!=-1){
				const dto=f.name=="dateTo"?"dateFrom":f.name.replace("DateTo","DateFrom");
				f.check=">=$("+dto+")";
			}
		};

		if(f.datatype=="boolean"){
			if(old["value"]==null)f.value=false;
			if(old["type"]==null)f.type="checkbox";
			if(old["onvalue"]==null)f.onvalue=true;
			if(old["offvalue"]==null)f.offvalue=false; 
		}else if(f.datatype=="int" || f.datatype=="double"){
			if(old["width"]==null)f.width=config.gridNumberFieldWidth;
			if(old["format"]==null)f.format=f.datatype=="double"?config.numberFormat:"#";
			if(old["align"]==null)f.align="right";
			if(f.supportsum)self.sumFields[f.name]=0;
			if(old["onvalue"]==null)f.onvalue=1;
			if(old["offvalue"]==null)f.offvalue=0; 
			if(old["supportsum"]==null)f.supportsum=true; 
			if(f.datatype=="double"&&old["precision"]==null){
				const str=f.format.substring(f.format.indexOf(".")+1,f.format.length);
				f.precision=!Misc.isNull(str)&&f.format.indexOf(".")!=-1?str.length:2;
			};
			if(old["value"]==null){
				if(f.datatype=="int")f.value=0;
				else f.value=Number(0).toFixed(f.precision);
			};
		}else if(f.datatype=="date"){
			f.type="date";
			if(old["width"]==null)f.width=config.gridDateFieldWidth;
			if(old["format"]==null)f.format=config.dateFormat;
		}else if(f.datatype=="datetime"){
			f.type="datetime";
			if(old["width"]==null)f.width=config.gridDatetimeFieldWidth;
			if(old["format"]==null)f.format=config.datetimeFormat;
		}else if(f.datatype=="string"){
			if(old["onvalue"]==null)f.onvalue="1";
			if(old["offvalue"]==null)f.offvalue="0"; 
		};

		if(old.options!=null&&old.options.length>0){
			if(old["type"]==null)f.type="select";
		};
		if(f.notnull===true)nonullFields[f.name]="notnull";
		if(f.datatype=="int"||f.datatype=="double")f.totaltype="sum";
		
		self.fieldMap[f.name]=f;
		let mrvalue="";
		if(f.datatype=="array")mrvalue=[];
		self.newRow[f.name]=f["value"]==null?mrvalue:f.value;
	};
	self.ex_initFields=(fields)=>{
		nonullFields={};
		self.sumFields={};
		if(fields.length>0){
			fields.forEach(field2=>{
				const f22=toLowerCase(field2), field= self.extend(self.mr,f22);
				self.initField(field,f22);
			});
			dsData.fields=fields;
		};
	};
	if(options!=null && options["fields"]!=null){
		self.ex_initFields(options["fields"]);
	};
	if(options!=null && options["columns"]!=null){
		const columns=[];
		options.columns.forEach(s=>{
		if(typeof(s)=="string"){
			if(self.fieldMap[s]!=null)columns.push(self.fieldMap[s]);
		}else if(typeof(s)=="object"){
			const name=s["name"],field=self.fieldMap[name];
			if(field!=null){
				const cp=eval("("+JSON.stringify(field)+")");
				for(const k in s){
					cp[k]=s[k];
				}
				columns.push(cp);
			}
		}});
		dsData.columns=columns;
	};
	dsData.addEvent=(fn2,evt)=>{//添加监听事件
		const fn=fn2.toLowerCase().trim();
		if(self.menthods[fn]==null)self.menthods[fn]=[];
		self.menthods[fn].push(evt);
	};
   self.queryServer=(params,evt)=>{
		if(dsData.actionquery==""&&dsData.action=="")return;
		self.executeEvent("executebefore",{type:"query"});
		let src="/"+dsData.actionquery;
		if(dsData.actionquery==null || dsData.actionquery==""){
			src="/"+dsData.action;
		}
		const header={};
		if(dsData.showloading)catchError(()=>{Loading.open("正在加载...");});
		let server=adminServer;
		params.server=dsData.server;
		params.executeId=new Date().getTime();
		params.commandType="Query";
		const ls=JSON.stringify(params).length;
		if(ls<1000){
			Promise.resolve(server.get(src, {params, headers: { ...header } })).then(res => {
				if(dsData.showloading)catchError(()=>{Loading.close();});
				if(dsData.isnormal){
					if(self.ajaxstatus(res)){
						try{evt(res)}catch(e){console.error(e);}
					}else{
						if(res["msg"]!=null){
							Message.closeAll();
							Message.error({ message: res.msg ,duration:duration});
						}
					}
				}else{
					try{evt(res)}catch(e){console.error(e);}
				}
				self.executeEvent("executeafter",{type:"query",rep:res});
			});
		}else{
			Promise.resolve(server.post(src,{data:params}, { headers: { ...header } })).then(res => {
				if(dsData.showloading)catchError(()=>{Loading.close();});
				if(dsData.isnormal){
					if(self.ajaxstatus(res)){
						try{evt(res)}catch(e){console.error(e);}
					}else{
						if(res["msg"]!=null){
							Message.closeAll();
							Message.error({ message: res.msg ,duration:duration});
						}
					}
				}else{
					try{evt(res)}catch(e){console.error(e);}
				}
				self.executeEvent("executeafter",{type:"query",rep:res});
			});
		}
   };
   self.deleteServer=(ids,evt)=>{
		self.executeEvent("executebefore",{type:"delete"});
		const src="/"+dsData.action+"/"+ids+"?sessionId="+sessionStorage.getItem("sessionId");
		const params={};
		const header={};
		if(dsData.showloading)catchError(()=>{Loading.open("正在删除...");});
		Promise.resolve(adminServer.delete(src, { params, headers: { ...header } })).then(res => {
			if(dsData.showloading)catchError(()=>{Loading.close();});
			if(self.ajaxstatus(res)){
				try{evt(res)}catch(e){console.error(e);};
				Message.closeAll();
				Message.success({message:"删除成功",duration:duration});
			}else{
				Message.closeAll();
				Message.error({ message: res.msg,duration:duration })
			}
			self.executeEvent("executeafter",{type:"delete"});
		});
	};
	self.executeServer=(params,evt)=>{
		if(typeof(params)=="undefined")params={};
		if(dsData.actionquery==""&&dsData.action=="")return;
		self.executeEvent("executebefore",{type:"execute"});
		let src="/"+dsData.action+"/execute";
		const header={};
		if(dsData.showloading)catchError(()=>{Loading.open("正在执行...");});
		let server=adminServer;
		if(dsData.server==="devtools"){
			params={params:params};
		}
		params.executeId=new Date().getTime();
		params.commandType="Query";
		Promise.resolve(server.get(src, {params, headers: { ...header } })).then(res => {
			if(dsData.showloading)catchError(()=>{Loading.close();})
			if(self.ajaxstatus(res)){
				try{evt(res)}catch(e){console.error(e);}
			}else{
				Message.closeAll();
				Message.error({ message: res.msg,duration:duration })
			}
			self.executeEvent("executeafter",{type:"execute",rep:res});
		},sb=>{
			if(dsData.showloading)catchError(()=>{Loading.close();});
			Message.closeAll();
			Message.error({ message:"查询失败",duration:duration })
		});
	};
	self.exportServer=(inParams)=>{
		self.executeEvent("executebefore",{type:"export"});
		const params=dsData.getParams();
		params.server=dsData.server;
		const head={sessionId:sessionStorage.getItem("sessionId")};
		const header={head:head};
		self.executeEvent("beforeexport",params);
		let url="/"+dsData.action+"/export/query";
		if(!Misc.isNull(inParams["url"]))url=inParams.url;
		else if(!Misc.isNull(dsData.actionquery)){
			url=dsData.actionquery.replace("/query","/export/query");
		};
		catchError(()=>{Loading.open("正在导出...");});
		Promise.resolve(adminServer.post(url, {data:params },
		 { headers: { ...header }, responseType: 'arraybuffer' })).then(res => {
			catchError(()=>{Loading.close();})
			self.executeEvent("executeafter",{type:"export"});
			self.executeEvent("afterexport",inParams);
		},sb=>{
			catchError(()=>{Loading.close();});
			Message.closeAll();
			Message.error({ message:"导出失败",duration:duration })
		});
		setTimeout(()=>{delete dsData.params.exportType;delete dsData.params.exportSetting;},10);
	};
	self.ajaxstatus=(res)=>{
		let iscg=true;
		if(res.status==="0" || res.status===0 ||res.success===false||(res.status!=null&&res.status*1!=200)||
		(res.code!=null&&res.code*1!=200)){
			iscg=false;
		}
		return iscg;
	};
	self.saveServer=(params,evt)=>{
		self.executeEvent("executebefore",{type:"save"});
		const src="/"+dsData.action+"/save?sessionId="+sessionStorage.getItem("sessionId");
		const head={sessionId:sessionStorage.getItem("sessionId")};
		const header={head:head};
		if(dsData.showloading)catchError(()=>{Loading.open("正在保存...");});
		Promise.resolve(adminServer.post(src,{data:params}, { headers: { ...header } })).then(res => {
			if(dsData.showloading)catchError(()=>{Loading.close();});
			if(self.ajaxstatus(res)){
				try{evt(res)}catch(e){console.error(e);};
				Message.closeAll();
				Message.success({message:"保存成功!",duration:duration});
			}else{
				Message.closeAll();
				Message.error({ message: res.msg,duration:duration })
			}
			self.executeEvent("executeafter",{type:"save"});
		});
	};
   self.executeEvent=(n2,param)=>{
		const n=n2.toLowerCase().trim();
		if(self.menthods[n]==null)return true;
		const sz=self.menthods[n];
		if(sz.length==0)return true;
		let isT=true;
		sz.forEach(fn=>{if(fn!=null){let isT2=catchError(()=>{return fn(param);});if(!isT2)isT=false;}});
		return isT;
	};
	dsData.doExport=(params)=>{
		if(typeof(params)=="undefined")params={};
		let type=params==null||params.exportType==null?"normal":params.exportType;
		dsData.params.exportType=type;
		if(type=="normal"){
			const exportSetting=[];
			dsData.fields.forEach(f=>{
				const ff=dsData.getField(f.name);
				if(ff.name!="select"&&ff.visible){
					exportSetting.push({name:ff.name,label:ff.label,width:ff.width,datatype:ff.datatype,format:ff.format});
				}
			});
			dsData.params.exportSetting=exportSetting;
		};
		self.exportServer(params);
	};
	dsData.doImport=()=>{
		console.log("----")
	};
   dsData.view=view;
	dsData.fieldAttr=(fieldname,attrname,value)=>{
		catchError(()=>{
			const ab=(a,b,c)=>{
				catchError(()=>{
					const field=self.fieldMap[a];
					if(field==null)return;
					const oldv=field[b];
					if(oldv===value)return;
					field[b]=value;
					self.executeEvent("fieldattr",{name:a,attrname:b,value:value,oldvalue:oldv});
					if(b==="value")self.newRow[a]=c;
					if(b==="notnull"){if(c===true)nonullFields[a]="notnull";else delete nonullFields[a];};
				});
			};
			if(typeof(fieldname)=="string"&&typeof(attrname)=="string"&&typeof(value)!="undefined"){
				if(fieldname.indexOf(",")==-1)ab(fieldname,attrname,value);
				else{
					const att=fieldname.split(",");
					if(att.length>0)att.forEach(s=>{
						if(s!="")ab(s,attrname,value);
					});
				}
			}else if(typeof(fieldname)=="string"&&typeof(attrname)=="object"&&typeof(value)=="undefined"){
				for(const k in attrname){
					const v=attrname[k];
					if(fieldname.indexOf(",")==-1){
						ab(fieldname,k,v);
					}else{
						const arr=fieldname.split(",");
						if(arr.length>0){
							arr.forEach(str=>{
								if(str!=="")ab(str,k,v);
							})
						}
					}
				}
			}else if(typeof(fieldname)=="object"&&typeof(attrname)=="undefined"&&typeof(value)=="undefined"){
				for(const k in fieldname){
					const kv=fieldname[k];
					dsData.fieldAttr(k,kv);
				}
			}
		});
	};
	dsData.getField=(fielname)=>{return self.fieldMap[fielname];};
   dsData.attr=function(sx,v){
		catchError(function(){
			const ab=function(n,v){
				if(self.props[n]==null||n==="name")return;
				const oldv=dsData[n];
				if(oldv===v)return;
				dsData[n]=v;
				self.executeEvent("attr",{attrname:n,value:v,oldvalue:oldv});
				if(n=="masterlink"){
					self.initMasterlink();
				}
				if(n=="fields")self.ex_initFields(v);
			};
			if(typeof(sx)=="string"){v=typeof(v)=="undefined"?"":v;ab(sx,v);}else if(typeof(sx)=="object"){for(const k in sx){const v2=sx[k]; ab(k,v2);}};
		});
   };
	dsData.setCurrent=(row)=>{
		const rowid1=row==null?"":row.rowId;
		const rowid2=dsData.row==null || dsData.row["rowId"]==null?"":dsData.row.rowId;
		if(rowid1===rowid2)return;
		const iszx=self.executeEvent("beforerowchange",{row:dsData.row});
		if(iszx){
			dsData.row=row;
			self.executeEvent("afterrowchange",{row:row});
		};
		return iszx;
	};
	self.node=document.createElement("div");
	self.rowstatechange=(row,state)=>{
		const rowNode=self.node.querySelector("#"+row.rowId);
		if(rowNode==null)return;
		const oldstate=rowNode.getAttribute("state");
		if(oldstate===state)return;
		rowNode.setAttribute("state",state);
		rowNode.setAttribute("v",state==="d"?"h":"s");
		row.state=state;
		if(state==="d" || oldstate==="d"){
			const nodes=self.node.querySelectorAll(".row");
			let isT=false;
			let curr_id="";
			for(let i=0;i<nodes.length;i++){
				const rid=nodes[i].getAttribute("id");
				if(rid!=row.rowId && isT===false && nodes[i].getAttribute("state")!="d")curr_id=rid;
				if(rid===row.rowId)isT=true;
				else if(rid!=row.rowId && nodes[i].getAttribute("state")!="d" && isT===true){
					curr_id=rid;
					break;
				}
			};
			if(!dsData.showdeletedata&&state==="d")dsData.setCurrent(dsData.rowMap[curr_id]);
			dsData.getRows();
		};
		self.executeEvent("rowstatechange",{value:state,oldvalue:oldstate,row:row});
	};
	dsData.getFieldValue=(n,v)=>{return self.getValue(n,v);};

	dsData.getFormatValue=(n,v)=>{
		let value=v,field=dsData.getField(n);
		if(field==null)return v;
		else if(field.datatype=="boolean"){
			if(v===1||v==="1"||v==="true"||v===field.onvalue)value=true;
			else if(typeof(v)!="boolean")value=false;
			else value=v;
		}else if(field.datatype=="int"||field.datatype=="double"){
			value=Number(v);
			if(isNaN(value))value=0;
			value=value.toFixed(field.precision);
		}else if(field.datatype=="date"||field.datatype=="datetime"){
			if(typeof(v)=="undefined"||v==""||v==null)value="";
			else{
				value=getDateFormat(field.format,v);
			}
		}else{
			if(typeof(v)=="undefined"||v==""||v==null)value="";
			else value=v;
		};
		const row={field:field,value:value};
		self.executeEvent("format",row);
		return row.value;
	};
	self.getValue=(n,v)=>{
		let value=v,field=dsData.getField(n);
		if(typeof(v)=="boolean"||typeof(v)=="number")return v;
		if(field==null)return typeof(v)=="undefined"?null:v;
		if(field.datatype=="boolean"){
			if(v===1||v==="1"||v==="true"||v===field.onvalue)value=true;
			else if(typeof(v)!="boolean")value=false;
			else value=v;
		}else if(field.datatype=="int"){
			value=Number(v).toFixed(0)*1;
			if(isNaN(value))value=0;
		}else if(field.datatype=="double"){
			value=Number(v).toFixed(field.precision)*1;
			if(isNaN(value))value=0;
		}else if(field.datatype=="array"){
			value=Misc.isNull(v)?[]:v;
			if(typeof(value)=="string")value=eval("("+v+")");
		}else if(field.datatype=="date"||field.datatype=="datetime"){
			value=Misc.isNull(value)?"":getDateValue(field.datatype,value);
		}else{
			if(typeof(v)=="undefined"||v==""||v==null)value="";
			else value=v;
		};
		return value;
	};
	dsData.set=(r,tp)=>{
		if(typeof(tp)=="undefined")tp="";
		if(self.node==null)return;
		let row=dsData.getCurrent();
		catchError(function(){
			if(r["rowId"]!=null)row=dsData.getRowById(r.rowId);
			if(row==null)return;
			let ismx=r.state==null?true:false;
			const oldrow=self.oldMap[row.rowId]==null?null:self.oldMap[row.rowId];
			for(const s in r){
				if(s=="rowId")continue;
				if(s==="state"){row.state=r.state;continue;};
				const value=self.getValue(s,r[s]),oldvalue=self.getValue(s,row[s]);
				const field=dsData.getField(s);
				if(field==null){
					view.tip({type:"error",msg:datasetName+"中["+s+"]不存在"});
					continue;
				}
				if(value+""===oldvalue+""&&!field.tag.isDataset)continue;
				const original=oldrow==null || oldrow[s]==null?null:oldrow[s];
				const isxg=self.executeEvent("beforechange",{name:s,value:value,oldvalue:oldvalue,original:original,row:row});
				if(!isxg)continue;
				row[s]=value;
				console.log(datasetName+"修改记录->","["+s+"]:"+value+"->"+oldvalue+"("+original+")"+row.rowId);
				if(!field.tag.isDataset){
					self.checkerror(s,row,value);
					self.executeEvent("afterchange",{name:s,value:value,oldvalue:oldvalue,original:original,row:row});
					if(s=="select")self.checkselect();
				}
			};
			
			if(row.state!=="i" && row.state!=="d"){
				const rowNode=self.node.querySelector("#"+row.rowId);
				if(rowNode==null)return;
				const sz=[];
				for(const f in self.fieldMap){
					const v1=self.getValue(f,row[f]);
					const v2=self.getValue(f,oldrow==null || oldrow[f]==null?"":oldrow[f]);
					const _field=self.fieldMap[f]
					if(v1===v2||(_field!=null&&_field.tag.isDataset)){continue;};
					sz.push("<span class='field' name='"+f+"' state='u'></div>");
				};
				rowNode.innerHTML=sz.join("");
				if(ismx){
					const nstate=sz.length==0?"n":"u";
					self.rowstatechange(row,nstate);
					row.state=nstate;
				}
			};
			if(r["state"]!=null){self.rowstatechange(row,r.state);row.state=r.state;};
		});
		self.executeEvent("afterset",{row:r,type:tp});
		return row;
	};
	self.createRowId=()=>{
		if(self.index==null)self.index=0; 
		let zm="R";
		if(datasetName=="dsData")zm="A";
		else if(datasetName=="dsLine1")zm="B";
		else if(datasetName=="dsLine2")zm="C";
		else if(datasetName=="dsLine3")zm="D";
		else if(datasetName=="dsLine4")zm="E";
		return zm+(++self.index);
	};

	self.clearRows=(rows)=>{
		const ids=[];
		rows.forEach(r=>{ids.push(r.rowId)});
		const id=dsData.row==null?null:dsData.row.rowId;
		const str=","+ids.join(",")+",";
		if(id!=null && str.indexOf(","+id+",")!=-1){
			const nodes=self.node.querySelectorAll(".row[v='s']");
			let isT=false;
			let curr_id="";
			for(let i=0;i<nodes.length;i++){
				const rid=nodes[i].getAttribute("id");
				if(str.indexOf(","+rid+",")==-1 && isT===false)curr_id=rid;
				if(str.indexOf(","+rid+",")!=-1 && isT===false)isT=true;
				else if(str.indexOf(","+rid+",")==-1 && isT===true){
					curr_id=rid;
					break;
				}
			}
			rows.forEach(rr=>{ self.remove(rr);});
			dsData.setCurrent(dsData.rowMap[curr_id]);
		}else{
			rows.forEach(rr=>{self.remove(rr);});
		}
	};
	dsData.commitMode="change";
	dsData.getSelected=function(){
		const rowids=[];
		self.node.querySelectorAll(".row").forEach(jd=>{
			const id=jd.getAttribute("id");
			if(row["select"]===true)rowids.push(id);
		});
		return rowids;
	};
	dsData.getData=function(status){
		const rows=[];
		const ab=(row)=>{
			let isT=true;
			isT=self.executeEvent("savefilter",row);
			if(typeof(isT)!="boolean")isT=true;
			if(isT)rows.push(row);
		};
		if(status==="current" && dsData.row!=null){
			ab(dsData.row);
		}
		else if(status==="all"){
			self.node.querySelectorAll(".row").forEach(jd=>{
				const id=jd.getAttribute("id");
				ab(dsData.rowMap[id]);
			});
		}else if(status==="change"){
			const rsNode=self.node.querySelectorAll(".row");
			const comits={};
			for(const f in self.fieldMap){
				const f2=self.fieldMap[f];
				if(f2.iscommit && f2.updateable)comits[f]=f;
			};
			if(rsNode!=null && rsNode.length>0)rsNode .forEach(jd=>{
				const state=jd.getAttribute("state");
				const id=jd.getAttribute("id");
				if(state=="u" || state=="d"){
					const row=dsData.rowMap[id];
					const rr={};
					rr.state=state;
					rr.rowId=row.rowId;
					for(const f in comits){
						rr[f]=row[f];
					}
					jd.querySelectorAll(".field").forEach(jj=>{const name=jj.getAttribute("name");rr[name]=row[name];})
					ab(rr);
				}else if(state=="i"){
					ab(dsData.rowMap[id]);
				}
			});
		}else if(status==="selected"){
			self.node.querySelectorAll(".row").forEach(jd=>{
				const id=jd.getAttribute("id");
				const row=dsData.rowMap[id];
				if(row["select"]===true){
					ab(row);
				}
			});
		};
		return rows;
	};
	dsData.params=options["params"]==null?{}:options.params;
	dsData.params2={};
	dsData.getParams=()=>{return self.getParams();};
	self.getParams=function(){//查询参数
		const params={};
		if(datasetName=="dsData"){
			if(view["search"]!=null){
				const fstr=view.search["findString"];
				if(fstr!="" && fstr!=null)params.findString=fstr;
			};
			if(dsData.findDataset!=""&& view[dsData.findDataset]!=null){
				const row=view[dsData.findDataset].getCurrent();
				if(row!=null){
					for(const k in row){
						if(k=="state" || k=="rowId")continue;
						const v=self.getValue(k,row[k]);
						if(v==null || v=="")continue;
						params[k]=v;
					}
				}
			};
		};
		if(dsData.params2!=null){
			for(const k in dsData.params2){
				if(k=="state"||k=="rowId")continue;
				const v=dsData.params2[k];
				if(Misc.isNull(v))continue;
				params[k]=v;
			}
		}
		if(dsData.params!=null){
			for(const k in dsData.params){
				params[k]=dsData.params[k];
			}
		}
		if(view["parameters"]!=null){
			for(const k in view.parameters){
				params[k]=view.parameters[k];
			}
		};
		if(dsData.server!=null)params.server=dsData.server;
		return params;
	};
	dsData.doExecute=function(evt){
		const isT=self.executeEvent("beforeexecute",{});
		if(!isT)return;
		self.executeServer(dsData.params,function(req){
			self.executeEvent("afterexecute",{req});
			catchError(()=>{if(typeof(evt)!="undefined")evt(req);});
		});
	};
	self.errorMaps={};
	self.executeCheck=(f,row2,evt)=>{
		if(f==null||Misc.isNull(f["check"])||(f.datatype!="int"&&f.datatype!="double"))return;
		const arr=f.check.split(",");
		if(arr==null||arr.length==0)return;
		for(let x=0;x<arr.length;x++){
			let xv=arr[x];
			if(xv==null)continue;
			catchError(()=>{
				xv=xv.trim();
				const v=self.getValue(f.name,row2[f.name]);
				if(eval(v+xv)==true)return;
				evt("「"+f.label+"」值必须"+xv);
			});
		};
	};
	dsData.errorsort=false;
	dsData.checkError=(rows)=>{
		let isError=false,error=[];
		self.errorMaps={};
		let isnonull=false;
		const ns=[];
		const ab=()=>{
			const arr=[];
			for(let k in self.fieldMap){
				const f=self.fieldMap[k];
				if(f.tag!=null&&f.tag.isDataset){
					arr.push(k);
				}
			}
			return arr;
		};
		const childs=ab();
		const abc=(_row)=>{
			if(childs.length==0)return {iserror:false,error:""};
			let iserror=false,error=[];
			childs.forEach(s=>{
				const _rows=_row[s];
				if(_rows!=null&&_rows.length>0){
					const rt=view[s].checkError(_rows);
					if(rt.iserror){
						iserror=true;
						error.push("明细["+s+"]"+rt.error);
					}
				}
			});
			return {iserror:iserror,error:error.join(",")};
		};
		catchError(()=>{
			for(let i=0;i<rows.length;i++){
				const row=rows[i];
				const row2=dsData.rowMap[row.rowId];
				if(row2.state=="n"||row2.state=="d")continue;
				if(nonullFields!=null){
					for(let k in nonullFields){
						const v=self.getValue(k,row2[k]);
						if(!Misc.isNull(v))continue;
						isError=true;
						const ff=dsData.getField(k);
						if(ff!=null){
							if(ns.join(",").indexOf(ff.label)==-1)ns.push(ff.label);
						}
						self.errorMaps[row2.rowId+"|"+k]="notnull";
						isnonull=true;
					};
				};
				for(let key in self.fieldMap){
					const f=self.fieldMap[key];
					if(f==null)continue;
					const prop={row:row2,iserror:false,error:[],name:f.name};
					self.executeCheck(f,row2,(err)=>{
						isError=true;
						if(error.join(",").indexOf(err)==-1)error.push(err);
						self.errorMaps[row2.rowId+"|"+f.name]="other";
					});
					self.executeEvent("check",prop);
					if(prop.iserror===false)continue;
					isError=true;
					if(prop.error!=null&&prop.error.length>0){error.push(prop.error.join(","));};
					self.errorMaps[row2.rowId+"|"+key]="other";
				};
				const rb=abc(row2);
				if(rb.iserror){
					isError=true;
					error.push(rb.error);
				}
			}
		});
		if(isnonull)error.push(ns.join(",")+",不能为空");
		if(isError){self.executeEvent("aftercheck",self.errorMaps);};
		if(isError&&error.length>0){Misc.alert({type:"error",text:error.join(",")});};
		if(dsData.errorsort===true)dsData.modifySort();
		return {iserror:isError,error:error};
	};
	dsData.getError=()=>{return self.errorMaps;};
	self.checkerror=(name,row,v)=>{
		 const key=row.rowId+"|"+name;
		if(self.errorMaps[key]==null)return;
		let isrr=false;
		if(nonullFields[key]!=null&&Misc.isNull(v))isrr=true;
		const prop={iserror:false,name:name,row:row,error:[]};
		self.executeEvent("check",prop);
		const field=dsData.getField(name);
		self.executeCheck(field,row,(err)=>{
			prop.iserror=true;
			prop.error.push(err);
		});
		if(prop.iserror||isrr)return;
		self.executeEvent("clearerror",key);
		delete self.errorMaps[key];
	};
	self.execute_aftersave=(req)=>{
		catchError(()=>{
			self.setStage(false);
			const data=req.data;
			if(data!=null && data.length>0){
				data.forEach(r=>{
					const rr=dsData.rowMap[r.rowId];
					if(rr!=null && rr.state!="d"){
						r.state="n";
						dsData.set(r,"save");
					}else{self.clearRows([rr]);}
				});
				self.oldMap=eval("("+JSON.stringify(dsData.rowMap)+")");
			};
			dsData.getRows();
			const fss=self.node.querySelectorAll(".field");
			if(fss.length>0)fss.forEach(s=>{s.parentNode.removeChild(s);});
			const rss=self.node.querySelectorAll(".row[v='d']");
			if(rss.length>0)rss.forEach(jd=>{jd.parentNode.removeChild(jd);});
			self.node.querySelectorAll(".row").forEach(jd=>{jd.setAttribute("v","s");jd.setAttribute("state","n");});
		});
		self.executeEvent("aftersave",req);
	};
	dsData.doSave=function(evt){
		let rows=dsData.getData(dsData.commitMode);
		console.log("save->"+datasetName,rows)
		if(rows.length==0)return;
		const rt=dsData.checkError(rows);
		if(rt!=null&&rt.iserror){
			if(rt.error!=null&&rt.error.length>0){
				Misc.alert({type:"error",text:rt.error.join(",")});
			};
		};
		if(rt.iserror)return;
		if(rows==null)rows=[];
		const isT=self.executeEvent("beforesave",{rows:rows});
		if(!isT)return;
		self.saveServer(rows,(req)=>{
			self.execute_aftersave(req);
			catchError(()=>{if(evt!=null)evt(req);});
		});
	};
	//self.eid=0;
	//self.createEventId=()=>{ return new Date().getTime()+Math.ceil(Math.random()*10000)+"_"+(++self.eid);};
	dsData.doQuery=function(evt){
		const params=self.getParams();
		if(!dsData.norefresh)dsData.clearData();
		if(dsData.pageIndex!==1){
			params.pageIndex=dsData.pageIndex;
			if(!Misc.isNull(dsData.pageSize))params.pageSize=dsData.pageSize;
		};
		const isT=self.executeEvent("beforequery",params);
		if(isT===false)return;
		self.errorMaps={};
		self.oldsort="";
		self.bymodifysort=false;
		self.queryServer(params,(req)=>{
			self.executeEvent("afterquery0",req);
			if(req!=null&&req.totalCount>0){
				dsData.attr("pageTotal",req.totalCount);
			}
			if(req!=null&&req.pageSize>0){
				dsData.attr("pageSize",req.pageSize);
			}
			if(dsData.isnormal){
				let rows=[];
				if(req!=null&&req["data"]!=null&&req.data["rows"]!=null)rows=req.data.rows;
				else if(req!=null&&req["data"]!=null&&req.data.length>0)rows=req.data;
				else if(req!=null&&req["length"]!=null)rows=req;
				else if(typeof(req)!="object")rows=[req];
				dsData.pushData(rows);
				self.executeEvent("afterquery",req);
				if(typeof(evt)!="undefined"){try{evt(req,dsData);}catch(e){console.error(e);}};
			}else{
				if(typeof(evt)!="undefined"){try{evt(req,dsData);}catch(e){console.error(e);}};
				self.executeEvent("afterquery",req);
			};
		});
	};
	dsData.getSum=(name)=>{const v=self.sumFields[name];if(v==null)return "";else return v;};
	self.getSum=()=>{
		if(dsData.stopsum)return;
		new Promise((resolve, reject)=>{
			catchError(()=>{
				let ls=false;
				for(const k in self.sumFields){if(self.sumFields[k]!==null){ls=true;self.sumFields[k]=0;};};
				if(!ls)return;
				catchError(()=>{
					dsData.rows.forEach(row=>{
						for(const k in self.sumFields){
							const v=row[k];
							let vv=v==null||isNaN(Number(v))?0:Number(v);
							self.sumFields[k]+=vv;
						}
					});
				});
				self.executeEvent("initfooter",{data:self.sumFields});
			});
		}).then();
	};
	dsData.doDelete=function(rs,ist){
		if(typeof(ist)=="undefined"&&typeof(rs)=="boolean")ist=rs;
		if(typeof(ist)=="undefined")ist=false;
		const rows=typeof(rs)=="undefined"||typeof(rs)=="boolean"?dsData.getCurrent():rs;
		if(rows==null)return;
		let isTT=true;
		isTT=self.executeEvent("beforedelete",rows);
		if(typeof(isTT)!="boolean")isTT=true;
		if(!isTT)return;
		const arr=[],clear_arr=[],ids=[];
		const ab=(row)=>{
			const id2=row[dsData.idField];
			if(row.state=="i")clear_arr.push(row);
			else {arr.push(row);ids.push(id2);}
		};
		if(rows["length"]==null && rows["rowId"]!=null){
			ab(rows);
		}else if(rows["length"]>0){rows.forEach(r=>{ab(r);});};
		if(arr.length==0 && clear_arr.length>0){
			self.clearRows(clear_arr);
			dsData.getRows();
			self.executeEvent("afterdelete",{rows:clear_arr});
		}else if(arr.length>0){
			if(dsData.deleteMode==="promptly"||ist){
				self.deleteServer(ids.join(","),function(){
					if(clear_arr.length>0)self.clearRows(clear_arr);
					self.clearRows(arr);
					dsData.getRows();
					self.executeEvent("afterdelete",{rows:arr});
					self.executeEvent("afterdeleteajax",{rows:arr});
					self.setStage(false);
					if(arr!=null&&arr.length>0)arr.forEach(r=>{
						const key=r[dsData.idField];
						delete dsData.keyMap[key];
					});
				});
			}else{
				if(clear_arr.length>0)self.clearRows(clear_arr); 
				arr.forEach(r=>{dsData.set({state:"d",rowId:r.rowId});});
				dsData.getRows();
				self.executeEvent("afterdelete",{rows:clear_arr});
			}
		}
	};
	dsData.type="Dataset";
	dsData.remove=(row)=>{
		if(row==null)return;
		if(row["length"]>0)self.clearRows(row);
		else self.clearRows([row]);
		dsData.getRows();
		self.executeEvent("afterclearrow",{row:row});
	};
	self.remove=function(row){
		catchError(function(){
			if(row==null)return;
			const rowid=row.rowId;
			if(dsData.rowMap[rowid]==null) return;
			const oldr=eval("("+JSON.stringify(row)+")");
			delete dsData.rowMap[rowid];
			delete self.oldMap[rowid];
			const dNode=self.node.querySelector("#"+rowid);
			if(dNode!=null)self.node.removeChild(dNode);
			self.executeEvent("afterremove",{row:oldr});
		});
	};
	dsData.getRowById=(rowid)=>{
		return dsData.rowMap[rowid];
	};
	dsData.clearData=function(){
		catchError(function(){
			self.changeselectall(false);
			dsData.rowMap={};
			self.oldMap={};
			self.bymodifysort=false;
			self.oldsort="";
			self.node.innerHTML="";
			dsData.rows=[];
			dsData.row=null;
			self.executeEvent("aftercleardata");
			self.setStage(false);
			self.executeEvent("afterrowchange",{row:null});
		});
	};
	dsData.doAdd=function(row,position){
		if((typeof(row)=="string"||typeof(row)=="number")&&typeof(position)=="undefined"){position=row;};
	   if(typeof(position)=="undefined")position=-1;
		const rr= eval("("+JSON.stringify(self.newRow)+")");
		let newRow=null;
		if(row!=null&&typeof(row)=="object"){newRow=row;for(let k in rr){if(row[k]==null)newRow[k]=rr[k];};}else{newRow=rr;};
		if(row==null){
			newRow= eval("("+JSON.stringify(self.newRow)+")");
		};
		let isT=true;
		newRow.rowId=self.createRowId();
		newRow.state="i";
		isT=self.executeEvent("beforeinsert",{row:newRow,position:position});
		if(typeof(isT)!="boolean")isT=true;
		if(!isT)return;
		dsData.rowMap[newRow.rowId]=newRow;
		const newNode=document.createElement("div");
		newNode.setAttribute("class","row");
		newNode.setAttribute("id",newRow.rowId);
		newNode.setAttribute("state","i");
		newNode.setAttribute("v","s");
		if(typeof(position)!="number" && position!=="after" && position!="before")position=-1;

		const nodes=self.node.querySelectorAll(".row[v='s']");
		if(position===-1 || nodes.length==0){
			self.node.appendChild(newNode);
		}else if(position==="after" || position==="before"){
			const dangq=dsData.row==null?null:dsData.row.rowId;
			let isfT=false;
			if(dangq!=null){
				for(let i=0;i<nodes.length;i++){
					const jd=nodes[i];
					if(jd.getAttribute("id")===dangq){
						isfT=true;
						if(position==="before"){
							self.node.insertBefore(newNode,jd);
						}else{
							if(i==nodes.length-1)self.node.appendChild(newNode);
							else{
								self.node.insertBefore(newNode,nodes[i+1]);
							}
						}
						break;
					}
				}
			}
			if(!isfT)self.node.appendChild(newNode);
		}else if(typeof(position)=="number"){
			if(position>0){
				if(nodes.length<position)self.node.appendChild(newNode);
				else self.node.insertBefore(newNode,nodes[position-1]);
			}else{
				if(nodes.length<position*-1){
					self.node.insertBefore(newNode,nodes[0]);
				}else{
					self.node.insertBefore(newNode,nodes[nodes.length+position]);
				}
			}
		};
		dsData.getRows();
		dsData.setCurrent(newRow);
		self.executeEvent("afterinsert",{row:newRow,position:position});
		let keys=newRow[dsData.idField];
		if(!Misc.isNull(keys)&&dsData.keyMap[keys]==null)dsData.keyMap[keys]=newRow.rowId;
	};
	dsData.getRows=function(){
		const sz=[];
		let  nodes=dsData.showdeletedata?self.node.querySelectorAll(".row"):self.node.querySelectorAll(".row[v='s']");
		nodes.forEach(jd=>{const id=jd.getAttribute("id"); sz.push(dsData.rowMap[id]);});
		dsData.rows=sz;
	};
	dsData.rowRaggable=function(start,end,ps){
		const nodes=self.node.querySelectorAll(".row[v='s']");
		if(start>nodes.length||end>nodes.length)return;
		const fnode=nodes[start],enode=nodes[end];
		if(fnode==null)return;
		const id1=fnode.getAttribute("id"),id2=enode.getAttribute("id");
		const copyNode=fnode.cloneNode(true);
		if(ps=="before")self.node.insertBefore(copyNode,enode);
		else{
			if(end==nodes.length-1)self.node.appendChild(copyNode);
			else{
				const next=nodes[end+1];
				self.node.insertBefore(copyNode,next);
			}
		};
		self.node.removeChild(fnode);
		const rows=[];
		for(let i=0;i<dsData.rows.length;i++){
			const r=dsData.rows[i];
			if(r.rowId!=id1&&r.rowId!=id2)rows.push(r);
			else if(r.rowId==id1)continue;
			else if(r.rowId==id2){
				if(ps=="before")rows.push(dsData.rowMap[id1]);
				rows.push(r);
				if(ps=="after")rows.push(dsData.rowMap[id1]);
			}
		};
		dsData.rows=rows;
		self.executeEvent("rowRaggable",{})
	};
	dsData.keyMap={};
	dsData.pushData=(rows)=>{
		self.setStage(false);
		dsData.rowMap={};
		dsData.keyMap={};
		const arr=[];
		dsData.rows=[];
		let isall=true,isslt=dsData.getField("select")!=null;
		let iszxkey=false;
		if(dsData.idField!=""&&dsData.getField(dsData.idField)!=null){
			iszxkey=true;
		};
		catchError(function(){
			if(typeof(rows)=="undefined"||rows==""||rows==null||rows["length"]==null)return;
			rows.forEach(row=>{
				row.rowId=self.createRowId();
				if(row["state"]==null)row.state="n";
				catchError(()=>{
					for(let s in self.fieldMap){
						const field=self.fieldMap[s];
						let v=row[s];
						if(field.type=="date"||field.type=="datetime"){
							if(Misc.isNull(v)){row[s]="";}
							else{const v2=getDateValue(field.type,v);if(v!==v2)row[s]=v2;};
						}else if(Misc.isNull(v)){
							if(field.datatype=="int"||field.datatype=="double"||field.datatype=="boolean"){
								row[s]=field.value;
							};
						};
					};
				});
				self.executeEvent("initrow",{row:row});
				if(isslt&&isall&&row.select!==true)isall=false;
				arr.push("<div class='row' id='"+row.rowId+"' state='"+row.state+"' v='"+(row.state=="d"?"h":"s")+"'></div>")
				if(row.state!=="d")dsData.rows.push(row);
				if(iszxkey){
					const key=row[dsData.idField];
					dsData.keyMap[key]=row.rowId;
				};
				dsData.rowMap[row.rowId]=row;
			});
		});
		if(isslt&&rows.length>0)self.changeselectall(isall);
		self.node.innerHTML=arr.join("");
		self.oldMap=eval("("+JSON.stringify(dsData.rowMap)+")");
		if(dsData.rows.length==0 && dsData.row!=null){
			dsData.row=null;
			self.executeEvent("afterrowchange",{row:null});
		}else if(dsData.rows.length>0){
			dsData.row=dsData.rows[0];
			self.executeEvent("afterrowchange",{row:dsData.rows[0]});
		};
		self.getSum();
		self.executeEvent("afterpushdata",{rows:dsData.rows});
	};
	self.bymodifysort=false;
	dsData.modifySort=()=>{if(dsData.rows==null||dsData.rows.length<2)return;dsData.sort(self.oldsort);};
	self.oldsort="";
	dsData.sort=(st)=>{
		if(dsData.rows==null||dsData.rows.length<2)return;
		const p=typeof(st)=="string"?st.split(","):st;
		let iszx=false;
		const rr=dsData.getError(),mpp={};
		let bcv=false;
		for(let k in rr){const rid=k.split("|")[0];mpp[rid]=rid;bcv=true;};
		if(Misc.isNull(st)&&!dsData.errorsort)return;
		iszx=self.bymodifysort!==bcv||bcv;
		self.bymodifysort=bcv;
		const _sort=(a,b)=>{
			if(self.bymodifysort&&dsData.errorsort){
				const a0=mpp[a.rowId]==null?1:0,b0=mpp[b.rowId]==null?1:0;
				if(a0!==b0){iszx=true;return a0-b0;};
			};
			if(st!=""&&st!=null){
				for(let i=0;i<p.length;i++){
					const str=p[i];
					const isasc=str.indexOf("-")!=-1?false:true;
					const field=str.replace("-","").replace("+","");
					const av=a[field]==null?"":a[field],bv=b[field]==null?"":b[field];
					if(av+""===bv+"")continue;
					if(!isNaN(Number(av)) && !isNaN(Number(bv))){
						iszx=true;
						return isasc?Number(av)-Number(bv):Number(bv)-Number(av);
					}else{
						iszx=true;
						return isasc?av.localeCompare(bv):bv.localeCompare(av);
					}
				};
			};
			const va=Number(a.rowId.replace(/\D/g,"")),vb=Number(b.rowId.replace(/\D/g,""));
			return va-vb;
		};
		const sz=dsData.rows.sort(_sort);
		if(!iszx)return;
		dsData.rows=sz;
		const root=document.createElement("div")
		sz.forEach(r=>{
			const nd=self.node.querySelector("#"+r.rowId);
			if(nd!=null)root.appendChild(nd.cloneNode(true));
		});
		self.node=root;
		self.executeEvent("aftersort",{sort:st});
		self.oldsort=st;
	};
	dsData.isModify=false;
	self.setStage=(ist)=>{
		//if(dsData.isModify===ist)return;
		dsData.isModify=ist;
		self.executeEvent("stagechange",{value:ist,oldvalue:!ist});
	};
	self.isxiugai=()=>{
		const htmls=self.node.innerHTML;
		const is=htmls.indexOf("state=\"i\"")!=-1||htmls.indexOf("state=\"u\"")!=-1||htmls.indexOf("state=\"d\"")!=-1;
		self.setStage(is);
	};
	dsData.addEvent("afterset",(param)=>{
		if(param.type=="save")return;
		self.isxiugai();
	});
	dsData.addEvent("afterinsert",()=>{self.isxiugai();});
	dsData.addEvent("afterdelete",()=>{self.isxiugai();});

	dsData.getCurrent=()=>{return dsData.row;};
	dsData.destroyed=()=>{
		catchError(function(){self.node.innerHTML="";self.node=null;});
		catchError(function(){for(var s in self){self[s]=null;};});
		dsData.rows=[];
	};
	if(options!=null && options["rows"]!=null){dsData.pushData(options.rows);};
	catchError(()=>{
		if(datasetName!=="dsData")return;
		view.datasetMap["dsData"]=false;
		const xgevt=(v)=>{
			if(view.isModify===v)return;
			view.isModify=v;
			catchError(()=>{if(view["modifyChange"]!=null)view.modifyChange();});
			view.executeEvent("modifyChange",{value:v});
		};
		const wxg=()=>{
			xgevt(false);
			for(let k in view.datasetMap){view.datasetMap[k]=false;};
			if(view["refreshForm"]!=null){view.refreshForm();};
		};
		dsData.addEvent("stagechange",(p)=>{
			view.datasetMap[datasetName]=p.value;
			let isxgg=false;
			for(let k in view.datasetMap){if(view.datasetMap[k]===true){isxgg=true;break;}};
			xgevt(isxgg);
		});
		dsData.addEvent("afterdeleteajax",()=>{wxg();});
		dsData.addEvent("aftersave",()=>{wxg();});
		dsData.addEvent("afterpushdata",()=>{wxg();});
		dsData.addEvent("afterinsert",()=>{if(view["refreshForm"]!=null){view.refreshForm();};});
	});
	view[options.name]=dsData;
	self.initMasterlink();
};//-------------DatasetEND
//EditorMode
function Editor(view,options){
	options=toLowerCase(options);
	const self={},setting={};
	self.elementprop=editorProp;
	const catchError=(evt)=>{let isT=true;try{isT=evt();}catch(e){console.error(e)}; if(typeof(isT)!="boolean")isT=true;return isT;};
	self.evs={};
	setting.addEvent=function(name,evt){
		const n=name.toLowerCase().trim();
		if(self.evs[n]==null)self.evs[n]=[];
		self.evs[n].push(evt);
	};
	setting.id="id_"+new Date().getTime()+"_E_"+Math.ceil(Math.random()*10000+1);
	setting.executeEvent=function(name,param){
		let isT=true;
		const n=name.toLowerCase().trim();
		if(self.evs[n]==null || self.evs[n].length==0)return isT;
		const sz=self.evs[n];
		sz.forEach((e,i)=>{
			let isT2=true;
			catchError(()=>{isT2=e(param);});
			if(typeof(isT2)!="boolean")isT2=true;
			if(isT2===false)isT=false;
		});
		return isT;
	};
	self.initreadonly=()=>{
		let ist1=false,ist2=false;
		const ab=function(sx){
			let isT=false;
			if(setting[sx]){isT=true;}
			else{
				const dsData=view[setting.dataset];
				if(dsData[sx])isT=true;
				else{
					const field=dsData.getField(setting.field);
					if(field!=null){if(field[sx])isT=true;}
				}
			};
			return isT;
		};
		ist1=ab("readonly");
		ist2=ab("disabled");
		setting.readonly2=ist1;
		setting.disabled2=ist2;
		setting.executeEvent("readonly",{name:setting.field,value:ist1||ist2,readonly:ist1,disabled:ist2});
	};
	self.iconwidth=16;
	self.initEditorCss=()=>{
		const css={},css2={};
		if(setting.editorcss!=null){for(const k in setting.editorcss){css[k]=setting.editorcss[k]};};
		const zw=setting.width*setting.colspan;
		const zh=setting.height*setting.rowspan+(setting.rowspan-1)*setting.rowspacing*2;
		const h=zh;
		const w=zw-(setting.hidelabel?0:setting.labelwidth)-setting.spacing;
		const showicon=setting.type=="select"
			||setting.type=="date"||
			setting.type=="datetime"||
			setting.type=="dropdown";
		let tiaoz=2;
		if(showicon)tiaoz+=self.iconwidth;
		if(setting.type!="radiogroup"&&setting.type!="checkboxgroup"){
			css.width=(w-tiaoz)+"px";
		};
		css.height=(h-2)+"px";
		if(setting.type!="textarea")css["line-height"]=(h-2)+"px";
		css["text-align"]=setting.align;
		if(setting.type!="image")css["padding"]="0px 2px";
		else css["padding"]="0px";
		css["margin"]="0px";
		setting.editorcss2=css;
		css2.width=w+"px";
		css2.height=h+"px";
		if(!setting.showline)css2.border="0px";
		if(setting.type=="switch"){
			css2["line-height"]=h+"px";
			css2["text-align"]=setting.align;
		}else if(showicon){
			const icon={};
			if(!setting.showline)icon.border="0px";
			icon.height=h+"px";
			icon.width=self.iconwidth+"px";
			setting.iconcss=icon;
		};
		setting.editorBodycss=css2;
	};
	self.initLabelCss=()=>{
		const css={},css2={},css3={};
		if(setting.labelcss!=null){for(const k in setting.labelcss){css[k]=setting.labelcss[k]};};
		let zw=setting.width*setting.colspan;
		const zh=(setting.height*setting.rowspan+(setting.rowspan-1)*setting.rowspacing*2);
		css.width=setting.hidelabel?"0px":setting.labelwidth+"px";
		css.height=zh+"px";
		css["line-height"]=zh+"px";
		const field=self.dsData.getField(options.field);
		if(field!=null&&field.notnull){css.color="blue";};
		css.display=setting.hidelabel?"none":"inline-block";
		css["text-align"]=setting.labelalign;
		css.padding="0px 2px";
		setting.labelcss2=css;
	
		if(setting.type!="group"){
			let h1=zh;
			if(setting.type=="banner"&&(Misc.isNull(setting.label)||setting.hidelabel))h1=10;
			css2["height"]=h1+"px";
			css3["height"]=h1+"px";
		}
		css2["width"]=(zw)+"px";
		if(setting.type=="banner"){
			css2["line-height"]=zh+"px";
			css2["text-align"]=setting.labelalign;
			css3["padding"]="0px 2px";
			css3["width"]=(zw-setting.spacing)+"px";
		}
		setting.rootcss3=css3;
		setting.rootcss=css2;
	};
	self.dsData=view[options.dataset];
	self.init=()=>{
		for(const k in self.elementprop){
			let v=options[k]==null?self.elementprop[k]:options[k];
			if(k=="label"&&options.field!=""&&self.dsData!=null&&(options.label==null||options.label=="")){
				const field=self.dsData.getField(options.field);
				if(field!=null)v=field.label;
			};
			setting[k]=v;
		};
		self.initProp();
	},
	setting.optionMap={};
	self.initOptions=()=>{
		setting.optionMap={};
		if(setting.type!="select")return;
		let options=setting.options;
		if(options.length==0){
			const dsData=view[options.dataset];
			if(dsData!=null&&dsData.getField(setting.field)!=null){
				const f=dsData.getField(setting.field);
				if(f["options"]!=null)options=f.options;
			}
		}
		if(options.length==0)return;
		options.forEach(item=>{setting.optionMap[item.value]=item.label;});
	};
	self.initProp=()=>{
		if(setting.type=="switch"&&(setting.options==null||setting.options.length==0)){
			const field=self.dsData.getField(options.field);
			if(field!=null){
				setting.options=[{value:field.onvalue,label:""},{value:field.offvalue,label:""}];
			}
		};
		self.initOptions();
		self.initLabelCss();
		self.initEditorCss();
		self.initreadonly();
	};
	self.init();
	
	setting.attr=(name,value)=>{
		const ab=(a,b)=>{
			if(a=="name"||self.elementprop[a]==null)return;
			const oldv=setting[a];
			if(oldv+""===b+"")return;
			setting.executeEvent("attr",{attrname:a,value:b,oldvalue:oldv});
			setting[a]=b;
		};
		if(typeof(name)=="string"&&typeof(value)!="undefined"){
			ab(name,value);
		}else if(typeof(name)=="object"){
			for(const k in name){
				ab(k,name[k]);
			}
		}
		self.initProp();
	};
	setting.view=view;
	setting.addEvent("attr",(p)=>{if(p.attrname=="readonly"||p.attrname=="disabled")self.initreadonly();});
	if(view[setting.dataset]!=null){
		const dst=view[setting.dataset]
		dst.addEvent("attr",(p)=>{
			if(p.attrname=="readonly"||p.attrname=="disabled")self.initreadonly();
		});
		dst.addEvent("fieldattr",(p)=>{if(p.attrname=="readonly"||p.attrname=="disabled")self.initreadonly();});
	};
	view[setting.name]=setting;
};
//AutoForm
function AutoForm(view,options){
	options=toLowerCase(options);
	const self={},setting={};
	const name=options["name"];
	const catchError=(evt)=>{let isT=true;try{isT=evt();}catch(e){console.error(e)}; if(typeof(isT)!="boolean")isT=true;return isT;};
	self.prop={
		name:"",
		controlwidth:config.autoformControlWidth,
		controlheight:config.autoformControlHeight,
		width:0,
		height:0,
		spacing:config.autoformSpacing,
		rowspacing:config.autoformRowSpacing,
		labelwidth:config.autoformLabelWidth,
		elements:[],
		readonly:false,
		disabled:false,
		dataset:"",
	};
	self.elementprop=editorProp;
	self.evs={};
	setting.addEvent=function(name,evt){
		const n=name.toLowerCase().trim();
		if(self.evs[n]==null)self.evs[n]=[];
		self.evs[n].push(evt);
	};
	setting.executeEvent=function(name,param){
		let isT=true;
		const n=name.toLowerCase().trim();
		if(self.evs[n]==null || self.evs[n].length==0)return isT;
		const sz=self.evs[n];
		sz.forEach((e,i)=>{
			let isT2=true;
			catchError(()=>{isT2=e(param);});
			if(typeof(isT2)!="boolean")isT2=true;
			if(isT2===false)isT=false;
		});
		return isT;
	}
	setting.attr=(_name,value)=>{
		const ab=(a,b)=>{
			if(a=="name"||self.prop[a]==null)return;
			const oldv=setting[a];
			if(oldv+""===b+"")return;
			setting.executeEvent("attr",{attrname:a,value:b,oldvalue:oldv});
			setting[a]=b;
			if(a=="elements")setting.elements=self.initElement(b,true);
		};
		if(typeof(_name)=="string"&&typeof(value)!="undefined")ab(_name,value);
		else if(typeof(_name)=="object"&&typeof(value)=="undefined"){
			for(const k in _name){ab(k,_name[k]);}
		}
	};
	setting.elementAttr=(names,attrname,value)=>{
		const abc=(a,b,c)=>{
			if(b=="name")return;
			catchError(()=>{
				if(self.elMap[name+"_"+a]==null||self.elementprop[b]==null)return;
				const element=self.elMap[name+"_"+a];
				const oldv=element[b];
				if(oldv+""===c+"")return;
				setting.executeEvent("elementattr",{name:a,attrname:b,value:c,oldvalue:oldv});
				if(element.attr!=null)element.attr(b,c);
			});
		};
		if(typeof(names)=="string"&&typeof(attrname)=="string"&&typeof(value)!="undefined"){
			if(names.indexOf(",")==-1)abc(names,attrname,value);
			else {
				const arr=names.split(",");
				arr.forEach(s=>{if(s!=null&&s!="")abc(s,attrname,value);});
			}
		}else if(typeof(names)=="string"&&typeof(attrname)=="object"&&typeof(value)=="undefined"){
			for(const k in attrname){
				if(names.indexOf(",")==-1)abc(names,k,attrname[k]);
				else {
					const arr=names.split(",");
					arr.forEach(s=>{if(s!=null&&s!="")abc(s,k,attrname[k]);});
				}
			}
		}else if(typeof(names)=="object"&&typeof(attrname)=="undefined"&&typeof(value)=="undefined"){
			for(const k in names){
				setting.elementAttr(k,names[k]);
			}
		};
	};
	self.elMap={};
	self.nb=0;
	self.initElement=(els2)=>{
		let els=els2;
		if(typeof(els2)=="string"&&els2!="")els=els2.split(",");
		const sz=[];
		self.elMap={};
		if(els!=null&&els!=""&&els.length>0){
			const dsData=view[setting.dataset];
			if(dsData==null)return;
			els.forEach(el=>{
				const field=typeof(el)=="string"?dsData.getField(el):dsData.getField(el.name);
				const nr={};
				for(const k in self.elementprop){
					let v=self.elementprop[k];
					if(typeof(el)=="object"&&el[k]!=null)v=el[k];
					else if(field!=null&&field[k]!=null)v=field[k];
					nr[k]=v;
				};
				nr.dataset=setting.dataset;
				if(field!=null){
					nr.field=field.name;
				}else if(nr.type=="group"){
					nr.field=nr.name;
				}else if(!Misc.isNull(nr.name)){
					nr.field=nr.name;
				}else{
					self.nb+=1;
					nr.field="$element-"+self.nb;
				};
				nr.name=name+"_"+nr.field;
				nr.width=setting.controlwidth;
				nr.height=setting.controlheight;
				if(nr.labelwidth===0)nr.labelwidth=setting.labelwidth;
				if(el.dropdown!=null&&el.dropdown!="")nr.type="dropdown";
				nr.spacing=setting.spacing;
				nr.rowspacing=setting.rowspacing;
				if(nr.child!=null&&nr.child.length>0){
					nr.child=self.initElement(nr.child);
				};
				new Editor(view,nr);
				if(field!=null){
					view[nr.name].addEvent("click",()=>{
						setting.executeEvent("click",{name:field.name});
					});
					view[nr.name].addEvent("focus",(p)=>{
						setting.executeEvent("focus",p);
					});
				};
				self.elMap[nr.field]=view[nr.name];
				sz.push(view[nr.name]);
				
			});
		};
		return sz;
	};

	self.init=()=>{
		if(options==null)options={};
		for(const k in self.prop){
			setting[k]=options[k]==null?self.prop[k]:options[k];
		}
		if(options["elements"]==null){
			const dsData=view[setting.dataset];
			setting.elements=dsData.fields;
		};
		setting.elements=self.initElement(setting["elements"],true);
	};
	setting.view=view;
	self.init();
	view[name]=setting;
};
function Tabset(view,options){
	options=toLowerCase(options);
	const self={},tabset={};
	const prop={name:"",label:"",visible:true,disabled:false};
	self.currentTab=null;
	const catchError=(evt)=>{let isT=true;try{isT=evt();}catch(e){console.error(e)}; if(typeof(isT)!="boolean")isT=true;return isT;};
	self.tabMap={};
	tabset.currentTab=null;
	self.activeMap={};
	self.setting={};
	tabset.key="T"+new Date().getTime()+"_S_"+Math.ceil(Math.random()*10000+1);
	self.methods={actived:function(tab){},afterchange:function(tab){},beforechange:function(tab){}};
	self.init=()=>{
		for(const k in self.methods){
			self.setting[k]=options==null || options[k]==null?self.methods[k]:options[k];
		};
	};
	self.initTab=function(tabs){
		self.tabMap={};
		tabset.currentTab=options["currentTab"];
		self.currentTab="";
		self.activeMap={};
		catchError(function(){
			const sz=[];
			if(tabs!=null && tabs.length>0){
				tabs.forEach((r,i)=>{
					const nr={};
					for(const s in prop){
						nr[s]=r[s]==null?prop[s]:r[s];
					}
					if(nr.label==="")nr.label=nr.name;
					self.tabMap[nr.name]=nr;
					if(tabset.currentTab==null && nr.visible && !nr.disabled){
						tabset.currentTab=nr.name;
					};
					sz.push(nr);
				});
			};
			tabset.tabs=sz;
		});
	};
	if(options!=null)self.initTab(options["tabs"]);
	self.evs={};
	tabset.addEvent=function(name,evt){
		const n=name.toLowerCase().trim();
		if(self.evs[n]==null)self.evs[n]=[];
		self.evs[n].push(evt);
	};
	self.executeEvent=function(name,param){
		let isT=true;
		const n=name.toLowerCase().trim();
		if(self.evs[n]==null || self.evs[n].length==0)return isT;
		const sz=self.evs[n];
		sz.forEach((e,i)=>{
			let isT2=true;
			catchError(()=>{isT2=e(param);});
			if(typeof(isT2)!="boolean")isT2=true;
			if(isT2===false)isT=false;
		});
		return isT;
	}
	self.init();
	self.changeTab=function(name){
		const item=self.tabMap[name];
		if(item==null || !item.visible || item.disabled)return;
		if(self.activeMap[name]==null){
			self.activeMap[name]=name;
			catchError(()=>{self.setting.actived(item);});
			self.executeEvent("actived",item);
		};
		if(self.currentTab===name)return;
		let isT=true;
		const tab0=self.currentTab===""?null:self.tabMap[self.currentTab];
		if(tab0!=null)catchError(()=>{
			isT=self.setting.beforechange(tab0,item);
			isT=self.executeEvent("beforechange",tab0,item);
		});
		if(typeof(isT)!="boolean")isT=true;
		if(!isT)return;
		self.showBody(name);
		self.currentTab=name;
		tabset.currentTab=name;
		catchError(()=>{isT=self.setting.afterchange(item);});
		self.executeEvent("afterchange",item);
	};
	self.changeLable=(name,label)=>{
		catchError(()=>{
			const node=document.querySelector(".tabset-item[for='"+tabset.key+"'][name='"+name+"']");
			if(node==null)return;
			node.innerHTML=label;
		});
	}
	self.visiableEvt=(name,ist)=>{
		catchError(()=>{
			const node=document.querySelector(".tabset-item[for='"+tabset.key+"'][name='"+name+"']");
			if(node!=null){
				node.style.display=ist?"inline-block":"none";
			}
			const bodys=document.querySelectorAll(".tab[for='"+tabset.key+"']");
			if(bodys.length>0)bodys.forEach(jd=>{
				const n2=jd.getAttribute("tab");
				if(n2!=null&&(","+n2+",").indexOf(","+name+",")!=-1){
					jd.classList.add("tabset-active");
					self.setHidden(jd,false);
				}else{
					jd.classList.remove("tabset-active");
					self.setHidden(jd,true);
				} 
			});
		})
	};
	self.setHidden=(jd,isT)=>{
		const nodes=jd.querySelectorAll(".control");
		for(let i=0;i<nodes.length;i++){
			const nd=nodes[i];
			nd.setAttribute("ishidden",isT);
			const nodes2=nd.querySelectorAll(".tab[tab]");
			if(nodes2.length>0){
				self.forEach(nodes2,(jd2)=>{
					if(!jd2.classList.contains("tabset-active")){self.setHidden(jd2,true);};
				});
			}
		}
	};
	self.forEach=(nodes,evt)=>{
		const ls=nodes.length;
		for(let i=0;i<ls;i++){
			const nd=nodes[i];
			evt(nd,i);
		}
	};
	tabset.attr=(obj)=>{
		if(typeof(obj)!="object")return;
		for(let name in obj){
			const item=self.tabMap[name];
			if(item==null)continue;
			const vtt=obj[name];
			for(const k in vtt){
				const v=vtt[k];
				if(k=="name"||prop[k]==null)continue;
				const oldv=item[k];
				if(oldv+""===v+"")continue;
				self.executeEvent("attr",{name:name,attrname:k,value:v,oldvalue:oldv});
				item[k]=v;
				if(k=="visible"){
					self.visiableEvt(name,v);
				}else if(k=="label"){
					self.changeLable(name,v);
				}
			}
		}
	};
	tabset.activeDefault=function(){
		if(tabset.currentTab==null)return;
		self.changeTab(tabset.currentTab);
	};
	tabset.setCurrentTab=(name)=>{
		self.changeTab(name);
	};
	tabset.destroyed=function(){
		catchError(()=>{for(const k in self){self[k]=null;}});
	};
	self.showBody=function(name){
		const nodes=document.querySelectorAll(".tab[for='"+tabset.key+"']");
		if(nodes==null || nodes.length==0)return;
		for(let i=0;i<nodes.length;i++){
			const jd=nodes[i],ns=jd.getAttribute("tab");
			
			if((","+ns+",").indexOf(","+name+",")==-1){
					jd.classList.remove("tab-active");
				   self.setHidden(jd,true);
			}else{
					jd.classList.add("tab-active");
					self.setHidden(jd,false);
			}
		}
	};
	tabset.onload=function(view){
		const id=tabset.key;
		const node=document.querySelector(".tabset-body[for='"+id+"']");
		const nodes= node.querySelectorAll("[tab]");
		for(let i=0;i<nodes.length;i++){
			const jd=nodes[i];
			if(!jd.classList.contains("tab"))jd.classList.add("tab");
			const pid=jd.parentNode.parentNode.getAttribute("for");
			if(pid!==tabset.key)continue;
			jd.setAttribute("for",pid);
		}
		self.executeEvent("onload",{});
	};
	tabset.name=options["name"];
	view[tabset.name]=tabset;
	return tabset;
}
//DropDownMode
function DropDown(view,options){
	options=toLowerCase(options);
	const self={};
	self.prop={
		maxwidth:0,
		maxheight:320,
		minwidth:30,
		name:"",
		read:"",
		autoopen:true,
		element:"",
		editor:"",
		write:"",
		isopen:false,
		showhead:true,
		openfilter:true,
		datamode:"hidden",
		dataset:"",
		selectclose:function(){},
		paramname:"findString",
		columns:[],
		tag:{},
		multi:false,
		insertsimple:false,
		selected:function(row,target){},
		grid:{},

	};
	let setting={};
	self.init=()=>{
		setting={};
		for(const k in self.prop){const v=self.prop[k]; setting[k]=options==null || options[k]==null?v:options[k];};
		if(setting.columns==null||setting.columns.length==0||setting.columns==""){
			const dsdd=view[setting.dataset];
			if(dsdd!=null&&dsdd.fields!=null&&dsdd.fields.length>0){
				setting.columns=dsdd.fields;
			}
		}
	};
	self.init();
	const dsdd=view[setting.dataset];
	self.evs={};
	setting.view=view;
	self.isNull=(str)=>{
		let ist=false;
		if(typeof(str)=="undefined"&&str==nul||str=="")ist=true;
		return ist;
	};
	setting.selected2=(row)=>{
		try{
			if(self.isNull(setting.editor)||setting.editor["dataset"]==null)return;
			const $dsData=setting.editor.view[setting.editor.dataset];
			if($dsData==null)return;
			let iszx=true;
			iszx=setting.selected(row,{name:setting.editor.field,view:setting.editor.view,dataset:setting.editor.dataset});
			if(typeof(iszx)!="boolean")iszx=true;
			if(iszx&&!self.isNull(setting.read)&&!self.isNull(setting.write)){
				const arr=setting.read.split(","),arr2=setting.write.split(","),nr={};
				if(setting.insertsimple||!setting.multi){//单选或单行
					if(!setting.multi){
						for(let i=0;i<arr.length;i++){
							const v=row[arr[i]];
							nr[arr2[i]]=v;
						}
					}else{
						const mpp={};
						row.forEach(r=>{
							for(let i=0;i<arr.length;i++){
								const f=arr[i],v=r[f],f2=arr2[i];
								if(mpp[f2]==null)mpp[f2]=[];
								mpp[f2].push(v);
							}
						});
						for(const k in mpp){nr[k]=mpp[k].join(",");};
					};
					$dsData.set(nr);
				}else{//多行多选
					const rows= $dsData.getData("all");
					const mp={},arr8=[];
					const inserts=[];
					rows.forEach(r=>{
						if(r.state!="d"){
							const key=r[arr2[0]];
							if(Misc.isNull(key))inserts.push(r.rowId);
							if(mp[key]==null&&!Misc.isNull(key)){
								mp[key]=key;
								arr8.push(key);
							};
						};
					});
					const vv=","+arr8.join(",")+",";
					let xh=0;
					row.forEach(r=>{
						const key=r[arr[0]];
						if(vv.indexOf(","+key+",")==-1){
							const nr={};
							for(let i=0;i<arr.length;i++){
								const v=r[arr[i]];
								nr[arr2[i]]=v;
							};
							if(inserts.length>xh){
								nr.rowId=inserts[xh];
								$dsData.set(nr);
								xh+=1;
							}else{
								$dsData.doAdd(nr,"after");
							};
						}
					});
				}
			};
			setting.executeEvent("selected",{row:row,field:setting.editor});
			try{if(setting.selectclose!=null)setting.selectclose();}catch(e){};
			setting.executeEvent("selectclose",{});
		}catch(e2){console.error(e2);};
	};
	self.isactive=false;
	setting.active=()=>{
		if(self.isactive)return;
		self.isactive=true;
		try{
			const dsData=setting.view[setting.dataset];
			if(dsData!=null&&dsData.rows.length==0){
				dsData.attr({"showloading":false,norefresh:true});
				dsData.doQuery();
			}
		}catch(e){console.error(e)}
		setting.executeEvent("active",{});
	};
	const catchError=(evt)=>{try{evt();}catch(e){console.error(e)}};
	self.openDropdown=()=>{
		const bd=setting.element;
		if(bd==""||bd==null||!setting.isopen||setting.grid==null)return;
		const editorPs=bd.getBoundingClientRect();
		const jd=document.querySelector("#"+setting.id);
		catchError(()=>{
			const left=editorPs.left,top=editorPs.top,w2=editorPs.width,h2=editorPs.height;
			const body=document.querySelector("body");
			const xx2=Math.floor(body.offsetWidth-2),yy2=Math.floor(body.offsetHeight-2);
			let leftwidth=left+w2,rightwidth=xx2-left;
			let height1=top-2,height2=yy2-top-h2-1;
			const params={
				height1:height1,
				height2:height2,
				leftwidth:leftwidth,
				rightwidth:rightwidth,
				minwidth:setting.minwidth,
				maxheight:setting.maxheight,
				multi:setting.multi
			};
			let lft=left,tp=top+h2+1;
			setting.executeEvent("executeopen",params);
			if(!params.isdown){tp=top-params.height-1;};
			if(!params.isright){lft=left+w2-params.width;};
			jd.style.height=params.height+"px";
			jd.style.width=params.width+"px";
			jd.style.left=lft+"px";
			jd.style.top=tp+"px";
			jd.style.zindex=100;
		});
	};
	dsdd.addEvent("afterpushdata",()=>{if(!setting.isopen)return;self.openDropdown();});
	self.initselect=()=>{
		catchError(()=>{
			if(self.isNull(setting.read)||self.isNull(setting.write))return;
			const dsDD=setting.view[setting.dataset];
			const dsData=setting.editor.view[setting.editor.dataset];
			const wid=setting.write.split(",")[0],rid=setting.read.split(",")[0];
			const abc=(v)=>{
				const rows=dsDD.getData("all");
				const selectField=dsDD.getField("select");
				rows.forEach(rr=>{
					const v2=rr[rid], ist=(","+v+",").indexOf(","+v2+",")!=-1;
					if(setting.datamode=="selected"&&selectField!=null){
						if(rr.select!==ist)dsDD.set({rowId:rr.rowId,select:ist,state:"n"});
					}else if(setting.datamode=="hidden"){
						const nstr=ist?"d":"n";
						const nr={rowId:rr.rowId,select:false,state:nstr};
						if(selectField==null)delete nr.select;
						dsDD.set(nr);
					}
				});
			};
			if(setting.insertsimple||!setting.multi){//是否是单行
				const r=dsData.getCurrent(),v0=r[wid];
				abc(v0);
			}else{//多行 插入
				const mp={},arr=[];
				const rows=dsData.getData("all");
				rows.forEach(r=>{if(r.state!="d"){const key=r[wid];if(mp[key]==null){arr.push(key);mp[key]=key;};}});
				const v0=arr.join(",");
				abc(v0);
			};
		});
	};
	self.isfst=false;
	setting.open=()=>{
		const ist=setting.executeEvent("beforeopen",{});
		if(ist===false)return;
		setting.active();
		const bd=setting.element;
		if(bd==""||bd==null)return;
		self.initselect();
		setting.isopen=true;
		const node=document.querySelector("#"+setting.id);
		if(node!=null){
			node.style.left="-1000px";
			node.style.display="block";
			if(!self.isfst){setTimeout(()=>{self.openDropdown();},20);self.isfst=true;}
			else self.openDropdown();
			const colsevt=function(e2){
				const target=e2.target;
				if(target!=bd&&!bd.contains(target)&&target!=node&&!node.contains(target)){
					document.removeEventListener("mousedown",colsevt);
					setting.close();
				}
			};
			document.addEventListener("mousedown",colsevt);
		};
		setting.executeEvent("afteropen",{});
	};
	setting.close=()=>{
		const ist=setting.executeEvent("beforeclose",{});
		if(ist===false)return;
		setting.isopen=false;
		setting.executeEvent("afterclose",{});
	};
	setting.addEvent=function(name,evt){
		const ns=name.toLowerCase().trim();
		if(self.evs[ns]==null)self.evs[ns]=[];
		self.evs[ns].push(evt);
	};
	setting.doFilter=(v)=>{
		if(!setting.openfilter)return;
		const dsData=setting.view[setting.dataset];
		dsData.attr({showloading:false});
		if(dsData==null||(self.isNull(dsData.action)&&self.isNull(dsData.actionquery)))return;
		dsData.params[setting.paramname]=v;
		dsData.doQuery();
	};
	setting.executeEvent=function(name,param){
		const ns=name.toLowerCase().trim();
		let ist=true;
		if(self.evs[ns]==null)return ist;
		const sz=self.evs[ns];
		if(sz==null || sz.length==0)return ist;
		sz.forEach(evt=>{
			let ist2=true;
			try{ist2=evt(param);}catch(e){console.error(e);}
			if(typeof(ist2)!="boolean")ist2=true;
			if(!ist2)ist=false;
		});
		return ist;
	};
	setting.attr=function(name,value){
		const ab=(k,v)=>{
			try{
				if(self.prop[k]==null || k=="set"||k=="selected2"|| 
				k=="addEvent"||k=="executeEvent"||k=="isopen"||k=="id")return;
				if(setting[k]===v&&k!="element"&&k!="tag")return;
				const oldv=setting[k];
				setting.executeEvent("attr",{attrname:k,value:v,oldvalue:oldv});
				setting[k]=v;
			}catch(e){console.error(e)};
		};
		if(typeof(name)=="string"&&typeof(value)!="undefined")ab(name,value);
		else if(typeof(name)=="object"&&typeof(value)=="undefined"){
			for(const k in name){
				ab(k,name[k]);
			}
		}
	};
	setting.id="dd" + new Date().getTime() + "-" + Math.ceil(Math.random() * 10000 + 1)
	if(view[setting.name]!=null)return;
   view[setting.name]=setting;
};
//SearchMode
function Search(view,options){
    let name=options["name"];
    if(name==null)name="search";
    const self={};
    self.prop={
		  name:"",
		  type:"search",
		  findString:"",
        placeholder:"", 
        showbutton:["btnFind","btnHight","btnNew","btnDelete","btnSave","btnExport","btnImport","btnRefresh","btnClose"],
        hightaction:"",
        hightwidth:560,
        highttitle:"高级查询",
		  highticon:"el-icon-search",
		  hightdataset:"dsData",
        buttons:{},
        show:true,
        align:"left",
		  width:320,
		  dsFind:{}
	 };
    const setting={};
    try{for(const k in self.prop){setting[k]=options==null||options[k]==null?self.prop[k]:options[k];}}catch(e){console.error(e);};
	 self.evs={};
	 setting.buttonMap={};
	 self.btnProp={name:"",type:"search",label:"",position:"left",icon:"",visible:true,disabled:false,click:function(btn){},child:[]};
	 self.initButtons=(btns)=>{
		setting.buttonMap={};
		if(btns==null||btns.length==0)return;
		for(const k in btns){
			const nbt={},attrs=btns[k];
			for(const k in self.btnProp){
				if(attrs[k]==null)continue;
				nbt[k]=attrs[k];
			};
			nbt.name=k;
			if(nbt.child==null)nbt.child=[];
			if(nbt.child.length>0){
				nbt.child.forEach(childbtn=>{
					for(const k2 in self.btnProp){
						if(childbtn[k2]!=null)continue;
						childbtn[k2]=self.btnProp[k2];
					}
				});
				nbt.icon="&#xe614;";
				nbt.position="right";
			};
			setting.buttonMap[k]=nbt;
		}
	 };
	 setting.getButton=(name)=>{return setting.buttonMap[name];};
	 setting.buttonAttrs=self.btnProp;
    setting.addEvent=function(name,evt){
        const ns=name.toLowerCase().trim();
        if(self.evs[ns]==null)self.evs[ns]=[];
        self.evs[ns].push(evt);
    };
    setting.executeEvent=function(name,param){
        const ns=name.toLowerCase().trim();
        if(self.evs[ns]==null)return;
        const sz=self.evs[ns];
        if(sz==null||sz.length==0)return;
        sz.forEach(evt=>{try{evt(param);}catch(e){console.error(e);}});
    };
	 setting.view=view;
	 setting.click=(name)=>{
		 const btn=setting.buttonMap[name];
		if(btn==null)return;
		if(btn["click"]!=null){
			try{btn.click(btn);}catch(e){console.error(e);};
		}
	 };
	 setting.buttonAttr=(dx)=>{
		if(dx==null||typeof(dx)!="object")return;
		const ab=(k,attrs)=>{
			if(setting.buttonMap[k]!=null){
				const oldr=setting.buttonMap[k];
				for(const n in attrs){
					const ns=n.toLowerCase().trim();
					if(ns=="name"||oldr[ns]===attrs[n])continue;
					oldr[ns]=attrs[n];
					setting.executeEvent("buttonattr",{name:k,attrname:ns,value:attrs[n]});
				}
			}else{
				for(const n in attrs){
					const ns=n.toLowerCase().trim();
					if(ns=="name"||self.btnProp[ns]==null)continue;
					setting.executeEvent("buttonattr",{name:k,attrname:ns,value:attrs[n]});
				}
			}
		};
		if(dx["name"]!=null){
			ab(dx.name,dx);
		}else{
			for(const k in dx){
				ab(k,dx[k]);
			}
		};
	 };
    setting.attr=(name,value)=>{
        const ab=function(a,b){
            if(a=="name"||a=="attr"||a=="view"||a=="buttonMap")return;
            if(self.prop[a]==null)return;
            if(setting[a]===b)return;
				setting[a]=b;

				if(a=="buttons"){self.initButtons(b);};
            setting.executeEvent("attr",{attrname:a,value:b});
        };
        if(typeof(name)=="string"&&typeof(value)!="undefined"){
            const ns=name!="dsFind"?name.toLowerCase().trim():"dsFind";
            ab(ns,value);
        }else if(typeof(name)=="object"){
            for(const k in name){
                const k2=k!=="dsFind"?k.toLowerCase().trim():"dsFind";
                ab(k2,name[k]);
            }
        }
	 };
	 setting.change=function(v){
		 view[setting.name].findString=v;
		 try{ if(options["change"]!=null){options.change(v);}; }catch(e){console.error(e);}
	 };
	 if(setting.name=="")setting.name=name;
	 if(options["buttons"]!=null)self.initButtons(options["buttons"]);
	 if(options!=null){
		 for(const k in options){
			 if(self.prop[k]!=null)continue;
			 setting[k]=options[k];
		 }
	 };
    view[setting.name]=setting;
};
//SubwindowMode
function Subwindow(view,options){
	options=toLowerCase(options);
	if(options==null||options["name"]==null)return;
	const name=options.name;
	const self={},setting={};
	self.prop={
		name:"",
		icon:"",
		show:false,
		title:"子窗口",
		component:null,
		params:{},
		width:0,
		height:0,
		modal:true,
		closeable:true,
		headheight:40,
		zindex:200,
		padding:5,
		showfooter:false,
		footerheight:40
	};
	self.initAttrs=()=>{
		for(let s in self.prop){
			setting[s]=options[s]==null?self.prop[s]:options[s];
		}
	};
	self.initAttrs();
	self.evs={};
	setting.addEvent=function(name,evt){
		const ns=name.toLowerCase().trim();
		if(self.evs[ns]==null)self.evs[ns]=[];
		self.evs[ns].push(evt);
	};
	setting.executeEvent=function(name,param){
		const ns=name.toLowerCase().trim();
		let isT=true;
		if(self.evs[ns]==null)return isT;
		const sz=self.evs[ns];
		if(sz==null || sz.length==0)return isT;
		sz.forEach(evt=>{
			let k=true;
			try{k=evt(param);}catch(e){console.error(e);};
			if(typeof(k)!="boolean")k=true;
			if(!k)isT=false;
		});
		return isT;
	};
	setting.open=(params)=>{
		const isT=setting.executeEvent("beforeopen",{});
		if(!isT)return;
		if(typeof(params)!="undefined")setting.attr("params",params);
		setting.attr("show",true);
		setting.executeEvent("afteropen",{});
	};
	setting.close=()=>{
		try{
			const isT=setting.executeEvent("beforeclose",{});
			if(!isT||!setting.closeable)return;
			setting.executeEvent("afterclose",{});
			setting.attr("show",false);
		}catch(e){console.error(e);}
	};
	self.id="";
	setting.getNode=()=>{return document.querySelector("#"+self.id);}
	setting.setId=(id)=>{self.id=id;};
	setting.attr=(name,value)=>{
		try{
			const ab=(a,b)=>{
				if(self.prop[a]==null)return;
				if(setting[a]===b)return;
				if(a=="show"&&!b){if(!setting.closeable)return;};
				const old=setting[a];
				setting[a]=b;
				setting.executeEvent("attr",{attrname:a,value:b,oldvalue:old});
			}
			if(typeof(name)=="string"&&typeof(value)!="undefined"){
				ab(name,value);
			}else if(typeof(name)=="object"){
				for(let s in name){
					if(self.prop[s]==null)continue;
					const v=name[s];
					ab(s,v);
				}
			}
		}catch(e){console.error(e);}
	};
	setting.attrs=self.prop;
	view[name]=setting;
};
//ReportMode
function Report(view,options){
	const self={},report={};
	const atts=eval("("+JSON.stringify(ReportAttr)+")");
	options=Misc.isNull(options)?{}:toLowerCase(options);
	if(options["name"]==null)options.name="rgData";
	const dsData=view[options.dataset];
	const modular=new ReportModular(dsData);
	dsData.addEvent("afterpushdata",()=>{self.createReportData(true);});
	dsData.addEvent("afterdelete",()=>{self.createReportData(true);});
	dsData.addEvent("aftercleardata",()=>{self.createReportData(true);});
	self.evs={};
	report.addEvent=function(name,evt){
		const ns=name.toLowerCase().trim();
		if(self.evs[ns]==null)self.evs[ns]=[];
		self.evs[ns].push(evt);
	};
	report.executeEvent=function(name,param){
		const ns=name.toLowerCase().trim();
		let isT=true;
		if(self.evs[ns]==null)return isT;
		const sz=self.evs[ns];
		if(sz==null || sz.length==0)return isT;
		sz.forEach(evt=>{
			let k=true;
			try{k=evt(param);}catch(e){console.error(e);};
			if(typeof(k)!="boolean")k=true;
			if(!k)isT=false;
		});
		return isT;
	};
	const catchError=(evt)=>{try{evt();}catch(e){console.error(e);}};
	report.gridData={columns:[],rows:[],head:[],footer:[],fixed:0};
	report.doExport=()=>{
		console.log(report.gridData,"reportdata")
		//report.executeEvent("export",{});
	};
	self.createReportData=(isT)=>{
		catchError(()=>{
			const rows=dsData.rows;
			let isqk=false;
			self.checkTotalFields();
			if(isT){modular.initRows(rows);};
			if(rows.length==0)isqk=true;
			else if(Misc.isNull(report.rowfields)&&Misc.isNull(report.cellfields)&&Misc.isNull(report.valuefields)){isqk=true;};
			if(isqk){report.attr({columns:[],head:[],footer:[]});return;};
			modular.createReportData(report);
			modular.createGridData(report);
			const gridData=modular.gridData;
			report.gridData=gridData;
			report.executeEvent("showGridData",gridData);
		});
	};
	self.checkTotalFields=()=>{
		const vss=Misc.isNull(report.valuefields)?"":report.valuefields;
		let css=Misc.isNull(report.cellfields)?"":report.cellfields;
		let rss=Misc.isNull(report.rowfields)?"":report.rowfields;
		const arr=vss.split(",");
		if(css.indexOf(vss)!=-1){
			css=css.replace(vss,"$total$");
			report.cellfields=css;
		}
		if(rss.indexOf(vss)!=-1){
			rss=rss.replace(vss,"$total$");
			report.rowfields=css;
		}
		const ab=(a,isv)=>{
			const varr=[];
			a.forEach(s=>{
				if(!isv&&s=="$total$"){
					varr.push(s);
				}else if(!Misc.isNull(s)&&dsData.getField(s)!=null){
					varr.push(s);
				}
			});
			return varr;
		};
		const varr2=ab(arr,true);
		report.valuefields=varr2.join(",");
		if(varr2.length>1){
			if(css.indexOf("$total$")==-1&&rss.indexOf("$total$")==-1){
				const carr=ab(css.split(","),false);
				carr.push("$total$");
				report.cellfields=carr.join(",");
			}
		}else{
			if(css.indexOf("$total$")!=-1||rss.indexOf("$total$")!=-1){
				css=css.replace("$total$","");
				const carr=ab(css.split(","),false);
				report.cellfields=carr.join(",");
				rss=rss.replace("$total$","");
				const rarr=ab(rss.split(","),false);
				report.rowfields=rarr.join(",");
			};
		}
	};
	report.open=()=>{
		report.executeEvent("open",{});
	};
	report.close=()=>{
		report.executeEvent("close",{});
		//console.log("close--->",report);
	};
	report.attr=(attrname,value)=>{
		let iszx=false;
		const ab=(a,b)=>{
			const xa=a.toLowerCase().trim();
			if(xa=="name"||ReportAttr[xa]==null)return;
			const oldv=report[xa];
			const str1=typeof(oldv)=="object"?JSON.stringify(oldv):oldv;
			const str2=typeof(b)=="object"?JSON.stringify(b):b;
			if(str1===str2)return;
			report[xa]=b;
			report.executeEvent("attr",{attrname:xa,value:b,oldvalue:oldv});
			if(xa=="rowfields"||xa=="cellfields"||xa=="valuefields")iszx=true;
		};
		if(typeof(attrname)=="string"&&typeof(value)!="undefined"){
			ab(attrname,value);
		}else if(typeof(attrname)=="object"&&typeof(value)=="undefined"){
			for(let s in attrname){const v=attrname[s];ab(s,v);};
		};
		if(iszx)self.createReportData(false);
	};
	self.init=()=>{
		for(let s in atts){
			report[s]=options[s]==null?atts[s]:options[s];
		};
	};
	self.init();
	report.view=view;
	view[options.name]=report;
	self.createReportData();
};
//GridMode
function Grid(view,options){
	const self={},grid={};
	self.evs={};
	self.prop={
		dataset:"",
		name:"",
		width:0,
		height:0,
		headheight:config.girdHeadRowHeight,
		rowheight:config.girdDataRowHeight,
		showline:true,
		rowcount:1,
		fixed:0,
		opensetting:true,
		multi:true,
		changepostion:true,
		isopeneditor:true,
		savesetting:true,
		marginleft:0,
		dataheight:false,
		sortable:true,
		rowdraggable:true,
		showhead:true,
		showfooter:false,
		showhbar:true,
		showvbar:true,
		moveable:true,
		shownumber:true,
		sname:"",
		disabled:false,
		readonly:false,
		maxheight:0,
		columns:[],
		openoverrow:true,
		remarkstate:true,
		head:[],
		footer:[],
		dropdown:"",
	};
	options=toLowerCase(options);
	const dsData=view[options.dataset];
	const catchError=(evt)=>{let isT=true;try{isT=evt();}catch(e){console.error(e)}; if(typeof(isT)!="boolean")isT=true;return isT;};
	grid.addEvent=function(name,evt){
		const ns=name.toLowerCase().trim();
		if(self.evs[ns]==null)self.evs[ns]=[];
		self.evs[ns].push(evt);
	};
	grid.refresh=()=>{grid.executeEvent("refresh",{});};
	grid.executeEvent=function(name,param){
		const ns=name.toLowerCase().trim();
		let isT=true;
		if(self.evs[ns]==null)return isT;
		const sz=self.evs[ns];
		if(sz==null || sz.length==0)return isT;
		sz.forEach(evt=>{
			let k=true;
			try{k=evt(param);}catch(e){console.error(e);};
			if(typeof(k)!="boolean")k=true;
			if(!k)isT=false;
		});
		return isT;
	};
	if(options==null)options={};
	const name=options==null?"":options["name"];
	grid.view=view;
	self.init=()=>{
		catchError(()=>{
			for(const k in self.prop){if(k!="columns")grid[k]=options[k]==null?self.prop[k]:options[k];}
			if(options["columns"]==null||options["columns"].length==0){
				const arr=dsData.fields;
				if(arr!=null){
					self.initcolumns(arr);
					self.inithead();
				}
			}else {
				const arr=typeof(options["columns"])=="string"?options.columns.split(","):options.columns;
				self.initcolumns(arr);
				self.inithead();
			}
		});
	};
	self.inithead=()=>{
		if(grid.head==null||grid.head.length==0)return;
		const rmap={},ls=grid.columns.length;;
		grid.head.forEach((arr,x)=>{
			let i=1;
			arr.forEach((r,y)=>{
				const colspan=r["colspan"]==null?0:Math.floor(r.colspan);
				const rowspan=r["rowspan"]==null?0:Math.floor(r.rowspan);
				for(let z=1;z<ls;z++){
					const rs=rmap["R"+i];
					if(rs!=null&&x<=rs.to){i+=1;}else break;
				};
				if(rowspan>0){
					rmap["R"+i]={from:x,to:x+rowspan};
					for(let p=i;p<colspan+i;p++){
						rmap["R"+p]={from:x,to:x+rowspan};
					}
				};
				const sz5=[];
				sz5.push(grid.columns[i]);
				i+=1;
				for(let t=i;t<colspan+i;t++){sz5.push(grid.columns[t]);};
				i+=colspan;
				r.colspan=colspan;
				r.rowspan=rowspan;
				r.columns=sz5.join(",");
				if(r["label"]==null&&r.columns===r.name){
					const col=grid.getColumn(r.name);
					r.label=col!=null?col.label:"";
				}
			});
		});
	};
	self.columnMap={};
	self.colProp={name:"",label:"",dropdown:"",fomart:"",supportsum:true,
			onvalue:true,offvalue:false,options:[],width:80,visible:true,notnull:false,
			disabled:false,format:"",
			readonly:false,datatype:"string",value:"",type:"text",sortable:true,labelalign:"center",
			align:"left",rowcount:1,columns:[]};
	
	self.gridprop=(field,col)=>{if(col.type=="checkbox"){col.align="center";};};
	grid.columns=[];
	self.oldstt=null;
	self.initcolumns=(cols)=>{
		self.columnMap={};
		const nbcol={name:"$number$",width:12,label:" ",visible:true,readonly:false,disabled:false,rowcount:grid.rowcount};
		grid.columns=["$number$"];
		self.columnMap["$number$"]=nbcol;
		if(cols==null||cols.length==0)return;
		const abc=(n,r8,ist)=>{
			if(n==="$number$")return;
			const r=toLowerCase(r8);
			const field=dsData.getField(n);
			if(field==null)return;
			const ncol={};
			ncol.name=n;
			ncol.label=field["label"]==null?field.name:field.label;
			ncol.notnull=field["notnull"]==null?false:field.notnull;
			ncol.datatype=field["datatype"]==null?"string":field.datatype;

			for(let k in self.colProp){
				if(k=="name")continue;
				if(field[k]!=null)ncol[k]=field[k];
			};
			for(const k in self.colProp){
				if(r[k]!=null)ncol[k]=r[k];
				else if(r[k]==null&&ncol[k]==null)ncol[k]=self.colProp[k];
			};
			self.gridprop(field,ncol);
			self.columnMap[ncol.name]=ncol;
			if(ist)grid.columns.push(ncol.name);
			if(ist&&grid.rowcount>1&&ncol.columns.length>0){
				const arr=[];
				ncol.columns.forEach(col=>{
					ab(col,false);
					if(typeof(col)=="string")arr.push(col);
					else if(typeof(col)=="object"&&!Misc.isNull(col.name))arr.push(col.name);
				});
				ncol.columns=arr;
			};
		};
		const ab=(a,ist)=>{if(typeof(a)=="string"){abc(a,{},ist);}else if(typeof(a)=="object"){abc(a.name,a,ist);}};
		catchError(()=>{cols.forEach(col=>{ab(col,true);});});
		if(self.oldstt==null){
			self.oldstt={
				map:JSON.stringify(self.columnMap),
				cols:JSON.stringify(grid.columns),
				fixed:grid.fixed+""};
		};
	};
	grid.recovery=()=>{
		if(self.oldstt==null)return;
		self.columnMap=eval("("+self.oldstt.map+")");
		grid.columns=eval("("+self.oldstt.cols+")");
		grid.fixed=Number(self.oldstt.fixed);
	};
	grid.changecolumn=(start,end,position)=>{
		const cols=[];
		grid.columns.forEach(name=>{
			if(name===end){
				if(position=="before")cols.push(start);
				cols.push(name);
				if(position=="after")cols.push(start);
			}else if(name!==start){
				cols.push(name);
			}
		});
		grid.columns=cols;
		grid.executeEvent("changecolumn",{columns:grid.columns});
	};
	grid.attr=($name,$value)=>{
		let zx=false,attrs={};
		catchError(()=>{
			const ab=(a,b)=>{
				if(self.prop[a]==null||a=="name")return;
				const oldvalue=grid[a];
				const str=typeof(b)=="object"&&a!="dropdown"?JSON.stringify(b):b;
				const str2=typeof(oldvalue)=="object"&&a!="dropdown"?JSON.stringify(oldvalue):oldvalue;
				if(str===str2)return;
				grid.executeEvent("attr",{attrname:a,value:b,oldvalue:oldvalue});
				if(a!=="columns")grid[a]=b;
				if(a=="columns"){
					self.initcolumns(b);
					self.inithead();
				}else if(a=="head"){
					self.inithead();
				}
				zx=true;
				attrs[a]=b;
			};
			if(typeof($name)=="string"&&typeof($value)!="undefined"){
				ab($name,$value);
			}else if(typeof($name)=="object"&&typeof($value)=="undefined"){
				for(const k2 in $name){
					ab(k2,$name[k2]);
				}
			}
		});
		if(zx)grid.executeEvent("afterattr",attrs);
	};
	grid.getColumn=(name)=>{return self.columnMap[name];};
	grid.columnAttr=(colname,attrname,value)=>{
		let iszx=false,map={};
		catchError(()=>{
			const ab=(a,b,c)=>{
				catchError(()=>{
					if(self.columnMap[a]==null)return;
					const col=self.columnMap[a];
					const oldv=col[b];
					if(oldv===c)return;
					col[b]=c;
					iszx=true;
					if(map[a]==null)map[a]={};
					map[a][b]=c;
					grid.executeEvent("columnattr",{name:a,attrname:b,value:c,oldvalue:oldv});
				});
			};
			if(typeof(colname)=="string"&&typeof(attrname)=="string"&&typeof(value)!="undefined"){
				if(colname.indexOf(",")==-1)ab(colname,attrname,value);
				else {
					const arr=colname.split(",");
					arr.forEach(s=>{ab(s,attrname,value)});
				}
			}else if(typeof(colname)=="string"&&typeof(attrname)=="object"){
				for(const k in attrname){
					if(colname.indexOf(",")==-1)ab(colname,k,attrname[k]);
					else {
						const arr=colname.split(",");
						arr.forEach(s=>{ab(s,k,attrname[k])});
					}
				}
			}else if(typeof(colname)=="object"&&typeof(attrname)=="undefined"&&typeof(value)=="undefined"){
				for(const k in colname){
					grid.columnAttr(k,colname[k]);
				}
			};
		});
		if(iszx)grid.executeEvent("aftercolumnattr",map);
	};
	self.init();
	grid.name=name;
	view[name]=grid;
};
function NavMenu(view,options){
	options=toLowerCase(options);
	const setting={},self={};
	setting.name=options.name;
	if(setting.name==null)setting.name="navmenu";
	const mr={
		name:"",
		height:40,
		showclose:false,
		dbclickclose:true,
		padding:10,
		spacing:2,
		style:"style1"
	};
	const menupop={
		name:"",
		label:"",
		isclosed:true,
		path:"",
		remark:{}
	};
	const catchError=(evt)=>{let isT=true;try{isT=evt();}catch(e){console.error(e)}; if(typeof(isT)!="boolean")isT=true;return isT;};
	self.evs={};
	setting.addEvent=function(name,evt){
		const ns=name.toLowerCase().trim();
		if(self.evs[ns]==null)self.evs[ns]=[];
		self.evs[ns].push(evt);
	};
	setting.executeEvent=function(name,param){
		const ns=name.toLowerCase().trim();
		let isT=true;
		if(self.evs[ns]==null)return isT;
		const sz=self.evs[ns];
		if(sz==null || sz.length==0)return isT;
		sz.forEach(evt=>{
			let k=true;
			try{k=evt(param);}catch(e){console.error(e);};
			if(typeof(k)!="boolean")k=true;
			if(!k)isT=false;
		});
		return isT;
	};
	self.init=()=>{for(let k in mr){if(k=="name")continue;setting[k]=options[k]==null?mr[k]:options[k];}};
	self.init();
	setting.attr=(name,value)=>{
		const map={};
		const ab=(n,v)=>{
			const ns=n.toLowerCase().trim();
			if(ns==="name")return;
			if(setting[ns]===v)return;
			const oldv=setting[ns];
			setting[ns]=v;
			map[ns]=v;
			setting.executeEvent("attr",{attrname:ns,value:v,oldvalue:oldv});
		};
		if(typeof(name)=="string"&&typeof(value)!="undefined")ab(name,value);
		else if(typeof(name)=="object"&&typeof(value)=="undefined"){
			for(let k in name){const v=name[k];ab(k,v);}
		};
		setting.executeEvent("afterattr",map);
	};
	self.menus={};
	self.arrMenu=[];
	self.extend=(mu,oldst)=>{const item={};
		for(let k in menupop){
			item[k]=mu[k]!=null?mu[k]:menupop[k];
			if((item[k]==null||item[k]=="")&&oldst!=null&&oldst[k]!=null&&oldst[k]!="")item[k]=oldst[k];
		};
		return item;
	};
	setting.push=(menu)=>{
		catchError(()=>{
			const item=toLowerCase(menu);
			if(item["name"]==null)return;
			const old=self.menus[item.name];
			const mutt=self.extend(item,old);
			self.menus[mutt.name]=mutt;
			if(old==null){self.arrMenu.push(mutt.name);setting.executeEvent("push",menu);};
			setting.active(mutt.name);
		});
	};
	setting.close=(name)=>{
		if(typeof(name)=="undefined"||name==null)return;
		catchError(()=>{
			const ns=name.trim(),stt3=self.menus[ns],arr=[];
			if(stt3==null||!stt3.isclosed)return;
			const stt=eval("("+JSON.stringify(stt3)+")");
			let isFind=false,nextmu="";
			const len=self.arrMenu.length;
			for(let i=0;i<len;i++){
				const v=self.arrMenu[i];
				if(v==ns){
					isFind=true;
					if(i<len-1)nextmu=self.arrMenu[i+1];
					else if(i==len-1&&i>0)nextmu=self.arrMenu[i-1];
				}else arr.push(v);
			};
			if(!isFind)return;
			let isTT=true;
			const istt2=setting.executeEvent("beforeclose",stt);
			if(typeof(istt2)=="boolean")isTT=istt2;
			if(!isTT)return;
			self.arrMenu=arr;
			delete self.menus[ns];
			if(nextmu!="")setting.active(nextmu);
			else self.activename="";
			setting.executeEvent("afterclose",stt);
		});
	};
	self.activename="";
	setting.closeAll=()=>{
		if(self.arrMenu.length==0)return;
		const ns=self.arrMenu.join(",")
		self.arrMenu=[];
		self.menus={};
		self.activename="";
		setting.executeEvent("closeall",ns);
	};
	setting.menuAttr=(name,attrname,value)=>{
		const ab=(a,b,c)=>{
			if(b==="name"||menupop[b]==null)return;
			const stt=self.menus[a];
			if(stt==null)return;
			const oldv=stt[b];
			if(oldv===c)return;
			stt[b]=c;
			setting.executeEvent("menuattr",{name:a,attrname:b,value:c,oldvalue:oldv});
		};
		if(typeof(name)=="string"&&typeof(attrname)=="string"&&typeof(value)!="undefined"){
			const arr=name.indexOf(",")==-1?[name]:name.split(",");
			arr.forEach(s=>{ab(s,attrname,value);});
		}else if(typeof(name)=="string"&&typeof(attrname)=="object"&&typeof(value)=="undefined"){
			const arr=name.indexOf(",")==-1?[name]:name.split(",");
			arr.forEach(s=>{for(let k in attrname){	ab(s,k,attrname[k]);}});
		}else if(typeof(name)=="object"&&typeof(attrname)=="undefined"&&typeof(value)=="undefined"){
			const names=name["name"];
			if(names!=null)setting.menuAttr(names,name);
			else{
				for(let n in name){
					const v=name[n];
					if(typeof(v)!="object"||v==null)continue;
					setting.menuAttr(n,v);
				};
			};
		};
	};
	setting.active=(name)=>{
		catchError(()=>{
			const oldv=self.activename;
			if(oldv===name)return;
			const mu=self.menus[name];
			if(mu==null)return;
			let isT=setting.executeEvent("beforeactive",{name:oldv,newname:name});
			if(typeof(isT)!="boolean"||isT===false)return;
			self.activename=name;
			const att=self.menus[name];
			setting.executeEvent("afteractive",att);
		});
	};
	setting.current=()=>{return self.activename;};
	setting.getMenu=(name)=>{return self.menus[name];};
	setting.getMenuList=()=>{return self.arrMenu;};
	view[setting.name]=setting;
};
export {
	Dataset,Tabset,DropDown,Search,Subwindow,Grid,AutoForm,Editor,Misc,NavMenu,Calendar,Report
};
export default {};