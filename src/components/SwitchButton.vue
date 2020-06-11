<template>
    <div class="switch-button"  v-bind:class="!readonly?'':'switch-button-readonly'">
      <span class="switch-button-left" v-bind:class="value2===options[0].value?'switch-active':''"  v-show="options[0].label!==''" v-text="options[0].label"  v-on:click="clickEvt('left')"></span>
      <span class="switch-button-icon" v-bind:class="value2===options[0].value?'switch-active':''" v-on:click="clickEvt('center')">
        <span class="switch-button-ball"></span>
      </span>
      <span class="switch-button-right" v-bind:class="value2!==options[0].value?'switch-active':''"  v-show="options[1].label!==''" v-text="options[1].label"  v-on:click="clickEvt('right')"></span>
    </div>
</template>

<script>
export default {
   name:"switchbutton",
   props:{
    value:[Boolean,String,Number],
    options:{type:Array,default:[{value:true,label:""},{value:false,label:""}]},
    readonly:{type:Boolean,default:false},
    disabled:{type:Boolean,default:false},
    visible:{type:Boolean,default:true}
   },
   data(){
     return {
       value2:""
    }
   },beforeMount(){
     this.value2=this.value;
   },
   methods:{
     clickEvt(tp){
        if(this.readonly||this.disabled)return;
        const v2=this.options[0].value,v3=this.options[1].value;
        this.value2=this.value2===v3?v2:v3;
     }
   },watch:{
     value(value,oldv){
       this.value2=value;
     },
     value2(v,v2){
       this.value2=v;
       this.$emit("change",v);
     }
   }
}
</script>

<style>

</style>