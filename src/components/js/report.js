'use strict'
let createReport={};
let st=0;
createReport.refresh=(obj,evt)=>{
   clearTimeout(st);
   st=setTimeout(()=>{obj.startTime=new Date().getTime();evt();},100)
}
createReport.create=function(obj){
	const rows=obj.rows;
	const fields2=obj.fields;
	let fields={};
	if(rows==null || rows.length==0 || fields2==null || fields2.length==0){
		obj.report.columns=[];
		obj.report.head=[];
		obj.report.showfooter=false;
		obj.report.footer=[];
		obj.report.rows=[];
		obj.report.fixed=0;
		obj.report.title="";
		obj.report.version+=1;
		return;
	}
	fields2.forEach(s=>{
		if(s["datatype"]==null)s.datatype="string";
		if(s["align"]==null)s.align="left";
		if(s["visible"]==null)s.visible=true;
		if(s["width"]==null)s.width=80;
		if(s["sort"]==null)s.sort="asc";
		if(s["lock"]==null)s.lock=false;
		if(s["position"]==null)s.position="";
		if(s["precision"]==null)s.precision=2;
		if(s["totaltype"]==null){s.totaltype="sum"};
		fields[s.name]=s;
	});
	let new_rows=[],rmap={},arrMap={},indxMap={},len=rows.length;
	var cells=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	const isNull=function(v){
		var isT=false;
		try{
			if(typeof(v)!="number" && typeof(v)!="boolean" && (typeof(v)=="undefined" || v==null || v=="undefined" || v=="null" || v==""))isT=true;
			else if(typeof(v)=="string"){
				var v2=v.replace(/\s/gi,"");
				if(v2=="")isT=true;
			}
		}catch(e){}
		return isT;
	};
	const getValue=function(v){
		if(isNull(v))return "";
		else{return v}
	};
	let loopFields=function(row){
		var nr={};
		try{
			for(var key in xh){
				var v=getValue(row[key]);
				var bh=xh[key];
				if(rmap[key]==null)rmap[key]={};
				if(arrMap[key]==null)arrMap[key]=[];
				if(rmap[key][v+""]==null){
					rmap[key][v+""]=v;
					arrMap[key].push(v);
				}
				nr[bh]=v;
			}
		}catch(e){}
		return nr;
	};
	let loopdata=function(){
		rmap={};arrMap={};indxMap={};new_rows=[];
		for(let i=0;i<len;i++){var row=rows[i]; var nrow=loopFields(row);new_rows.push(nrow);}
	};
	let xh={},nameXh={};
	var sortRt=function(a,b){
		if(isNull(a))a="";
		if(isNull(b))b="";
		var a1=Number(a),b1=Number(b);
		if(!isNaN(a1) && !isNaN(b1))return a1-b1;
		else{
			var a2=a+"",b2=b+"";
			var k1=a2.replace(/\d/gi,""),k2=b2.replace(/\d/gi,"");
			if(k1==k2 && k1!="" && a2.indexOf(k1)!=-1 && a2.indexOf(k1)==b2.indexOf(k1)){
				var v1=a2.replace(/\D/gi,""),v2=b2.replace(/\D/gi,"");
				var v11=isNull(v1)?0:Number(v1),v22=isNull(v2)?0:Number(v2);
				return v11-v22;
			}else{
				return a2.localeCompare(b2);
			}
		}
	};
	const setFieldXH=function(){//给field 赋编号
		try{
			xh={};
			var t=0;
			for(let key in fields){
				if(isNull(key))continue;
				var k2=getValue(key);
				if(xh[k2]!=null)continue;
				t+=1;
				var nb="";
				if(t<=26)nb=cells[t-1];
				else if(t>26 && t<=702){
					var t2=t-26;
					var bs=(t2-t2%26)/26,ys=t2%26;
					nb=cells[bs]+""+cells[ys];
				}
				xh[k2]=nb;
				nameXh[nb]=k2;
			}
		}catch(e){}
	};
	var sortMap={};
	var sortValues=function(){
		for(var k in arrMap){
			var ar=arrMap[k];
			var ar2=ar.sort(sortRt);
			sortMap[k]=ar2;
		}
		arrMap=null;
	};
	var vMap={},xhVmap={};
	const valueToXh=function(){
		for(var k in sortMap){
			var _xh=xh[k];
			var arr=sortMap[k],mp={},mp2={};
			for(var x=0;x<arr.length;x++){
					var v=arr[x],vxh=_xh+"_"+(x+1);
					mp[v]=vxh;
					mp2[vxh]=v;
			}
			vMap[_xh]=mp;
			xhVmap[_xh]=mp2;
		}
		sortMap=null;
	};

	var _rows=[];
	var createRows=function(){
		_rows=[];
		var ls=new_rows.length;
		for(var x=0;x<ls;x++){
			var r={};
			var nr=new_rows[x];
			for(var k in nr){
				var v=nr[k];
				r[k]=vMap[k][v];
			}
			_rows.push(r);
		}
		new_rows=null;
	};
	setFieldXH();
	loopdata();
	sortValues();//排序feild的值
	valueToXh();
	createRows();
	obj.xh=xh;
	obj.nameXh=nameXh;
	obj.rows2=_rows;
	obj.vMap=vMap;
	obj.xhVMap=xhVmap;
	createReport.createData(obj)
};
createReport.time=null;
createReport.createData=function(obj){
	clearTimeout(createReport.time);
	createReport.time=setTimeout(function(){ createReport.createData2(obj);},100);
};
createReport.createData2=function(obj){
const xh=obj.xh,nameXh=obj.nameXh,rows=obj.rows2,vMap=obj.vMap,xhVMap=obj.xhVMap;
const closetotal=obj.closetotal;
var addft=obj.addfooter;
const isNull=function(v){
	var isT=false;
	try{
		if(typeof(v)!="number" && typeof(v)!="boolean" && (typeof(v)=="undefined" || v==null || v=="undefined" || v=="null" || v==""))isT=true;
		else if(typeof(v)=="string"){
			var v2=v.replace(/\s/gi,"");
			if(v2=="")isT=true;
		}
	}catch(e){}
	return isT;
};
let fields={},fields2=obj.fields;
if(rows==null || rows.length==0 || fields2==null || fields2.length==0){
	obj.report.columns=[];
	obj.report.head=[];
	obj.report.footer=[];
	obj.report.showfooter=false;
	obj.report.rows=[];
	obj.report.fixed=0;
	obj.report.version+=1;
	obj.report.title=""
	obj.report.columnInfo={};
	return;
}
fields2.forEach(s=>{
	if(s["datatype"]==null)s.datatype="string";
	if(s["align"]==null)s.align="left";
	if(s["visible"]==null)s.visible=true;
	if(s["isgroup"]==null)s.isgroup=false;
	if(s["width"]==null)s.width=80;
	if(s["sort"]==null)s.sort="asc";
	if(s["lock"]==null)s.lock=false;
	if(s["position"]==null)s.position="";
	if(s["precision"]==null)s.precision=2;
	if(s["totaltype"]==null){s.totaltype="sum"};
	fields[s.name]=s;
});

const getValue=function(v){
	if(isNull(v))return "";
	else{return v}
};
let vmap={},vmap2={},vlenth=0;
let valuefields=obj.valueFields,cellfields=obj.cellFields,rowfields=obj.rowFields;
if(valuefields!=null && valuefields.indexOf(",")==-1){
	if((","+cellfields+",").indexOf(","+valuefields+",")==-1 && (","+rowfields+",").indexOf(","+valuefields+",")==-1){
		cellfields+=(cellfields==null?"":",")+valuefields;
	}
};
var getVmap=function(){
	var f=valuefields.split(",");
	for(var x=0;x<f.length;x++){
		var f1=f[x],h=xh[f1];
		vmap[h]=f1;
		vmap2[f1]=h+"";
		vlenth+=1;
	}
};
var rult=[],vpositon="row",vIndx=[];
var getRult=function(){
	if(isNull(cellfields))return;
	rult=[];
	var arr1=cellfields.split(","),isv=false;
	var cc=-1;
	for(var i=0;i<arr1.length;i++){
		var k=arr1[i];
		if(isNull(k))continue;
		if(vmap2[k]!=null){
			if(!isv){isv=true;rult.push("value");vpositon="cell";cc+=1;vIndx[cc]="value"}
		}else{
			cc+=1;
			vIndx[cc]=k;
			rult.push(k);
		}
	}
};
var allrows={},cellrows={},hrows={},sumrows={},harr=[],cellarr=[];
var hjrows={};
var loopData=function(){
	allrows={};hjrows={};sumrows={};harr=[];cellarr=[];
	try{
		var rs=[],ls=rows.length;
		for(var x=0;x<ls;x++){
			var row=rows[x];
			var r1=getRow1(row);
			rs.push(r1);
		};
	}catch(e){
		console.error(e)
	}
	for(var k in hjrows){sumrows[k]=hjrows[k];}
};
const detValue=(sz)=>{
	let r=[];
	sz.forEach(s=>{
		if(s!="value")r.push(s);
	});
	return r;
};
const getGroupKey=function(k,arrs,isHang){
	let sz=[];
	for(let i=0;i<arrs.length;i++){
		if(i<=k || arrs[i]=="value")sz.push(arrs[i]);
		else sz.push(isHang?"ZZZZZA":"ZZZZZB");
	}
	return sz;
}
let gpcount=1;
var getRow1=function(row){//获取列，统计数据
	var r={},key=[],key1=[],hz=[],ishvhz=false,cff={};
	var rgps=[],cgps=[],rrsz=[],ccsz=[];
	gpcount=1;
	if(!isNull(rowfields)){//行数据不为空时
		var rfs=rowfields.split(",");
		let szk=[];
		for(var x=0;x<rfs.length;x++){
			var f=rfs[x];
			if(isNull(f))continue;
			if(vmap2[f]!=null){continue;}
			var _xh=xh[f],v=row[_xh];
			key.push(v);
			key1.push(v);
			szk.push(f);
			rrsz.push(v);
			if(ishvhz)hz.push(v);
		};
		if(szk.length>1){//行分组
			for(let i=0;i<szk.length-1;i++){
				const k=szk[i],fst=fields[k];
				if(fst.isgroup==true){
					gpcount+=1;
					const szgp=getGroupKey(i,key1,true);
					var gpkey=szgp.join("|");
					if(cff[gpkey]==null){
						sumrows[gpkey]=getRow2(sumrows[gpkey],row);
							if(hrows[gpkey]==null){
								hrows[gpkey]=gpkey;
								harr.push(gpkey);
							};
						rgps.push(gpkey);
					}
				}
			}
		};
		//行统计数据
		var key1Str=key1.join("|");
		if(cff[key1Str]==null){
			sumrows[key1Str]=getRow2(sumrows[key1Str],row);
			cff[key1Str]=key1Str;
		};
		//统计行
		if(hrows[key1Str]==null){
			hrows[key1Str]=key1Str;
			harr.push(key1Str);
		};
	};
	let key2=[];
	if(!isNull(cellfields)){//列数据不为空时
		let rfs=cellfields.split(","),isv=false;
		let szk=[];
		let isGp=true;
		for(var x=0;x<rfs.length;x++){
			var f=rfs[x];
			if(isNull(f))continue;
			if(vmap2[f]!=null){
				if(!isv){
					isv=true;
					key2.push("value");
					if(ishvhz)hz.push("value");
					if(fields[f]!=null){
						const vgp=fields[f].isgroup;
						if(!vgp)isGp=false;
					}
				}
				continue;
			}
			if(valuefields==null || valuefields.split(",").length<=1)isGp=false;
			szk.push(f);
			var _xh=xh[f],v=row[_xh];
			if(x==0 && vmap2[f]==null){ishvhz=true;hz.push("ZZZZZV");}//添加合计列
			else if(ishvhz)hz.push(v);
			key.push(v);
			ccsz.push(v);
			key2.push(v);
		};
		if(!isv && !isNull(valuefields)){
			key2.push("value");
			if(ishvhz && hz.join("").indexOf("value")==-1)hz.push("value");
		};
		//-----------普通列-----------------------------------
		const mx=isGp?0:1;
		if(szk.length>mx){//列分组
			for(let i=0;i<szk.length-mx;i++){
				const f=szk[i];
				if(fields[f].isgroup==true){
					const szgp=getGroupKey(i,key2,false);
					const szpg2=detValue(szgp)
					const gpkey=szgp.join("|");
					const gpkey2=szpg2.join("|");
					if(cellrows[gpkey]==null){
						cellrows[gpkey]=gpkey;
						cellarr.push(gpkey);
					};
					if(cff[gpkey2]==null){
						hjrows[gpkey2]=getRow2(hjrows[gpkey2],row);
						cff[gpkey2]=gpkey2;
					}
					cgps.push(gpkey2);
				}
			}
		};
		if(key2.length>0){
			var key2Str=key2.join("|");
			if(cellrows[key2Str]==null){
					cellrows[key2Str]=key2Str;
					cellarr.push(key2Str);
			};
		};
		//------------底部合计列数据-----------------------------
		var key3=[];
		for(var t=0;t<rfs.length;t++){//获取行列小计
			var f=rfs[t];
			if(isNull(f))continue;
			if(vmap2[f]!=null)continue;
			var _xh=xh[f];
			var v=row[_xh];
			key3.push(v);
			var k3str=key3.join("|");
			if(cff[k3str]==null){
				hjrows[k3str]=getRow2(hjrows[k3str],row);
				cff[k3str]=k3str;
			}
		};
		if(key1.length>0){
			var k4str=key3.join("|");
			var k4=key1.join("|")+"|"+k4str;
			if(cff[k4]==null){
				hjrows[k4]=getRow2(hjrows[k4],row);
				cff[k4]=k4;
			}
		};
		//-------------组小计-----------------------------------
		var key4=[];
		for(var t=0;t<rfs.length;t++) {//获取行列小计
			var f = rfs[t];
			if (isNull(f)) continue;
			if (vmap2[f] != null){continue;}
			var _xh=xh[f],v=row[_xh];
			key4.push(v);
			var k4=key4.join("|")+"|ZZZZZU";
			if(cff[k4]==null){
				hjrows[k4]=getRow2(hjrows[k4],row);
			}
			if(key1.length>0){
				var k5=key1.join("|")+"|"+k4;
				if(cff[k5]==null){
					hjrows[k5]=getRow2(hjrows[k5],row);
				}
			}
			rgps.forEach(str=>{
				var k6=str+"|"+k4;
				if(cff[k6]==null){
					hjrows[k6]=getRow2(hjrows[k6],row);
				}
			});
		};

		//------------------------汇总合计- 列--------------
		if(hz.length>0 && !closetotal){
			var sumLs=hz.join("|");
			if(cellrows[sumLs]==null){
				cellrows[sumLs]=sumLs;
				cellarr.push(sumLs);
			}
			if(rrsz.length>0){
				const ks=rrsz.join("|")+"|"+sumLs;
				allrows[ks]=getRow2(allrows[ks],row);
			}
			rgps.forEach(str=>{
				const ks=str+"|"+sumLs;
				allrows[ks]=getRow2(allrows[ks],row);
			});
		};
		if(cff["ZZZZZV"]==null){
			hjrows["ZZZZZV"]=getRow2(hjrows["ZZZZZV"],row);
			cff["ZZZZZV"]="ZZZZZV";
		};
		if(hz.length>0){//添加汇总列数据
			var hzstr=hz.join("|");
				var hz2=[];
			if(key1.length>0){
					for(var i=0;i<hz.length;i++){
						if(hz[i]=="value")continue;
						hz2.push(hz[i]);
					};
					var hzstr2=hz2.join("|");
					hzstr=key1.join("|")+"|"+hzstr2;
					if(cff[hzstr2]==null){
						hjrows[hzstr2]=getRow2(hjrows[hzstr2],row);//汇总合计
						cff[hzstr2]=hzstr2;
					}
			}
			if(cff[hzstr]==null){
					hjrows[hzstr]=getRow2(hjrows[hzstr],row);//汇总合计
					cff[hzstr]=hzstr;
			}
			rgps.forEach(str=>{
					const hzstr2=str+"|"+hz2.join("|");
					if(cff[hzstr2]==null){
						hjrows[hzstr2]=getRow2(hjrows[hzstr2],row);//汇总合计
						cff[hzstr2]=hzstr2;
					}
			});
			if(szk.length>1){//列分组
				for(let i=0;i<szk.length-1;i++){
					const f=szk[i];
					if(fields[f].isgroup==true){
						const szgp=getGroupKey(i,key2,false);
						szgp.splice(0,1)
						const szpg2=detValue(szgp)
						const gpkey="ZZZZZV|"+szgp.join("|");
						const gpkey2="ZZZZZV|"+szpg2.join("|");
						if(cellrows[gpkey]==null){
							cellrows[gpkey]=gpkey;
							cellarr.push(gpkey);
						};
						if(cff[gpkey2]==null){
							hjrows[gpkey2]=getRow2(hjrows[gpkey2],row);
							cff[gpkey2]=gpkey2;
						}
						cgps.push(gpkey2);
					}
				}
			};
		};
		//-----------------------添加istotal=true 列
		if(!isNull(cellfields)){//列不为空是，合计列
			var n9=[];
			for(var i9=0;i9<rult.length-1;i9++){
					var f9=rult[i9];
					if(f9.indexOf("value")!=-1){n9.push(f9);}
					else{
						var st=fields[f9]==null?null:fields[f9];
						var xh9=xh[f9],vv9=row[xh9];
						if(st!=null && st.istotal){
							var iscj=false,nxt=[],istj=false;
							nxt.push(vv9);
							for(var i10=i9+1;i10<rult.length;i10++){
									var v10=rult[i10];
									var xh10=xh[v10],vv10=row[xh10];
									if(v10.indexOf("value")==-1){
										istj=true;
										nxt.push("ZZZZZU");
									}else{
										nxt.push(v10.indexOf("value")!=-1?v10:vv10);
									}
							}
							if(!istj)break;
							else{
									var k9=(n9.length>0?n9.join("|")+",":"")+nxt.join("|");
									if(cellrows[k9]==null){
										cellrows[k9]=k9;
										cellarr.push(k9);
									};
									n9.push(vv9);
							}
						}else n9.push(vv9);
					}
			}
		}//----
	};
	var ks=key.join("|");
	allrows[ks]=getRow2(allrows[ks],row);
	rgps.forEach(str => {
		if(ccsz.length>0){
			const ks2=str+"|"+ccsz.join("|");
			allrows[ks2]=getRow2(allrows[ks2],row);
		}
		if(cgps.length>0){
			cgps.forEach(str2 => {
					const ks3=str+"|"+str2;
					allrows[ks3]=getRow2(allrows[ks3],row);
			});
		}
	});
	cgps.forEach(str=>{
		if(rrsz.length>0){
			const ks2=rrsz.join("|")+"|"+str;
			allrows[ks2]=getRow2(allrows[ks2],row);
		}
	});
	cff=null;
};
var qvalue=function(s){
	let arr=s.split("|"),sz=[];
	for(let i=0;i<arr.length;i++){
		if(arr[i].indexOf("value")!=-1)continue;
		sz.push(arr[i]);
	}
	return sz.join("|");
};
var getRow2=function(r1,r2){//循环数据
	if(r1==null)r1={};
	for(let k in vmap){
		let v=xhVMap[k], v2=r2[k],v1=vmap[k],st=fields[v1];
		if(st!=null){
			const v9=st.datatype!="int" && st.datatype!="double"?(isNull(v[v2])?0:1):v[v2];
			r1[k]=((r1[k]==null?0:Number(r1[k]))+Number(v9)).toFixed(st.precision)*1;
			const counkey="$count_"+k,minkey="$min_"+k,maxkey="$max_"+k,avgkey="$avg_"+k;
			r1[counkey]=(r1[counkey]==null?0:r1[counkey])+1;
			r1[minkey]=r1[minkey]==null?v9:r1[minkey]>v9?v9:r1[minkey];
			r1[maxkey]=r1[maxkey]==null?v9:r1[maxkey]<v9?v9:r1[maxkey];
			r1[avgkey]=(r1[k]/r1[counkey]).toFixed(st.datatype=="double"?st.precision:0)*1;
		};
	};
	return r1;
};
//程序开始
getVmap();//valuefields 转化成键值对
getRult();//获取规则
loopData();//循环数据 生成列，行，统计数据
var valueexpression=obj.valueexpression;
var showzerocell=obj.showzerocell;
if(vpositon=="cell"){
	var sz=[],ls=valuefields.split(",").length,ls2=cellarr.length,varr=valuefields.split(",");
	for(var i=0;i<ls;i++){
		for(var x=0;x<ls2;x++){
			var v=cellarr[x];
			if(!showzerocell && v!="value"){
					var kx=qvalue(v);
					var row=sumrows[kx];
					var f=varr[i],fdx=vmap2[f];
					if(row==null || row[fdx]==0)continue;
			}
			if(ls>1)sz.push(v.replace("value","value"+(i+1)));
			else sz.push(v);
		}
	};
	if(valueexpression!=null){
		for(var x=0;x<ls2;x++){
			var v=cellarr[x];
			if(!showzerocell){
					var kx=qvalue(v);
					var row=sumrows[kx];
					var f=varr[i],fdx=vmap2[f];
					if(row==null || row[fdx]==0)continue;
			}
			sz.push(v.replace("value","z-express"));
		}
	}
	cellarr=sz;
};
var sort_cell=function(a,b){
	if(a===b)return 0;
	var a1=a.split("|"),b1=b.split("|");
	for(var i=0;i<a1.length;i++){
		if(a1[i]===b1[i])continue;
		var aa1=a1[i].replace(/\d/gi,""),bb1=b1[i].replace(/\d/gi,"");
		var isasc="asc";
		if(aa1===bb1 && (a1[i]+"").indexOf(bb1)!=-1 && (b1[i]+"").indexOf(bb1)!=-1){
			var v1=a1[i].replace(/\D/gi,""),v2=b1[i].replace(/\D/gi,"");
			v1=isNull(v1)?0:Number(v1);
			v2=isNull(v2)?0:Number(v2);
			return isasc=="asc"?v1-v2:v2-v1;
		}else{
			return isasc=="asc"?aa1.localeCompare(bb1):bb1.localeCompare(aa1);
		}
	}
};
var rptData={head:[],body:[],foot:[]};
var rtData={};
var createReportData=function(rs,cs){
	var title=[],bodys=[],foots=[];
	var  v_arr_lent=valuefields==""?0:valuefields.split(",").length;
	try{
		var isfv=false;
		var arr1=rowfields.split(","),arr2=cellfields.split(",");
		var arr_head=[{label:"序号",visible:true,name:"index",colspan:1}];
		for(var i=0;i<arr1.length;i++){
			var f=arr1[i],st=fields[f];
			if(st==null)continue;
			if(vmap2[f]!=null){
					isfv=true;
					title.push("【"+st.label+" 求"+(st.totaltype=="sum"?"和":st.totaltype=="min"?"最小值":st.totaltype=="max"?"最大值":st.totaltype=="avg"?"平均值":"")+"】");
			}else{
					title.push((title.length>0?",":"")+st.label);
			}
			arr_head.push({label:st.label,visible:st.visible,name:xh[f],colspan:1});
		}
		title.push((title.length>0?" - ":" "));
		for(var j=0;j<arr2.length;j++){
			var f=arr2[j],st=fields[f];
			if(st==null)continue;
			if(vmap2[f]!=null){
					isfv=true;
					title.push("【"+st.label+" 求"+(st.totaltype=="sum"?"和":st.totaltype=="min"?"最小值":st.totaltype=="max"?"最大值":st.totaltype=="avg"?"平均值":st.totaltype=="count"?"个数":"")+"】");
			}else{
					title.push((title.length>0 && j>0?"、":"")+st.label);
			}
		};
		if(!isfv && !isNull(valuefields)){
			var vaa=valuefields.split(",");
			for(var i=0;i<vaa.length;i++){
					var s=vaa[i]
					var st=fields[s];
					if(st==null)continue;
					title.push("【"+st.label+" 求"+(st.totaltype=="sum"?"和":st.totaltype=="min"?"最小值":st.totaltype=="max"?"最大值":st.totaltype=="avg"?"平均值":st.totaltype=="count"?"个数":"")+"】");
			}
		};
		var ls=cs.length,leftcell=[],map={};
		for(var j=0;j<ls;j++){
				var v=cs[j];
				var arrv=v.split("|"),arr3=[];
				for(var x=0;x<arrv.length;x++){
						var lm=arrv[x];
						if(lm=="value" || isNull(lm))continue;// || lm=="z-express"
						arr3.push(lm);
						var kk=arr3.join("|");
						if(map[""+x]==null)map[""+x]={};
						if(map[""+x][kk]==null){
							var lb="",bf=vIndx[x];
							if(lm=="ZZZZZV" || lm=="ZZZZZB"){
									lb="汇总";
							}else if(lm=="ZZZZZU"){
									lb="总计";
							}else if(lm=="z-express"){
									lb="表达式";
							}else if(lm.indexOf("autocolumn")!=-1){
									var nb=Number(lm.replace("autocolumn",""));
									lb=autocolumn[nb].title;
							}else if(bf=="value" || lm.indexOf("value")!=-1){
									var idx=lm=="value"?1:Number(lm.replace("value",""));
									var v_arr=valuefields.split(",")[idx-1];
									var st23=fields[v_arr];
									lb=st23.label;
							}else{
									var fxh=xh[bf];
									lb=xhVMap[fxh][lm];
							}
							if((bf!="value" || (bf=="value" && v_arr_lent>1))){
									if(leftcell[x]==null)leftcell[x]=[];
									leftcell[x].push({label:lb,name:kk,nonull:v.indexOf("ZZZZZB")!=-1});
							}
							map[""+x][kk]=1;
						}else{
							map[""+x][kk]+=1;
						}
				}
		};
		for(var t=0;t<leftcell.length;t++){
			var tv=leftcell[t];
			if(tv!=null && tv.length>0){
					for(var a=0;a<tv.length;a++){
						leftcell[t][a].colspan=map[""+t][leftcell[t][a].name]
					}
			}
		}
		var head1=[];
		if(leftcell.length>0 && !isNull(cellfields)){
			for(var t=0;t<leftcell.length;t++){
					var arr_t=[];
					for(var d=0;d<arr_head.length;d++){
						arr_t.push({label:t==0?arr_head[d].label:"",visible:arr_head[d].visible,colspan:1,name:arr_head[d].name});
					}
					var tv=leftcell[t];
					if(tv!=null && tv.length>0) {
						for (var a = 0; a < tv.length; a++) {
							arr_t.push(leftcell[t][a]);
						}
					}
					head1.push(arr_t);
			};
		}else{
			head1=[arr_head];
		}

		//-----------end----head
		//----------start---body
		var columnArr=[];
		var rls=rs.length,ff_arr=rowfields.split(","),left_len=ff_arr.length,vv_arr=valuefields.split(",");
		var c_len=cs.length;
		if(rls==0){
			var row=[1];
			let ispc=true;
			let ccc=[];
			for(var j=0;j<c_len;j++){
					var kv=cs[j],kv_arr=kv.split("|"),arr_n=[];
					var vdx=vv_arr.length==1?"value1":"";
					ccc.push(kv);
					for(var m=0;m<kv_arr.length;m++){
						var mv=kv_arr[m];
						if(mv=="ZZZZZV"){arr_n.push(mv);}
						else if(mv=="ZZZZZU" || mv=="ZZZZZB"){arr_n.push(mv);}
						else if(mv.indexOf("z-express")!=-1)continue;
						else if(mv.indexOf("value")==-1){arr_n.push(mv);}
						else vdx=mv;
					}
					var key=arr_n.join("|");
					var v9=0,rrr=null;
					if(key.indexOf("ZZZZZV")!=-1 || key.indexOf("ZZZZZU")!=-1)rrr=sumrows[key];
					else rrr=allrows[key];
					if(rrr!=null && vdx!=""){
						var nb=vdx=="value"?1:Number(vdx.replace("value",""));
						var vf=vv_arr[nb-1],vfxh=xh[vf];
						const totaltype=fields[vf].totaltype;
						if(totaltype=="sum"){
							v9=rrr[vfxh];
						}else{
							v9=rrr["$"+totaltype+"_"+vfxh];
						}
					}
					if(v9>0)ispc=false;
					row.push(v9);
			}
			if(!ispc || showzerocell){
					bodys.push(row);
					columnArr.push(ccc.join("|"));
			}
		}else{
			let xhh=0;
			for(var i=0;i<rls;i++){
					var r=rs[i],row=[],r_arr=r.split("|");
					row.push(xhh+1);
					for(var x=0;x<left_len;x++){
						var ff=ff_arr[x],fxh=xh[ff];
						if(vmap2[ff]==null){
							var vvv=xhVMap[fxh][r_arr[x]];
							row.push(vvv);
						}else{
								var vvv=sumrows[r];
								var v=vvv==null || vvv[fxh]==null?0:vvv[fxh];
								row.push(v);
						}
					}
					let ispc=true;
					let ccc=[];
					for(var j=0;j<c_len;j++){
						var kv=cs[j],kv_arr=kv.split("|"),arr_n=[];
						ccc.push(kv)
						var vdx=vv_arr.length==1?"value1":"";
						for(var m=0;m<kv_arr.length;m++){
							var mv=kv_arr[m];
							if(mv=="ZZZZZV" || mv=="ZZZZZB")arr_n.push(mv);
							else if(mv=="ZZZZZU")arr_n.push(mv);
							else if(mv.indexOf("value")==-1)arr_n.push(mv);
							else vdx=mv;
						}
						var key=r+(arr_n.length>0?"|":"")+arr_n.join("|");
						var v9=0,rrr=null;
						if(key.indexOf("ZZZZZV")!=-1 || key.indexOf("ZZZZZU")!=-1)rrr=sumrows[key];
						if(rrr==null)rrr=allrows[key];
						if(rrr!=null && vdx!=""){
							var nb=vdx=="value"?1:Number(vdx.replace("value",""));
							var vf=vv_arr[nb-1],vfxh=xh[vf];
							const totaltype=fields[vf].totaltype;
							if(totaltype=="sum"){
									v9=rrr[vfxh];
							}else{
									v9=rrr["$"+totaltype+"_"+vfxh];
							}
						}
						if(v9>0)ispc=false;
						row.push(v9);
					}
				if(!ispc || showzerocell){
						bodys.push(row);
						columnArr.push(r+"|"+ccc.join("|"))
						xhh+=1;
				}
			}
		};

		let frow=[];
		frow.push({label:"总计"});
		for(let i=0;i<left_len;i++){frow.push("");};
		for(let i=0;i<c_len;i++){
			const kv=cs[i] ,kv_arr=kv.split("|"),arr_n=[];
			var vdx=vv_arr.length==1?"value1":"";
			for(var m=0;m<kv_arr.length;m++){
					var mv=kv_arr[m];
					if(mv=="ZZZZZV" || mv=="ZZZZZB")arr_n.push(mv);
					else if(mv=="ZZZZZU")arr_n.push(mv);
					else if(mv.indexOf("value")==-1)arr_n.push(mv);
					else vdx=mv;
			}
			var key=arr_n.join("|");
			var v9=0,rrr=sumrows[key];
			if(rrr!=null && vdx!=""){
					var nb=vdx=="value"?1:Number(vdx.replace("value",""));
					var vf=vv_arr[nb-1],vfxh=xh[vf];
					const totaltype=fields[vf].totaltype;
					if(totaltype=="sum"){
						v9=rrr[vfxh];
					}else{
						v9=rrr["$"+totaltype+"_"+vfxh];
					}
			}
			frow.push({label:v9,nonull:kv.indexOf("ZZZZZB")!=-1});
		}
		foots.push(frow);
		rptData.head=head1;
		rptData.body=bodys;
		rptData.foot=foots;
		rptData.columnsArr=columnArr;
	}catch(e){
		console.error(e)
	};
	rtData.title=title.join("");
	};
	const initvalue=obj.initvalue;
	const autorow =obj.autorow;
	var autocolumn=obj.autocolumn;
	var cellData=isNull(cellfields)?[]:cellarr.sort(sort_cell);//排序
	if(autocolumn!=null && autocolumn.length>0){for(var i=0;i<autocolumn.length;i++){cellData.push("autocolumn"+i);}}else autocolumn=[];
	var rowData=harr.sort(sort_cell);    //排序
	var leftcount=isNull(rowfields)?0:(rowfields.split(",").length+1);
	var rightcount=(isNull(cellData)?0:cellData.length);
	rtData.columnInfo={left_column_count:leftcount,right_column_count:rightcount,column_count:leftcount+rightcount};
	createReportData(rowData,cellData);  //创建数据
	var xhNb=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	var getLe=function(sz,i){
		var ys=i%26,bs=(i-ys)/26;
		sz.push(xhNb[ys]);
		if(bs>0 && bs<26)sz.push(xhNb[bs-1]);
		if(bs>=26){sz=getLe(sz,bs);}
		return sz;
	};
	var numberToString=function(nb){var sz=[];sz= getLe(sz,nb);return sz.reverse().join("");};
	var getJson=function(){//返回表格数据
		var cs=rtData.columnInfo.column_count;
		var cd0=rtData.columnInfo.left_column_count;
		var jsdata={head:[],rows:[],columns:[],footer:[],head2:[],footer2:[]};
		var vls=valuefields.split(",");
		var colMap={};
		for(var i=0;i<cs;i++){
			var lm=numberToString(i);
			var textalign="left";
			var ww=i==0?40:100;
			var lmmm="";
			if(i+1>cd0){textalign="right";ww=80;}
			var vzb=true;
			var field="";
			if(i==0){field="number";lmmm="number";}
			else if(i+1<=cd0){
					field=rowfields.split(",")[i-1];
					if(fields[field]!=null){
						vzb=fields[field].visible;
						ww=fields[field].width;
						ww=ww<110?110:ww;
					}
					lmmm=field;
			}else{
					var cv=cellData[i-cd0];
					lmmm=cv;
					if(cv!=null && cv.indexOf("ZZZZZV")!=-1){
						if(cv.indexOf("z-express")!=-1)field="sumtotal-express";
						else if(cv.indexOf("value")!=-1){
							var r=cv.split("|");
							for(var t=0;t<r.length;t++){
									if(r[t].indexOf("value")!=-1){
										var nb=Number(r[t].replace("value",""));
										if(fields[vls[nb-1]]!=null){
												vzb=fields[vls[nb-1]].visible;
												field="sumtotal-"+vls[nb-1];
										}
										break;
									}
							}
						}
						else field="sumtotal";
					}
					else if(cv!=null && cv.indexOf("ZZZZZU")!=-1)field="total";
					else if(cv!=null && cv.indexOf("z-express")!=-1)field="express";
					else if(cv!=null && cv.indexOf("autocolumn")!=-1){field=cv;}
					else if(vls.length==1)field=vls[0];
					else{
						if(!isNull(cv)){
							var r=cv.split("|");
							for(var t=0;t<r.length;t++){
									if(r[t].indexOf("value")!=-1){
										var nb=Number(r[t].replace("value",""));
										field=vls[nb-1];
										break;
									}
							}
						}
					}
					if(fields[field]!=null){
						vzb=fields[field].visible;
						ww=fields[field].width;
					}
					if(isNull(field))field=cv;
			}
			jsdata.columns.push({name:lm,visible:vzb,width:ww,align:textalign,field:field,nonull:lmmm.indexOf("ZZZZZB")!=-1});
			colMap[lm]=field;
			obj.columnsMap[lm]=lmmm;
		};
		jsdata.head.push([{name:"A",label:rtData.title,align:"left",colspan:cs-1}]);
		jsdata.head2.push({A:{label:rtData.title,align:"left",colspan:cs-1}});
		var hlength=rptData.head.length;
		for(var i=0;i<hlength;i++){
			var h1=rptData.head[i],h1_arr=[],_xx=0;
			var h2_arr={};
			for(var x=0;x<h1.length;x++){
					var xk=h1[x],colspan=xk.colspan;
					if(x<cd0 && i>0){
						var cnb=numberToString(_xx);
						h2_arr[cnb]={label:"",align:"left"};
						_xx+=1;
						continue;
					}
					var rspan=i==0 && x<cd0?hlength-1:0;
					var lb=xk.label;
					if(colspan==1){
						var cnb=numberToString(_xx);
						h1_arr.push({name:cnb,label:lb,align:_xx<leftcount?"left":"right",rowspan:rspan,nonull:xk.nonull});
						h2_arr[cnb]={label:lb,align:_xx<leftcount?"left":"right",rowspan:rspan};
						_xx+=1;
					}else{
						var cnb=numberToString(_xx);
						h1_arr.push({name:cnb,label:lb,align:"center",rowspan:rspan,colspan:colspan-1,nonull:xk.nonull});
						h2_arr[cnb]={label:lb,align:"center",rowspan:rspan,colspan:colspan-1};
						_xx+=colspan;
					}
			}
			jsdata.head.push(h1_arr);
			jsdata.head2.push(h2_arr);
		}
		var sur=sumrows["ZZZZZV"];
		var total=0;
		if(sur!=null && valuefields!=null){total=sur[vmap2[valuefields]];};
		for(var i=0;i<rptData.body.length;i++){
			var r1=rptData.body[i],rjs={__type:"old"},values=[],vl=0;
			for(var t=0;t<r1.length;t++){
					var cnb=numberToString(t);
					var name=colMap[cnb],v=r1[t]===0?"":r1[t];
					if((","+valuefields+",").indexOf(","+name+",")!=-1){values.push(v==""?0:v);vl+=(v==""?0:v*1)};
					if(name!=null && name.indexOf("autocolumn")!=-1){
						var v2="";
						try{
							var xh=Number(name.replace("autocolumn",""));
							var p=autocolumn[xh];
							if(p!=null){var evt=eval(p.method);v2=evt({values:values,value:vl,total:total});}
						}catch(ee){}
						if(v2==undefined)v2="";
						v=v2;
					}else if(name!=null && initvalue!=null){
						var v3="";
						try{
							var values=[],leftRow={};
							for(var k=0;k<r1.length;k++){
									var cnb2=numberToString(k);
									var lm2=colMap[cnb2],v2=r1[k]===0?"":r1[k];
									if(lm2==null)continue;
									if((","+valuefields+",").indexOf(","+lm2+",")!=-1){values.push(v2==""?0:v2);}
									else leftRow[lm2]=v2;
							}
							var evt=eval(initvalue);
							v3=evt(name,v,values,leftRow);
						}catch(eee){}
						if(v3!=undefined)v=v3;
					};
					if(valueexpression!=null && name.indexOf("express")!=-1){
						var evt=eval(valueexpression),v2="";
						try{
							var p={},vls=valuefields.split(",").length;
							for(var n=1;n<=vls;n++){
									var cnb6=numberToString(t-n);
									var field6=colMap[cnb6];
									field6=field6.replace("sumtotal-","");
									p[field6]=rjs[cnb6];
							}
							v2=evt(p);
						}catch(e5){}
						if(typeof(v2)!="undefined")v=v2;
					}
					rjs[cnb]=v;
			}
			jsdata.rows.push(rjs);
			if(autorow!=null){
					var values={};
					for(var k in rjs){
						if(k=="__type")continue;
						var name=colMap[k];
						if((","+valuefields+",").indexOf(","+name+",")==-1){
							values[name]=rjs[k];
						}
					}
					for(var y=0;y<autorow.length;y++){
						var evt=eval(autorow[y].method);
						var newrow={};
						for(var key in rjs){
							if(key=="__type")newrow[key]="autorow"+y;
							else{
									var name=colMap[key];
									var v=rjs[key];
									var p={};
									p.values=values;
									p.field=name;
									p.value=v;
									var isv=(","+valuefields+",").indexOf(","+name+",")!=-1;
									p.isvalue=isv;
									var v3="";
									if(name!="number")try{v3=evt(p);}catch(ee){}
									if(v3==undefined)v3="";
									newrow[key]=v3==null?"":v3;
							}
						}
						jsdata.rows.push(newrow);
					}
			}
		}
		//-----------footer
		let foots=rptData.foot
		var fjs=[],finfo=[],fjs2={};
		for(let  i=0;i<foots.length;i++){
			const sz=foots[i];
			for(let j=0;j<sz.length;j++){
					var cnb=numberToString(j);
					let sum="",colspan=0,tl="left";
					let nll=false;
					if(j==0){sum="总计";colspan=leftcount-1;tl="center"}
					if(j>=cd0){
						sum=sz[j].label;
						nll=sz[j].nonull;
						tl="right";
					}
					if(j==0 || j>=leftcount){
						fjs.push({name:cnb,label:sum==0?"":sum,align:tl,colspan:colspan,nonull:nll});
					}
					fjs2[cnb]={label:sum==0?"":sum,align:tl,colspan:0}
			}
		}
		jsdata.footer.push(fjs);//小计
		jsdata.footer2.push(fjs2);//小计
		try{
			if(addft!=null && addft.length>0){
					for(var x=0;x<addft.length;x++){
						var fv=addft[x];
						if(fv==null || finfo.length==0)continue;
						var fjs2=[];
						for(var t=0;t<finfo.length;t++){
							var tv=finfo[t];
							var cnb=numberToString(t),sum="",tl="left";
							if(t==1 && isNull(tv)){
									sum=isNull(fv["label"])?"":fv["label"];
							}else if(!isNull(tv) && tv.length>0){
									var et=fv.event;
									if(!isNull(et)){
										var evt=eval(et);
										var ss=0;
										if(tv!=null && typeof(tv)=="object" && tv["length"]>0){
											for(var tt=0;tt<tv.length;tt++){
													var ttv=Number(tv[tt]);
													if(isNaN(ttv))ttv=tv[tt];
													else ss+=ttv;
											}
										}
										var valuefield=jsdata.columns[t];
										var dx={sum:ss,values:tv,valuefield:valuefield};
										if(typeof(evt)=="function")sum=evt(dx);
									}
									if(typeof(sum)=="undefined")sum=0;
									sum=sum*1;
									tl="right";
							}
							fjs2.push({name:cnb,label:sum===0?"":sum,align:tl,colspan:0});
						}
						jsdata.footer.push(fjs2);
					}
			}
		}catch(ee){
			console.error(ee)
		}
		rtData.json=jsdata;
	};
	getJson();
	console.log("报表用时:"+(new Date().getTime()-obj.startTime)+"毫秒");
	obj.report.columns=rtData.json.columns;
	obj.report.head=rtData.json.head;
	obj.report.showfooter=rtData.json.footer.length>0;
	obj.report.footer=rtData.json.footer;
	obj.report.rows=rtData.json.rows;
	obj.report.fixed=rtData.columnInfo.left_column_count;
	obj.report.title=rtData.json.title;
	obj.report.columnInfo=rtData.columnInfo;
	obj.report.report_head=rtData.json.head2;
	obj.report.report_footer=rtData.json.footer2;
	obj.report.columnsArr=rptData.columnsArr;
	obj.report.version+=1;
};
createReport.initSetting=function(obj){
	const id=obj.id;
	const node=document.querySelector("#"+id);
	const titleNode=node.querySelector(".report-setting-title");
	titleNode.onmousedown=function(e){
		const x=e.pageX,y=e.pageY;
		let lft=node.getAttribute("mleft"),tp=node.getAttribute("mtop");
		if(lft==null)lft=0;
		if(tp==null)tp=0;
		document.onmousemove=function(e2){
			node.style.left=(Number(lft)+e2.pageX-x)+"px";
			node.style.top=(Number(tp)+e2.pageY-y)+"px";
			node.setAttribute("mleft",(Number(lft)+e2.pageX-x));
			node.setAttribute("mtop",(Number(tp)+e2.pageY-y));
		};
		document.onmouseup=function(){
			document.onmousemove=null;
			document.onmouseup=null;
		}
	};
};
createReport.getSetting=function(obj){
	const id=obj.id;
	const node=document.querySelector("#"+id);
	const rowNode= node.querySelector(".report-row-fields");
	const cellNode= node.querySelector(".report-cell-fields");
	const valueNode= node.querySelector(".report-value-fields");
	const getArr=function(nd){
		let varr=[];
		const vs=nd.querySelectorAll(".report-item");
		if(vs!=null && vs.length>0)vs.forEach(s=>{
			if(s.style.display!="none"){
					varr.push(s.getAttribute("column"));
			};
		});
		return varr;
	};

	const st={};
	cellNode.querySelectorAll(".report-item").forEach(item=>{
		const column=item.getAttribute("column");
			const ndd=item.querySelector("input");
			const sx=ndd.checked;
			if(column!="__total_data"){
					if(st[column]==null)st[column]={};
					st[column].isgroup=sx;;
			}else{
					valueNode.querySelectorAll(".report-item").forEach(item=>{
						const column2=item.getAttribute("column");
						if(st[column2]==null)st[column2]={};
						st[column2].isgroup=sx;;
					});
			}
	});
	rowNode.querySelectorAll(".report-item").forEach(item=>{
			const column=item.getAttribute("column");
			const ndd=item.querySelector("input");
			const sx=ndd.checked;
			if(column!="__total_data"){
					if(st[column]==null)st[column]={};
					st[column].isgroup=sx;;
			}else{
					valueNode.querySelectorAll(".report-item").forEach(item=>{
						const column2=item.getAttribute("column");
						if(st[column2]==null)st[column2]={};
						st[column2].isgroup=sx;;
					});
			};
	});
	valueNode.querySelectorAll(".report-item").forEach(item=>{
		const column=item.getAttribute("column");
		const ndd=item.querySelector("select");
		const sx=ndd.value;
		if(st[column]==null)st[column]={};
		st[column].totaltype=sx;;
	});

	let v=getArr(valueNode).join(",");
	let c=getArr(cellNode).join(",");
	let r=getArr(rowNode).join(",");
	if(v!=null && v.indexOf(",")!=-1){
		c=c.replace("__total_data",v);
		r=r.replace("__total_data",v);
	}
return {cellFields:c,rowFields:r,valueFields:v,prop:st};

};
createReport.createSetting=function(obj){
	const id=obj.id;
	const node=document.querySelector("#"+id);
	const fields=obj.fields;
	const allNode= node.querySelector(".report-all-fields");
	const rowNode= node.querySelector(".report-row-fields");
	const cellNode= node.querySelector(".report-cell-fields");
	const valueNode= node.querySelector(".report-value-fields");
	const getHtml=function(k){
		let html="";
		if(map[k]!=null){
			const s=map[k];
			let totaltype=s["totaltype"],isgroup=s["isgroup"];
			if(k=="__total_data"){
					let isgp=true;
					valueNode.querySelectorAll(".report-item").forEach(item=>{
						const fstt=map[item.getAttribute("column")];
						if(fstt!=null && fstt.isgroup!=true)isgp=false;
					});
					isgroup=isgp;
			};
			if(totaltype==null)totaltype="sum";
			html="<div class=\"report-item\" column='"+s.name+"' draggable='true'>"+
					"<span style='width:160px;display:inline-block'>"+s.label+"</span>"+
					"<select style='outline:none;height:24px;position: absolute;margin-top:2px;' value='"+totaltype+"'>"+
						"<option value='sum' "+(totaltype=="sum"?"selected":"")+">求和</option>"+
						"<option value='max' "+(totaltype=="max"?"selected":"")+">最大值</option>"+
						"<option value='min' "+(totaltype=="min"?"selected":"")+">最小值</option>"+
						"<option value='avg' "+(totaltype=="avg"?"selected":"")+">平均值</option>"+
						"<option value='count' "+(totaltype=="count"?"selected":"")+">个数</option>"+
					"</select>"+
					"<input name='"+s.name+"' type='checkbox' style='float:right;margin-top:7px;' "+(isgroup?"checked":"")+" title='分组'/>"+
			"</div>";
		}
		return html;
	};
	const bindStart=function(jd,tp){
		const cp=jd.cloneNode(true)
		cp.onmousedown=function(e){let obj=this;dragNode={node:cp,type:tp,column:obj.getAttribute("column")};};
		cp.ondragstart=function(e){let obj=this;dragNode={node:cp,type:tp,column:obj.getAttribute("column")}};
		jd.onmousedown=function(e){let obj=this;dragNode={node:cp,type:tp,column:obj.getAttribute("column")};};
		jd.ondragstart=function(e){let obj=this;dragNode={node:cp,type:tp,column:obj.getAttribute("column")};};
	}
	const bindItemEvent=function(_node,tp){
		const items=_node.querySelectorAll(".report-item");
		if(items.length>0){
			items.forEach(jd=>{bindStart(jd,tp); });
		}
	};
	const changeEvt=function(tp,column,optype){
		if(tp=="value"){checkTotal();}
		if(tp=="cell" || tp=="row"){
			if(optype=="add"){
					if(tp=="cell"){
						const findn=rowNode.querySelector(".report-item[column='"+column+"']");
						if(findn!=null)rowNode.removeChild(findn);
					}else{
						const findn=cellNode.querySelector(".report-item[column='"+column+"']");
						if(findn!=null)cellNode.removeChild(findn);
					}
			}
		}
		if(column=="__total_data"){
			if(optype=="delete")valuestatus(false);
			else if(optype=="add")valuestatus(true);
		}
	};
	const valuestatus=function(ist){
		const vs=valueNode.querySelectorAll(".report-item");
		if(vs==null || vs.length==0)return;
		vs.forEach(jd=>{
			jd.style.display=ist?"block":"none";
		})
	}
	allNode.innerHTML="";
	const map={};
	let dragNode={node:null,type:""};
	if(fields!=null && fields.length>0){
		let sz=[];
		map["__total_data"]={name:"__total_data",label:"数据集",isgroup:false}
		fields.forEach(s=>{map[s.name]=s;sz.push(getHtml(s.name));});
		allNode.innerHTML=sz.join("");
		bindItemEvent(allNode,"all");
	}
	const checkTotal=function(){
		let vnodes= valueNode.querySelectorAll(".report-item");
		if(vnodes!=null && vnodes.length>0){
			vnodes.forEach(jd=>{if(jd.style.display=="none")valueNode.removeChild(jd);});
			vnodes=valueNode.querySelectorAll(".report-item");
		}
		const fnode1= cellNode.querySelector(".report-item[column='__total_data']");
		const fnode2=rowNode.querySelector(".report-item[column='__total_data']");
		if(vnodes!=null && vnodes.length>1 && fnode1==null && fnode2==null){
			const nd2=document.createElement("div");
			nd2.innerHTML=getHtml("__total_data")
			const ttNode=nd2.querySelector(".report-item");
			bindStart(ttNode,"cell");
			cellNode.appendChild(ttNode);
		}else if((vnodes==null || vnodes.length<2) && (fnode1!=null || fnode2!=null)){
			if(fnode1!=null){cellNode.removeChild(fnode1);}
			if(fnode2!=null){rowNode.removeChild(fnode2);}
		}
	};
	let oldk="";
	const bindEvent=function(nd,tp){
	nd.ondragover=function(e3){
		e3.preventDefault()
		const key2=dragNode.column+"|"+e3.pageX+"|"+e3.pageY;
		if(key2==oldk)return false;
		oldk=key2;
		const _node=this;
		dragNode.endtype=tp;
		const items=_node.querySelectorAll(".report-item");
		if(tp=="value" && dragNode.column=="__total_data")return false;
		if(tp=="cell" || tp=="row"){
			const lm=dragNode.column;
			const vn=valueNode.querySelector(".report-item[column='"+lm+"']");
			if(vn!=null && vn.style.display!="none"){
					const fnode1= cellNode.querySelector(".report-item[column='__total_data']");
					const fnode2=rowNode.querySelector(".report-item[column='__total_data']");
					if(fnode1!=null || fnode2!=null)return false;
			}
		}
		if(items!=null && items.length>0){
			const lastNode=items[items.length-1];
			const ps2=lastNode.getBoundingClientRect(),h2=lastNode.offsetHeight;
			if(lastNode.getAttribute("column")!=dragNode.column && e3.pageY>=ps2.top+h2){
					const fnode= _node.querySelector(".report-item[column='"+dragNode.column+"']");
					if(fnode!=null)_node.removeChild(fnode);
					const cp=dragNode.node;
					_node.appendChild(cp);
					changeEvt(tp,dragNode.column,"add");
			}else{
					items.forEach((nd,i)=>{
						const ps=nd.getBoundingClientRect();
						const column=nd.getAttribute("column");
						if(column!=dragNode.column){
							const h=nd.offsetHeight,y3=e3.pageY;
							const fnode= _node.querySelector(".report-item[column='"+dragNode.column+"']");
							const cp=dragNode.node;
							if(ps.top<=y3 && ps.top+h>=y3){
									_node.insertBefore(cp,nd);
									changeEvt(tp,dragNode.column,"add");
									if(fnode!=null)_node.removeChild(fnode);
							}
						}
					})
			}
		}else{
			if(_node!=null){_node.innerHTML=getHtml(dragNode.column);changeEvt(tp,dragNode.column,"add");}
		}
	};

	nd.ondragleave=function(e){
		e.preventDefault();
		const ps=this.getBoundingClientRect();
		const tp2=tp;
		if(e.pageX>=ps.left && e.pageX<=ps.left+this.offsetWidth && e.pageY>=ps.top && e.pageY<=ps.top+this.offsetHeight){
		}else{
			const fnode= this.querySelector(".report-item[column='"+dragNode.column+"']");
			if(fnode!=null){this.removeChild(fnode);changeEvt(tp2,dragNode.column,"delete");}
		}
	}
	nd.ondrop=function(e){
		e.preventDefault();
		bindItemEvent(nd,tp);
	};
};

bindEvent(valueNode,"value");
bindEvent(rowNode,"row");
bindEvent(cellNode,"cell");

valueNode.innerHTML="";
const valueFields=obj.valueFields;
if(valueFields!=null){
		const sz=valueFields.split(",");
		let sz2=[];
		sz.forEach(k=>{sz2.push(getHtml(k))});
		valueNode.innerHTML=sz2.join("")
		bindItemEvent(valueNode,"value");
}

	rowNode.innerHTML="";
	let rowFields=obj.rowFields;
	if(rowFields!=null && obj.valueFields!=null && obj.valueFields.indexOf(",")!=-1)rowFields=rowFields.replace(obj.valueFields,"__total_data");
	if(rowFields!=null){
		const sz=rowFields.split(",");
		let sz2=[];
		sz.forEach(k=>{sz2.push(getHtml(k));});
		rowNode.innerHTML=sz2.join("")
		bindItemEvent(rowNode,"row");
	}

	cellNode.innerHTML="";
	let cellields=obj.cellFields;
	if(cellields!=null){
		if(obj.valueFields!=null && obj.valueFields.indexOf(",")!=-1)cellields=cellields.replace(obj.valueFields,"__total_data");
		const sz=cellields.split(",");
		let sz2=[];
		sz.forEach(k=>{ sz2.push(getHtml(k));});
		cellNode.innerHTML=sz2.join("")
		bindItemEvent(cellNode,"cell");
	}
};
export default createReport;
