'use strict'
function Navigation(view){
   const self={},setting=view.navmenu,nav={};
   const node=document.querySelector("#"+view.id+"_canvas");
   self.stopRightClick=function(ndd){ndd.oncontextmenu = function(){event.returnValue = false;}; ndd.oncontextmenu = function(){return false;}};
	self.stopRightClick(node);
   const navNode=document.querySelector("#"+view.id);
   const isNull=(s)=>{if(typeof(s)=="undefined"||s==null||s==="")return true;return false;};
   const catchError=(evt)=>{try{evt();}catch(e){console.error(e)}};
   let scrollx=0;
   let css={
      font:"14px sans-serif",
      color:"black",
      barBackgroundColor:"",
      backgroundcolor:"rgb(220,220,220,0.5)",
      activeColor:"white",
      activeBackgroundColor:"black",
      overcolor:"#A8A8A8",
      overBackgroundColor:"transparent"
   };
   if(view.css!=null&&view.css[setting.style]!=null)css=view.css[setting.style];
   self.images={};
	self.imagesnames={};
   self.createImage=()=>{
		const ab=(n)=>{self.imagesnames[n]=n;const img=document.createElement("canvas");self.images[n]=img;self.images[n+"_ctx"]=img.getContext("2d");};
      ab("copy");
	};
   const targetCtx=node.getContext("2d");
   let width=0,height=0,bodywidth=0;
   self.attr=(n,p)=>{catchError(()=>{for(const k in p){n[k]=p[k];}})};
   self.css=(n,p)=>{catchError(()=>{for(const k in p){n.style[k]=p[k];}})};
   //获取设备分辨率
	self.getRatio=function getPixelRatio() {return (window.devicePixelRatio  ||  1) /(targetCtx.webkitBackingStorePixelRatio  || targetCtx.mozBackingStorePixelRatio  || targetCtx.msBackingStorePixelRatio  || 	targetCtx.oBackingStorePixelRatio  || targetCtx.backingStorePixelRatio  ||  1);};
   self.resize=()=>{
      width=self.oldsize.width;
      height=self.oldsize.height;
      const ratio=self.getRatio();
      self.attr(node,{width:Math.floor(width*ratio),height:Math.floor(height*ratio)});
      targetCtx.scale(ratio,ratio);
      self.css(node,{width:width+"px",height:height+"px"});
      if(bodywidth<width*2){
         bodywidth=Math.ceil(width*2);
         self.setWidth();
      };
   };
   self.setWidth=()=>{
      const ratio=self.getRatio(),height=self.oldsize.height;;
      self.attr(self.images["copy"],{width:Math.floor(bodywidth*ratio),height:Math.floor(height*ratio)});
      self.css(self.images["copy"],{width:bodywidth+"px",height:height+"px"});
      self.images["copy_ctx"].scale(ratio,ratio);
   }
   self.getColor=(ctx,color,y,h)=>{
		if(isNull(color))return "black";
		else if(color.indexOf(";")==-1)return color;
		const sz=color.split(";");
		let gradient=ctx.createLinearGradient(0,y,0,y+h);
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
   self.pots={};
   self.position={};
   let showbar=false;
   const barwidth=18;
   self.setPots=(name,x,width,i,max)=>{
      const yb=Math.floor(setting.spacing/2);
      let from=i==0?x:x-(setting.spacing<0?yb:0)
      let end=x+width-(setting.spacing<0&&i!=max?yb:0);
      for(let i=from;i<end;i++){self.pots["p"+i]=name;};
   };
   let navwidth=0;
   self.refresh=()=>{
      self.pots={};self.position={};
      const ctx=self.images["copy_ctx"],canvas=self.images["copy"];
      const ratio=self.getRatio();
      navwidth=0;
      catchError(()=>{
         ctx.clearRect(0,0,bodywidth,height);
         if(!isNull(css["barBackgroundColor"])){
            ctx.fillStyle=self.getColor(ctx,css.barBackgroundColor,0,height);
            ctx.fillRect(0,0,bodywidth,height);
          };
         const arr=setting.getMenuList();
         if(arr==null||arr.length==0)return;
         const spacing=setting.spacing;
         let ww=2;
         const ab=()=>{
            for(let i=0;i<arr.length;i++){const name=arr[i],stt=self.menus[name]; if(stt==null)return; ww+=stt.width+(i<arr.length-1?spacing:0);};
         };
         ab();
         showbar=ww>width;
         if(ww>bodywidth){ bodywidth=ww;self.setWidth();};
         navwidth=ww;
         if(!showbar)scrollx=0;
         let w=2,cq=setting.current(),h=setting.height,maxls=arr.length-1;
         for(let i=0;i<arr.length;i++){
            const name=arr[i],stt=self.menus[name];
            if(stt==null)return;
            const canvas2=stt.node,ist=cq==name;
            const isov=name===self.over;
            if(!ist&&!isov){
               ctx.drawImage(canvas2,0,0, stt.width*ratio,h*ratio, w,0, stt.width,h);
               if(setting.style==="style3"&&i>0){
                  const nt=arr[i-1];
                  if(nt!==self.over&&nt!==cq){
                     ctx.fillStyle=css.color;
                     const tz=Math.floor((setting.spacing<0?setting.spacing*-1:0)/2);
                     ctx.fillRect(w+tz,10,1,h-20);
                  };
               }
            };
            self.position[name]={x:w,width:stt.width};
            self.setPots(name,w,stt.width,i,maxls);
            w+=stt.width+(i<arr.length-1?spacing:0);
         };
         catchError(()=>{
            if(isNull(self.over)||self.over===cq)return;
            const stt=self.menus[self.over];
            if(stt==null)return;
            const pt=self.position[self.over];
            const canvas2=stt.node;
            ctx.drawImage(canvas2,0,(h+1)*2*ratio, stt.width*ratio,h*ratio, pt.x,0, stt.width,h);
         });
         catchError(()=>{
            if(cq=="")return;
            const stt=self.menus[cq];
            if(stt==null)return;
            const pt=self.position[cq];
            const canvas2=stt.node;
            ctx.drawImage(canvas2,0,(h+1)*ratio, stt.width*ratio,h*ratio, pt.x,0, stt.width,h);
         });
      });
      catchError(()=>{
         targetCtx.clearRect(0,0,width,height);
         const wz=showbar?barwidth:0;
         const w=width-wz*2;
         targetCtx.drawImage(canvas,
            Math.floor(scrollx*ratio),
            0,
            w*ratio,
            height*ratio,
            wz,
            0,
            w,
            height
         );
         self.drewbar();
      });
      self.autoScroll();
   };
   self.drewbar=()=>{
      if(!showbar)return;
      const h=setting.height;
      targetCtx.save();
      const color1=self.overbar=="before"&&!isNull(css.overBackgroundColor)?css.overBackgroundColor:css.buttonBackgroundColor;
      const color2=self.overbar=="after"&&!isNull(css.overBackgroundColor)?css.overBackgroundColor:css.buttonBackgroundColor;
      if(!isNull(color1)){
         targetCtx.fillStyle=color1;
         targetCtx.fillRect(0,0,barwidth,h);
      };
      if(!isNull(color2)){
         targetCtx.fillStyle=color2;
         targetCtx.fillRect(width-barwidth,0,barwidth,h);
      };
      targetCtx.textBaseline = "middle";
      targetCtx.font="12px sans-serif";
      targetCtx.textAlign="center";
      targetCtx.fillStyle=self.overbar=="before"&&!isNull(css.overColor)?css.overColor:css.color;
      targetCtx.fillText("◀",Math.floor(barwidth/2),Math.floor(h/2));
      targetCtx.fillStyle=self.overbar=="after"&&!isNull(css.overColor)?css.overColor:css.color;
      targetCtx.fillText("▶",width-Math.floor(barwidth/2),Math.floor(h/2));
      targetCtx.restore();
   };
   self.autoScroll=()=>{
      if(!showbar){scrollx=0;return;};
      catchError(()=>{
         const cq=setting.current(),stt=self.position[cq];
         if(stt==null)return;
         let bh=scrollx;
         if(stt.x-scrollx<0){
            bh=stt.x;
            if(bh<0)bh=0;
         }else if(stt.x+stt.width-scrollx+2>width-barwidth*2){
            bh=stt.x+stt.width-(width-2*barwidth)+2;
         };
         if(bh===scrollx)return;
         self.executescroll(bh);
      });
   };
   self.tss2=null;
   self.bg=0;self.end=0,self.oldscrollx=0;
   self.executescroll=function(bh){
     if(self.tss2!=null)window.cancelAnimationFrame(self.tss2);
      self.tss2=null;
      self.bg=0;self.end=bh;
      self.oldscrollx=scrollx;
      self.drawing();
      scrollx=bh;
   };
   self.drawing=function(){
      const bhv=self.end-self.oldscrollx;
      const v2=Math.abs(bhv);
      if(self.bg>=v2)return;
      let v=10;
      if(self.bg+v>v2){self.bg=v2;}else self.bg+=v;
      catchError(()=>{
         const  canvas=self.images["copy"],ratio=self.getRatio(),height=setting.height;
         const w=width-2*barwidth,sx=self.oldscrollx+(bhv<0?-1:1)*self.bg;
         targetCtx.clearRect(barwidth,0,width,height);
         targetCtx.drawImage(canvas,
            Math.floor(sx*ratio),
            0,w*ratio,height*ratio,
            barwidth,0,w,height);
         self.drewbar();
      });
      window.requestAnimationFrame(self.drawing);
   };
   self.clickEvt=(tp)=>{
      if(!showbar)return;
      catchError(()=>{
         const arr=setting.getMenuList();
         if(arr==null||arr.length<=1)return;
         const cq=setting.current();
         let ns="";
         for(let i=0;i<arr.length;i++){
            const ns2=arr[i];
            if(cq===ns2){
               if(tp=="before"&&i>0){
                  ns=arr[i-1]
               }else if(tp=="after"&&i<arr.length-1){
                  ns=arr[i+1];
               }
               break;
            }
         };
         if(ns=="")return;
         setting.active(ns);
      });
   };
   self.over="";
   self.overbar="";
   self.overout=function(){catchError(()=>{if(isNull(self.over))return; self.over="";node.style.cursor="default"; self.executeover();});};
   self.overinbar=(tp)=>{
      if(tp===self.overbar)return;
      self.overbar=tp;
      self.executeoverbar(tp);
   };
   self.executeoverbar=(tp)=>{
      if(!showbar)return;
      self.drewbar();
   };
   self.overoutbar=()=>{
      if(isNull(self.overbar))return;
      const oldv=self.overbar;
      self.overbar="";
      self.executeoverbar(oldv);
   };
   self.ps=null;
   self.overint=function(ns){
      self.overbar="";
      if(ns===self.over)return;
      self.over=ns;
      node.style.cursor="pointer";
      self.executeover();
   };
   self.outMu=function(e){
      catchError(()=>{
         if(self.ps==null)return;
         const x=e.pageX,y=e.pageY;
         if(self.ps.left<=x&&x<=self.ps.left+width&&y>=self.ps.top&&y<=self.ps.top+setting.height){ 
         }else{
            self.overout(); 
            self.overoutbar();
         }
      });
   };
   self.executeover=()=>{
      catchError(()=>{
         if(css==null||(isNull(css.overColor)&&isNull(css.overBackgroundColor)))return;
         self.refresh();
      })
   };
   document.addEventListener("mousemove",self.outMu);
   self.clickparam={name:""};
   self.getXpot=function(x){
      if(showbar){
         return Math.abs(scrollx)+x-barwidth;
      }else return x;
   };
   self.bindEvt=()=>{
      node.onmousemove=function(e){
         self.ps=node.getBoundingClientRect();
         const x=Math.floor(e.offsetX);
         if(showbar&&x<barwidth){
            node.style.cursor="pointer";
            self.overinbar("before");
            self.overout();
         }else if(showbar&&x>width-barwidth){
            node.style.cursor="pointer";
            self.overinbar("after");
            self.overout();
         }else{
            const name=self.pots["p"+self.getXpot(x)];
            if(name==null){self.overout();}else{self.overint(name);};
         };
      };
      node.onmousedown=function(e){
         catchError(()=>{
            const x=Math.floor(e.offsetX);
            if(showbar&&x<barwidth){
               self.clickEvt("before");
               return;
            }else if(showbar&&x>width-barwidth){
               self.clickEvt("after");
               return ;
            };
            const name=self.pots["p"+self.getXpot(x)];
            if(name==null)return;
            setting.active(name);
            if(self.clickparam.name===name){
               const ts=new Date().getTime()-self.clickparam.time;
               if(ts<300){setting.close(name); self.clickparam={name:""}; return;};
            };
            self.clickparam={name:name,time:new Date().getTime()};
         });
      };
   };
   nav.destroyed=()=>{
      catchError(()=>{
         clearTimeout(self.ts);
         if(self.tss2!=null)window.cancelAnimationFrame(self.tss2);
         document.removeEventListener("mousemove",self.outMu);
         window.cancelAnimationFrame(self.stateTime); 
         for(let k in self){self[k]=null;};
      });
   };
   self.changeState=function(){
		if(self.state=="none"&&actived===true){//第一次激活 只执行一次
         self.state="active";
         self.bindEvt();
         self.createImage();
         self.executeActive();
		}else if(self.state==="active"&&!actived){//休眠状态
			self.state="sleep";
			self.executeSleep();
		}else if(self.state=="sleep"&&actived){//休眠到激活状态
			self.state="active";
			self.executeActive();
		}
   };
   self.executeSleep=()=>{
      bodywidth=0;
      self.attr(self.images["copy"],{width:0,height:0});
      self.attr(node,{width:0,height:0});
      self.css(self.images["copy"],{width:"0px",height:"0px"});
      self.css(node,{width:"0px",height:"0px"});
   };
   self.executeActive=()=>{
      self.resize();
      self.refresh();
   };
   self.getTextWidth=function(text){targetCtx.font=css.font;return Math.ceil(targetCtx.measureText(text).width);};
   self.stateTime=null;
   self.state="none";
   let actived=false;
   self.changesize=()=>{self.executeActive(); };
   self.oldsize={width:0,height:0};
   self.menus={};
   self.drawRoundedRect=(ctx,color,x, y, width, height, r, fill,stroke)=> {
      ctx.save(); ctx.beginPath();
      ctx.fillStyle=color;
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + r, r); 
      ctx.arcTo(x + width, y + height, x + width, y + height, 0); 
      ctx.arcTo(x, y + height, x, y + height, 0);
      ctx.arcTo(x, y, x + r, y, r);
      if (fill) { ctx.fill(); }
      if (stroke) { ctx.stroke(); }
      ctx.restore(); 
  };
   self.drewStyle1=(ctx,map)=>{
      const h=setting.height,radius=css.radius;
      const color1=self.getColor(ctx,css.backgroundColor,0,h);
      const color2=self.getColor(ctx,css.activeBackgroundColor,h+1,h);
      const color3=self.getColor(ctx,css.overBackgroundColor,(h+1)*2,h);
      self.drawRoundedRect(ctx,color1,0,0,map.width,h,radius,true,false);
      self.drawRoundedRect(ctx,color2,0,h+1,map.width,h,radius,true,false);
      self.drawRoundedRect(ctx,color3,0,(h+1)*2,map.width,h,radius,true,false);
      const label=map.label;
      const x0=Math.ceil(map.width/2),y=Math.ceil(h/2);
      ctx.fillStyle=css.color;
      ctx.fillText(label,x0,y);
      ctx.fillStyle=css.activeColor;
      ctx.fillText(label,x0,y+h+1);
      ctx.fillStyle=css.overColor;
      ctx.fillText(label,x0,y+h*2+2);
   };
   self.drawRect2=(ctx,color,x, y, w, h, r, fill,stroke)=>{
      let  slope=css.slope;
      if(typeof(slope)!="number")slope=r;
      ctx.save(); ctx.beginPath();
      ctx.fillStyle=color;
      ctx.moveTo(x + slope, y);
      ctx.arcTo(x + w-slope, y, x + w-slope, y + r, r); 
      ctx.arcTo(x + w, y + h, x + w, y + h, 0); 
      ctx.arcTo(x, y + h, x, y + h, 0);
      ctx.arcTo(x+slope, y, x +slope+w, y, r);
      if (fill) { ctx.fill(); }
      if (stroke) { ctx.stroke(); }
      ctx.restore(); 
  };
   self.drewStyle2=(ctx,map)=>{
      const r=css.radius,w2=map.textwidth+2*setting.padding+r*2,h=setting.height;
      const color1=self.getColor(ctx,css.backgroundColor,0,h);
      const color2=self.getColor(ctx,css.activeBackgroundColor,h+1,h);
      const color3=self.getColor(ctx,css.overBackgroundColor,(h+1)*2,h);
      self.drawRect2(ctx,color1,0,0,map.width,h,r,true,false);
      self.drawRect2(ctx,color2,0,h+1,map.width,h,r,true,false);
      self.drawRect2(ctx,color3,0,(h+1)*2,map.width,h,r,true,false);
      const label=map.label;
      const x0=Math.ceil(w2/2),y=Math.ceil(h/2);
      ctx.fillStyle=css.color;
      ctx.fillText(label,x0,y);
      ctx.fillStyle=css.activeColor;
      ctx.fillText(label,x0,y+h+1);
      ctx.fillStyle=css.overColor;
      ctx.fillText(label,x0,y+h*2+2);
   };

   self.drawRoundedRect3=(ctx,color,x, y, w, h, r, fill,stroke)=> {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle=color;
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r); 
      ctx.arcTo(x + w, y + h, x + w, y + h, 0); 
      ctx.arcTo(x + w, y + h, x + w, y + h, 0); 
      ctx.arcTo(x, y + h, x, y + h, r);
      ctx.arcTo(x, y, x + r, y, r);
      if (fill) { ctx.fill(); };
      if (stroke) {ctx.stroke();};
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle=color;
      ctx.arc(x+w+r,y+h-r,r, Math.PI * 1 / 2, Math.PI);
      ctx.lineTo(x+w,y+h-r);
      ctx.lineTo(x+w,y+h);
      ctx.lineTo(x+w+r,y+h);
      ctx.arc(x-r,y+h-r,r, 0, Math.PI * 1 / 2);
      ctx.lineTo(x-r,y+h);
      ctx.lineTo(x,y+h);
      ctx.lineTo(x,y+h-r);
      if (fill) { ctx.fill(); };
      if (stroke) {ctx.stroke();};
      ctx.restore();
      ctx.closePath();
  };

   self.drewStyle3=(ctx,map)=>{
      const r=css.radius,w2=map.width,h=setting.height;
      const color1=self.getColor(ctx,css.backgroundColor,0,h);
      const color2=self.getColor(ctx,css.activeBackgroundColor,h+1,h);
      const color3=self.getColor(ctx,css.overBackgroundColor,(h+1)*2,h);
      self.drawRoundedRect3(ctx,color1,r,0,map.width-r*2,h,r,true,false);
      self.drawRoundedRect3(ctx,color2,r,h+1,map.width-r*2,h,r,true,false);
      self.drawRoundedRect3(ctx,color3,r,(h+1)*2,map.width-r*2,h,r,true,false);
      const label=map.label;
      const x0=Math.ceil(w2/2),y=Math.ceil(h/2);
      ctx.fillStyle=css.color;
      ctx.fillText(label,x0,y);
      ctx.fillStyle=css.activeColor;
      ctx.fillText(label,x0,y+h+1);
      ctx.fillStyle=css.overColor;
      ctx.fillText(label,x0,y+h*2+2);
   };
   self.addMenu=function(menu){
      const map={},name=menu.name,label=menu.label;
      const w=self.getTextWidth(label),h=setting.height*3+3;
      let tz=0;
      if(setting.style=="style2"){
         tz=css.radius*2;
      }else if(setting.style=="style3"){
         tz=css.radius*2;
      };
      map.width=w+2*setting.padding+tz;
      map.textwidth=w;
      map.label=label;
      const totalwidth=w+2*setting.padding+2+tz,ratio=self.getRatio();
      map.node=document.createElement("canvas");
      map.ctx=map.node.getContext("2d");
      self.css(map.node,{width:totalwidth+"px",height:h+"px"});
      self.attr(map.node,{width:Math.floor(totalwidth*ratio),height:Math.floor(h*ratio)});
      map.ctx.scale(ratio,ratio);
      catchError(()=>{
         const ctx= map.ctx;
         ctx.textBaseline = "middle";
         ctx.font=css.font;
         ctx.textAlign="center";
         if(setting.style==="style1"){
            self.drewStyle1(ctx,map);
         }else if(setting.style==="style2"){
            self.drewStyle2(ctx,map);
         }else if(setting.style==="style3"){
            self.drewStyle3(ctx,map);
         }
      });
      self.menus[name]=map;
   };
   self.removeMenu=(menu)=>{
      delete self.menus[menu.name];
      self.refresh();
   };
   setting.addEvent("push",(menu)=>{self.addMenu(menu);});
   self.ts=null;
   setting.addEvent("closeall",()=>{
      for(let k in self.menus){
         self.menus[k]=null;
      };
      self.menus={};
      self.refresh();
   });
   setting.addEvent("afteractive",()=>{ 
      clearTimeout(self.ts);
      self.ts=setTimeout(()=>{self.refresh();},100);
   });
   setting.addEvent("afterclose",(menu)=>{self.removeMenu(menu);});
   nav.changeStyle=()=>{
      css=view.css[setting.style];
      if(css==null)return;
      const sz=setting.getMenuList();
      if(sz!=null&&sz.length>0){
         for(let i=0;i<sz.length;i++){
            const stt=setting.getMenu(sz[i]);
            if(stt==null)continue;
            self.addMenu(stt);
         }
      };
       self.refresh();
   };
	self.begin=()=>{
		catchError(()=>{
			const ps=node.parentNode.getBoundingClientRect();
			let state=true;
         let ishidden=navNode.getAttribute("hidden");
			const ww=Math.floor(ps.width),hh=Math.floor(ps.height);
         if(ww===0||hh===0||ishidden==="true"){state=false;};
			if(state){
				if(ww>0&&hh>0&&(self.oldsize.width!==ww||self.oldsize.height!=hh)){
					self.oldsize={width:ww,height:hh};
					if(self.state=="active"){
                  self.changesize();
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
   setTimeout(()=>{self.begin();},10);
   return nav;
};
export {
	Navigation
};
export default {};