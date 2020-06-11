'use strict'
function ReportModular(dsData){
   const self=this;
   const cells=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
   let map={},data=[],vMap={};
   const getXh=(i)=>{
      const sz=[];
      const ab=(a)=>{if(a<26){sz.push(cells[a]);}else{const ys=a%26;sz.push(cells[ys]);const b=(a-ys)/26;ab(b); }};
      ab(i);
      return sz.reverse().join("");
   };

   self.initRows=(rows)=>{
      map={};data=[];vMap={};
      let i=0;
      rows.forEach(row=>{
         const r2={};
         dsData.fields.forEach(f=>{
            const name=f.name,st=dsData.getField(name);
            const datatype=st.datatype;
            let v=row[name]==null?"":row[name];
            if(datatype=="int"){
              const v2=isNaN(Number(v))?0:Number(v); v=v2.toFixed(0);
            }else if(datatype=="double"){
              const v2=isNaN(Number(v))?0:Number(v); v=v2.toFixed(st.precision);
            }
            if(map[v]==null){
               i+=1;
               map[v]="A"+i;
               vMap["A"+i]=v;
            }
            r2[name]=map[v];
         });
         data.push(r2);
      });
   };
   let rowData={},cellData={},allData={};
   const toArray=(str)=>{
      if(str==null||str=="")return [];
      else{
         const sz=[];
         const arr=str.split(",");
         arr.forEach(s=>{if(s!=null&&s!="")sz.push(s);});
         return sz;
      }
   };
   const addNumber=(v1,v2,jd)=>{
      let nb1=Number(v1),nb2=Number(v2);
      if(isNaN(nb1))nb1=0;
      if(isNaN(nb2))nb2=0;
      return (nb1+nb2).toFixed(jd);
   };
   const joinData=(r,map,sz,sz2,sz3,type)=>{
      if(sz.length==0&&sz2.length==0)return;
      const arr=[];
      const ab=(a)=>{
         a.forEach(s=>{
            if(s=="$total$"||s.indexOf("ZZZZZZ")!=-1)arr.push(s);
            else{ arr.push(r[s]);}
         });
      };
      ab(sz);
      ab(sz2);
      const key=arr.join("|");
      if(key.indexOf("$total$")!=-1){
         sz3.forEach(ss=>{
            const key2=key.replace("$total$",ss);
            const st=dsData.getField(ss);
            const v2=r[ss];
            let v=vMap[v2];
            if(map[key2]==null)map[key2]={value:0,values:[],map:{}};
            map[key2].value=st.datatype=="int"||st.datatype=="double"?addNumber(map[key2].value,v,st.datatype=="int"?0:st.precision):map[key2].value+1;
            map[key2].values.push(v);
            map[key2].map[vMap[v2]]=v;
         });
      }else{
         if(map[key]==null)map[key]={};
         sz3.forEach(ss=>{
            const st=dsData.getField(ss);
               const v2=r[ss],v=vMap[v2];
               const v3=st.datatype=="int"||st.datatype=="double"?v:1;
               const rr={value:v3,values:[v],map:{}};
               rr.map[v]=v;
               if(map[key][ss]==null)map[key][ss]=rr;
               else{
                  const v4=st.datatype=="int"||st.datatype=="double"?addNumber(map[key][ss].value,v,st.datatype=="int"?0:st.precision):map[key][ss].value+=1;
                  map[key][ss].value=v4;
                  map[key][ss].values.push(v);
                  map[key][ss].map[v]=v;
               }
         });
      };
   };
   self.createReportData=(setting)=>{
      rowData={};cellData={};allData={};
      const rowFields=toArray(setting.rowfields),cellFields=toArray(setting.cellfields),valueFields=toArray(setting.valuefields);
      data.forEach(r=>{
         joinData(r,rowData,rowFields,[],valueFields,"row");
         joinData(r,cellData,cellFields,[],valueFields,"cell");
         joinData(r,allData,rowFields,cellFields,valueFields,"all");
         //汇总
         if(cellFields.length>0){
            const abb=(xh)=>{
               const szz=[]
               cellFields.forEach((s,i)=>{
                  if(i<=xh){
                     szz.push("ZZZZZZR");
                  }else szz.push(s);
               });
               return szz;
            };
            for(let i=0;i<cellFields.length;i++){
               const v=cellFields[i];
               if(v=="$total$")break;
               const cellFields2=abb(i);
               joinData(r,cellData,cellFields2,[],valueFields,"cell");
               joinData(r,allData,rowFields,cellFields2,valueFields,"all");
            }
         }
         //组小计--------------------
         if(cellFields.length>0){
            const abb=(xh)=>{
               const sz=[];
               for(let i=0;i<cellFields.length;i++){
                  const kk=cellFields[i];
                  if(i>=xh)sz.push("ZZZZZZI");
                  else sz.push(kk);
               }
               return sz;
             };
            for(let i=cellFields.length-1;i>0;i--){
               const str=cellFields[i];
               if(str=="$total$")break;
               const field=dsData.getField(str);
               if(field.group!==true)continue;
               const cellFields2= abb(i);
               joinData(r,cellData,cellFields2,[],valueFields,"cell");
               joinData(r,allData,rowFields,cellFields2,valueFields,"all");
            }
         }
      });
   };
   let columns=[];
   let head=[];
   self.createGridData=(setting)=>{
      self.gridData={columns:[],head:[],footer:[],rows:[]};
      columns=[];head=[];
      const rowFields=toArray(setting.rowfields),cellFields=toArray(setting.cellfields),valueFields=toArray(setting.valuefields);
      const abc=(d)=>{const sz=[];for(let k in d){sz.push(k); } return sz;};
      rowFields.forEach((s,i)=>{
         const ab=(ss)=>{
            const st=dsData.getField(ss);
            const col={name:ss,label:st.label,width:st.width,visible:st.visible,rowspan:cellFields.length-1,wz:"row",index:i};
            columns.push(col);
         };
         if(s!="$total$"){
            ab(s);
         }else{
            const col={name:s,label:"统计列",width:80,rowspan:cellFields.length-1,wz:"row",index:i};
            columns.push(col);
         }
      });
      const indexV={};
      valueFields.forEach((s,i)=>{indexV[s]=i;});
      const sz=abc(cellData);
      const sortCell=(a,b)=>{
         if(a===b)return 0;
         const a1=a.split("|"),b1=b.split("|");
         for(let i=0;i<cellFields.length;i++){
            if(a1[i]===b1[i])continue;
            const v=cellFields[i];
            if(v=="$total$"){
               return indexV[a1[i]]-indexV[b1[i]];
            }else{
               if(a1[i].indexOf("ZZZZZZ")!=-1||b1[i].indexOf("ZZZZZZ")!=-1){
                  return a1[i].localeCompare(b1[i]);
               };
               const st=dsData.getField(v);
               const isasc=st.sort;
               const v1=vMap[a1[i]],v2=vMap[b1[i]];
               const aa1=v1.replace(/\d/gi,""),bb1=v2.replace(/\d/gi,"");
               if(aa1===bb1 && (v1+"").indexOf(bb1)!=-1 && (v2+"").indexOf(bb1)!=-1){
                  let vv1=v1.replace(/\D/gi,""),vv2=v2.replace(/\D/gi,"");
                  vv1=vv1==""?0:Number(vv1);
                  vv2=vv2==""?0:Number(vv2);
                  return isasc=="asc"?vv1-vv2:vv2-vv1;
               }else{
                  return isasc=="asc"?v1.localeCompare(v2):v2.localeCompare(v1);
               }
            }
         }
      };
      const cArr=sz.sort(sortCell);
      const getCol=(str)=>{
         if(valueFields.length==1){
            return {field:dsData.getField(valueFields[0]),name:valueFields[0]};
         }
         else{
            if(setting.rowfields.indexOf("$total$")!=-1){
               return {field:{label:"value",width:80},name:"$total$"};
            }else{
               let xh=0;
               cellFields.forEach((s,i)=>{if(s=="$total$"){xh=i;}});
               const s=str.split("|");
               return {field:dsData.getField(s[xh]),name:valueFields[xh]};
            }
         }
      };
      cArr.forEach((s,i)=>{
         const xh=getXh(i);
         const f=getCol(s);
         const col={
            name:xh,label:f.field.label,
            type:"text",
            width:f.field.width,field:s,
            tag:{name:s},
            total:f.name,wz:"cell",align:"right"};
            columns.push(col);
      });
      self.gridData.columns=columns;
      self.gridData.fixed=rowFields.length;
      const createHead=()=>{
         if(columns.length==0)return;
         const rcount=cellFields.length==0?1:cellFields.length;
         for(let i=0;i<rcount;i++){
            const sz=[],mpp={};
            if(i==0){
               columns.forEach(r=>{
                  if(r.wz=="row")sz.push(r);
                  else{
                     const field=r.field.split("|");
                     const str=field[i];
                     if(mpp[str]==null){
                        const ff=dsData.getField(str);
                        let v=ff==null?vMap[str]:ff.label;
                        if(str==="ZZZZZZR")v="汇总";
                        else if(str==="ZZZZZZI")v=i<rcount-1?"":"组小计";
                        const col2={name:str,label:v,field:r.field};
                        mpp[str]=0;
                        sz.push(col2);
                     }else{
                        mpp[str]+=1;
                     }
                  }
               });
            }else{
               columns.forEach(r=>{
                  if(r.wz=="cell"){
                     const field=r.field.split("|");
                     const str=field[i];
                     const arr2=field.splice(0,i+1);
                     const key=arr2.join("|");
                     if(mpp[key]==null){
                        const ff=dsData.getField(str);
                        let v=ff==null?vMap[str]:ff.label;
                        if(str==="ZZZZZZR")v="汇总";
                        else if(str==="ZZZZZZI")v=i<rcount-1?"":"组小计";
                        const col2={name:key,label:v,field:r.field};
                        mpp[key]=0;
                        sz.push(col2);
                     }else{
                        mpp[key]+=1;
                     }
                  }
               });
            };
            sz.forEach(r=>{
               if(mpp[r.name]!=null)r.colspan=mpp[r.name];
            });
            head.push(sz);
         }
      };
      createHead();
      self.gridData.head=head;
      //--------------------------------
      const sortRow=(a,b)=>{
         if(a===b)return 0;
         const a1=a.split("|"),b1=b.split("|");
         for(let i=0;i<rowFields.length;i++){
            if(a1[i]===b1[i])continue;
            const v=rowFields[i];
            if(v=="$total$"){
               return indexV[a1[i]]-indexV[b1[i]];
            }else{
               const st=dsData.getField(v);
               const isasc=st.sort;
               const v1=vMap[a1[i]],v2=vMap[b1[i]];
               const aa1=v1.replace(/\d/gi,""),bb1=v2.replace(/\d/gi,"");
               if(aa1===bb1 && (v1+"").indexOf(bb1)!=-1 && (v2+"").indexOf(bb1)!=-1){
                  let vv1=v1.replace(/\D/gi,""),vv2=v2.replace(/\D/gi,"");
                  vv1=vv1==""?0:Number(vv1);
                  vv2=vv2==""?0:Number(vv2);
                  return isasc=="asc"?vv1-vv2:vv2-vv1;
               }else{
                  return isasc=="asc"?v1.localeCompare(v2):v2.localeCompare(v1);
               }
            }
         }
      };
      const rsz=abc(rowData);
      const rsz2= rsz.sort(sortRow);
      rsz2.forEach(r=>{
         const row={},strArr=r.split("|");
         columns.forEach(col=>{
            if(col.wz=="row"){
               const name=col.name;
               const r1=strArr[col.index];
               if(name=="$total$"){
                  const ff=dsData.getField(r1);
                  row[name]=ff.label;
               }else{
                  row[name]=vMap[r1];
               }
            }else{
               const key=r+"|"+col.field;
               let rr=allData[key];
               if(valueFields.length==1){rr=rr==null?{}:rr[valueFields[0]];};
               const vv=rr==null||rr.value==null||isNaN(Number(rr.value))?0:Number(rr.value);
               row[col.name]=vv===0?"":rr.value;
            }
         })
         self.gridData.rows.push(row);
      });
      //----------------------footer
    
      if(setting.rowfields.indexOf("$total$")!=-1){
         valueFields.forEach(f=>{
            const footer=[];
            const vf=dsData.getField(f);
            columns.forEach((r,i)=>{
               if(r.wz=="row"){
                  footer.push({name:r.name,label:i==0?vf.label+"小计":""});
               }else{
                  const col={name:r.name},f2=r.field;
                  let rr=cellData[f2];
                  rr=rr[f]
                  col.label=rr==null||rr.value==null?"":rr.value;
                  footer.push(col);
               }
            });
            self.gridData.footer.push(footer);
         });
      }else{
         const footer=[];
         columns.forEach((r,i)=>{
            if(r.wz=="row"){
               footer.push({name:r.name,label:i==0?"小计":""});
            }else{
               const col={name:r.name},f=r.field;
               let rr=cellData[f];
               if(valueFields.length==1){
                  rr=rr=null?{}:rr[valueFields[0]];
               }
               col.label=rr==null||rr.value==null?"":rr.value;
               footer.push(col);
            }
         });
         self.gridData.footer.push(footer);
      }
   };
   self.gridData={columns:[],head:[],footer:[],rows:[],fixed:0};
   return self;
};
export {
	ReportModular
};
export default {};