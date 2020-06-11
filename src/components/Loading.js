const Loading={};
Loading.open=function(msg){
	const title=typeof(msg)=="undefined"?"":msg;
	let node=document.querySelector("#loading-BF");
	if(node==null){
		const body= document.querySelector(".app-body");
		const bj=document.createElement("div");
		bj.setAttribute("class","loading-background");
		bj.setAttribute("id","loading-BF");
	//  bj.innerHTML="<div class='loading-body'></div>";
		if(body==null)return;
		body.appendChild(bj);
		const bd=document.createElement("div");
		bd.setAttribute("class","loading-body");
		bd.setAttribute("id","loading-BF-body")
		bd.innerHTML="<div style='flex:1'><i class='el-icon-loading'></i></br>"+msg+"</div>";
		body.appendChild(bd);
		node=document.querySelector("#loading-BF");
	}
	node.style.display="flex";
	const ndd=document.querySelector("#loading-BF-body");
	ndd.style.display="flex";
};
Loading.close=function(){
	const node=document.querySelector("#loading-BF");
	if(node==null)return;
	const ndd=document.querySelector("#loading-BF-body");
	ndd.style.display="none";
	node.style.display="none"
};
export default Loading;
