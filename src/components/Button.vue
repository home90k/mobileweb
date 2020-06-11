<template>
<div class="control" v-show="visible" style="display: inline-block;flex:none;height:32px;overflow:hidden;">
  <button :id="id" v-show="visible" @click="buttonClick" @mousedown="mouseDownEvt" @mouseup="mouseUpEvt" :disabled="disabled" v-bind:class="'view-button button-'+type+(disabled?' button-disabled':'') ">
      <div style="height:20px;overflow:hidden;">
         <span  v-show="icon!=''&&position=='left'"  class="iconfont" v-html="icon"></span>
         <span v-if="label=='更多'" class="iconfont"> &#xe6e2;</span>
         <span v-else-if="label.indexOf('&')==0" class="iconfont"  v-html="label"></span>
         <span  v-else class="view-button-text" v-text="label"></span>
         <span v-show="icon!=''&&position=='right'" class="iconfont" v-html="isopen?upicon:icon"></span>
      </div>
  </button>
   <div class="view-button-childs" :id="id+'_childs'">
      <button v-for="item in child" :key="item.name" v-show="item.visible"  @click="buttonClick2(item)" @mousedown="mouseDownEvt" @mouseup="mouseUpEvt" :disabled="disabled" v-bind:class="'view-button button-'+type+(disabled?' button-disabled':'')">
         <div style="height:20px;overflow:hidden;">
            <span  v-show="item.icon!=''&&item.position==='left'"  class="iconfont" v-html="item.icon"></span>
            <span class="view-button-text" v-text="item.label"></span>
            <span v-show="item.icon!=''&&item.position==='right'" class="iconfont" v-html="item.icon"></span>
         </div>
      </button>
   </div>
</div>
</template>

<script>
export default {
   props:{
      type:{type:String,default:"search"},
      label:{type:String,default:""},
      icon:{type:String,default:""},
      name:{type:String,default:""},
      child:{type:Array,default:()=>[]},
      position:{type:String,default:"left"},
      disabled:{type:Boolean,default:false},
      visible:{type:Boolean,default:true},
   },
   name:"",
   data(){
      return {
         id:"id_"+new Date().getTime()+"_B_"+Math.ceil(Math.random()*10000+1),
         isopen:false,
         upicon:"&#xe6f2;"
      }
   },
   destroyed(){
       document.removeEventListener("click",this.openChilds);
   },
   methods:{
      buttonClick(){
         if(this.disabled)return;
         this.$emit("button-click",this.name);
      },
      buttonClick2(item){
         if(this.disabled||item.disabled)return; 
         this.$emit("command",{name:this.name,child:item});
         this.closeChild();
      },
      closeChild(){
         const nd2=document.querySelector("#"+this.id+"_childs");
         if(nd2!=null)nd2.style.display="none";
         document.removeEventListener("click",this.openChilds);
         this.isopen=false;
      },
      openChilds(e){
         if(this.child==null||this.child.length==0)return;
         const target=e.target,nd=document.querySelector("#"+this.id).parentNode;
         if(target!==nd&&!nd.contains(target)){
           this.closeChild();
         }
      },
      mouseDownEvt(e){
         if(this.disabled)return;
         if(this.child.length>0){
            if(this.isopen){
               this.closeChild();
            }else{
                this.isopen=true;
               const nd=document.querySelector("#"+this.id);
               const nd2=document.querySelector("#"+this.id+"_childs");
               const ps=nd.getBoundingClientRect();
               nd2.style.display="flex";
               nd2.style.top=(ps.top+ps.height+2)+"px";
               nd2.style.left=ps.left+"px";
               document.addEventListener("click",this.openChilds);
            }
         }
         //else{
           const nn=document.querySelector("#"+this.id);
           nn.style.marginTop="2px";
        // }
      },
      mouseUpEvt(e){
         if(this.disabled)return;
         //if(this.child==null||this.child.length==0){
            const nn=document.querySelector("#"+this.id);
            nn.style.marginTop="0px";
        // };
      }
   }
}
</script>

<style>
/*.view-button .iconfont{
   height:14px;
   overflow: hidden;
   display: inline-block;
}*/
</style>