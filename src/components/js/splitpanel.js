'use strict'
function Splitpanel(view){
 const self={},setting={};
 const node=document.querySelector("#"+view.id);
 const barNode=document.querySelector(".split-bar[for='"+view.id+"']");
 self.oldposition=view.position;
 self.getMaxSize=()=>{
	const ps=node.getBoundingClientRect();
	return (view.mode==="horizontal"?ps.width:ps.height)-view.barsize;
 }
 self.bindEvt=function(){
	barNode.onmousedown=function(e){
		if(e.target.nodeName.toLowerCase()==="i")return false;
		const x=e.pageX,y=e.pageY;
		const cur=view.position2;
		const max=self.getMaxSize()
		node.style.userSelect="none";
		const moveevt=function(e2){
			const x0=e2.pageX-x,y0=e2.pageY-y;
			const bh=view.mode==="horizontal"?x0:y0;
			let cur2=cur+(view.fixedposition=="start"?bh:-bh);
			let wz="center";
			if(cur2<0){cur2=0;wz=view.fixedposition=="start"?"start":"end"}
			else if(cur2>max){cur2=max;wz=view.fixedposition=="start"?"end":"start"}
			view.position2=cur2;
			self.oldposition=cur2;
			view.wz=wz;
		};
		const mup=function(e){
			node.style.userSelect="text";
			document.removeEventListener("mousemove",moveevt);
			document.removeEventListener("mouseup",mup);
		};
		document.addEventListener("mousemove",moveevt);
		document.addEventListener("mouseup",mup);
	};
 };
 self.bindEvt();
 setting.goto=(fx)=>{
	if((fx=="start"&&view.wz=="start")||(fx=="end"&&view.wz=="end"))return;
	const max=self.getMaxSize()
	if(self.oldposition==0||self.oldposition==max)self.oldposition=Math.floor(max/2)
	if(fx=="start"){
		if(view.wz=="end"){
			view.wz="center";
			view.position2=self.oldposition;
		}else if(view.wz=="center"){
			view.wz="start";
			view.position2=view.fixedposition=="start"?0:max;
		}
	}else if(fx=="end"){
		if(view.wz=="start"){
			view.wz="center";
			view.position2=self.oldposition;
		}else if(view.wz=="center"){
			view.wz="end";
			view.position2=view.fixedposition=="end"?0:max;
		}
	}
 };
 self.init=()=>{
	const max=self.getMaxSize()
		if(view.position2==0)view.wz=view.fixedposition=="start"?"start":"end";
		else if(view.position2>=max){
			view.position2=max;
			view.wz=view.fixedposition=="start"?"end":"start";
		}else view.wz="center";
 };
 self.resize=()=>{
	const ps=node.getBoundingClientRect();
	if(ps.width==0||ps.height==0){
		window.requestAnimationFrame(self.resize);
		return;
	}
	self.init();
 };
 setting.destroyed=()=>{
	 try{for(const k in self){ self[k]=null;}}catch(e){}
 };
 self.resize();
 return setting;
};

export {
	Splitpanel
};
export default {};
