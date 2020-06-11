<template>
<div class="editor-item control" v-bind:style="[{height:element_height+'px',width:total_width+'px',margin:rowspacing+'px '+spacing+'px'}]">
	<div  class="editor date-select" v-show="visible" v-bind:style="[{height:element_height+'px',width:total_width+'px'}]">
		<span v-show="!hideLabel" class="editor-label" v-text="label" v-bind:style="[{width:(labelWidth)+'px',height:element_height+'px','line-height':element_height+'px','text-align':labelAlign,padding:'0px '+text_spacing+'px'}]">
		</span>
		<div class="editor-input-body"  @click="selectOpen" style="border:0px" v-bind:style="[{height:element_height+'px','text-align':'right'}]">
			<input :name="names" :type="type" autocomplete="off" 
				class="editor-input" readonly="readonly" :disabled="disabled" v-bind:style="[{width:(element_width-2-16)+'px',
				height:(element_height)+'px',padding:'0px '+text_spacing+'px',
				'line-height':(element_height)+'px','text-align':'center'}]" v-model="label2" @focus="$event.target.select()" />
			<div style="width:16px;"  class="editor-down-icon" v-bind:style="[{height:(element_height)+'px'}]" >
				<i v-bind:class="dropdown_open?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
			</div>
		</div>
	</div>
	<div v-if="type=='select'" class="editor-select" :id="select_id" v-show="dropdown_open" v-bind:style="[{'min-width':(element_width-2)+'px','max-height':maxHeight_+'px'}]">
		<div v-for="item in options" :key="item.value" @click="selected(item)" v-bind:class="item.value===value2?'select-active select-option':'select-option'"><span v-text="item.label"></span></div>
	</div>
</div>
</template>

<script>
export default {
	name:"Select",
	props: {
		maxHeight:{type:Number,default:150},
		name: {
			type: String,
			default: ""
		},
		disabled: {
			type: Boolean,
			default: false
		},
		visible: {
			type: Boolean,
			default: true
		},
		showline: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: "text"
		},
		label: {
			type: String,
			default: ""
		},
		height: {
			type: Number,
			default: 32
		},
		width: {
			type: Number,
			default: 240
		},
		value: {
			default: ""
		},
		hideLabel: {
			type: Boolean,
			default: false
		},
		labelWidth: {
			type: Number,
			default: 80
		},
		labelAlign: {
			type: String,
			default: "left"
		},
		align: {
			type: String,
			default: "left"
		},
		placeholder: {
			type: String,
			default: ""
		},
		showType: {
			type: String,
			default: ""
		},
		colspan: {
			type: Number,
			default: 1
		},
		rowspan: {
			type: Number,
			default: 1
		},
		options: {
			type: Array,
			default: () => []
		},
		datatype: {
			type: String,
			default: "string"
		},
		format: {
			type: String,
			default: ""
		},
		spacing: {
				type: Number,
				default: 5
		},
		rowspacing: {
			type: Number,
			default: 0
		},
		text_spacing: {
			type: Number,
			default: 3
		},
		setting:{type:Object,default:()=>{}}
	},
	data() {
		return {
			value2: "",
			label2:"",
			dropdown_open:false,
			format2: "",
			rows:[],
			element_width: 0,
			element_height: 0,
			total_width: 0,
			checkgroup: {},
			dropdown_:{},
			dropdown_id:"",
			disdd:false,
			maxHeight_:150,
			select_id: "D" + new Date().getTime() + "-" + Math.ceil(Math.random() * 10000 + 1),
			names: "N" + new Date().getTime() + "-" + Math.ceil(Math.random() * 10000 + 1),
			position:{}
		}
	},
	mounted() {
		this.change_size();
		this.value2 = this.value;
		this.initLabel();
	},
	watch: {
		value(v, oldv) {this.value2 = v; this.initLabel();},
		value2(v, oldv) {
			this.$emit("change", { name: this.name, value: v});
			this.disdd=false;
		},
		width(v) {
			this.change_size();
		},
		labelWidth(v) {
			this.change_size();
		},
		spacing(v) {
			this.change_size();
		},
		rowspacing(v) {
			this.change_size();
		},
		text_spacing(v) {
			this.change_size();
		},
	},
	methods: {
		change(v){ this.value2=v;},
		initLabel(){
			let lb="",isfd=false;;
			if(this.options!=null){
				this.options.forEach(item=>{
					if(item.value===this.value2){
						lb=item.label;
						isfd=true;
					}
				})
			};
			this.label2=isfd?lb:"<"+this.value2+">";
		},
		change_size() {
			const jianju = 2 * this.spacing, rowjianju = 2 * this.rowspacing;
			this.total_width = this.width * this.colspan + (this.colspan - 1) * jianju;
			this.element_width = this.total_width;// (this.hideLabel ? 0 : this.labelWidth);
			this.element_height = (this.height * this.rowspan) + (this.rowspan - 1) * rowjianju;
		},
		resizeHeight(){
			const node=document.querySelector("#"+this.select_id);
			if(node==null)return;
			const body=document.querySelector("body");
			const bodyps=body.getBoundingClientRect();
			const ps=this.position;
			const h1=Math.floor(bodyps.height);
			let top=this.element_height+ps.y-this.rowspacing+3;
			this.maxHeight_=this.maxHeight;
			const ab=function(){
				const pp=node.getBoundingClientRect();
				if(pp.height==0){
					setTimeout(function(){ab(); },100);
				}else{
					if(top+pp.height>bodyps.height){
						if(ps.y>pp.height){//向上展开
							node.style.top=(ps.y-pp.height)+"px";
						}else{
							if(ps.y>h1-ps.y){
								this.maxHeight_=ps.y;
									node.style.top="0px";
							}else{
								this.maxHeight_=h1-ps.y-this.element_height+this.rowspacing-3;
								node.style.top=top+"px"; 
							}
						}
					}else{
						node.style.top=top+"px";
					}
				}
			};
			ab();
			const css={top:"1500px",left:(ps.x+2)+"px"};
			for(const k in css){node.style[k]=css[k]};
		},
		selected(row){
			this.disdd=true;
			this.label2=row.label;
			this.value2=row.value;
			this.dropdown_open=false;
		},
		selectOpen(e){
			if(this.disabled)return;
			this.dropdown_open=true;
			let bd=e.target;
			while(!bd.classList.contains("editor-input-body")){
				bd=bd.parentNode;
			};
			let ps=bd.getBoundingClientRect();
			const view=this;
			const node=document.querySelector("#"+this.select_id);
			node.style.top=(ps.top+ps.height+2)+"px";
			node.style.left=(ps.left)+"px";
			const close_evt=function(e2){
				const target=e2.target;
				if(target!=bd&&!bd.contains(target)&&target!=node&&!node.contains(target)){
					document.removeEventListener("click",close_evt);
					view.dropdown_open=false;
				}
			};
			document.addEventListener("click",close_evt);
		}
	}
}
</script>

<style>

</style>
