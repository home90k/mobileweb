<template>
	<div>
	<div :id="id+'_body'" class="subwindow control" v-bind:class="'subwindow-status-'+status"   v-show="show" v-bind:style="[{'z-index':zIndex,width:width===0?'auto':width+'px',height:height===0?'auto':height+'px','max-height':maxheight+'px','max-width':maxwidth+'px'}]">
		<div class="subwindow-title">
			<div @mousedown="handMovePositon" class="middle-center" style="height:100%; flex: 1;width:100%;padding-left:5px;display: flex;">
				<div><i v-show="icon!=''"  :class="icon"></i></div>
				<span v-html="title" style="margin-left:5px;flex:1;"></span>
			</div>
			<div v-show="status!='min'" class="middle-center subwindow-btnmin" title="最小化"   @click="changestatus('min')"><span class="iconfont">&#xe624;</span></div>
			<div v-show="status!='common'" class="middle-center subwindow-btncommon" title="还原"   @click="changestatus('common')"><span class="iconfont">&#xe690;</span></div>
			<div v-show="status!='max'" class="middle-center subwindow-butmax"  title="最大化" @click="changestatus('max')"><span class="iconfont">&#xe691;</span></div>
			<div class="middle-center subwindow-butclose" title="关闭"  @click="close"><span class="iconfont">&#xe608;</span></div>
		</div>
		<div class="subwindow-body" v-show="status!='min'">
				<div  v-if="component==''||component==null" style="flex:1;display:flex;">
					<slot :name="name+'-body'"></slot>
				</div>
				<div  v-else style="flex:1;display:flex;">
					<component   :is="componentname" :subwindow="subwindow"></component>
				</div>
		</div>
		 <div class="subwindow-footer middle-center" v-show="showfooter&&status!='min'">
			<slot :name="name+'-footer'"></slot>
		</div>
	</div>
	<div class="subwindow-modal" :id="id" v-show="modal&&showmodal" v-bind:style="[{'z-Index':zIndex-2}]"></div>
	</div>
</template>

<script>
import Vue from 'vue'
import base from '@/components/js/base.js'
export default {
	name:"subwindow",
	props:{
		subwindow:{type:Object,default:null},
	},
	data(){
		return {
			id:base.createId(),
			zIndex:100,
			show:false,
			icon:"",
			title:"子窗口",
			name:"",
			width:0,
			height:0,
			headheight:40,
			maxheight:400,
			maxwidth:400,
			showfooter:false,
			footerheight:40,
			path:"",
			status:"common",
			modal:true,
			showmodal:false,
			params:{},
			component:null,
			componentname:"",
			oldposition:null
		}
	},beforeMount(){
		const view=this;
		if(view.subwindow!=null){
			view.subwindow.setId(view.id+"_body");
			const loadcomponent=(component)=>{
				if(component==null||component=="")view.component=null;
				else{
					try{
						Vue.component(component.name,component.path);
					}catch(e){}
				}
			};
			const initAttrs=function(){
				const attrs=view.subwindow.attrs;
				if(attrs!=null){
					for(const k in attrs){
						view[k]=view.subwindow[k];
						if(k=="component")loadcomponent(view[k]);
					}
				};
			};
			view.subwindow.addEvent("attr",(dx)=>{
				view[dx.attrname]=dx.value;
				if(dx.attrname=="component")loadcomponent(view.component);
			});
			view.subwindow.addEvent("afterclose",function(){view.afterclose();});
			initAttrs();
			view.subwindow.addEvent("afteropen",function(){view.open();return true;});
		};

	},
	methods:{
		changestatus(status){
			this.status=status;
			this.resizeBody();
		},
		close(){
			if(this.subwindow!=null&&this.subwindow["close"]!=null){
				this.subwindow.close();
			}else afterclose();
			this.showmodal=false;
			this.deletekey();
		},
		afterclose(){
			this.$emit("close",true);
			if(this.modal){
				const bjNode= document.querySelector("#"+this.id);
				if(bjNode!=null)bjNode.style.display="none";
			}
			this.show=false;
			document.onmousedown=null;
			window.removeEventListener("resize",this.resizeBody);
			window.removeEventListener("keydown",this.escEvent);
		},
		pushkey(){
			let szkey=this.getTokenValue("subwindowkeys");
			if(szkey==null||szkey=="")szkey=[];
			else szkey=eval("("+szkey+")");
			szkey.push(this.id+"_body");
			this.setTokenValue("subwindowkeys",JSON.stringify(szkey));
		},
		closeone(){
			let szkey=this.getTokenValue("subwindowkeys");
			if(szkey==null||szkey=="")szkey=[];
			else szkey=eval("("+szkey+")");
			let delkey="";
			const sz2=[];
		   for(let i=szkey.length-1;i>=0;i--){
				const k=szkey[i];
				const node2=document.querySelector("#"+k);
				if(node2==null)continue;
				if(delkey==""&&node2.style.display!="none"){
					if(this.id+"_body"==k){
						delkey=k;
					}else break;
				}else{
					sz2.push(k);
				}
			}
			return delkey;
		},
		deletekey(){
			let szkey=this.getTokenValue("subwindowkeys");
			if(szkey==null||szkey=="")szkey=[];
			else szkey=eval("("+szkey+")");
			if(szkey==null||szkey.length==0)return;
			const sz2=[];
		   for(let i=szkey.length-1;i>=0;i--){
				const k=szkey[i];
				if(k===this.id+"_body")continue;
				sz2.push(k);
			};
			if(sz2.length==0){this.setTokenValue("subwindow-zindex",100);};
			this.setTokenValue("subwindowkeys",JSON.stringify(sz2));
		},
		open(){
			if(this.component!=null){this.componentname =this.component.name;};
			this.updateIndex();
			window.addEventListener("resize",this.resizeBody);
			this.resizeBody();
			this.pushkey();
			window.addEventListener("keydown",this.escEvent);
			if(this.modal){
				this.showmodal=true;
				const bjNode= document.querySelector("#"+this.id);
				if(bjNode==null)return;
				bjNode.style.display="block";
				const _this=this;
				document.onmousedown=function(e){if(e.target==bjNode){_this.close();}};
			};
		},
		updateIndex(){
			const oldv=this.getTokenValue("subwindow-zindex");
			let zindx=100;
			if(oldv!=null){zindx=Number(oldv);if(isNaN(zindx))zindx=100;}
			zindx+=5;
			this.subwindow.attr("zindex",zindx);
			this.zIndex=zindx;
			this.setTokenValue("subwindow-zindex",zindx);
		},
		escEvent(e){
			if(e.keyCode===27){
				const kid=this.closeone();
				if(kid==this.id+"_body"){this.close();}
			}
		},
		handMovePositon(e){
			const target=e.target;
			const x=e.pageX,y=e.pageY;
			const bdd=document.querySelector("#"+this.id+"_body");
			target.style.cursor="move";
			const bodyNode=document.querySelector("body");
			const position=bdd.getBoundingClientRect();
			const padding=this.subwindow.padding;
			const maxH=bodyNode.offsetHeight,maxW=bodyNode.offsetWidth;
			const mv=function(e2){
				let x0=e2.pageX,y0=e2.pageY;
				if(x0<20)x0=20;
				if(y0<20)y0=20;
				if(x0>maxW-20)x0=maxW-20;
				if(y0>maxH-20)y0=maxH-20;
				let xx=(position.x+(x0-x)),yy=(position.y+(y0-y));
				bdd.style.left=xx+"px";
				bdd.style.top=yy+"px";
			};
			const up=function(){
				document.removeEventListener("mousemove",mv);
				document.removeEventListener("mouseup",up);
				target.style.cursor="default";
			};
			document.addEventListener("mousemove",mv);
			document.addEventListener("mouseup",up);
		},
		resizeBody(){
			const body=document.querySelector("body");
			this.maxheight=body.offsetHeight-2*this.subwindow.padding;
			this.maxwidth=body.offsetWidth-2*this.subwindow.padding;
			const bdd=document.querySelector("#"+this.id+"_body");
			if(bdd==null)return;
			const position=bdd.getBoundingClientRect();
			const abc=()=>{
				const position2=bdd.getBoundingClientRect();
				if(position2.height<100)setTimeout(function(){abc()},1);
				else{
					if(this.oldposition==null)this.oldposition=position2;
					const pd=this.subwindow.padding;
					if(this.status=="max"){
						bdd.style.left=pd+"px";
						bdd.style.top=pd+"px";
						bdd.style.height=this.maxheight+"px";
						bdd.style.width=this.maxwidth+"px";
					}else{
						const old=this.oldposition;
						const x3=body.offsetWidth,y3=body.offsetHeight;
						const y=Math.ceil((y3-old.height)/2);
						const x=Math.ceil((x3-old.width)/2);
						bdd.style.left=(x<=2?2:x)+"px";
						let topp=(y<=2?2:y);
						if(old.height>500)topp=pd;
						bdd.style.top=topp+"px";
						if(this.subwindow.height===0){
							bdd.style.height="auto";
						}else{
							bdd.style.height=old.height+"px";
						};
						bdd.style.width=old.width+"px";
						bdd.oldx=x3;
						bdd.oldy=y3;
					}
				};
			};
			abc();
		}
	},destroyed(){
		const bjNode= document.querySelector("#"+this.id);
		if(bjNode!=null)bjNode.remove();
		window.removeEventListener("keydown",this.escEvent);
		window.removeEventListener("resize",this.resizeBody);
		this.deletekey()
	}
}
</script>

<style>

</style>