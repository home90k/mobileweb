<template>
	<div :class="mode+' split-panel control'" :id="id" v-bind:style="[{'flex-direction':mode==='horizontal'?'initial':'column'}]">
			<div :class="mode+' split-panel-start'" v-show="wz!=='start'" :for="id" v-bind:style="[{flex:fixedposition=='end'?1:'none',width:mode==='horizontal'&&fixedposition=='start'?position2+'px':'100%',height:mode==='vertical'&&fixedposition=='start'?position2+'px':'100%'}]">
				<slot name="start"></slot>
			</div>
			<div :class="mode+' split-bar'" :for="id" v-bind:style="[{width:mode==='horizontal'?barsize+'px':'100%',height:mode==='horizontal'?'100%':barsize+'px','flex-direction':mode==='horizontal'?'column':'initial',cursor:mode==='horizontal'?'ew-resize':'ns-resize'}]">
					<i v-if="mode==='horizontal'" @click="goto('start')" v-bind:class="wz=='start'?'split-bar-disabled':'split-bar-active'" data-status='prev' class="el-icon-caret-left" style="cursor:pointer;"></i>
					<i v-else-if="mode==='vertical'"  @click="goto('start')" v-bind:class="wz=='start'?'split-bar-disabled':'split-bar-active'"  data-status='prev' class="el-icon-caret-top" style="cursor:pointer;"></i>
					<i v-if="mode==='horizontal'" @click="goto('end')" v-bind:class="wz=='end'?'split-bar-disabled':'split-bar-active'" data-status='next' class="el-icon-caret-right" style="cursor:pointer;"></i>
					<i v-else-if="mode==='vertical'" @click="goto('end')"  v-bind:class="wz=='end'?'split-bar-disabled':'split-bar-active'"  data-status='next' class="el-icon-caret-bottom" style="cursor:pointer;"></i>
			</div>
			<div :class="mode+' split-panel-end'" v-show="wz!=='end'" :for="id" v-bind:style="[{flex:fixedposition=='start'?1:'none',width:mode==='horizontal'&&fixedposition=='end'?position2+'px':'100%',height:mode==='vertical'&&fixedposition=='end'?position2+'px':'100%'}]">
				<slot name="end"></slot>
			</div>
	</div>
</template>

<script>
import {Splitpanel} from '@/components/js/splitpanel'
const splits={};
export default {
	name:"splitpanel",
	props:{
		mode:{type:String,default:"horizontal"},
		barposition:{type:String,default:"center"},
		position:{type:Number,default:300},
		fixedposition:{type:String,default:"start"},
		dismove:{type:Boolean,default:false},
		width:{type:Number,default:0},
		height:{type:Number,default:0}
	},data(){
		return {
			id:"id_"+new Date().getTime()+"R"+Math.ceil(Math.random()*10000+1),
			wz:"center",
			position2:0,
			barsize:8
		}
	},
	beforeMount(){
		this.position2=this.position;
	},
	methods:{
		goto(tp){
			event.stopPropagation();
			const setting=splits[this.id];
			setting.goto(tp);
		}
	},
	mounted(){
		splits[this.id]=new Splitpanel(this)
	},destroyed(){
		//if(splits[this.id]!=null)splits[this.id].destroyed();
	}
}
</script>
	
<style>
	
</style>
