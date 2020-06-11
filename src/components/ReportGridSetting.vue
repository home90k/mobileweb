<template>
  <div class="view report-show">
     <div class="report-all-fields">
        <div class="report-head">字段列表</div>
        <div class="report-list" type="all" @dragover="dragoverEvt" @drop="dropEvt">
           <div class="report-item"  @dragstart="dragstartEvt" type="all" draggable='true' v-for="item in fields" :key="item.key" :name="item.name">
              <div class="report-title" v-text="item.label"></div>
              <div class="report-value">
                  <select v-model="item.totaltype">
                     <option value="sum">求和</option>
                     <option value="avg">平均值</option>
                     <option value="min">最小值</option>
                     <option value="max">最大值</option>
                     <option value="count">个数</option>
                  </select>
              </div>
              <div class="report-close"><span class="iconfont" style="font-size:10px">&#xe608;</span></div>
           </div>
        </div>
     </div>
     <div class="report-row-fields">
       <div class="report-head">行区域</div>
       <div class="report-list" type="row" @dragover="dragoverEvt" @drop="dropEvt">
            <div class="report-item" v-show="showEvt(item)" v-bind:class="item.name==dropParams.name&&currenttype=='row'?'report-current':''" @dragstart="dragstartEvt" type="row"  draggable='true' v-for="item in rows" :key="item.key" :name="item.name">
              <div class="report-title" v-text="item.label"></div>
              <div class="report-value">
                  <select v-model="item.totaltype">
                        <option value="sum">求和</option>
                        <option value="avg">平均值</option>
                        <option value="min">最小值</option>
                        <option value="max">最大值</option>
                        <option value="count">个数</option>
                     </select>
              </div>
              <div class="report-close"  @click="removeEvt('row',item.name)"><span class="iconfont" style="font-size:10px">&#xe608;</span></div>
           </div>
       </div>
     </div>
      <div class="report-other-fields">
         <div class="report-cell-fields">
            <div class="report-head">列区域</div>
            <div class="report-list" type="cell" @dragover="dragoverEvt" @drop="dropEvt">
               <div class="report-item" v-show="showEvt(item)" v-bind:class="item.name==dropParams.name&&currenttype=='cell'?'report-current':''" @dragstart="dragstartEvt" type="cell"  draggable='true' v-for="item in cells" :key="item.key" :name="item.name">
                  <div class="report-title" v-text="item.label"></div>
                  <div class="report-value">
                      <select v-model="item.totaltype">
                        <option value="sum">求和</option>
                        <option value="avg">平均值</option>
                        <option value="min">最小值</option>
                        <option value="max">最大值</option>
                        <option value="count">个数</option>
                     </select>
                  </div>
                  <div class="report-close"  @click="removeEvt('cell',item.name)"><span class="iconfont" style="font-size:10px">&#xe608;</span></div>
               </div>
            </div>
         </div>
         <div class="report-value-fields">
            <div class="report-head">数据区域</div>
            <div class="report-list" type="value" @dragover="dragoverEvt" @drop="dropEvt">
               <div class="report-item" v-bind:class="item.name==dropParams.name&&currenttype=='value'?'report-current':''"  @dragstart="dragstartEvt"  draggable='true' type="value" v-for="item in values" :key="item.key" :name="item.name">
                  <div class="report-title" v-text="item.label"></div>
                  <div class="report-value">
                     <select v-model="item.totaltype">
                        <option value="sum">求和</option>
                        <option value="avg">平均值</option>
                        <option value="min">最小值</option>
                        <option value="max">最大值</option>
                        <option value="count">个数</option>
                     </select>
                  </div>
                  <div class="report-close"  @click="removeEvt('value',item.name)"><span class="iconfont" style="font-size:10px">&#xe608;</span></div>
               </div>
            </div>
         </div>
     </div>
  </div>
</template>

<script>
export default {
   props:{
      subwindow:{type:Object,default:()=>{}}
   },
   data(){
      return {
         fields:[],
         rows:[],
         cells:[],
         values:[],
         dropParams:{},
         overname:"",
         fieldMap:{},
         currenttype:""
      }
   },
   beforeMount(){
      this.subwindow.addEvent("afteropen",this.afteropen);
      const report=this.subwindow.params.report;
      report.addEvent("btnOk",()=>{
          const ab=(sz)=>{
             const ar=[];
            if(sz!=null&&sz.length>0)sz.forEach(r=>{
               const name=r.name;
               if(name!="$number$"){
                  ar.push(name);
               }else{
                  this.values.forEach(r=>{
                     ar.push(r.name);
                  });
               }
            });
            return ar.join(",");
          };
         const a=ab(this.rows),b=ab(this.cells),c=ab(this.values);
         report.attr({rowfields:a,cellfields:b,valuefields:c});
      });
   },
   mounted(){
      this.afteropen();
   },
   methods:{
      showEvt(item){
         if(item.name==="$total$"){ return this.values.length>1;}else return true;
      },
      dropEvt(e){
         e.preventDefault();
         if(this.currenttype=="all"&&this.dropParams.name=="$total$"){
            this.values=[];
         }
         this.dropParams={};
         this.currenttype="";
         this.overname="";
         if(this.values.length<=1){
            const nd=document.querySelectorAll(".report-item[name='$total$']");
            if(nd.length>0){
               this.removeField("row","$total$");
               this.removeField("cell","$total$");
            }
         }
      },
      dragoverEvt(e){
         e.preventDefault();
         const target=e.target;
         const type=target.getAttribute("type");
         if(!this.isNull(type)){
            if(this.currenttype!==type){
               const oldvalue=this.currenttype;
               this.currenttype=type;
               if(!this.isNull(oldvalue)){
                  this.removeField(oldvalue,this.dropParams.name);
               }
            };
            if(type!="all"||this.dropParams.type!="all"){
                  let name=target.getAttribute("name"),position="after";
                  if(this.isNull(name)){
                     let ls=0,sz=[];
                      if(type=="row")sz=this.rows;
                      else if(type=="cell")sz=this.cells;
                      else if(type=="value")sz=this.values;
                      ls=sz.length*30;
                     if(e.offsetY>ls&&sz.length>0){
                        name=sz[sz.length-1].name;
                     }else name=this.dropParams.name;
                  }else{
                     const ps=target.getBoundingClientRect(),y=e.pageY,yb=Math.floor(ps.height/2);
                     if(y<ps.top+yb){
                        position="before";
                     }
                  };
                  const str=name+"|"+type+"|"+position;
                 if(this.overname!=str){
                    this.overname=str;
                    this.movefield(type,name,position);
                 };
            }
         }
      },
      dragstartEvt(e){
         const target=e.target;
         const rr={name:target.getAttribute("name"),type:target.getAttribute("type")};
         this.dropParams=rr;
      },
      movefield(type,name,position){
         if(this.dropParams.name=="$total$"&&type=="value"){return;};
         const name2=this.dropParams.name;
         const ab=(rows)=>{
            const arr=[];
            let isf=false;;
            rows.forEach(r=>{
               if(r.name==name){
                  isf=true;
                  const mv=this.fieldMap[this.dropParams.name];
                  if(position=="before")arr.push(mv);
                  if(r.name!==this.dropParams.name)arr.push(r);
                  if(position=="after")arr.push(mv);
               }else if(r.name!==this.dropParams.name){
                  arr.push(r);
               }
            });
            if(!isf){
              const mv=this.fieldMap[this.dropParams.name];  
              arr.push(mv);
            };
            return arr;
         };
         if(type=="row"){
           this.rows=ab(this.rows);
           this.removeField("cell",this.dropParams.name);
           this.removeField("value",this.dropParams.name);
         }else if(type=="cell"){
            this.cells=ab(this.cells);
            this.removeField("row",this.dropParams.name);
            this.removeField("value",this.dropParams.name);
         }else if(type=="value"){
            this.values=ab(this.values);
            this.removeField("row",this.dropParams.name);
            this.removeField("cell",this.dropParams.name);
         }
         if(this.values.length>1&&this.dropParams.name!="$total$"){
             const nd=document.querySelectorAll(".report-item[name='$total$']");
             if(nd.length==0){
                this.cells.push({name:"$total$",label:"数据集",totaltype:"sum"})
             }
         }
      },
      removeField(type,name){
         const ab=(rows)=>{
            const arr=[];
            rows.forEach(r=>{if(name!==r.name)arr.push(r);});
            return arr;
         }
         if(type=="row"){
           this.rows=ab(this.rows);
         }else if(type=="cell"){
            this.cells=ab(this.cells);
         }else if(type=="value"){
            this.values=ab(this.values);
         };
      },
      afteropen(){
         const report=this.subwindow.params.report;
         const dsData=report.view[report.dataset];
         this.fields=dsData.fields;
         this.fieldMap={};
         this.fields.forEach(r=>{this.fieldMap[r.name]=dsData.getField(r.name);});
         this.fieldMap["$total$"]={name:"$total$",label:"数据集",totaltype:"sum"};
         const ab=(str)=>{
            const arr=[];
            if(!this.isNull(str)){
               const arr2=str.split(",");
               arr2.forEach(s=>{
                  if(s=="$total$"){
                     arr.push({name:"$total$",label:"数据集",totaltype:"sum"});
                  }else{
                     const field=dsData.getField(s);
                     if(field!=null){
                        arr.push(field);
                     }
                  };
               })
            }
            return arr;
         };
         this.rows=ab(report.rowfields);
         this.cells=ab(report.cellfields);
         this.values=ab(report.valuefields);
      },
      removeEvt(type,name){
         if(type=="row"){ 
            const arr=[];
            this.rows.forEach(r=>{
               if(r.name!=name){arr.push(r);}
            });
            this.rows=arr;
            if(name=="$total$")this.values=[];
        }else if(type=="cell"){
            const arr=[];
            this.cells.forEach(r=>{
               if(r.name!=name){arr.push(r);}
            });
            this.cells=arr;
             if(name=="$total$")this.values=[];
        }else if(type=="value"){
            const arr=[];
            this.values.forEach(r=>{
               if(r.name!=name){arr.push(r);}
            });
            this.values=arr;
        }
      }
   }
}
</script>

<style>
.report-show{
   flex-direction: row;
   -moz-user-select: none;
	-webkit-user-select: none;
   user-select: none;
   color:rgb(103, 106, 108);
}
</style>