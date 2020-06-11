<template>
  <div class="nav-menu control" :id="id">
      <div class="nav-menu-head" v-bind:style="[{height:navmenu.height+'px'}]" :for="id">
         <canvas :id="id+'_canvas'" style="position: absolute;"></canvas>
      </div>
  </div>
</template>

<script>
import {navMenuStyle} from '@/scss/common/gridStyle'
import myStore from '@/store/myStore'
import {Navigation} from '@/components/js/navmenu'
const navs={};
export default {
   name:"navmenu",
   props:{
      navmenu:{type:Object,default:()=>{}}
   },
   data(){
      return {
         id:"id_"+new Date().getTime()+"_T_"+Math.ceil(Math.random()*10000+1),
         css:{},
         eids:[]
      }
   },beforeMount(){
      const view=this;
		const key=myStore.addEvent("style",function(value,oldvalue){
         view.css=navMenuStyle[value];navs[view.id].changeStyle();
		});
		this.eids.push(key);
      const style=myStore.getItem("style")||'default';
      this.css=navMenuStyle[style];
   },
   mounted(){
      navs[this.id]=new Navigation(this);
   },destroyed(){
      if(navs[this.id]!=null)navs[this.id].destroyed();
      delete navs[this.id];
		myStore.removeEvent(this.eids);
   }
};
</script>

<style>

</style>