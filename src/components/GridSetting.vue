<template>
  <div class="view" style="overflow:hidden;">
    <tabset :tabset="tabset1">
      <div :slot="tabset1.name" class="tab-items" style="width:100%;height:100%;">
        <div tab="tab1">
           <div style="display:flex;width:100%;height:100%;">
            <div style="width:100%;height:100%;">
             <grid :grid="gridData"></grid>
            </div>
           </div>
        </div>
        <div tab="tab2">
             <div style="display:flex;width:100%;height:100%;">
              <div style="width:580px;height:100%;">
                <grid :grid="gridData1"></grid>
              </div>
               <div style="width:100%;height:100%;">
                <grid :grid="gridSort"></grid>
              </div>
           </div>
        </div>
        <div tab="tab3">
            
        </div>
        <div tab="tab4">
            
        </div>
      </div>
    </tabset>
      <search :search="search" style="margin-top:2px;">
        <div slot="body" v-show="showfixed">
          <editor :editor="element_fixed"></editor>
        </div>
      </search>
  </div>
</template>

<script>
    import {Misc,Tabset,Dataset,Grid,Search,Editor} from '@/components/js/controls'
    export default {
      name:"GridSetting",
      props:{
         subwindow:{type:Object,default:()=>{}}
      },
      data(){
        return {
          autoopen:["root"],
          showfixed:true
        }
      },
      beforeMount(){
        const view=this;
        const key=view.subwindow.params.key;
        const grid=view.subwindow.params.grid;
        new Tabset(this,{
          name : "tabset1",
          tabs : [
           {name:"tab1",label:"列设置"},
           {name:"tab2",label:"多列排序"},
           {name:"tab3",label:"多列查询",visible:false},
           {name:"tab4",label:"交叉表",visible:false}
         ],
         afterchange:(tab)=>{
          const showtab1=tab.name==="tab1";
          const showtab2=tab.name==="tab2";
          this.showfixed=showtab1;
          
          this.search.buttonAttr({btn1:{visible:showtab1},
                                  btn2:{visible:showtab1},
                                  btn3:{visible:showtab2},
                                  btn4:{visible:showtab2},
                                  btn5:{visible:showtab2}
                                });
         }
        });
        new Dataset(this,{
          name:"dsData",
          fields:[
            {name:"select"},
            {name : "name",label : "名称",width:150,readonly:true},
            {name : "label",label : "标题",width:120,readonly:true},
            {name : "width",label:"宽度",width:100,datatype:"int"},
            {name : "visible",label : "显示",width:35,type : "checkbox",value : false,datatype : "boolean"},
            {name : "fixed",label : "固定",width:35,type : "checkbox",value : false,datatype : "boolean"}
          ]
        });
        new Dataset(this,{
          name:"dsData1",
          fields:[
            {name:"select"},
            {name : "name",label : "名称",width:150,readonly:true},
            {name : "label",label : "标题",width:120,readonly:true}
          ]
        });
        new Dataset(this,{
          name:"dsSort",
          fields:[
            {name:"select"},
            {name : "name",label : "名称",width:150,readonly:true},
            {name : "label",label : "标题",width:120,readonly:true},
            {name : "sort",label : "升序",width:45,datatype:"boolean",value:true}
          ]
        });

        new Grid(this,{
           name:"gridData",
           shownumber:false,
           opensetting:false,
           savesetting:false,
           dataset:"dsData",
           columns:["name","label","visible","width"]
        });
         new Grid(this,{
           name:"gridData1",
           shownumber:false,
           opensetting:false,
           savesetting:false,
           dataset:"dsData1"
        });
        new Grid(this,{
           name:"gridSort",
           shownumber:false,
           opensetting:false,
           savesetting:false,
           dataset:"dsSort"
        });
        new Search(this,{
          showbutton : ["btn1","btn2","btn3","btn4","btn5"],
          show:false,
          align:"right",
          buttons:{
            btn1:{
              label:"恢复默认",
              click:function(){
                localStorage.removeItem(key);
                grid.recovery();
                grid.refresh();
                view.subwindow.close();
              }
            },
            btn2:{
              label:"确定",
              click:()=>{
                const rs=view.dsData.getData("all");
                const arr=[];
                for(let i=0;i<rs.length;i++){
                  const r=rs[i];
                  arr.push({name:r.name,width:r.width,visible:r.visible});
                };
                const rr=view.dsFixed.getCurrent(),fixed=rr==null?0:rr.fixed;
                const st={fixed:fixed,columns:arr};
                localStorage.setItem(key,JSON.stringify(st));
                grid.refresh();
                view.subwindow.close();
              }
            },
            btn3:{
              label:"添加",
              click:()=>{
                const sz=this.dsData1.getData("selected");
                const sz2=[];
                sz.forEach(r=>{
                  sz2.push({select:false,name:r.name,label:r.label,sort:true});
                });
                this.dsSort.pushData(sz2);
              }
            },
            btn4:{
              label:"移除",
              click:()=>{
                const sz=this.dsSort.getData("selected");
                if(sz.length>0){
                  this.dsSort.doDelete(sz);
                }
              }
            },btn5:{
              label:"确定",
              click:()=>{
                const sz=this.dsSort.getData("all");
                if(sz.length==0){
                  this.alert({type:"error",text:"请添加要排序的字段"});
                  return;
                }
                const sz2=[];
                sz.forEach(r=>{
                  sz2.push(r.name+" "+(r.sort?"":"desc"));
                });
                const str=sz2.join(",");
                const grid=this.subwindow.params.grid;
                const ds3=grid.view[grid.dataset];
                ds3.params2.orderyBy=str;
                ds3.doQuery();
                this.subwindow.close();
              }
            }
          }
        });
        new Dataset(this,{
          name:"dsFixed",
          fields:[{name:"fixed",datatype:"int"}]
        });
        const getOptins=()=>{
          const sz=[],ls=this.subwindow.params.grid.columns.length-1;
          for(let i=0;i<ls;i++){
            sz.push({value:i,label:i+""});
          };
          return sz;
        };
        this.dsFixed.doAdd();
        new Editor(this,{
          name:"element_fixed",
          field:"fixed",
          dataset:"dsFixed",
          label:"固定",
          labelwidth:40,
          width:110,
          type:"select",
          options:getOptins()
        });
        const load=()=>{
           if(this.subwindow==null)return;
            const grid=this.subwindow.params.grid;
            const columns=grid.columns;
            const rows=[],fcount=grid.fixed;
            const rows2=[];
            columns.forEach((name,i)=>{
                if(name!=="$number$"){
                  const col=grid.getColumn(name);
                  const nr={state:"n",select:false,
                  name:col.name,label:col.label,visible:col.visible,width:col.width};
                  const nr2=eval("("+JSON.stringify(nr)+")")
                  rows.push(nr);
                  if(name!=="select")rows2.push(nr2)
                }
            });
            this.dsData.pushData(rows);
            this.dsData1.pushData(rows2)
            let f=this.subwindow.params.fixed;
            this.dsFixed.set({fixed:f==null?0:f});
        };
       load();
       if(this.subwindow!=null)this.subwindow.addEvent("afteropen",()=>{load();});
      }
    }
</script>

<style>
</style>