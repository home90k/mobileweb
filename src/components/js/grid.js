'use strict'
function Grid(view){
	const grid={},self={};
	let css=view.css,setting=view.grid;
	const dsData=setting.view[setting.dataset];
	const node=document.querySelector("#"+view.id);
	const gridNode=node.parentNode.parentNode;
	const targetCtx=node.getContext("2d");
	const barwidth=10,barheight=10;//滚动条高度宽度
	let scrollx=0,scrolly=0,bsx=1,bsy=1,showhbar=false,showvbar=false,barmin=15,hbarwidth=0,vbarheight=0;//滚动条参数
	let startx=0,endx=0,leftx1=0,leftx2=-1;//右边显示列的下标
	let starty=0,endy=0;//数据开始行下标
	let width=0,height=0;//高度宽度
	let bodywidth=0,bodyheight=0;//数据位置
	let leftwidth=0,rightwidth=0,totalwidth=0;
	let currentid="";//当前数据Id
	let actived=false;
	const checkboxsize=16;
	const yuliuwidth=600;//提前预留宽度
	let spacing=2;//表格缩进px
	let positons={};//坐标对应的列名
	const vmiddle=1;//控制字体垂直居中 线下偏移
	self.state="none";
	self.scoll_sep=60;
	self.oldratio=-1;
	self.oldsize={width:0,height:0};
	self.getTextWidth=function(text,font){targetCtx.font=typeof(font)!="undefined"?font:css.bodyFont;return Math.ceil(targetCtx.measureText(text).width);};
	const isNull=(s)=>{
		if(typeof(s)=="boolean"||typeof(s)=="number")return false;
		else if(typeof(s)=="undefined"||s==null||s==="")return true;
		else return false;
	};
	const catchError=(evt)=>{try{evt();}catch(e){console.error(e)}};
	self.attr=(n,p)=>{catchError(()=>{for(const k in p){n[k]=p[k];}})};
	self.css=(n,p)=>{catchError(()=>{for(const k in p){n.style[k]=p[k];}})};
	//禁止右击
	self.stopRightClick=function(ndd){ndd.oncontextmenu = function(){event.returnValue = false;}; ndd.oncontextmenu = function(){return false;}};
	self.stopRightClick(node);
	//获取设备分辨率
	self.getRatio=function getPixelRatio() {return (window.devicePixelRatio  ||  1) /(targetCtx.webkitBackingStorePixelRatio  || targetCtx.mozBackingStorePixelRatio  || targetCtx.msBackingStorePixelRatio  || 	targetCtx.oBackingStorePixelRatio  || targetCtx.backingStorePixelRatio  ||  1);};
	//获取表格实际位置
	self.setPositions=(x,w,name)=>{const yb=Math.floor(w/2);for(let i=x;i<x+w;i++){const wz=i<x+yb?"before":"after";positons["p"+i]={name:name,position:wz,start:x,end:x+w};}};
	//设置边框线
	self.setLine=()=>{if(setting.showline)node.style.border="1px solid "+css.borderColor;else node.style.border="0px";};
	const webname=setting.view.$options.name;
	self.saveSetting=()=>{//保存设置
		if(!setting.savesetting)return;
		catchError(()=>{
			const k=self.getGridName(),st={};
			const cols=[];
			for(let i=0;i<setting.columns.length;i++){
				const name=setting.columns[i],col=setting.getColumn(name);
				if(col==null)continue;
				cols.push({name:col.name,width:col.width,visible:col.visible});
			};
			st.columns=cols;
			st.fixed=setting.fixed;
			localStorage.setItem(k,JSON.stringify(st));
			setting.executeEvent("savesetting",{key:k,setting:st});
		});
	};

	self.initSetting=()=>{
		if(!setting.savesetting)return;
		catchError(()=>{
			const k=self.getGridName();
			setting.executeEvent("initsetting",{key:k});
			const v=localStorage.getItem(k);
			if(v==null){return;};
			const stt=eval("("+v+")"),columns=stt.columns,cols=["$number$"];
			for(let i=0;i<columns.length;i++){
				const col=columns[i],oldcol=setting.getColumn(col.name);
				if(oldcol==null||col.name=="$number$")continue;
				oldcol.width=col.width;
				oldcol.visible=col.visible;
				cols.push(oldcol.name);
			};
			setting.fixed=stt.fixed;
		});
	};
	//获取表格总宽度
	self.initGridWidth=()=>{
		let w=0,ls=setting.columns.length;
		for(let i=0;i<ls;i++){
			const ns=setting.columns[i],col=setting.getColumn(ns);
			if(!col.visible||col.width<=0)continue;
			if(col.name==="$number$"){col.width=setting.shownumber?35:col.width;};
			w+=col.width;
		};
		totalwidth=w;
	};
	self.getrowheight=()=>{const rowcount=setting["rowcount"]==null||setting.rowcount<=0?1:Math.ceil(setting.rowcount);return rowcount*setting.rowheight;};
	self.columnpost={};
	self.initbarattrs=()=>{
		const rowheight=self.getrowheight();
		const rh=dsData.rows.length*rowheight,gh=self.getHeadHeight()+self.getFooterHeight()+1;
		if(setting.showhbar&&!setting.dataheight){
			showhbar=totalwidth>width;
		}else showhbar=false;
		if(setting.showvbar){
			if(setting.dataheight&&setting.maxheight>0){
				const hh=self.getHeadHeight()+dsData.rows.length*rowheight+self.getFooterHeight();
				showvbar=hh>setting.maxheight?true:false;
			}else showvbar=rh+gh+(showhbar)+barheight>height;
		}else showvbar=false;
		if(showhbar){
			const zw=totalwidth-leftwidth+1;
			const showwidth=width-(showvbar?barwidth:0)-leftwidth;
			const zwBar=width-(showvbar?barwidth:0);
			hbarwidth=Math.floor((showwidth*zwBar)/zw);
			if(hbarwidth<barmin)hbarwidth=barmin;
			if(zwBar>hbarwidth)bsx=(zw-showwidth)/(zwBar-hbarwidth);
			else{bsx=1;showhbar=false;scrollx=0;};
			if(scrollx>0){
				const maxw=width-(showvbar?barwidth:0);
				if(scrollx+hbarwidth>maxw){scrollx=maxw-hbarwidth;};
				self.executehbarevt();
			};
		}else {bsx=1;hbarwidth=0;scrollx=0;}

		if(showvbar){
			const zh=dsData.rows.length*rowheight;
			const bheight=height-(showhbar?barheight:0);
			const showheight=bheight-gh;
			vbarheight=Math.floor((showheight*bheight)/zh);
			if(vbarheight<barmin)vbarheight=barmin;
			if(bheight>vbarheight){
				bsy=(zh-showheight)/(bheight-vbarheight);
			}else{
				showvbar=false;
				bsy=1;
				scrolly=0;
			}
			if(scrolly>0){
				const maxh=height-(showhbar?barheight:0);
				if(scrolly+vbarheight>maxh){scrolly=maxh-vbarheight;};
				self.executevbarevt();
			};
		}else {bsy=1;vbarheight=0;scrolly=0;}
	};
	//获得冻结宽度，右边宽度，右边开始列，右边结束列
	self.movewidthpots={};
	self.setmovewidthpots=(x,col)=>{
		if(col.name==="$number$")return;
		const nb=x+col.width;
		for(let i=nb-10;i<=nb+10;i++){self.movewidthpots["p"+i]={name:col.name,x:x,width:col.width};}
	};
	self.loadshowcolumn=()=>{
		self.columnpost={};
		self.movewidthpots={};
		leftwidth=0;rightwidth=0;startx=0;endx=0;positons={};leftx1=0;leftx2=-1;
		if(totalwidth<=1)return;
		const fixed=self.getFixed(),w2=bodywidth,ls=setting.columns.length;
		let w=0;
		for(let i=0;i<fixed;i++){
			const ns=setting.columns[i], col=setting.getColumn(ns);
			if(!col.visible||col.width<=0)continue;
			if(w===1){leftx1=i;}
			if(w+col.width>w2){break;};
			leftx2=i;
			self.setPositions(w,col.width,col.name);
			self.setmovewidthpots(w,col);
			self.columnpost[col.name]={x:w,end:w+col.width,x3:w,isleft:true,index:i};
			w+=col.width;
		};
		leftwidth=w;
		let ww=0,scrollwidth=Math.floor(scrollx*bsx);
		const maxwidth=width-(showvbar?barwidth:0)
		if(scrollwidth<yuliuwidth)scrollwidth=0;
		else if(totalwidth-scrollwidth<width-maxwidth){
			scrollwidth=totalwidth-maxwidth-yuliuwidth;
		};
		let _wd=0;
		for(let i=fixed;i<ls;i++){
			const ns=setting.columns[i], col=setting.getColumn(ns);
			if(!col.visible||col.width<=0)continue;
			if(ww==0&&leftwidth+col.width>w2)break;
			if(_wd+col.width<scrollwidth){_wd+=col.width;continue;};
			if(_wd<=scrollwidth&&_wd+col.width>=scrollwidth){startx=i;};
			if(ww+leftwidth<=w2&&ww+leftwidth+col.width>w2){break;};
			endx=i;
			self.setPositions(_wd+leftwidth,col.width,col.name);
			self.setmovewidthpots(_wd+leftwidth,col);
			self.columnpost[col.name]={
				x:ww+leftwidth,
				end:ww+col.width+leftwidth,
				x2:ww,
				end2:ww+col.width,
				x3:_wd,
				isleft:false,
				index:i
			};
			ww+=col.width;
			_wd+=col.width;
		};
		rightwidth=ww;
	};
	//设置表格size
	self.setsize=(v)=>{
		catchError(()=>{
			self.css(node,{width:(width+v)+"px",height:(height+v)+"px"});
			if(setting.dataheight){
				self.css(node.parentNode,{width:(width+v)+"px",height:(height+v)+"px"});
				self.css(node.parentNode.parentNode,{width:(width+v)+"px",height:(height+v)+"px"});
			}
		});
	};
	self.changeGridAttr=(p)=>{if(p.attrname=="showline"){}};
	//创建内存图片
	self.images={};
	self.imagesnames={};
	self.createImage=()=>{
		const ab=(n)=>{self.imagesnames[n]=n;const img=document.createElement("canvas");self.images[n]=img;self.images[n+"_ctx"]=img.getContext("2d",{ alpha: false });};
		ab("copy");ab("body");ab("head");ab("mode");ab("bj");ab("checkbox");
		ab("footer");
	};
	self.clearImage=()=>{catchError(()=>{targetCtx.clearRect(0,0,width,height);})};
	self.getHeadHeight=()=>{return !setting.showhead?0:(isNull(setting.head)||setting.head.length==0?1:setting.head.length)*setting.headheight+2;};
	self.getFooterHeight=()=>{return !setting.showfooter?0:(isNull(setting.footer)||setting.footer.length==0?1:setting.footer.length)*setting.headheight;};
	self.changeRatio=()=>{if(self==null||self["isactive"]==null||!self.isactive())return;self.createHead();self.createBody();self.createFooter();self.refresh();};
	self.drewDx=function(ctx,evt){if(self==null||self["isactive"]==null||!self.isactive()||ctx==null)return;catchError(function(){ctx.save();ctx.beginPath();if(typeof(evt)=="function"){catchError(function(){evt();})};ctx.closePath();ctx.stroke();ctx.restore();});};
	self.setAutoSize=(iszx)=>{
		if(self==null||self["isactive"]==null||!self.isactive()||!setting.dataheight)return;
		if(typeof(iszx)=="undefined")iszx=true;
		catchError(()=>{
			if(self.state!=="active")return;
			if(totalwidth==0){self.initGridWidth();};
			let ww=totalwidth+1,hh=self.getHeadHeight()+dsData.rows.length*self.getrowheight()+self.getFooterHeight()+4;
			if(totalwidth==0)ww=240;
			height=hh;width=ww;
			if(setting.maxheight>0&&hh>setting.maxheight){
				height=setting.maxheight-(setting.showline?2:0);
				width=ww+barwidth;
			};
			self.setsize(setting.showline?2:0);
			if(!iszx)return;
			self.createBody();
			self.createFooter();
			self.refresh();
		});
	};
	//激活后执行
	self.chagesize=(w,h)=>{
		if(isNull(setting.dropdown)||setting.dropdown["addEvent"]==null){
			if(setting.dataheight){
				self.setAutoSize(false);
			}else{
				width=w-(setting.showline?2:0);
				height=h-(setting.showline?2:0);
				self.setsize(0);//设置
			};
		}else{
			if(width==0)width=400;
			if(height==0)height=200;
		}
		self.initbarattrs();//
		const ratio=self.getRatio();
		//console.log(ratio,"----------------缩放比例---------");
		const ab=(nd,ctx,w,h)=>{
			catchError(()=>{
				self.css(nd,{width:w+"px",height:h+"px"});
				self.attr(nd,{width:Math.floor(w*ratio),height:Math.floor(h*ratio)});
				ctx.scale(ratio,ratio);
			});
		};
		ab(node,targetCtx,width,height);
		ab(self.images["copy"],self.images["copy_ctx"],width,height);
		const rh=self.getrowheight();
		if(self.oldratio!==ratio||width+yuliuwidth>bodywidth||height+5*rh>bodyheight){
			ab(self.images["mode"],self.images["mode_ctx"],400,200);
			ab(self.images["checkbox"],self.images["checkbox_ctx"],100,40);
			self.createcheckbox();
			const old=self.oldratio;
			bodywidth=width+yuliuwidth*2;
			bodyheight=height+10*rh;
			ab(self.images["body"],self.images["body_ctx"],bodywidth,bodyheight);
			ab(self.images["bj"],self.images["bj_ctx"],bodywidth,bodyheight);
			ab(self.images["head"],self.images["head_ctx"],bodywidth,10*setting.headheight);
			ab(self.images["footer"],self.images["footer_ctx"],bodywidth,4*rh);
			if(self.oldratio!=-1)self.changeRatio(ratio,old);
			self.oldratio=ratio;
		};
	};

	//画checkbox
	self.createcheckbox=()=>{
		const ctx=self.images["checkbox_ctx"];
		self.drewDx(ctx,()=>{
			const size=checkboxsize-2;
			ctx.clearRect(0,0,100,40);
			ctx.strokeStyle=css.checkboxColor1;
			if(!isNull(css.checkboxColor2)){
				ctx.fillStyle=self.getColor(ctx,css.checkboxColor2,false,1,1,size,size);
				ctx.fillRect(1,1,size,size);
			}
			ctx.strokeRect(1,1,size,size);
			if(!isNull(css.checkboxColor3)){
				ctx.fillStyle=self.getColor(ctx,css.checkboxColor3,false,20,1,size,size);
				ctx.fillRect(20,1,size,size);
			}
			ctx.strokeStyle=css.checkboxColor1;
			ctx.strokeRect(20,1,size,size);
			ctx.lineWidth=2;
			ctx.strokeStyle=css.checkboxColor4;
			ctx.moveTo(22,7);
			ctx.lineTo(25,12);
			ctx.moveTo(24,12);
			ctx.lineTo(32,3);
		});
	};
	self.headpot={};
	self.getText=(font,w,str)=>{
		let  text=str+"";
		if(isNull(text)||text+"".length<2) return text;
		const w2=self.getTextWidth(text,font)+2*spacing;
		if(w2+2<w) return text;
		const ls=(text+"").length,sz=[];
		for(let i=0;i<ls;i++){
			const ct=text.charAt(i),str=sz.join("")+ct;
			const w3=self.getTextWidth(str,font)+2*spacing;
			if(w3>w)break;
			sz.push(ct);
		}
		return sz.join("");
	};
	//判断是否是只读
	self.checkEditable=(name)=>{
		let isReadonly=false;
		if(name=="select")return false;
		const col=setting.getColumn(name),field=dsData.getField(name);
		if(dsData.readonly||setting.readonly||dsData.disabled||setting.disabled)return true;
		if(field==null||col==null){return true;};
		catchError(()=>{
			const ist=col.type=="link"||col.type=="image"||col.type=="botton"||col.type=="ratiogroup"||col.type=="checkboxgroup";
			if(ist)isReadonly=true;
			else if(col.readonly||col.disabled)isReadonly=true;
		});
		if(isReadonly)return true;
		let k=setting.executeEvent("checkreadonly",col);
		if(typeof(k)!=="boolean")k=true;
		if(!k)isReadonly=true;
		if(!isReadonly){
			let k2=setting.executeEvent("checkdisabled",col);
			if(typeof(k2)!=="boolean")k2=true;
			if(!k2)isReadonly=true;
		};
		return isReadonly;
	};
	self.createFooterTh=(ctx,col,stt,w,stt2)=>{
		if(self==null||self["isactive"]==null||!self.isactive())return;
		const h=stt.height,y=stt.y;
		if(!isNull(stt2.backgroundcolor)&&stt2.backgroundcolor!==css.headBackgroundColor){
			ctx.fillStyle=self.getColor(ctx,stt2.backgroundcolor,false,w,stt.y1,col.width,h);
			ctx.fillRect(w,stt.y1,col.width,h);
			ctx.fillStyle=stt2.color;
		};
		if(col.name!=="select"||(!dsData.multi&&col.name=="select")){
			let xx=w+spacing,ispx=self.sortfield!=null&&self.sortfield[col.name]!=null?true:false;
			const v8=stt==null||stt.value==null?"":stt.value;
			const vv=setting.footer.length>0?v8:dsData.getFormatValue(col.name,stt.value==null?"":stt.value);
			const title=self.getText(stt.font,col.width,vv);
			if(col.align=="center")xx=w+Math.floor(col.width/2);
			else if(col.align=="right")xx=w+col.width-spacing-(ispx?12:0);
			if(title!="")ctx.fillText(title,xx,y+vmiddle);
		}
	};
	self.createTh=(ctx,col,stt,w,stt2)=>{
		if(self==null||self["isactive"]==null||!self.isactive())return;
		const h=stt.height,y=stt.y;
		if(!isNull(stt2.backgroundcolor)&&stt2.backgroundcolor!==css.headBackgroundColor){
			ctx.fillStyle=self.getColor(ctx,stt2.backgroundcolor,false,w,stt.y1,col.width,h);
			ctx.fillRect(w,stt.y1,col.width,h);
			ctx.fillStyle=stt2.color;
		};
		if(col.name!=="select"||(!dsData.multi&&col.name=="select")){
			let xx=w+spacing,ispx=self.sortfield!=null&&self.sortfield[col.name]!=null?true:false;
			const title=self.getText(stt.font,col.width-(ispx?12:0),stt.label);
			//if(col.labelalign=="center")
			ctx.textAlign="center";
			xx=w+Math.floor(col.width/2);
			//else if(col.labelalign=="right")xx=w+col.width-spacing-(ispx?12:0);
			ctx.fillText(title,xx,y+vmiddle);
			if(ispx){
				ctx.textAlign="right"
				const isasc=self.sortfield[col.name]==="asc";
				ctx.fillText(isasc?"▲":"▼",w+col.width,y+vmiddle);
				ctx.textAlign="center"
			}
		}else{
			const canvas=self.images["checkbox"];
			let xx=w+spacing,yb=Math.floor(checkboxsize/2);
			if(col.align=="center")xx=w+Math.floor((col.width-checkboxsize)/2);
			else if(col.align=="right")xx=w+col.width-yb-spacing;
			const wz=dsData.selectall?19:0,rd=self.getRatio();
			ctx.drawImage(canvas,wz*rd,0,checkboxsize*rd,checkboxsize*rd,xx,y-yb+vmiddle,checkboxsize,checkboxsize)
		};
	};
	self.footerpot={};
	self.createFooter=()=>{
		if(self==null||self["isactive"]==null||!self.isactive()||!setting.showfooter)return;
		catchError(()=>{
			const ctx=self.images["footer_ctx"],footh=self.getFooterHeight();
			const ww=leftwidth+rightwidth,rh=setting.rowheight+2,h2=10*rh;
			self.drewDx(ctx,()=>{
				ctx.clearRect(0,0,bodywidth,h2);
				if(!isNull(css.footerBackgroundColor)){
					ctx.fillStyle=self.getColor(ctx,css.footerBackgroundColor,false,0,0,ww,footh);
					ctx.fillRect(0,0,ww,footh);
				};
				catchError(()=>{//画线
					if(!setting.showline)return;
					let w2=0;
					ctx.strokeStyle=css.borderColor;
					self.loopcolumns(col=>{w2+=col.width;ctx.moveTo(w2,1);ctx.lineTo(w2,footh);});
					if(setting.footer.length>0){
						const rh=setting.rowheight;
						const nbw=setting.getColumn("$number$").width;
						setting.footer.forEach((sz,i)=>{
							ctx.moveTo(nbw,1+rh*i);
							ctx.lineTo(ww,1+rh*i);
						});
					}
				});
				let w=0,y1=0,h=rh,y=y1+Math.floor(h/2);
				ctx.fillStyle=css.footerColor;
				ctx.textBaseline = "middle";
				ctx.font=css.footerFont;
				ctx.textAlign="right";	
				if(setting.footer.length==0){
					const hb=(stt,st)=>{const zb=["font","value","color","backgroundcolor"];zb.forEach(s=>{if(!isNull(st[s]))stt[s]=st[s];});}
					self.loopcolumns((col)=>{
						const stt={x1:w,x2:w+col.width,y1:y1,y:y,height:h};
						const field=dsData.getField(col.name);
						let vv=field!=null&&field.supportsum?dsData.getSum(col.name):"";
						const stt2={name:col.name,value:vv,font:"",color:"",backgroundcolor:""};
						setting.executeEvent("initfooter",stt2);
						hb(stt,stt2);
						self.footerpot[col.name]=stt;
						if(stt.font!==css.footerFont)ctx.font=stt.font;
						if(stt.color!==css.footerColor)ctx.fillStyle=stt.color;
						if(col.align!=="right")ctx.textAlign=col.align;
						self.createFooterTh(ctx,col,stt,w,stt);
						if(stt.font!==css.footerFont)ctx.font=css.headFont;
						if(stt.color!==css.footerColor)ctx.fillStyle=css.footerColor;
						if(col.align!=="right")ctx.textAlign="right";
						w+=col.width;
					});
				}else{
					setting.footer.forEach((rr,q)=>{
						const hb=(stt,st)=>{const zb=["font","value","color","backgroundcolor"];zb.forEach(s=>{if(!isNull(st[s]))stt[s]=st[s];});};
						const _row={};
						rr.forEach(_r=>{
							_row[_r.name]=_r.label;
						});
						w=0;
						self.loopcolumns((col)=>{
							const stt={x1:w,x2:w+col.width,y1:y1+q*h,y:y+q*h,height:h};
							let vv=col.name=="$number$"?"":_row[col.name]==null?"":_row[col.name];
							const stt2={name:col.name,value:vv,font:"",color:"",backgroundcolor:""};
							setting.executeEvent("initfooter",stt2);
							hb(stt,stt2);
							self.footerpot[col.name]=stt;
							if(stt.font!==css.footerFont)ctx.font=stt.font;
							if(stt.color!==css.footerColor)ctx.fillStyle=stt.color;
							if(col.align!=="right")ctx.textAlign=col.align;
							self.createFooterTh(ctx,col,stt,w,stt);
							if(stt.font!==css.footerFont)ctx.font=css.headFont;
							if(stt.color!==css.footerColor)ctx.fillStyle=css.footerColor;
							if(col.align!=="right")ctx.textAlign="right";
							w+=col.width;
						});
					});
				}
			});
		});
	};
	self.createHead=function(){
		if(self==null||self["isactive"]==null||!self.isactive()||!setting.showhead)return;
		self.headpot={};
		let headh=self.getHeadHeight();
		if(headh===0)return;
		const ctx=self.images["head_ctx"];
		catchError(()=>{
			const ww=leftwidth+rightwidth,h2=10*setting.headheight;
			ctx.clearRect(0,0,bodywidth,h2);
			self.drewDx(ctx,()=>{
				if(!isNull(css.headBackgroundColor)){
					ctx.fillStyle=self.getColor(ctx,css.headBackgroundColor,false,0,0,ww,headh);
					ctx.fillRect(0,0,ww,headh);
				};
				catchError(()=>{//画线
					if(!setting.showline)return;
					let w=0;
					ctx.strokeStyle=css.borderColor;
					if(setting.head.length==0){
						self.loopcolumns(col=>{
							w+=col.width;
							ctx.moveTo(w,0);
							ctx.lineTo(w,headh);
						});
						ctx.moveTo(0,headh);
						ctx.lineTo(ww,headh);
					}else{
						const nw=setting.getColumn("$number$").width;
						ctx.moveTo(nw,0);
						ctx.lineTo(nw,headh);
						ctx.moveTo(ww,0);
						ctx.lineTo(ww,headh);
						const maps={};
						self.loopcolumns(col=>{
							if(col.name==="$number$"){w+=col.width;return;};
							maps[col.name]={x:w,width:col.width};
							w+=col.width;
						});
						const hh=setting.headheight;
						setting.head.forEach((sz,i)=>{
							sz.forEach(col=>{
								const columns=col.columns.split(",");
								let isf=false,ww=0,x0=0;
								columns.forEach(s=>{
									const fr=maps[s];
									if(fr!=null){
										if(!isf){isf=true;x0=fr.x;}
										ww+=fr.width;
									}
								});
								if(isf){
									const rowspan=col.rowspan;
									ctx.moveTo(x0,i*hh);
									ctx.lineTo(x0,(i+1+rowspan)*hh);
									if(i+rowspan<setting.head.length-1){
										ctx.moveTo(x0,(i+1+rowspan)*hh);
										ctx.lineTo(x0+ww,(i+1+rowspan)*hh);
									};
								}
							});
						});
					}
				});//------------
				ctx.strokeStyle=css.borderColor;
				ctx.fillStyle=css.headColor;
				ctx.textBaseline = "middle";
				ctx.font=css.headFont;
				ctx.textAlign="center";	
				let w=0,y1=0,h=setting.headheight;
				const y=y1+Math.floor(h/2);
				const hb=(stt,st)=>{const zb=["font","label","color","backgroundcolor"];zb.forEach(s=>{if(!isNull(st[s]))stt[s]=st[s];});};
				if(setting.head.length==0){
					self.loopcolumns((col)=>{
						const stt={x1:w,x2:w+col.width,
							y1:y1,y:y,height:h,
							font:css.headFont,
							color:css.headColor,
							backgroundcolor:css.headBackgroundColor,
							label:col.label
						};
						const field=dsData.getField(col.name);
						const stt2={name:col.name,label:col.label,font:"",color:"",backgroundcolor:""};
						if(field!=null&&field.notnull&&!isNull(css.notNullColor))stt2.color=css.notNullColor;
						setting.executeEvent("inithead",stt2);
						hb(stt,stt2);
						self.headpot[col.name]=stt;
						if(stt.font!==css.headFont)ctx.font=stt.font;
						if(stt.color!==css.headColor)ctx.fillStyle=stt.color;
						if(col.labelalign!=="center")ctx.textAlign=col.labelalign;
						self.createTh(ctx,col,stt,w,stt);
						if(stt.font!==css.headFont)ctx.font=css.headFont;
						if(stt.color!==css.headColor)ctx.fillStyle=css.headColor;
						if(col.labelalign!=="center")ctx.textAlign="center";
						w+=col.width;
					});
				}else{//复杂的自定义表头
					let w=0,maps={};
					self.loopcolumns(col=>{
						if(col.name=="$number$"){w+=col.width;return;};
						maps[col.name]={name:col.name,x:w,width:col.width};
						w+=col.width;
					});
					setting.head.forEach((sz,i)=>{
						y1=i*h;
						sz.forEach(col=>{
							const columns=col.columns.split(",");
							let isf=false,x1=0,ww=0;
							columns.forEach(s=>{
								const fr=maps[s];
								if(fr!=null){
									if(isf===false){isf=true;x1=fr.x;};
									ww+=fr.width;
								};
							});
							if(isf){
								const rowspan=col.rowspan;
								const hh=h*(1+rowspan);
								let y=y1+Math.floor(hh/2);
								const stt={x1:x1,x2:x1+ww,
									y1:y1,y:y,height:hh,
									font:css.headFont,
									color:css.headColor,
									backgroundcolor:css.headBackgroundColor,
									label:col.label
								};
								col.width=ww;
								const stt2={name:col.name,label:col.label,font:"",color:"",backgroundcolor:""};
								setting.executeEvent("inithead",stt2);
								hb(stt,stt2);
								self.headpot[col.name]=stt;
								if(stt.font!==css.headFont)ctx.font=stt.font;
								if(stt.color!==css.headColor)ctx.fillStyle=stt.color;
								if(col.labelalign!=="center")ctx.textAlign=col.labelalign;
								self.createTh(ctx,col,stt,x1,stt);
								if(stt.font!==css.headFont)ctx.font=css.headFont;
								if(stt.color!==css.headColor)ctx.fillStyle=css.headColor;
								if(col.labelalign!=="center")ctx.textAlign="center";
							}
						})
					});
				};
			});
		});
	};
	self.getColor=(ctx,color,ishx,x,y,w,h)=>{
		if(isNull(color))return "black";
		else if(color.indexOf(";")==-1)return color;
		const sz=color.split(";");
		let gradient=ctx.createLinearGradient(0,y,0,y+h);
		if(ishx){
			gradient=ctx.createLinearGradient(x,0,x+w,0);
		}
		const bh=(1/(sz.length-1)).toFixed(3);
		const value=Number(bh);
		for(let i=0;i<sz.length;i++){
			const cl=isNull(sz[i])?"white":sz[i];
			if(i==0)gradient.addColorStop(0,cl);
			else if(i!=sz.length-1){
				gradient.addColorStop(value*i,cl);
			}else{
				gradient.addColorStop(1,cl);
			}
		};
		return gradient;
	};
	//------------调整列宽 移动事件-----
	self.executechangecolwidth=(pp,ww)=>{
		self.drewDx(targetCtx,()=>{
			const canvas=self.images["copy"],ratio=self.getRatio();
			targetCtx.clearRect(0,0,width,height);
			targetCtx.drawImage(canvas,0,0,width*ratio,height*ratio,0,0,width,height);
			const colpot=self.columnpost[pp.name];
			let xpot=pp.x,cz=0;
			if(!colpot.isleft){
				const sw=Math.floor(bsx*scrollx);
				xpot=pp.x-sw;
				if(xpot<leftwidth){
					cz=leftwidth-xpot;
					xpot=leftwidth;
				}
			};
			const ww2=(pp.width+ww<30?30:pp.width+ww)-cz;
			const hh2=height-1-(showhbar?barheight:0);
			targetCtx.fillStyle=self.getColor(targetCtx,css.changeSizeBjColor,false,xpot,0,ww2,hh2);
			targetCtx.fillRect(xpot,0,ww2,hh2);
		});
	};
	//-----------调整列宽 结束事件---------------------
	self.stopchangecolwidth=(pp,ww)=>{
		self.drewDx(targetCtx,()=>{
			if(ww===0){
				const canvas=self.images["copy"],ratio=self.getRatio();
				targetCtx.clearRect(0,0,width,height);
				targetCtx.drawImage(canvas,0,0,width*ratio,height*ratio,0,0,width,height);
			}else{
				const ww2=pp.width+ww<30?30:pp.width+ww;
				pp.width=ww2;
				self.overcell=null;
				self.mouseOutRow();
				self.mouseOutBody();
				self.mouseOutHead();
				setting.columnAttr(pp.name,"width",ww2);
				self.saveSetting();
				self.initGridWidth();
				self.loadshowcolumn();//获得冻结宽度，
				self.initbarattrs();
				self.createBody()
				self.createHead();
				self.createFooter();
				self.refresh();
				catchError(()=>{
					if(isNull(setting.dropdown)||setting.dropdown["addEvent"]==null)return;
					if(!setting.dropdown.isopen)return;
					setting.dropdown.open();
				});
			};
		});
	};
	//标题移动列宽
	self.movecolname="";
	self.mouseIncolwidth=(pz)=>{
		if(self.movecolname!=null&&self.movecolname.name===pz.name)return;
		self.movecolname=pz;
		node.style.cursor="ew-resize";
	};
	self.mouseOutcolwidth=()=>{
		if(isNull(self.movecolname)||self.isPosition)return;
		self.movecolname=null;
		node.style.cursor="default";
	};
	self.outAll=(ty)=>{
		if(typeof(ty)=="undefined")ty="";
		if(ty!="scroll")self.mouseOutRow();
		self.mouseOutHead();
		self.mouseOutBody();
		self.mouseOutcolwidth();
	};
	//鼠标离开表头事件
	self.overrow="";
	self.mouseOutRow=()=>{
		if(isNull(self.overrow))return;
		const oldrid=self.overrow;
		self.overrow=null;
		self.changerowremark(oldrid,null);
		self.refresh("currentrow");
	};
	self.mouseInRow=(id1,id2)=>{
		if(!isNull(self.cursortype))return;
		self.changerowremark(id1,id2);
		self.refresh("currentrow");
	};
	self.currenthead=null;
	self.mouseOutHead=()=>{if(self.currenthead==null)return;const name=self.currenthead;self.currenthead=null;self.refrshHead(name);};
	self.refrshHead=(name)=>{if(!isNull(name)&&name.indexOf("$number$")!=-1)return;};
	//鼠标进入表头事件
	self.mouseInHead=()=>{self.refrshHead(self.currenthead);};
	self.outTableClick=function(e){
		catchError(()=>{
			if(!actived||self.gridwz==null||self.editorParam==null)return;
			const target=e.target,target2=document.querySelector("#"+view.id+"_editor");
			if(target2!=null&&node!=null&& target!=node&&target2!=target&&!node.contains(target)&&!target2.contains(target)
			&&(self.openNode==null||(self.openNode!=null&&target!=self.openNode.node&&!self.openNode.node.contains(target)))){
				self.closeEditor();
				self.stopdraw=true;
			}
		});
	};
	self.outTable=function(e){
		catchError(()=>{
			if(!actived||self.gridwz==null)return;
			const x=e.pageX,y=e.pageY,x2=self.gridwz.x,y2=self.gridwz.y;
			if(x<x2||x>x2+width||y<y2||y>y2+height){
				self.overvbar=false;
				self.overhbar=false;
				self.outAll();
				self.changehbar();
				self.changevbar();
				self.outsettingcol();
			}
		});
	};
	self.mouseOutBody=()=>{
		if(self.overcell==null)return;
		const name=self.overcell;
		self.overcell=null;
		self.overcellevt(name,null);
	};
	self.overcellevt=(oldv,name)=>{
		let col=null,col2=null;
		if(name!=null){const ns=name.split("|")[1];col=setting.getColumn(ns);};
		if(oldv!=null){const ns=oldv.split("|")[1];col2=setting.getColumn(ns);};
		node.style.cursor=col!=null&&col.type=="link"?"pointer":"default";
		const istt1=(col!=null&&col.type=="link"),istt2=(col2!=null&&col2.type=="link");
		const istt=istt1||istt2
		if(!istt)return;
		self.remarklink(istt2?oldv:null,istt1?name:null);
	};
	
	self.remarklink=(oldv,value)=>{
		const ctx=self.images["body_ctx"];
		self.drewDx(ctx,()=>{
			const ab=(key)=>{
				if(key==null)return;
				const tt=self.rowMapPot[key];
				if(tt==null)return;
				const sz=key.split("|");
				const row=dsData.getRowById(sz[0]),col=setting.getColumn(sz[1]);
				ctx.textBaseline = "middle";
				ctx.font=css.bodyFont;
				ctx.fillStyle=css.bodyColor;
				ctx.textAlign="left";
				self.writebodyvalue(ctx,row,col,tt,true,false);
			};
			ab(oldv);ab(value);
			self.refresh();
		});
	};
	self.createvbar=(ctx)=>{
		if(!showvbar)return;
		const x=width-barwidth;
		const h=height-(showhbar?barheight:0);
		self.drewDx(ctx,()=>{
			const color1=self.overvbar?css.barColor3:css.barColor1;
			if(!isNull(color1)){//背景颜色
				ctx.fillStyle=self.getColor(ctx,color1,false,x,0,barwidth,h);
				ctx.fillRect(x,0,barwidth,h);
			}
			const color3=self.overvbar?css.barColor4:css.barColor2;
			ctx.fillStyle=self.getColor(ctx,color3,true,x,scrolly,barheight,vbarheight);
			ctx.fillRect(x,scrolly,barheight,vbarheight);
		});
	};
	self.createhbar=(ctx)=>{
		if(!showhbar)return;
		const h=height-barheight;
		let w=width;
		self.drewDx(ctx,()=>{
			ctx.clearRect(0,h,width,barheight);
			const color1=self.overhbar?css.barColor3:css.barColor1;
			if(!isNull(color1)){//背景颜色
				ctx.fillStyle=self.getColor(ctx,color1,false,0,h,w,barheight);
				ctx.fillRect(0,h,w,barheight);
			}
			if(showvbar&&showhbar){
				if(!isNull(css.barColor5)){
					ctx.fillStyle=self.getColor(ctx,css.barColor5,false,w-barwidth,h,barwidth,barheight);
					ctx.fillRect(w-barwidth,h,barwidth,barheight);
				}
			};
			 const color3=self.overhbar?css.barColor4:css.barColor2;
			 ctx.fillStyle=self.getColor(ctx,color3,false,scrollx,h,hbarwidth,barheight);
			 ctx.fillRect(scrollx,h,hbarwidth,barheight);
		});
	};
	self.ismoveing=false;
	self.mouseInBody=(oldv)=>{
		self.overcellevt(oldv,self.overcell);
	};
	document.addEventListener("mousemove",self.outTable);
	document.addEventListener("mousedown",self.outTableClick);
	self.gridwz=null;
	self.overcell=null;
	self.executeScoll=function(isy,isUp){
		catchError(function(){
			if(isy){
				let old=scrolly
				let v=old+Math.floor(self.scoll_sep/bsy)*(isUp?-1:1);
				if(v<0)v=0;
				let max=height-(showhbar?barheight:0)-vbarheight;
				if(v>max){v=max;}
				if(old===v)return;
				scrolly=v;
				self.executevbarevt();
			}else{
				let old=scrollx;
				let v=old+Math.floor(self.scoll_sep/bsx)*(isUp?-1:1);
				if(v<0)v=0;
				let max=width-(showvbar?barwidth:0)-hbarwidth;
				if(v>max){v=max;}
				if(old===v)return;
				scrollx=v;
				self.executehbarevt();
			}
		});
	};
	self.getFixed=()=>{let fixed=1;if(setting.fixed<=0)fixed=1;else if(setting.fixed>setting.columns.length)fixed=setting.columns.length;else fixed=setting.fixed+1;return fixed};
	self.executesroll=(e)=>{
		catchError(()=>{
			self.closeEditor();
			self.outAll("scroll");
			const ctrlKey=e.ctrlKey;
			if(ctrlKey||(!showhbar&&!showvbar))return;
			self.cursortype="movebar";
			e.preventDefault();
			const v1=Number(e.deltaY),h1=Number(e.deltaX);
			let v=Math.abs(v1),h=Math.abs(h1);
			if(v>0 && v>h && showvbar){self.executeScoll(true,v1<0);}
			else if(h>0 && h>v && showhbar){
				self.executeScoll(false,h1<0);
			};
			self.cursortype="";
		});
	};
	self.mousewheel=()=>{
		node.onmousewheel=function(e){
			self.executesroll(e);
		};
	};
	self.getGridName=()=>{
		if(!setting.savesetting)return "";
		let user=view.getTokenValue("user");
		if(user!=null&&typeof(user)=="string")user=eval("("+user+")");
		const uid=user==null?"":user.userId;
		return webname+"-"+setting.name+"-"+(isNull(setting.sname)?"":setting.sname+"-")+(uid!=null?uid:"");
	};
	self.cursortype="";
	self.sortfield={};
	self.checkboxindex=-1;
	self.mouseclick=()=>{
		node.onclick=function(e6){
			const e=self.mousedownpot;
			const x=Math.floor(e.offsetX),y=Math.floor(e.offsetY),headh=self.getHeadHeight(),footh=self.getFooterHeight();
			const cellx=self.getColumnX(x);
			const ps=positons["p"+cellx];
			const name=ps==null?"":ps.name;
			catchError(()=>{
				if(!isNull(self.movecolname)||y>headh||isNull(name)||self.isPosition)return;
				self.closeEditor();
				if(name==="$number$"){//打开设置
					if(setting.opensetting){
						view.gridsetting.attr({params:{grid:setting,key:self.getGridName(),fixed:setting.fixed}});
						view.gridsetting.open();
					}
				}
			});
			catchError(()=>{//点击数据区域
				if(name==null||y<headh||dsData.rows.length==0
					||x>=width-(showvbar?barwidth:0)||y>height-footh-(showhbar?barheight:0))return;

				let y2=y-headh,sh=Math.floor(bsy*scrolly);
				y2=y2+(sh-starty*self.getrowheight());
				const rps=self.rowpot["p"+y2];
				const rowid=rps==null?null:rps.rowid;
				const row=dsData.getRowById(rowid);
				let name2=name;
				if(setting.rowcount>1){
					const y6=Math.floor(e6.offsetY)-self.getHeadHeight()+(Math.floor(bsy*scrolly)-starty*self.getrowheight());
					name2=self.columnport2[name+"|"+y6];
				};
				const col=setting.getColumn(name2);
				if(rowid==null||row==null)return;
				setting.executeEvent("clickrow",row);
				if(col==null)return;
				setting.executeEvent("clickcell",{name:name2,row:row});
				const oldkey=self.editorParam!=null?self.editorParam.key:"";
				const newkey=row.rowId+"|"+name2;
				if(col.type=="checkbox"){
					const iszd=self.checkEditable(name2);
					if(iszd)return;
					const v=row[name2];
					const rr={rowId:row.rowId};
					rr[name2]=v==col.onvalue?col.offvalue:col.onvalue;
					if(e.shiftKey){
						self.multicheckbox(currentid,rowid,col);
					}else{
						dsData.set(rr);
					};
				};
				if(oldkey!==newkey&&setting.isopeneditor){
					self.excutechange();
					const oldstt=self.editorParam!=null?eval("("+JSON.stringify(self.editorParam)+")"):null;
					self.editorParam={name:name,row:row,e:e,key:row.rowId+"|"+name};
					self.refreshcell(oldstt);
					self.refreshcell(self.editorParam);
					self.openEditor();
				}
			});
		};
	};
	self.multicheckbox=(id1,id2,col)=>{
		catchError(()=>{
			if(isNull(id1)||isNull(id2))return;
			const xh1=self.rowIdMap[id1],xh2=self.rowIdMap[id2];
			const cr=dsData.getCurrent();
			const v=cr[col.name];
			const v2=v===col.onvalue?col.offvalue:col.onvalue;
			const ab=(a,b,v)=>{
				const min=a>b?b:a,max=a>b?a:b;
				for(let i=min;i<=max;i++){
					const r=dsData.rows[i];
					if(r==null||r[col.name]+""===v+"")continue;
					const ur={rowId:r.rowId};
					ur[col.name]=v;
					dsData.set(ur);
				};
			};
			if(self.checkboxindex!==-1){
				const min=xh1>xh2?xh2:xh1,max=xh1>xh2?xh1:xh2;
				if(self.checkboxindex<min){
					ab(self.checkboxindex,min-1,v2);
				}else if(self.checkboxindex>max){
					ab(max+1,self.checkboxindex,v2)
				}
			};
			ab(xh1,xh2,v);
			self.checkboxindex=xh2;
		});
	};
	self.setValue=(row,name,value)=>{
		 const rowid=row.rowId,key=rowid+"|"+name,ctx=self.images["body_ctx"],col=setting.getColumn(name),stt=self.rowMapPot[key];
		 if(row==null||col==null||stt==null)return;
		 const title=self.getValue(col,value);
		 stt.value=title;
		 stt.target=name;
		 self.drewDx(ctx,()=>{
			ctx.textBaseline = "middle";
			ctx.font=css.bodyFont;
			ctx.fillStyle=css.bodyColor;
			ctx.textAlign="left";
			const sz10=[];
			if(name!="$number$"){
				catchError(()=>{
					const rowstt={font:"",color:"",backgroundcolor:"",row:row,index:stt.index};
					const istt=setting.executeEvent("initrow",rowstt);
					if(istt)return;
					["font","color","backgroundcolor"].forEach(k=>{
						stt["row"+k]=rowstt[k];
						sz10.push({name:"row"+k,value:rowstt[k]});
					});
				});
			};
			self.writebodyvalue(ctx,row,col,stt,true,true);
			if(name!="$number$")self.loopcolumns((col2)=>{
				catchError(()=>{
				  if(col2.name!="$number$"&&col2.name!=name){
						const rowid2=row.rowId,key2=rowid2+"|"+col2.name,stt2=self.rowMapPot[key2];
						if(stt2==null)return;	
						stt2.target=name;
						if(sz10.length>0){sz10.forEach(dx=>{stt2[dx.name]=dx.value;});};
					   self.writebodyvalue(ctx,row,col2,stt2,true,sz10.length>0);
				  }
				})
			});
		 });
		 clearTimeout(self.rv);
		 self.rv=setTimeout(()=>{self.refresh();},10);
	};
	self.rv=null;
	self.refreshcell=(param)=>{};
	self.editorParam=null;
	self.notype=(col)=>{
		let isT=true;
		if(col.type=="checkbox"||col.type=="image"||col.type=="checkboxgroup"||col.type=="radiogroup")isT=false;
		return isT;
	};
	self.openDropdown=(left,top,inptnode,ddnode,zindex,fixedleft)=>{
		catchError(()=>{
			const body=document.querySelector("body");
			const xx2=body.offsetWidth,yy2=body.offsetHeight;
			const ps=ddnode.getBoundingClientRect(),w=ps.width,h=ps.height;
			const ps2=inptnode.parentNode.parentNode.getBoundingClientRect(),w2=Math.floor(ps2.width),h2=Math.floor(ps2.height);
			let lft=left,tp=top;
			if(!fixedleft&&left+w>xx2&&left>xx2/2){lft=left+w2-w+1;};
			if(top+h+h2+1>yy2&&top>yy2/2){tp=top-h2-1-h;};
			self.css(ddnode,{left:lft+"px",top:tp+"px","zIndex":zindex});
		});
	};
	self.bindEvent_keydown=function(e){
		catchError(()=>{
			if(self==null||self["isactive"]==null||!self.isactive()||self.editorParam==null||dsData.rows.length==0)return;
			const keyCode=e.keyCode;
			if(keyCode===9||keyCode==38||keyCode==40){
				e.stopPropagation();e.preventDefault();
				const shiftKey=e.shiftKey;
				if(keyCode===9){
					self.autokeydown(shiftKey?"left":"right");
					self.autokeydown2(shiftKey?"left":"right");
				}else{
					self.mouseOutRow();
					self.autokeydown(keyCode===38?"up":"down");
					self.autokeydown2(keyCode===38?"up":"down");
				}
			};
		});
	};
	self.autokeydown2=(fx)=>{
		if(setting.rowcount===1)return;
		catchError(()=>{//向上下
			if(fx=="left"||fx=="right")return;
			self.mouseOutRow();
			const name=self.editorParam.name,name2=self.editorParam.name2,row=self.editorParam.row;
			const col=setting.getColumn(name);
			const sz=[name],arr=col.columns,mp={};
			mp[name]=0;
			if(arr!=null&&arr.length>0){arr.forEach((s,x)=>{sz.push(s);mp[s]=x+1;});};
			const dx=mp[name2];
			if((dx==0&&fx=="up")||(dx==sz.length-1&&fx=="down")){
				const rowid=row.rowId,xh=self.rowIdMap[rowid];
				if((xh==0&&fx=="up")||(xh==dsData.rows.length-1&&fx=="down"))return;
				const nrow=dsData.rows[xh+(fx=="up"?-1:1)];
				if(nrow==null)return;
				self.excutechange();
				dsData.setCurrent(nrow);
				const newid=nrow.rowId;
				self.editorParam.row=nrow;
				self.editorParam.key=newid+"|"+name;
				self.editorParam.name2=sz[fx=="up"?sz.length-1:0];
				self.openEditor();
			}else{
				self.excutechange();
				self.editorParam.name2=sz[dx+(fx=="up"?-1:1)];
				self.openEditor();
			}
		});
		catchError(()=>{
			if(fx=="up"||fx=="down")return;
			const name=self.editorParam.name,name2=self.editorParam.name2,row=self.editorParam.row;
			const col=setting.getColumn(name);
			const sz=[name],arr=col.columns,mp={};
			mp[name]=0;
			if(arr!=null&&arr.length>0){arr.forEach((s,x)=>{sz.push(s);mp[s]=x+1;});};
			const dx=mp[name2];
			const stt=self.columnpost[name];
			const index=stt.index;
			if((index===1&&fx=="left")||(index==setting.columns.length-1&&fx=="right"))return;
			const findcol=()=>{
				let xh=index+(fx=="left"?-1:1);
				let ns=setting.columns[xh],ncol=setting.getColumn(ns);
				let isFind=false;
				while(ncol!=null){
					const ist=self.notype(ncol);
					if(ncol.visible&&ncol.width>0&&ist){
						const mp2={},arr2=[ncol.name],arr3=ncol.columns;
						if(arr3!=null&&arr3.length>0)arr3.forEach((s,x)=>{arr2.push(s);mp2[s]=x+1;});
						if(arr2.length>dx&&arr2[dx]!=null){
							const col4=setting.getColumn(arr2[dx]);
							const ist4=self.notype(col4);
							if(ist4){
								isFind=true;
								self.editorParam.name2=arr2[dx];
								break;
							}
						}
					};
					xh=xh+(fx=="left"?-1:1);
					if(xh<1||xh>setting.columns.length)break;
					ns=setting.columns[xh];
					ncol=setting.getColumn(ns);
				};
				return {index:xh,col:ncol,isfind:isFind};
			};
			const fr=findcol();
			if(fr==null||index===fr.index||fr.col==null||!fr.isfind)return;
			const fcol=fr.col;
			self.excutechange();
			self.editorParam.name=fcol.name;
			self.editorParam.key=row.rowId+"|"+fcol.name;
			self.openEditor();
		});
	};
	self.excutechange=()=>{
		catchError(()=>{
			if(self.editorParam==null)return;
			const row=self.editorParam.row,name=self.editorParam.name;
			if(row==null||isNull(name))return;
			const inputBody=document.querySelector("#"+view.id+"_editor");
			if(inputBody==null)return;
			inputBody.querySelector(".grid-input").blur();
		});
	};
	self.autokeydown=(fx)=>{
		if(setting.rowcount!==1)return;
		catchError(()=>{
			const row=self.editorParam.row,name=self.editorParam.name;
			if(fx=="down"||fx=="up"){
				const rowid=row.rowId,xh=self.rowIdMap[rowid];
				if((xh==0&&fx=="up")||(xh==dsData.rows.length-1&&fx=="down"))return;
				const nrow=dsData.rows[xh+(fx=="up"?-1:1)];
				if(nrow==null)return;
				self.excutechange();
				dsData.setCurrent(nrow);
				const newid=nrow.rowId;
				self.editorParam.row=nrow;
				self.editorParam.key=newid+"|"+name;
				self.openEditor();
			}else if(fx=="left"||fx=="right"){
				const stt=self.columnpost[name];
				if(stt==null)return;
				const index=stt.index;
				if((index===1&&fx=="left")||(index==setting.columns.length-1&&fx=="right"))return;
				const findcol=()=>{
					let xh=index+(fx=="left"?-1:1);
					let ns=setting.columns[xh],ncol=setting.getColumn(ns);
					let isFind=false;
					while(ncol!=null){
						const ist=self.notype(ncol);
						if(ncol.visible&&ncol.width>0&&ist){isFind=true;break;}
						xh=xh+(fx=="left"?-1:1);
						if(xh<1||xh>setting.columns.length)break;
						ns=setting.columns[xh];
						ncol=setting.getColumn(ns);
					};
					return {index:xh,col:ncol,isfind:isFind};
				};
				const fr=findcol();
				if(fr==null||index===fr.index||fr.col==null||!fr.isfind)return;
				const fcol=fr.col;
				self.excutechange();
				self.editorParam.name=fcol.name;
				self.editorParam.key=row.rowId+"|"+fcol.name;
				self.openEditor();
			}
		});
	};
	window.addEventListener("keydown",self.bindEvent_keydown);
	self.dropdowncol=null;
	self.openNode=null;
	self.dropdownts=null;
	grid.openEditor=(pp)=>{if(pp==null)return;self.editorParam=pp;self.openEditor();};
	self.ddmap={};
	self.openEditor=()=>{
		if(self!=null)clearTimeout(self.dropdownts);
		if(self==null||self.editorParam==null)return;
		catchError(()=>{
			const  name=self.editorParam.name,row=self.editorParam.row,e=self.editorParam.e,key2=self.editorParam.key;
			let name2=name,key=key2;
			if(self.openNode!=null){if(self.openNode.name!==name2){self.closeEditor();};};
			if(setting.rowcount>1){
				if(self.editorParam["name2"]==null){
					const y6=Math.floor(e.offsetY)-self.getHeadHeight()+(Math.floor(bsy*scrolly)-starty*self.getrowheight());
					name2=self.columnport2[name+"|"+y6];
					if(isNull(name2)){self.editorParam=null;return;};
				}else{
					name2=self.editorParam.name2;
				};
				key=row.rowId+"|"+name2;
				self.editorParam.name2=name2;
			};
	
			const parentcol=setting.getColumn(name);
			const field=dsData.getField(name2),col=setting.getColumn(name2);
			if(field==null)return;
			const inputBody=document.querySelector("#"+view.id+"_editor");
			if(!self.notype(col)){inputBody.style.display="none";return;};
			const type=col.type;
			const iszd=self.checkEditable(name2);
			const icon=inputBody.querySelector(".grid-dropdown-icon");
			icon.style.display=!iszd&&(type=="dropdown"||type=="select"||type=="radiogroup"||type=="date"||type=="datetime")?"flex":"none";
			const iconNode=icon.querySelector("i");
			iconNode.setAttribute("class","el-icon-caret-bottom");
			inputBody.onmousewheel=null;
			inputBody.onmousemove=null;
			inputBody.onmousemove=function(){
				catchError(()=>{
					if(!setting.openoverrow)return;
					const oldv=self.overrow;
					if(oldv===row.rowId)return;
					self.overrow=row.rowId;self.mouseInRow(oldv,row.rowId);
				});
			};
			inputBody.onmousewheel=function(e){self.executesroll(e);};
			let sh=Math.floor(bsy*scrolly),sw=Math.floor(bsx*scrollx);
			const colpot=self.columnpost[name];
			const st=self.headpot[name];
			if(st==null)return;
			let x9=st.x1,y9=0;
			let sqwidth=parentcol.width;
			const maxwidth=width-(showvbar?barwidth:0);
			if(colpot.isleft&&x9+col.width>maxwidth){sqwidth=maxwidth-x9;};
			if(!colpot.isleft){
				const fst=setting.columns[startx];
				const fpt=self.columnpost[fst];
				const xpot=st.x1-(sw-fpt.x3);
				if(xpot<leftwidth){//微调
					const cz=leftwidth-xpot;
					const sxx=Math.ceil(cz/bsx);
					scrollx-=sxx;
					if(scrollx<0)scrollx=0;
					sw=Math.floor(bsx*scrollx);
					self.executehbarevt();
					x9=st.x1-(sw-fpt.x3);
					if(x9+col.width>maxwidth){sqwidth=maxwidth-x9;};
				}else if(xpot+col.width>maxwidth){
					if(leftwidth+col.width<=maxwidth){
						const cz=width-(showvbar?barwidth:0)-xpot;
						const gdcd=col.width-cz;
						const sw2=Math.ceil(gdcd/bsx);
						scrollx+=sw2;
						if(scrollx+hbarwidth>width-(showvbar?barwidth:0)){scrollx=width-(showvbar?barwidth:0)-hbarwidth;}
						sw=Math.floor(bsx*scrollx);
						self.executehbarevt();
						x9=st.x1-(sw-fpt.x3);
					}
					if(x9+col.width>maxwidth){
						sqwidth=maxwidth-x9;
					}
				}else{
					x9=st.x1-(sw-fpt.x3);
				}
			};
			const st2=self.rowMapPot[key],headh=self.getHeadHeight();
			if(st2==null)return;
			const footh=self.getFooterHeight(),rowheight=self.getrowheight();
			const tpp=st2.y1-(sh-starty*rowheight);
			const maxh=height-(showhbar?barheight:0)-footh;
			if(showvbar&&tpp<0&&scrolly>0){
				const cy=-tpp;
				const syy=Math.ceil(cy/bsy);
				scrolly-=syy;
				if(scrolly<0)scrolly=0;
				self.executevbarevt();
				sh=Math.floor(bsy*scrolly);
			}else if(showvbar&&tpp+setting.rowheight+headh>maxh){
				const cz=maxh-tpp-headh;
				const shh=rowheight-cz;
				const sh2=Math.ceil(shh/bsy);
				scrolly+=sh2;
				if(scrolly>height-(showhbar?barheight:0)-vbarheight){scrolly=height-(showhbar?barheight:0)-vbarheight;};
				self.executevbarevt();
				sh=Math.floor(bsy*scrolly);
			};
			y9=st2.y1-(sh-starty*rowheight)+headh;
			if(y9+st2.height>maxh){y9=maxh-st2.height;};
			if(y9<headh)y9=headh;
			if(name==="$number$")return;
			const ps=node.getBoundingClientRect();
			y9+=ps.top+1;x9+=ps.left+1;
			const zindex=view.subwindow==null||view.subwindow["zindex"]==null?99:view.subwindow.zindex;

			if(col.type!="link")self.css(inputBody,{
				width:sqwidth+"px",
				height:st2.height+"px",
				top:y9+"px",
				left:x9+"px",
				display:"flex",
				"zIndex":zindex,
				"background-color":!iszd?css.editorBackgroundColor:css.editorReadOnlyColor,
				border:"1px solid "+(isNull(css.editorBorderColor)?css.borderColor:css.editorBorderColor)
			});
			const inputNode=inputBody.querySelector(".grid-input");
			let iscg=false;
			const exup=function(nd,e2){
				const vv2=e2.target.value;
				if(vv2!==vv){
					iscg=true;
					if(col.type=="dropdown"){
						catchError(()=>{
							const dd=setting.view[col.dropdown];
							if(dd==null||!dd.isopen)return;
							dd.doFilter(vv2);
						});
					};
					setting.executeEvent("keyup",{name:col.name,value:vv2});
				};
				nd.removeEventListener("keyup",upevt);
			};
			const upevt=function(e2){exup(inputNode,e2)};
			let vv="";
			if(!iszd&&col.type!="select"&&col.type!="radiogroup")inputNode.removeAttribute("readonly");
			else inputNode.setAttribute("readonly","readonly");
			const vv9=row[name2]==null?"":row[name2];
			const value9=self.getValue(col,vv9);
			inputNode.onkeydown=null;
			inputNode.onkeyup=null;
			inputNode.onblur=null;
			let oldts=new Date().getTime();
			inputNode.onkeydown=function(e1){
				if((e1.keyCode>=37&&e1.keyCode<=40)||e1.keyCode==9)return;
				catchError(()=>{
					iscg=false;
					vv=e1.target.value;
					inputNode.addEventListener("keyup",upevt);
				})
			};
			inputNode.onmousedown=null;
			if(col.type==="textarea"){
				view.bigtextcol=self.editorParam;
				inputNode.onmousedown=function(e1){
					catchError(()=>{
						const bignode=document.querySelector("#"+view.id+"_bigtext");
						if(bignode==null)return;
						if(!iszd)bignode.removeAttribute("readonly");
						else bignode.setAttribute("readonly","readonly");
						bignode.value=inputNode.value;
						bignode.onkeydown=null;
						const upevt2=function(e8){exup(bignode,e8);};
						bignode.onkeydown=function(e9){iscg=false;
							vv=e9.target.value;bignode.addEventListener("keyup",upevt2);
						};
						bignode.onchange=null;
						bignode.onfocus=null;
						bignode.onfocus=function(e){e.target.select();};
						bignode.onchange=function(e){
							if(!iszd){const r={rowId:row.rowId,};r[name2]=e.target.value;dsData.set(r);inputNode.value=r[name];}
						};
						view.gridBigText.attr("title","大文本编辑->["+col.label+"]");
						if(oldts!=null&&new Date().getTime()-oldts<=400){
							self.closeEditor();
							view.gridBigText.open();
							self.openNode={name:name2,node:view.gridBigText.getNode(),type:"subwindow",dx:view.gridBigText};
							setTimeout(()=>{bignode.focus();},10);
						}else oldts=new Date().getTime();
					});
				};
			};
			inputNode.onchange=null;
			inputNode.onchange=function(e){
				if(!iszd){
					const r={rowId:row.rowId,};r[name2]=e.target.value;dsData.set(r);
				}
			};
			inputNode.onfocus=null;
			inputNode.blur();
			inputNode.onfocus=function(e){
				e.target.select();
			};
			self.css(inputNode,{
				"text-align":col.align,
				padding:"0px "+spacing+"px",
				"background-color":!iszd?css.editorBackgroundColor:css.editorReadOnlyColor,
				font:st2.font,
				color:st2.color
			});

			self.css(icon,{"background-color":!iszd?css.editorBackgroundColor:css.editorReadOnlyColor});
			if(col.type=="date"||col.type=="datetime"){
				const calendar=col.type=="date"?view.calendarDate:view.calendarDatetime;
				calendar.attr({
					node:inputBody,
					value:value9,
					readonly:iszd,
					editor:{
						field:name2,
						dataset:dsData.name,
						view:setting.view
					},
					format:col.format,
					closeevent:()=>{
						iconNode.setAttribute("class","el-icon-caret-bottom");
						calendar.attr("selected",()=>{});
					},
					labelshow:(v)=>{
						inputNode.value=v;
					},
					selected:(p)=>{
						const r={rowId:row.rowId};
						r[name2]=p.value;
						dsData.set(r);
					}
				});

				inputNode.onkeyup=function(e){calendar.keyup(e);};
				inputNode.onblur=function(e){calendar.blur(e);};
			};
			inputNode.value=value9;
			inputNode.focus();
			let isclose=true;
			try{if(typeof(self.editorParam["isclose"])=="undefined"||self.editorParam.isclose!==true)isclose=false;}catch(e){}
			if(col.type=="select"||col.type=="radiogroup"){
				const open=function(){
					if(iszd)return;
					view.bigtextcol=self.editorParam;
					view.options=col.options;
					catchError(()=>{
						const dnode=document.querySelector("#"+view.sid);
						self.css(dnode,{
							top:(y9+st2.height+1)+"px",
							left:x9+"px",
							"zIndex":-10,
							"min-width":(col.width)+"px",
							display:"block"
						});
						setTimeout(() =>{self.openDropdown(x9,(y9+st2.height+1),inputNode,dnode,zindex,true)},10);
						self.openNode={name:name2,node:dnode,type:"select"};
						iconNode.setAttribute("class","el-icon-caret-top");
					});
				};
				const dnode=document.querySelector("#"+view.sid);
				if(isclose){iconNode.setAttribute("class","el-icon-caret-bottom");dnode.style.display="none";};
				if(!isclose)open();
				icon.onclick=null;
				icon.onclick=function(){
					catchError(()=>{
						const dp=dnode.style.display;
						if(dp=="none"){
							open();
						}else{
							dnode.style.display="none";
							iconNode.setAttribute("class","el-icon-caret-bottom");
						}
					})
				};
			}else if(col.type=="date"||col.type=="datetime"){
				catchError(()=>{
					if(iszd)return;
					const ab=(calendar)=>{
						icon.onclick=null;
						icon.onclick=function(){
							if(iszd)return;
							const isopen=calendar.isopen;
							if(isopen){
								calendar.close();
								iconNode.setAttribute("class","el-icon-caret-bottom");
							}else{
								calendar.open();
								view.bigtextcol=self.editorParam;
								iconNode.setAttribute("class","el-icon-caret-top");
							}
						};
					};
					const calendar=col.type=="date"?view.calendarDate:view.calendarDatetime;
					const dateNode=document.querySelector("#"+calendar.id);
					ab(calendar);
					self.openNode={name:name2,dx:calendar,node:dateNode,type:"date"};
				});//---
			}else if(col.type=="dropdown"&&!isNull(col.dropdown)){
				catchError(()=>{
					if(iszd)return;
					const dd=setting.view[col.dropdown];
					if(dd==null)return;
					if(self.ddmap[dd.id]==null){
						self.ddmap[dd.id]=dd.id;
						dd.addEvent("selectclose",()=>{
							if(self.dropdowncol==null)return;
							self.dropdowncol.isclose=true;
							grid.openEditor(self.dropdowncol);
							iconNode.setAttribute("class","el-icon-caret-bottom");
						});
					}
					dd.attr("element",inputBody);
					dd.attr("editor",{field:col.name,dataset:setting.dataset,view:setting.view});
					dd.attr("selectclose",function(){self.dropdowncol=self.editorParam;self.closeEditor();});
					dd.attr("minwidth",col.width);
					if(dd.autoopen&&!isclose){
						dd.open();
						iconNode.setAttribute("class","el-icon-caret-top");
					};
					icon.onclick=null;
					icon.onclick=function(){
						if(dd.isopen){
							dd.close()
							iconNode.setAttribute("class","el-icon-caret-bottom");
						}else{
							iconNode.setAttribute("class","el-icon-caret-top");
							dd.open();
						}; 
					};
					self.openNode={name:name2,node:document.querySelector("#"+dd.id),type:"dropdown",dx:dd};
				});
			}
		});
	};
	self.closeEditor=()=>{
		catchError(()=>{
			if(self.editorParam==null)return;
			self.excutechange();
			if(self.openNode!=null){
				if(self.openNode.type=="subwindow"||self.openNode.type=="dropdown"||self.openNode.type=="date")self.openNode.dx.close();
				else self.openNode.node.style="none";
			};
			self.openNode=null;
			const oldstt=eval("("+JSON.stringify(self.editorParam)+")");
			self.editorParam=null;
			self.refreshcell(oldstt);
			const ndd=document.querySelector("#"+view.id+"_editor");
			const dnode=document.querySelector("#"+view.sid);
			if(dnode!=null&&dnode.style.display!="none")dnode.style.display="none";
			if(ndd==null)return;
			ndd.style.display="none";
		});
	};
	self.isPosition=false,self.isTs=null;
	self.oldkey=null;
	self.keydown=function(e){
		catchError(()=>{
			if(self==null||self["isactive"]==null||!self.isactive())return;
			if(self.oldkey===e.keyCode)return;
			self.oldkey=e.keyCode;
			const kcode=e.keyCode;
			catchError(()=>{
				if(e.keyCode!==16)return;
				const mup=function(e2){if(kcode===16){self.checkboxindex=-1;};window.removeEventListener("keyup",mup);self.oldkey=null;};
				window.addEventListener("keyup",mup);
			});
		});
	};
	self.oldvv=null;
	self.mousedownpot={};
	self.mousedown=()=>{
		node.onmousedown=function(e){
			self.mousedownpot=e;
			const x=Math.floor(e.offsetX),y=Math.floor(e.offsetY);
			self.gridwz={x:e.pageX-x,y:e.pageY-y};
			const cellx=self.getColumnX(x);
			const ps=positons["p"+cellx];
			const name=ps==null?"":ps.name;
			const headh=self.getHeadHeight();
			const fooh=self.getFooterHeight();
			catchError(function(){//数据区域-切换当前行
				if(e.which===3||(e.shiftKey&&e.which===1))return;
				let y2=y-headh,sh=Math.floor(bsy*scrolly);
				y2=y2+(sh-starty*self.getrowheight());
				const rps=self.rowpot["p"+y2];
				const rowid=rps==null?null:self.rowpot["p"+y2].rowid;
				if(name==null||rowid==null){self.closeEditor();return;};
				if(y>headh&&y<=height-fooh-(showhbar?barheight:0)&&x<width-(showvbar?barwidth:0)){
					const oldrowid=currentid;
					if(self.editorParam!=null&&self.editorParam.key!==rowid+"|"+name){self.closeEditor();}
					if(oldrowid===rowid){return;};
					dsData.setCurrent(dsData.getRowById(rowid));
				}
			});
			catchError(()=>{//横向滚动条
				if(!self.overhbar)return;
				if(x<scrollx||x>scrollx+hbarwidth)return;
				const px=e.pageX;
				const oldx=scrollx,max=width-(showvbar?barwidth:0);
				self.stopdraw=false;
				self.oldvv=null;
				self.cursortype="movebar";
				self.drawingevt=()=>{if(self.oldvv!==scrollx){self.executehbarevt();self.oldvv=scrollx;}};
				self.drawing();
				const hbarmoveevt=(e2)=>{
					catchError(function(){
						self.closeEditor();
						let xx=oldx+Math.floor(e2.pageX-px);
						if(xx<=0)xx=0;
						else if(xx+hbarwidth>max)xx=max-hbarwidth;
						if(scrollx===xx)return;
						scrollx=xx;
					});
				};
				const closemove=()=>{
					self.cursortype="";
					self.stopdraw=true;
					document.removeEventListener("mouseup",closemove);
					document.removeEventListener("mousemove",hbarmoveevt);
				};
				document.addEventListener("mouseup",closemove);
				document.addEventListener("mousemove",hbarmoveevt);
			});
			catchError(()=>{//纵向滚动条
				if(!self.overvbar)return;
				if(y<scrolly||y>scrolly+vbarheight)return;
				const py=e.pageY;
				const oldy=scrolly,max=height-(showhbar?barheight:0);
				self.oldvv=null;
				self.stopdraw=false;
				self.cursortype="movebar";
				self.drawingevt=()=>{
					if(self.oldvv===scrolly)return;
					self.executevbarevt();
					self.oldvv=scrolly;
				};
				self.drawing();
				const vbarmoveevt=(e2)=>{
					catchError(function(){
						self.closeEditor();
						let yy=oldy+Math.floor(e2.pageY-py);
						if(yy<=0)yy=0;
						else if(yy+vbarheight>max)yy=max-vbarheight;
						if(scrolly===yy)return;
						scrolly=yy;
					});
				};
				const closemove=()=>{
					catchError(()=>{self.cursortype="";self.stopdraw=true;});
					document.removeEventListener("mousemove",vbarmoveevt);
					document.removeEventListener("mouseup",closemove);
				};
				document.addEventListener("mouseup",closemove);
				document.addEventListener("mousemove",vbarmoveevt);
			});
			catchError(()=>{//执行调整列宽
				if(isNull(self.movecolname)||y>headh)return;
				self.closeEditor();
				const px=e.pageX;
				let ww=0;
				const pp=self.movecolname;
				self.executechangecolwidth(pp,0);
				const mvevt=(e2)=>{ww=Math.floor(e2.pageX-px);self.cursortype="changewidth";self.executechangecolwidth(pp,ww);};
				const mvclose=(e2)=>{
					catchError(()=>{
						self.cursortype="";
						document.removeEventListener("mousemove",mvevt);
						document.removeEventListener("mouseup",mvclose);
						self.stopchangecolwidth(pp,ww);
					});
				};
				document.addEventListener("mousemove",mvevt);
				document.addEventListener("mouseup",mvclose);
			});
			catchError(()=>{//执行调整列位置 和排序
				if(y>headh||x>width-(showvbar?barwidth:0))return;
				const col=setting.getColumn(name)
				if(col==null||!isNull(self.movecolname)||y>headh||!setting.changepostion||name==="$number$")return;
				clearTimeout(self.isTs);
				const px=e.pageX;
				self.isPosition=false;
				const mup=function(){
					clearTimeout(self.isTs);
					if(name==="select"){
						dsData.selectToggle();
					}else if(!self.isPosition&&name!=="select"){////单击排序
						if(col==null||!col.sortable||dsData.rows.length<2)return;
						let  isasc="asc";
						if(self.sortfield!=null&&!isNull(self.sortfield[name])){
							const isasc2=self.sortfield[name];
							isasc=isasc2=="asc"?"desc":"asc";
						};
						dsData.sort(name+""+(isasc=="asc"?"":"-"));
					};
					self.isPosition=false;
					document.removeEventListener("mouseup",mup);
					node.style.cursor="default";
				};
				document.addEventListener("mouseup",mup);
				self.isTs=setTimeout(()=>{//交换位置
					catchError(()=>{
						self.changeposition={start:name,end:name};
						self.isPosition=true;
						node.style.cursor="move";
						let sw=Math.floor(bsx*scrollx);
						const colpot=self.columnpost[name];
						const st=self.headpot[name];
						let x9=st.x1;
						if(!colpot.isleft){
							const fst=setting.columns[startx];
							const fpt=self.columnpost[fst];
							const xpot=st.x1-(sw-fpt.x3);
							if(xpot<leftwidth&&scrollx>0){//微调
								const cz=leftwidth-xpot;
								const sxx=Math.ceil(cz/bsx);
								scrollx-=sxx;
								if(scrollx<0)scrollx=0;
								sw=Math.floor(bsx*scrollx);
								self.executehbarevt();
								x9=st.x1-(sw-fpt.x3);
							}else x9=st.x1-(sw-fpt.x3);
						};
						self.cursortype="move";
						self.moveposition(col,x9,0,Math.floor(e.offsetX));
						const mv=function(e2){
							const xx=Math.floor(e2.pageX-px);
							self.moveposition(col,x9+xx,xx,Math.floor(e2.offsetX));
						};
						const mvup=function(){
							catchError(()=>{
								self.isPosition=false;
								self.cursortype="";
								self.movepositionend();
								document.removeEventListener("mousemove",mv);
								document.removeEventListener("mouseup",mvup);
								self.changeposition=null;
							});
						};
						document.addEventListener("mousemove",mv);
						document.addEventListener("mouseup",mvup);
					})
				},300);
			});
			catchError(()=>{//行拖动
				if(y<headh||y>height-(showhbar?barheight:0))return;
				let y2=y-headh,sh=Math.floor(bsy*scrolly);
				const rowheight=self.getrowheight()
				y2=y2+(sh-starty*rowheight);
				const rps=self.rowpot["p"+y2];
				const rowid=rps==null?null:self.rowpot["p"+y2].rowid;
				const fna=setting.columns[0],fst=setting.getColumn(fna), st=self.rowMapPot[rowid+"|$number$"];
				if(name==null||st==null||rowid==null||fst==null||x>fst.width||!setting.rowdraggable){self.closeEditor();return;};
				const mup=function(e1){self.ismvrow=false;document.removeEventListener("mouseup",mup);clearTimeout(self.ts2);};
				document.addEventListener("mouseup",mup);
				const rh=rowheight,tpp=st.y1-(sh-starty*rh);
				if(tpp<0&&scrolly>0){const sh2=tpp*-1;scrolly-=Math.ceil(sh2/bsy);if(scrolly<0)scrolly=0;self.executevbarevt();sh=Math.floor(bsy*scrolly);};
				const max=height-(showhbar?barheight:0)-fooh;
				if(tpp+headh+rh>max){const cz=rh-(max-tpp-headh);const sh2=Math.ceil(cz/bsy);scrolly+=sh2;self.executevbarevt();sh=Math.floor(bsy*scrolly);};
				clearTimeout(self.ts2);
				self.ts2=setTimeout(()=>{
					catchError(()=>{
						if(!isNull(self.cursortype))return;
						self.ismvrow=true;
						self.mouseOutRow();
						self.oldyy=null;
						let mheight=0;
						const starwz=st.y1-(sh-starty*rh)+headh;
						self.moverowparams={start:rowid,end:rowid};
						self.stopdraw=false;
						self.drawingevt=()=>{self.moverowevt(rowid,starwz,mheight);};
						self.drawing();
						const mv=function(e2){const yy=Math.floor(e2.pageY-e.pageY);mheight=yy;};
						const stmv=function(){catchError(()=>{self.stopdraw=true;self.ismvrow=false;self.stopmoverowevt();self.moverowparams=null;document.removeEventListener("mousemove",mv);document.removeEventListener("mouseup",stmv);});};
						document.addEventListener("mousemove",mv);
						document.addEventListener("mouseup",stmv);
					})
				},300);
			});
		};
	};
	self.ismvrow=false;
	self.ts2=null;
	self.oldv=0;
	self.moverowparams={};
	self.oldyy=null;
	self.moverowevt=(rowid,top,yy)=>{
		if(self.oldyy===yy)return;
		catchError(()=>{
			const y2=top+yy,headh=self.getHeadHeight(),rh=self.getrowheight(),sh=Math.floor(scrolly*bsy), yb=Math.floor(rh/2)
			if(y2<yb-2)return;
			const ftt=self.rowMapPot[rowid+"|$number$"]
			const pot=ftt.y1+yy+yb
			const pss=self.rowpot["p"+pot];
			if(pss==null)return;
			self.moverowparams.end=pss.rowid;
			self.moverowparams.position=pss.position;
			const maxw=leftwidth+rightwidth>width-(showvbar?barwidth:0)?width-(showvbar?barwidth:0):leftwidth+rightwidth;
			self.drewDx(targetCtx,()=>{
				const canvas=self.images["copy"],ratio=self.getRatio();
				targetCtx.clearRect(0,0,width,height);
				targetCtx.drawImage(canvas,0,0,width*ratio,height*ratio,0,0,width,height);
				targetCtx.strokeStyle=css.moveRowColor;
				targetCtx.strokeRect(0,y2,maxw,rh);
				targetCtx.fillStyle=self.getColor(targetCtx,css.moverowbjcolor,false,1,y2,maxw,rh);
				targetCtx.fillRect(1,y2,maxw,rh);
				const st3=self.rowMapPot[pss.rowid+"|$number$"];
				const starwz3=st3.y1-(sh-starty*rh)+headh+(pss.position=="after"?rh:0);
				const color2=isNull(css.moverowlinecolor)?"black":css.moverowlinecolor;
				targetCtx.fillStyle=self.getColor(targetCtx,color2,false,1,starwz3-1,maxw,3);
				targetCtx.fillRect(1,starwz3-1,maxw,3);
			});
		});
	};
	self.stopmoverowevt=()=>{
		catchError(()=>{
			if(self.moverowparams==null||self.moverowparams.start===self.moverowparams.end){
				self.drewDx(targetCtx,()=>{
					const canvas=self.images["copy"],ratio=self.getRatio();
					targetCtx.clearRect(0,0,width,height);
					targetCtx.drawImage(canvas,0,0,width*ratio,height*ratio,0,0,width,height);
				});
			}else{
				dsData.rowRaggable(self.rowIdMap[self.moverowparams.start],self.rowIdMap[self.moverowparams.end],self.moverowparams.position);
			}
		});
	};
	self.changeposition={};
	self.moveposition=(col,x,bh,lx)=>{
		catchError(()=>{
			const col33=self.columnpost[col.name];
			const np=col33.x3+bh+(col33.isleft?0:leftwidth);
			const pot=lx<=leftwidth?lx:np+Math.floor(col.width/2);
			const ps=positons["p"+pot]
			if(self.oldv===x||ps==null||ps.name==="$number$")return;
			const sw=Math.floor(bsx*scrollx);
			if(lx>leftwidth&&ps.position=="before"&&ps.start-sw<leftwidth)return;
			self.oldv=x;
			const canvas=self.images["copy"],ratio=self.getRatio(),stt=self.headpot[col.name];
			if(stt==null)return;
			self.drewDx(targetCtx,()=>{
				targetCtx.clearRect(0,0,width,height);
				targetCtx.drawImage(canvas,0,0,width*ratio,height*ratio,0,0,width,height);
				targetCtx.fillStyle=css.headColor;
				targetCtx.textBaseline = "middle";
				targetCtx.font=css.headFont;
				targetCtx.textAlign=col.align;
				self.createTh(targetCtx,col,stt,x,stt);
				targetCtx.strokeStyle=css.posionColor;
				targetCtx.strokeRect(x,stt.y1,col.width,stt.height);
				targetCtx.fillStyle="red";
				targetCtx.textBaseline = "top";
				let xx=ps.position=="before"?ps.start:ps.end;
				let xx2=xx>leftwidth?xx-sw:xx;
				targetCtx.textAlign="left";
				targetCtx.fillText("▲",xx2-7,self.getHeadHeight());
			});
			self.changeposition.end=ps.name;
			self.changeposition.position=ps.position;
		});
	};
	self.movepositionend=()=>{
		catchError(()=>{
			if(self.changeposition==null||self.changeposition.start===self.changeposition.end){
				self.drewDx(targetCtx,()=>{
					const canvas=self.images["copy"],ratio=self.getRatio();
					targetCtx.clearRect(0,0,width,height);
					targetCtx.drawImage(canvas,0,0,width*ratio,height*ratio,0,0,width,height);
				});
			}else{
				setting.changecolumn(self.changeposition.start,self.changeposition.end,self.changeposition.position);
				self.saveSetting();
			}
		});
	};
	self.overhbar=false;self.overvbar=false;
	self.getColumnX=(x)=>{
		const sw=Math.floor(bsx*scrollx);
		let cellx=x;
		catchError(()=>{if(x>leftwidth){cellx=x+sw;}});
		return cellx;
	};
	self.isoverst=false;
	self.outsettingcol=()=>{
		if(!self.isoverst)return;
		node.style.cursor="default";
		self.isoverst=false;
	};
	self.insettingcol=()=>{
		if(self.isoverst)return;
		node.style.cursor="pointer";
		self.isoverst=true;
	};
	//表格鼠标移动事件
	self.bindmousemove=()=>{
		node.onmousemove=function(e){
			const x=Math.floor(e.offsetX),y=Math.floor(e.offsetY);
			self.gridwz={x:e.pageX-x,y:e.pageY-y};
			const cellx=self.getColumnX(x);
			const ps=positons["p"+cellx];
			const name=ps==null?"":ps.name;
			const headh=self.getHeadHeight();
			const fooh=self.getFooterHeight();
			catchError(()=>{//鼠标移到表格头事件
				if(y<headh&&x<width-(showvbar?barwidth:0)){
					if(self.cursortype==="changewidth"||self.cursortype==="movebar")return;
					self.mouseOutBody();
					self.mouseOutRow();
					if(name==null){
						self.mouseOutHead();
						self.mouseOutcolwidth();
						return;
					};
					const zj=self.movewidthpots["p"+cellx];
					if(zj==null){
						self.mouseOutcolwidth();
						if(self.currenthead===name)return;
						if(self.currenthead!==name){
							self.mouseOutHead();
							self.currenthead=name;
							self.mouseInHead();
						};
					}else{
						self.mouseOutHead();
						self.mouseIncolwidth(zj);
					};
				}else{
					if(self.cursortype==="changewidth"||self.cursortype==="movebar")return;
					self.mouseOutcolwidth();
					self.mouseOutHead();
				};
			});
			catchError(()=>{//鼠标移到设置位置改变鼠标状态
				const nbx=setting.getColumn("$number$");
				if(nbx==null)return;
				const hh=self.getHeadHeight();
				if(!setting.opensetting||!setting.showhead||x>nbx.width||y>hh||self.cursortype!=""){
					if(self.cursortype=="")self.outsettingcol();
					return;
				}
				self.insettingcol();
			});
			catchError(()=>{//鼠标移到数据行事件
				const ht=showhbar?barheight:0;
				if(!self.ismvrow&&y>headh&&y<=height-fooh-ht&&x<width-(showvbar?barwidth:0)){
					if(self.cursortype==="changewidth"||self.cursortype==="movebar")return;
					const sh=Math.floor(bsy*scrolly);
					const y2=y-headh+sh-starty*self.getrowheight();
					const rps=self.rowpot["p"+y2];
					const rowid=rps==null?null:self.rowpot["p"+y2].rowid;
					if(name==null||rowid==null){self.mouseOutBody();self.mouseOutRow();return;}
					if(self.overcell===rowid+"|"+name)return;
					self.mouseOutcolwidth();
					self.mouseOutHead();
					const oldv=self.overcell;
					self.overcell=rowid+"|"+name;
					self.mouseInBody(oldv);
					if(self.overrow!==rowid&&setting.openoverrow){
						const oldid=self.overrow;
						self.overrow=rowid;
						self.mouseInRow(oldid,rowid);
					}
				}else{
					self.mouseOutBody();
					self.mouseOutRow();
				}
			});
			catchError(()=>{//鼠标移到滚动条上事件
				const ww=width-(showvbar?barwidth:0),hh=height-(showhbar?barheight:0);
				let ov=false,oh=false;
				if(showvbar&&x>=width-barwidth&&y<hh){ov=true;};
				if(showhbar&&x<ww&&y>hh)oh=true;
				if(ov!==self.overvbar){self.overvbar=ov;self.changevbar();};
				if(oh!==self.overhbar){self.overhbar=oh;self.changehbar();}
			});
		};
	};
	//---------以下是滚动条变化事件---------------------------------
	self.oldoverhbar=false;self.oldovervbar=false;
	//画水平滚动条
	self.changehbar=()=>{if(self.oldoverhbar===self.overhbar)return;self.oldoverhbar=self.overhbar;const ctx=targetCtx;self.drewDx(ctx,()=>{self.createhbar(ctx);});};
	//画垂直滚动条
	self.changevbar=()=>{if(self.oldovervbar===self.overvbar)return;self.oldovervbar=self.overvbar;const ctx=targetCtx;self.drewDx(ctx,()=>{self.createvbar(ctx);});};
	self.loadbody=()=>{
		if(dsData.rows.length==0||self==null||self["isactive"]==null||!self.isactive())return;
		const rowheight=self.getrowheight();
		const maxcount=Math.floor(bodyheight/rowheight);
		const yb=5;
		const sch=Math.floor(bsy*scrolly);
		const start=Math.floor(sch/rowheight);
		starty=start<yb?0:start-yb;
		endy=starty+maxcount;
		dsData.benginLoadData(starty,endy);
		self.createBody();
	};
	self.rowpot={};self.rowMapPot={};
	self.initrowpot=(rowid,y1)=>{catchError(()=>{const rowheight=self.getrowheight();const max=y1+rowheight,yb=Math.floor(rowheight/2)+y1;for(let i=y1;i<max;i++){const ps=i<yb?"before":"after";self.rowpot["p"+i]={rowid:rowid,position:ps,start:y1,end:max};}});};
	//循环列
	self.loopcolumns=(evt)=>{
		if(setting.columns==null||setting.columns.length==0)return;
		catchError(()=>{
			const ab=(x1,x2,isleft)=>{
				for(let i=x1;i<=x2;i++){
					const ns=setting.columns[i], col=setting.getColumn(ns);
					if(col==null||!col.visible||col.width<=0)continue;
					if(typeof(evt)!="undefined")evt(col,isleft);
				}
			};
			if(leftx2>-1)ab(leftx1,leftx2,true);
			ab(startx,endx,false);
		});
	};
	//切换当前行标记
	self.changerowremark=(rowid,rowid2)=>{
		if(self==null||self["isactive"]==null||!self.isactive())return;
		if(dsData.rows.length==0||isNull(css.currentBackgroundColor))return;
		 catchError(()=>{
		 	if(isNull(rowid)&&isNull(rowid2))return;
		 	const ctx=self.images["bj_ctx"],ns=setting.columns[0],fst=setting.getColumn(ns);
			self.drewDx(ctx,()=>{
				const rh=self.getrowheight(),ww=leftwidth+rightwidth;
				const ab=(rid)=>{
					if(isNull(rid))return;
					let wz=self.rowIdMap[rid];
					if(wz==null)return;
					wz=wz-starty;
					let color="";
					if(rid===self.overrow&&!isNull(css.bodyOverBjColor))color=css.bodyOverBjColor;
					else if(rid===currentid)color=css.currentBackgroundColor;
					else {color=wz%2==0?css.dataColor2:css.dataColor1;};
					ctx.clearRect(0,wz*rh,ww,rh);
					if(!isNull(color)){
						ctx.fillStyle=self.getColor(ctx,color,false,0,wz*rh,ww,rh);
						ctx.fillRect(0,wz*rh,ww,rh);
					};
					if(!isNull(css.numberColor)){
						ctx.clearRect(0,wz*rh,fst.width,rh);
						ctx.fillStyle=self.getColor(ctx,css.numberColor,false, 0,wz*rh,fst.width,rh);
						ctx.fillRect(0,wz*rh,fst.width,rh);
					}
				};
				ab(rowid);ab(rowid2);
			});
		 });
	};
	self.rowIdMap={};
	self.getValue=(col,value)=>{
		let v=value;
		catchError(()=>{
			const field=dsData.getField(col.name);
			if(field==null||col==null)return;
			const datatype=field.datatype;
			if(datatype=="int"){
				v=Number(value);
				if(isNaN(v))v=0;
				else v=v.toFixed(0);
			}else if(datatype=="double"){
				v=Number(value);
				if(isNaN(v))v=Number(0).toFixed(field.precision);
				else v=v.toFixed(field.precision);
			}else if(col.type=="select"||col.type=="radiogroup"){
				for(let i=0;i<col.options.length;i++){
					const r=col.options[i];
					if(r.value===value){
						v=r.label;
						break;
					}
				}
			}else if(datatype=="boolean"){
				v=v==="1"||v===1||v==="true"||v===true?true:false;
			}else if(datatype=="date"||datatype=="datetime"){
				v=dsData.getFormatValue(col.name,v);
			};
		});
		return v;
	};
	self.writebodyvalue=(ctx,row,col,stt,isqk,iszx10)=>{
		let iszx=true,iszxqk=false;
		const kyy=row.rowId+"|"+col.name,mp=dsData.getError();
		let qk2=false;
		if(mp[kyy]!=null&&stt.signerror!==true){//标记错误
			qk2=true;
			ctx.clearRect(stt.x1+1,stt.y1+1,col.width-2,stt.height-2);
			if(!isNull(css.errorBjColor)){
				ctx.fillStyle=css.errorBjColor;
				ctx.fillRect(stt.x1+1,stt.y1+1,col.width-2,stt.height-2);
			}
			if(!isNull(css.errorBorderColor)){
				ctx.strokeStyle=css.errorBorderColor;
				ctx.strokeRect(stt.x1+1,stt.y1+1,col.width-2,stt.height-2);
				ctx.strokeStyle=css.borderColor;
			}
			stt.signerror=true;
		}else if(mp[kyy]==null&&stt.signerror){//清空错误
			qk2=true;
			delete stt["signerror"];
			ctx.clearRect(stt.x1,stt.y1,col.width,stt.height);
			ctx.strokeStyle=css.borderColor;
			ctx.strokeRect(stt.x1,stt.y1,col.width,stt.height);
		};
		if(col.name!="$number$")catchError(()=>{
			const userStt={name:col.name,value:stt.value,font:"",color:"",backgroundcolor:"",row:row};
			let isT=setting.executeEvent("initcell",userStt);
			if(!isT){
				if(stt.value!==userStt.value)stt.value=userStt.value;
				const bh=(rst)=>{
					const abc=(tp,sz,st)=>{sz.forEach(s=>{stt[tp+""+s]=st[s];});};
					abc("column",["font","color","backgroundcolor"],rst);
				};
				bh(userStt);
				iszx=false;
			};
			if(isT&&!iszx10)return;
			let backgroundcolor="";
			if(!isNull(stt["columnbackgroundcolor"])){backgroundcolor=stt.columnbackgroundcolor;}
			else if(!isNull(stt["rowbackgroundcolor"])){backgroundcolor=stt.rowbackgroundcolor;};
			if(!isNull(backgroundcolor)){
				if(isqk){
					iszxqk=true;
					ctx.clearRect(stt.x1+1,stt.y1+1,col.width-2,stt.height-2);
				}
				console.log(backgroundcolor)
				ctx.fillStyle=backgroundcolor;
				ctx.fillRect(stt.x1+1,stt.y1+1,col.width-2,stt.height-2);
				ctx.fillStyle=css.bodyColor;
			};
		});
		if(!iszx10&&iszx&&col.name!==stt.target&&!isNull(stt.target))return;
		const h=stt.height;
		if(isqk&&!iszxqk&&!qk2)ctx.clearRect(stt.x1+1,stt.y1+1,col.width-2,h-2);
		if(col.type=="checkbox"){
			const canvas=self.images["checkbox"];
			let xx=stt.x1+spacing;
			if(col.align=="center"){
				xx=stt.x1+Math.floor((col.width-checkboxsize)/2);
			}else if(col.align=="right"){
				xx=stt.x1+col.width-spacing;
			};
			const ist=stt.value===col.onvalue||stt.value==1||stt.value==true?true:false;
			const rd=self.getRatio();
			ctx.drawImage(canvas,
				(ist?19:0)*rd,
				0*rd,
				checkboxsize*rd,checkboxsize*rd,
				xx,
				stt.y1+Math.floor((h-checkboxsize)/2),
				checkboxsize,checkboxsize
			);
			return;
		};
		let font=css.bodyFont,color=css.bodyColor;
		
		if(col.name!="$number$"){
			if(!isNull(stt["columnfont"]))font=stt.columnfont;
			else if(!isNull(stt["rowfont"]))font=stt.rowfont;
			if(!isNull(stt["columncolor"]))color=stt.columncolor;
			else if(!isNull(stt["rowcolor"]))color=stt.rowcolor;
			if(col!=null&&row!=null&&col.type=="link"&&self.overcell==row.rowId+"|"+col.name){
				color=css.linkOverColor;
			};
			if(font!==css.bodyFont){ctx.font=font;};
			if(color!==css.bodyColor)ctx.fillStyle=color;
		};
		let align=col.align,xx=stt.x1+spacing;
		if(align!=="left")ctx.textAlign=align;
		if(align=="center"){
			xx=stt.x1+Math.floor(col.width/2);
		}else if(align=="right")xx=stt.x1+col.width-spacing;
		const title=self.getText(font,col.width,stt.value);
		const yb=Math.floor(h/2)
		ctx.fillText(title,xx,stt.y1+yb+vmiddle);
		if(col.type=="link"&&!isNull(title)){//超链接
			const ww=self.getTextWidth(title,ctx.font);
			let x0=xx;
			if(align=="right"){
				x0=xx-ww;
			}else if(align=="center"){
				x0=xx-Math.floor(ww/2);
			}
			ctx.fillRect(x0,stt.y1+yb+vmiddle+6,ww,1.5);
		};
		if(col.name=="$number$"&&row.state!="n"&&setting.remarkstate){
			 ctx.font="9px sans-serif"
			 ctx.textBaseline = setting.shownumber?"top":"middle";
			 ctx.fillStyle=row.state=="i"?css.insertColor:row.state=="u"?css.modifyColor:css.deleteColor;
			 let xx=stt.x1+col.width-2,yy=stt.y1+3;
			 if(!setting.shownumber){
				ctx.textAlign="center";
				 const ns=setting.columns[0], ncol=setting.getColumn(ns);
				 xx=stt.x1+Math.floor(ncol.width/2);
				 yy=stt.y1+Math.floor(h/2);
			 }else  ctx.textAlign="right";
			 ctx.fillText(row.state=="u"?css.modifytext:row.state=="i"?css.insertText:css.deleteText,xx,yy);
			 ctx.fillStyle=css.bodyColor;
			 ctx.textBaseline = "middle";
			 ctx.font=css.bodyFont;
			 ctx.textAlign="left";
		};
		if(align!=="left")ctx.textAlign="left";
		if(color!==css.bodyColor)ctx.fillStyle=css.bodyColor;
		if(font!==css.bodyFont){ctx.font=css.bodyFont;};
	};
	self.columnport2={};
	self.setport2=(name1,y1,y2,name2)=>{
		for(let i=y1;i<y1+y2;i++){
			self.columnport2[name1+"|"+i]=name2;
		};
	};
	self.createBody=function(){
		if(dsData.rows.length==0||self==null||self["isactive"]==null||!self.isactive())return;
		self.rowpot={};
		self.rowIdMap={};
		self.rowMapPot={};
		self.columnport2={};
		catchError(()=>{
			const ls=dsData.rows.length;
			if(ls==0||setting.columns.length<2)return;
			const looprows=(evt)=>{catchError(()=>{let yy=0,h=self.getrowheight();for(let i=starty;i<=endy;i++){if(i>ls-1)break;evt(i,yy);yy+=h;}});};
			const ctx=self.images["body_ctx"];
			self.drewDx(ctx,()=>{
				ctx.clearRect(0,0,bodywidth,bodyheight);
				ctx.strokeStyle=css.borderColor;
				const maxh=endy>ls?ls:endy;
				const www=leftwidth+rightwidth;
				catchError(()=>{//画边框线
					if(!setting.showline)return;
					let w=0,hh=(maxh-starty)>ls?ls:(maxh-starty),mx=1;
					const rh=self.getrowheight();
					self.loopcolumns((col)=>{
						w+=col.width;
						ctx.moveTo(w,0);
						ctx.lineTo(w,hh*rh);
					});
					const nbw=setting.getColumn("$number$");
					looprows((i,yy)=>{
						if(setting.rowcount>1){
							for(let z=1;z<setting.rowcount;z++){
								const yyy=yy-z*setting.rowheight;
								ctx.moveTo(nbw.width,yyy);
								ctx.lineTo(www,yyy);
							}
						}else{
							ctx.moveTo(0,yy);
							ctx.lineTo(www,yy);
						}
						mx=yy;
					});
					ctx.moveTo(0,mx+rh)
					ctx.lineTo(www,mx+rh);
					if(setting.rowcount>1){
						for(let z=1;z<setting.rowcount;z++){
							const yyy=mx+rh-z*setting.rowheight;
							ctx.moveTo(nbw.width,yyy);
							ctx.lineTo(www,yyy);
						}
					}
				});
				let rowstyle=true;
				ctx.textBaseline = "middle";
				ctx.font=css.bodyFont;
				ctx.fillStyle=css.bodyColor;
				ctx.textAlign="left";
				const bh=(zst,rst)=>{
					const abc=(tp,sz,st)=>{sz.forEach(s=>{zst[tp+""+s]=rowstyle?"":st[s];});};
					abc("row",["font","color","backgroundcolor"],rst);
				};
				const ad=(ctx,col,row,i,yy,w,pcol,rowstt)=>{
					catchError(()=>{
						const name=col.name,key=row.rowId+"|"+name;
						const colh=setting.rowcount>1?col.rowcount*setting.rowheight:setting.rowheight;
						let value=self.getValue(col,isNull(row[name])?"":row[name]);
						if(name==="$number$")value=setting.shownumber?i+1:"";
						const stt={name:name,x1:w,x2:w+pcol.width,y1:yy,value:value,font:css.bodyFont,
										color:css.bodyColor,backgroundcolor:"",height:colh,index:(i+1),target:""};

						bh(stt,rowstt);
						self.rowMapPot[key]=stt;
						self.writebodyvalue(ctx,row,col,stt,false,true);
					});
				};
				looprows((i,yy)=>{//写数据
					catchError(()=>{
						const row=dsData.rows[i];
						if(row==null)return;
						self.rowIdMap[row.rowId]=i;
						self.initrowpot(row.rowId,yy);
						const rowstt={row:row,backgroundcolor:"",color:"",font:"",number:i+1};
						rowstyle=setting.executeEvent("initrow",rowstt);
						let w=0,rowcount=setting.rowcount;
						self.loopcolumns((col)=>{
							const count1=col.rowcount;
							ad(ctx,col,row,i,yy,w,col,rowstt);
							if(rowcount>1){
								let top=yy;
								self.setport2(col.name,top,setting.rowheight*count1,col.name);
								top+=count1*setting.rowheight;
								const arr=col.columns;
								for(let i=0;i<rowcount-count1;i++){
									if(arr!=null&&arr.length>i){
										const ns=arr[i],col2=setting.getColumn(ns);
										if(isNull(ns)||col2==null||!col2.visible)continue;
										col2.width=col.width;
										ad(ctx,col2,row,i,top,w,col,rowstt);
										self.setport2(col.name,top,setting.rowheight,col2.name);
									}
									top+=setting.rowheight;
								};
							};
							w+=col.width;
						});
					});
				});
			});
			if(setting.showline&&setting.rowcount>1){
				self.drewDx(ctx,()=>{
					let mx=0;
					const www=leftwidth+rightwidth;
					const nbw=setting.getColumn("$number$");
					ctx.strokeStyle=css.multiLineColor;
					const rh=self.getrowheight();
					looprows((i,yy)=>{
						ctx.moveTo(0,yy);
						ctx.lineTo(www,yy);							
						mx=yy;
					});
					ctx.moveTo(0,mx+rh);
					ctx.lineTo(www,mx+rh);	
				})
			}
			self.signError();
			const bjctx=self.images["bj_ctx"]
			self.drewDx(bjctx,()=>{//画背景
				bjctx.clearRect(0,0,bodywidth,bodyheight);
				const zw=leftwidth+rightwidth,xhcol=setting.getColumn("$number$"),xhw=xhcol.width,rh=self.getrowheight();
				looprows((i,yy)=>{//写数据
					catchError(()=>{
						let color="",row=dsData.rows[i];
						if(row.rowId===self.overrow&&!isNull(css.bodyOverBjColor))color=css.bodyOverBjColor;
						else if(row.rowId===currentid&&!isNull(css.currentBackgroundColor))color=css.currentBackgroundColor;
						else if(i%2==0&&!isNull(css.dataColor2)){
							color=css.dataColor2;
						}else if(i%2==1&&!isNull(css.dataColor1)){
							color=css.dataColor1;
						};
						if(!isNull(color)){
							bjctx.fillStyle=self.getColor(bjctx,color,false,0,yy,zw,rh);
							bjctx.fillRect(0,yy,zw,rh);
						}
						if(!isNull(css.numberColor)){
							bjctx.clearRect(0,yy,xhw,rh);
							bjctx.fillStyle=self.getColor(bjctx,css.numberColor,false,0,yy,xhw,rh);
							bjctx.fillRect(0,yy,xhw,rh);
						}
					});
				});
			});
		});
	};
	self.setBigBj=function(ctx,x,y,w,h){//大背景
		catchError(function(){
			if(css["bodyBjColor"]==null)return;
			let gradient2=self.getColor(ctx,css.bodyBjColor,false,x,y,w,h);
			ctx.fillStyle=gradient2;
			ctx.fillRect(x,y,w,h);
		});
	};
	/**将缓存数据显示到页面上 */
	self.showHeadImage=(ctx,tp)=>{
		if(setting.length<=1)return;
		let headh=self.getHeadHeight();
		if(headh===0)return;
		if(typeof(tp)=="undefined")tp="";
		const canvas=self.images["head"];
		const ratio=self.getRatio();
		const width2=width;
		const sw=Math.floor(bsx*scrollx);
		if(leftwidth>0&&tp!="hbar"&&tp!="vbar"){//画左边冻结列
			ctx.drawImage(canvas,0,0,(leftwidth+1)*ratio,headh*ratio,0,0,(leftwidth+1),headh);
		};
		if(rightwidth>0&&tp!="vbar"){//画右边
			const ns=setting.columns[startx], col=setting.getColumn(ns);
			const startpot=self.columnpost[col.name];
			if(startpot==null)return;
			let sxx=sw-startpot.x3;
			if(sxx<=0)sxx=0;
			ctx.drawImage(canvas,
				(leftwidth+sxx+1)*ratio,
				0,
				(width2-leftwidth)*ratio,
				headh*ratio,
				leftwidth+1,
				0,
				width2-leftwidth,headh);
		}
	};
	self.showFooterImage=(ctx,tp)=>{
		if(self==null||self["isactive"]==null||!self.isactive()||!setting.showfooter)return;
		if(typeof(tp)=="undefined")tp="";
		catchError(()=>{
			let footh=self.getFooterHeight();
			const canvas=self.images["footer"],ratio=self.getRatio(), width2=width,sw=Math.floor(bsx*scrollx),top=height-(showhbar?barheight:0)-footh;
			if(leftwidth>0&&tp!="hbar"&&tp!="vbar"){//画左边冻结列
				ctx.drawImage(canvas,0,0,(leftwidth+1)*ratio,footh*ratio,0,top,(leftwidth+1),footh);
			};
			if(rightwidth>0&&tp!="vbar"){//画右边
				const ns=setting.columns[startx],col=setting.getColumn(ns);
				const startpot=self.columnpost[col.name];
				if(startpot==null)return;
				let sxx=sw-startpot.x3;
				if(sxx<=0)sxx=0;
				ctx.drawImage(canvas,
					(leftwidth+sxx+1)*ratio,
					0,
					(width2-leftwidth)*ratio,
					footh*ratio,
					leftwidth+1,
					top,
					width2-leftwidth,footh);
			}
		});
	};
	/**画body数据*/
	self.showBodyImage=(ctx,tp)=>{
		if(dsData.rows.length==0||self==null||self["isactive"]==null||!self.isactive())return;
		if(typeof(tp)=="undefined")tp="";
		let headh=self.getHeadHeight();
		let footh=self.getFooterHeight();
		const yy=headh===0?1:headh;
		const hh=height-headh-footh-(showhbar?barheight:0);
		const canvas=self.images["body"],bjcanvas=self.images["bj"];
		const ratio=self.getRatio();
		const width2=width;
		const sw=Math.floor(bsx*scrollx);
		const sh=Math.floor(bsy*scrolly);
		const ypot=sh-starty*self.getrowheight();
		if(leftwidth>0&&tp!="hbar"){
			ctx.drawImage(bjcanvas,0,ypot*ratio,(leftwidth+1)*ratio,hh*ratio,0,yy,leftwidth+1,hh);
			ctx.drawImage(canvas,0,ypot*ratio,(leftwidth+1)*ratio,hh*ratio,0,yy,leftwidth+1,hh);
		};
		if(rightwidth==0)return;
		const ns=setting.columns[startx], col=setting.getColumn(ns);
		const startpot=self.columnpost[col.name];
		if(startpot==null)return;
		let sxx=sw-startpot.x3;
		if(sxx<=0)sxx=0;
		ctx.drawImage(bjcanvas,
			(leftwidth+1+sxx)*ratio,
			ypot*ratio,
			(width2-leftwidth)*ratio,
			hh*ratio,
			leftwidth+1,
			yy,
			width2-leftwidth,
			hh);
		ctx.drawImage(canvas,
			(leftwidth+1+sxx)*ratio,
			ypot*ratio,
			(width2-leftwidth)*ratio,
			hh*ratio,
			leftwidth+1,
			yy,
			width2-leftwidth,
			hh);
	};
	self.executevbarevt=()=>{
		const ctx=self.images["copy_ctx"],canvas=self.images["copy"];
		const ratio=self.getRatio();
		let headh=self.getHeadHeight();
		let h22=self.getFooterHeight()+(showhbar?barheight:0);
		catchError(()=>{
			const yz=Math.floor(scrolly*bsy);
			const rowheight=self.getrowheight();
			const xh=Math.floor(yz/rowheight);//显示开始
			const ht=height-headh;
			const xs=Math.floor(ht/rowheight);
			if(xh<starty||xh+xs>endy){self.loadbody();};
		});
		self.drewDx(ctx,()=>{
			ctx.clearRect(0,headh,width-1,height-headh-h22);
			self.setBigBj(ctx,0,headh,width-1,height-headh-h22);
			self.showBodyImage(ctx,"vbar");
			self.createhbar(ctx);
			self.createvbar(ctx);
		})
		self.drewDx(targetCtx,()=>{
			targetCtx.clearRect(0,0,width,height);
			targetCtx.drawImage(canvas,0,0,width*ratio,height*ratio,0,0,width,height);
		});
	};
	self.executehbarevt=()=>{
		const ctx=self.images["copy_ctx"],canvas=self.images["copy"];
		const ratio=self.getRatio();
		catchError(()=>{
			const wz=Math.floor(scrollx*bsx);
			const ns1=setting.columns[startx];
			const ns2=setting.columns[endx];
			const col1=setting.getColumn(ns1);
			const col2=setting.getColumn(ns2);
			const startpot=self.columnpost[col1.name];
			const endpot=self.columnpost[col2.name];
			if(endpot==null||startpot==null)return;
			const min=startpot.x3, max=endpot.x3+col2.width;
			if(wz<min||wz+width>max){
				self.loadshowcolumn();
				self.createHead();
				self.createBody();
				self.createFooter();
			};
		});
		self.drewDx(ctx,()=>{
			ctx.clearRect(leftwidth+1,1,width-leftwidth-1,height);
			self.setBigBj(ctx,leftwidth+1,1,width-leftwidth-1,height);
			self.showHeadImage(ctx,"hbar");
			self.showBodyImage(ctx,"hbar");
			self.showFooterImage(ctx,"hbar");
			self.createhbar(ctx);
			self.createvbar(ctx);
		});
		self.drewDx(targetCtx,()=>{
			targetCtx.clearRect(0,0,width,height);
			targetCtx.drawImage(canvas,0,0,width*ratio,height*ratio,0,0,width,height);
		});
	};
	self.loadingts=null;
	//将数据显示到界面上
	self.refresh=(tp)=>{
		if(self==null||self["isactive"]==null||!self.isactive())return;
		if(typeof(tp)=="undefined")tp="";
		const ctx=self.images["copy_ctx"],canvas=self.images["copy"];
		const ratio=self.getRatio();
		self.drewDx(ctx,()=>{
			if(tp==="currentrow"||tp==="cleardata"){
				let headh=self.getHeadHeight();
				ctx.clearRect(0,headh,width,height-headh);
				self.setBigBj(ctx,0,headh,width,height-headh);
				if(tp!=="cleardata")self.showBodyImage(ctx,tp);
				self.showFooterImage(ctx);
				self.createhbar(ctx);
				self.createvbar(ctx);
				return;
			};
			ctx.clearRect(0,0,width,height);
			self.setBigBj(ctx,0,0,width,height);
			self.showHeadImage(ctx,tp);
			self.showBodyImage(ctx,tp);
			self.showFooterImage(ctx,tp);
			self.createhbar(ctx);
			self.createvbar(ctx);
		});
		if(height==0||width==0)return;
		self.drewDx(targetCtx,()=>{
			targetCtx.clearRect(0,0,width,height);
			targetCtx.drawImage(canvas,0,0,width*ratio,height*ratio,0,0,width,height);
		});
	};
	self.executeActive=()=>{
		self.initSetting();
		dsData.getRows();
		self.setLine();
		self.createImage();
		self.chagesize(self.oldsize.width,self.oldsize.height);
		self.initGridWidth();//获得总宽度
		self.loadshowcolumn();//获得冻结宽度，
		self.initbarattrs();//
		self.createHead();
		const rr=dsData.getCurrent();
		currentid=rr==null||rr["rowId"]==null?"":rr.rowId;
		self.loadbody();
		self.createFooter();
		self.refresh();
	};
	self.isactive=()=>{return self.state=="active";};
	self.oldcolumns=[];
	self.changeState=function(){
		if(self.state=="none"&&actived===true){//第一次激活 只执行一次
			self.state="active";
			window.addEventListener("keydown",self.keydown);
			self.mouseclick();//鼠标单击事件
			self.mousedown();//鼠标按下事件
			self.mousewheel();//鼠标滚轮事件
			self.bindmousemove();//鼠标移动事件
			//if(setting.savesetting)self.oldcolumns=eval("("+JSON.stringify(setting.columns)+")")
			self.executeActive();
			self.oldratio=self.getRatio();
		}else if(self.state==="active"&&!actived){//休眠状态
			self.state="sleep";
			self.executeSleep();
		}else if(self.state=="sleep"&&actived){//休眠到激活状态
			self.state="active";
			self.executeActive();
		}
	};
	self.executeSleep=()=>{
		clearInterval(self.loadingts);
		self.closeEditor();
		catchError(()=>{
			self.oldratio=-1;
			positons={};
			self.columnpost={};
			self.movewidthpots={};
			self.images={};
			self.headpot={};
			self.overrow="";
			self.movecolname="";
			self.gridwz=null;
			self.overcell=null;
			self.sortfield={};
			self.editorParam=null;
			self.moverowparams={};
			self.changeposition={};
			self.rowpot={};
			self.rowMapPot={};
			self.columnport2={};
			self.rowIdMap={};
		});
		targetCtx.clearRect(0,0,width,height);
		self.attr(node,{width:10,height:10});
		catchError(()=>{for(let k in self.imagesnames){if(self.images[k]==null)continue;self.images[k]=null;self.images[k+"_ctx"]=null;};self.images={};});
	};
	//时时获取表格状态 ---表格开始
	self.stateTime=null;
	self.begin=()=>{
		catchError(()=>{
			const ps=gridNode.getBoundingClientRect();
			let state=true;
			let ishidden=gridNode.getAttribute("ishidden");
			const ww=Math.floor(ps.width),hh=Math.floor(ps.height);
			if(ww===0||hh===0||ishidden==="true"){state=false;}
			if(state){
				if(ww>0&&hh>0&&(self.oldsize.width!==ww||self.oldsize.height!=hh)){
					self.oldsize={width:ww,height:hh};
					if(self.state=="active"){
						self.closeEditor();
						self.chagesize(ww,hh);
						self.refresh();
					};
				}
			};
			if(state!==actived){
				actived=state;
				self.changeState();
			}
		});
		self.stateTime=window.requestAnimationFrame(self.begin);
	};
	self.stopdraw=true;
	self.drawingevt=function(){};
	self.drawing=()=>{
		if(self.stopdraw){return;};
		catchError(()=>{
			self.drawingevt();
			window.requestAnimationFrame(self.drawing);
		});
		if(self.stopdraw){return;};
	};
	self.remarkmovehead=()=>{//

	};
	dsData.addEvent("aftersort",(p)=>{
		if(self==null||self["isactive"]==null||!self.isactive())return;
		const sort=p.sort,mp={};
		const sz=sort.split(",");
		let istt=false;
		sz.forEach(s=>{
			const str=s.replace("+","").replace("-","").trim();
			if(!isNull(str)){
				mp[str]=s.indexOf("-")==-1?"asc":"desc";
				if(setting.getColumn(str)!=null){
					istt=true;
				}
			}
		});
		self.setAutoSize();
		if(istt){self.sortfield=mp;self.createHead();};
		self.createBody();
		self.refresh();
	});
	dsData.addEvent("afterchange",function(p){
		catchError(()=>{
			if(self==null||self["isactive"]==null||!self.isactive())return;
			const row=p.row,name=p.name,value=p.value;
			if(p==null||row==null||self.rowIdMap[row.rowId]==null)return;
			self.setValue(row,name,value);
		});
	});
	const retable=(isT)=>{
		catchError(()=>{
			if(self==null||self["isactive"]==null||!self.isactive())return;
			self.setAutoSize();
			self.initbarattrs();
			if(isT&&showvbar){
				scrolly=height-(showhbar?barheight:0)-vbarheight;
			};
			self.loadbody();
			self.refresh();
		});
	};
	dsData.addEvent("rowstatechange",function(p){
		if(p.value=="d"||p.oldvalue=="d")retable(false);
	});
	dsData.addEvent("afterinsert",function(p){
		retable(p.position==-1);
	});
	dsData.addEvent("afterdelete",function(){retable(false);});
	dsData.addEvent("afterclearrow",function(){retable(false);});
	dsData.addEvent("rowdRaggable",()=>{retable(false);});
	dsData.addEvent("attr",(p)=>{
		catchError(()=>{
			if(self==null||self["isactive"]==null||!self.isactive())return;
			if(p.attrname=="selectall"){
				const ctx=self.images["head_ctx"];
				const stt=self.headpot["select"];
				const col=setting.getColumn("select");
				if(ctx==null||stt==null||col==null)return;
				self.drewDx(ctx,()=>{self.createTh(ctx,col,stt,stt.x1,stt);});
				self.refresh();
			};
		})
	});
	dsData.addEvent("aftercleardata",function(){catchError(()=>{if(self==null||self["isactive"]==null||!self.isactive())return;self.setAutoSize();currentid="";scrolly=0;self.overcell=null;self.refresh("cleardata");});});
	dsData.addEvent("rowRaggable",()=>{;catchError(()=>{;self.createBody();;self.refresh();;});});
	dsData.addEvent("afterrowchange",function(p){
		if(self==null||self["isactive"]==null||!self.isactive())return;
		const rowid=p.row==null?"":p.row.rowId;
		if(currentid===rowid)return;
		const oldid=currentid;
		currentid=rowid;
		if(dsData.rows.length==0)return;
		if(isNull(css.currentBackgroundColor))return;
		 self.changerowremark(oldid,rowid);
		 self.refresh("currentrow");
	});
	dsData.addEvent("afterquery0",function(){
		if(self.sortfield!=null){
			self.sortfield=null;
			self.createHead();
		};
		//scrollx=
		scrolly=0;
		try{self.closeEditor();}catch(e){}
	});
	self.ddmax=null;
	dsData.addEvent("afterpushdata",()=>{
		catchError(()=>{
			if(self==null||self["isactive"]==null||!self.isactive())return;
			starty=0;endy=0;scrolly=0;
			//scrollx=0;
			currentid="";
			if(setting.dataheight){self.chagesize(self.oldsize.width,self.oldsize.height);};
			self.initbarattrs();
			const rr=dsData.getCurrent();
			currentid=rr==null?"":rr.rowId;
			self.loadbody();
			self.refresh("pushdata");
		});
	});
	setting.addEvent("attr",(p)=>{if(self.state!="active"){return;};self.changeGridAttr(p);});
	setting.addEvent("changecolumn",()=>{catchError(()=>{if(self==null||self["isactive"]==null||!self.isactive())return;self.loadshowcolumn();self.createHead();self.createBody();self.createFooter();self.refresh();})});
	//行状态变化事件
	dsData.addEvent("aftercheck",()=>{
		dsData.errorsort=showvbar;
		if(scrolly>0){
			scrolly=0;
			self.executevbarevt();
		}
	});
	dsData.addEvent("rowstatechange",function(p){
		if(self==null||self["isactive"]==null||!self.isactive()||!setting.remarkstate)return;
		catchError(()=>{
			const row=p.row,name="$number$",id=self.rowIdMap[row.rowId];
			if(p==null||row==null||id==null)return;
			const stt=self.rowMapPot[row.rowId+"|$number$"];
			self.setValue({rowId:row.rowId,state:p.value},name,stt.value);
		});
	});
	grid.destroyed=()=>{
		clearInterval(self.loadingts);
		self.closeEditor();
		window.removeEventListener("keyup",self.bindEvent_keydown);
		window.cancelAnimationFrame(self.stateTime);
		document.removeEventListener("mousemove",self.outTable);
		document.removeEventListener("mousedown",self.outTableClick);
		window.removeEventListener("keydown",self.keydown);
		catchError(()=>{for(const k in self){self[k]=null;}});
	};
	grid.closeEditor=()=>{self.closeEditor();};
	grid.selected=(item)=>{
		catchError(()=>{
			const p=self.editorParam;
			if(p==null||dsData.rows.length==0)return;
			const r=p.row;
			const rr={rowId:r.rowId};
			if(r[p.name]===item.value)return;
			rr[p.name]=item.value;
			dsData.set(rr);
		});
	};
	setting.addEvent("refresh",()=>{
		if(self==null||self["isactive"]==null||!self.isactive())return;
		self.initSetting();
		self.initGridWidth();//获得总宽度
		self.loadshowcolumn();//获得冻结宽度，
		self.initbarattrs();//
		self.createHead();
		const rr=dsData.getCurrent();
		currentid=rr==null||rr["rowId"]==null?"":rr.rowId;
		self.loadbody();
		self.createFooter();
		self.refresh();
	});
	dsData.addEvent("initfooter",(p)=>{
		if(setting.footer.length>0)return;
		catchError(()=>{
			if(self==null||typeof(self.createFooter)!="function"||typeof(self.refresh)!="function")return;
			self.createFooter();
			self.refresh();
		})
	});
	//处理下拉框事件
	if(!isNull(setting.dropdown)&&setting.dropdown["addEvent"]!=null){
		setting.dropdown.addEvent("executeopen",(params)=>{
			try{
				if(params==null||params.maxheight==null||self==null)return;
				const maxheight=params.maxheight,leftwidth=params.leftwidth,rightwidth=params.rightwidth;
				const height1=params.height1,height2=params.height2;
				const zhh=self.getHeadHeight()+self.getFooterHeight()+self.getrowheight()*dsData.rows.length+2;
				const minwidth=params.minwidth;
				const multi=params.multi;
				self.initGridWidth();
				let showheight=zhh>maxheight?maxheight:zhh,isdown=true;
				if(showheight<=height2){
					isdown=true;
				}else if(showheight>height2&&showheight<=height1){
					isdown=false;
				}else{
					isdown=height2>height1;
					showheight=height2>height1?height2:height1
				};
				let tz=(zhh>showheight?barwidth+2:2)+totalwidth;
				let w1=minwidth>tz?minwidth:tz;
				let w3=w1,isright=true;
				if(w1<rightwidth){
					isright=true;
				}else if(w1>rightwidth&&w1<leftwidth){
					isright=false;
				}else if(w1>rightwidth&&w1>leftwidth){
					isright=rightwidth>leftwidth;
					w3=rightwidth>leftwidth?rightwidth:leftwidth;
				};
				let iszx=height!==showheight||width!=w3;
				height=showheight-(multi&&zhh>maxheight?50:0);
				width=w3-2;
				self.oldsize={width:width,height:height};
				self.setsize(2);
				if(self!=null&&self.isactive()&&iszx){
					self.chagesize(width,height);
					self.loadshowcolumn();
					self.refresh();
				};
				params.height=showheight;
				params.isdown=isdown;
				params.isright=isright;
				params.width=w3;
			}catch(e){}
		});
	};
	setting.addEvent("attr",(p)=>{
		if(self==null||self["isactive"]==null||!self.isactive())return;
		if(p.attrname=="maxheight"&&setting.dataheight&&setting.dropdown!=null){
			self.chagesize(self.oldsize.width,self.oldsize.height);
			self.initbarattrs();
			const rr=dsData.getCurrent();
			currentid=rr==null?"":rr.rowId;
			self.loadbody();
			self.refresh("pushdata");
		}
	});
	setting.addEvent("afterattr",(p)=>{
		if(self==null||self["isactive"]==null||!self.isactive())return;
		if(p.columns!=null||p.head!=null){
			dsData.getRows();
			self.initGridWidth();//获得总宽度
			self.loadshowcolumn();//获得冻结宽度，
			self.initbarattrs();//
			self.createHead();
			const rr=dsData.getCurrent();
			currentid=rr==null||rr["rowId"]==null?"":rr.rowId;
			self.loadbody();
			self.createFooter();
			self.refresh();
		}
	})
	dsData.addEvent("beforelink",()=>{targetCtx.clearRect(0,0,width,height);});
	self.signError=()=>{
		catchError(()=>{
			const map=dsData.getError();
			if(map==null)return;
			const ctx=self.images["body_ctx"];
			let iszx=false;
			self.drewDx(ctx,()=>{
				ctx.strokeStyle=css.errorBorderColor;
				for(let k in map){
					const stt=self.rowMapPot[k];
					if(stt==null)continue;
					iszx=true;
					const col=setting.getColumn(stt.name);
					const rowid=k.split("|")[0];
					const row=dsData.getRowById(rowid);
					ctx.textBaseline = "middle";
					ctx.font=css.bodyFont;
					ctx.fillStyle=css.bodyColor;
					ctx.textAlign="left";
					self.writebodyvalue(ctx,row,col,stt,true,true);
				};
			});
			if(!iszx)return;
			self.refresh();
		});
	};
	dsData.addEvent("aftercheck",(p)=>{
		if(self==null||self["isactive"]==null||!self.isactive())return;
		self.signError();
	});
	grid.changeStyle=()=>{
		catchError(()=>{
			css=view.css;
			if(self.state==="none")return;
			self.setLine();
			self.createcheckbox();
			self.createHead();
			self.createBody();
			self.createFooter();
			self.refresh();
		});
	};
	//-------------------
	setTimeout(()=>{self.begin();},10);
	return grid;
};
export {
	Grid
};
export default {};
