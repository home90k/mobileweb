'use strict'
const baseView={};
baseView.createId=()=>{
	return "vs_"+new Date().getTime()+"_k_"+Math.ceil(Math.random()*10000+1);
};
baseView.getDate=function(){
	const d=new Date();
	const y=d.getMonth()+1;
	const day=d.getDate();
	const str=d.getFullYear()+"-"+(y<10?"0":"")+y+"-"+(day<10?"0":"")+day;
	return str;
}
baseView.dataset={};
baseView.catchError=(evt)=>{try{evt();}catch(e){}};
baseView.onload=function(view){
	const cathError=(evt)=>{try{evt();}catch(e){}};
	cathError(()=>{
		if(view["dsFind"]==null)return
		const fields=view.dsFind.fields;
		if(fields==null || fields.length==0)return;
		const ab=function(fs){
			if(fs==null)return;
			if(fs["type"]!=="group"){
				if(fs["name"]!=""){
					const v=fs["value"]==null?"":fs["value"];
					view.$set(dsFind.row,fs.name,v)
				}
			}else{
				if(fs["children"]!=null && fs["children"].length>0){
					fs.children.forEach(fs2=>{ab(fs2);})
				};
			}
		};
		fields.forEach(field=>{ab(field);});
	});
	if(view["dsData"]!=null){
		view.dsData.addEvent("changeAttr",function(sx){
			if(sx.name==="pageIndex"){
				baseView.click(view,{name:"btnFind"});
			}
		})
	};
};

baseView.click=(view,obj)=>{
	if(obj==null || obj.name==null)return;
	if(obj.name=="btnFind"){//普通查询
		if(view["dsData"]!=null){ 
			view.dsData.doQuery();
		}
	}else if(obj.name=="btnClear"){
		if(view["show_hight"]===true){
			if(view["multiRow"]!=null){
				for(const k in view.multiRow){view.multiRow[k]="";}
			}
		}else  if(view["dsFind"]!=null){
			if(view.dsFind["row"]!=null){
				const r=view.dsFind.getCurrent();
				for(const k in r){
					if(k=="rowId"||k=="state")continue;
					view.dsFind.row[k]="";
				}
			} 
		}
	}else if(obj.name=="btnHight"){ 
		if(view["show_hight"]!=null)view.show_hight=true;
	}
	else if(obj.name=="btnNew"){
		if(view["dsData"]!=null){view.dsData.doAdd();}
	}else if(obj.name=="btnDelete"){
		if(view["dsData"]==null)return;
		const row=view.dsData.getCurrent();
		if(row==null)return;
		if(row.state=="i"){
			view.dsData.doDelete();
		}else{
			const md=view.dsData.deleteMode;
			if(md=="promptly"){
				view.ask({text:"是否确定要执行删除逻辑？",okclick:()=>{view.dsData.doDelete();}})
			}else view.dsData.doDelete();
		};
	}else if(obj.name=="btnSave"){
		if(view["dsData"]!=null){view.dsData.doSave();}
	}else if(obj.name=="btnClose"){
		if(view["subwindow"]!=null)view.subwindow.close();
	}else if(obj.name=="btnExport"){
		if(view["dsData"]!=null){view.dsData.doExport();}
	}
}
export default baseView;

