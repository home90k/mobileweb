<template>
	<div  class="mini-toolbar control" >
		<span class="toolbar-div" v-for="item in toolbar" :key="item.name">
		<!-- type：cascade -->
		<button v-if="item.type=='cascader'" class="toolbar-button" :class="[item.disabled?'toolbar-button-disabled':'', item.checked?'toolbar-button-active':'']" @click="clickTool(item)">
			<span class="toolbar-button-text toolbar-button-icon-right-text">{{item.name}}</span>
			<i class="toolbar-button-icon toolbar-button-icon-right-icon el-icon-arrow-down"></i>
		</button>

		<!-- type：button -->
		<button v-if="item.type=='button'" class="toolbar-button" :class="[item.disabled?'toolbar-button-disabled':'', item.checked?'toolbar-button-active':'']" @click="clickTool(item)">
			<i v-if="item.icon" class="toolbar-button-icon toolbar-button-icon-right-icon" :class="'el-icon-my-button-'+item.icon"></i>
			<span class="toolbar-button-text" :class="item.icon?'toolbar-button-icon-right-text':'toolbar-button-icon-no'">{{item.label}}</span>
		</button>

		<!-- type：input -->
		<span class="toolbar-button-input" v-if="item.type=='input'">
			{{item.inputText?item.inputText+'：':''}}
			<el-input
				:placeholder=item.placeholder
				v-model="item.value"
				@keyup.enter.native="clickTool(item)">
			</el-input>
			<button class="toolbar-button" :class="[item.checked?'toolbar-button-active':'']" @click="clickTool(item)">
				<span class="toolbar-button-text toolbar-button-icon-no">{{item.name}}</span>
			</button>  
		</span>    
		</span>   
	</div>
</template>

<script>
export default {
	data(){
		return {
		}
	},
	props: {
		/*
		toolBar定义: toolbar
		参数说明:
		type:'cascader', // (必填) toolbar类型，目前有cascader，button，input，默认'button'
		name:'文件', // toolbar按钮的文字 默认''
		icon:'folder', // toolbar图标，需要在element-ui-zf配置想要的图标
		disabled:false, // toolbar是否可点击，
		inputName:'', // 类型是'input'时，input的名字
		placeholder:'请输入搜索项', // 类型是'input'时，input的placeholder
		value:'', // 类型是'input'时，input的value
		callback:'', // 回调的方法名，值为父组件对应请求方法名。
		*/   
		toolbar: {
		type: Array,
		required: true,
		},
	},
	methods: {
		clickTool(item){
			if(item.disabled){ // 按钮不可点击
			return
			}
			// 回调父组件方法
			if((item.callback && item.callback !== undefined)){
			if(item.type=='input'){
				this.$parent[`${item.callback}`](item.value)
			}else{
				this.$parent[`${item.callback}`]()
			}
			}
		},

		handleChange(value) {
			console.log(value);
		},
	},mounted(){
		console.log(this.toolbar)
	}
}
</script>

<style lang="scss" scope>
$toolbar-font-color: #2779aa;
$toolbar-bg-color: #fff;
.mini-toolbar{
	// 文本不被选中
	-moz-user-select:none; /*火狐*/
	-webkit-user-select:none; /*webkit浏览器*/
	-ms-user-select:none; /*IE10*/
	-khtml-user-select:none; /*早期浏览器*/
	user-select:none;
	border: solid 1px #909aa6;
	padding: 4px;
	button {
		margin: 0;
		padding: 0;
		border: 1px solid transparent;  //自定义边框
		outline: none;    //消除默认点击蓝色边框效果
		color: $toolbar-font-color;
		border-radius: 0px;
		margin-right: 4px;
		font-size: 16px;
		line-height: 26px;
		display: inline-block;
	}
	.toolbar-div{
		color: $toolbar-font-color;
		border-radius: 0px;
		margin-right: 4px;
		font-size: 16px;
		display: inline-block;
	}
	/* button */
	.toolbar-button{
		display: inline-block;
		border: 1px solid $toolbar-bg-color;
		padding: 0px 10px 0px 6px;
		cursor: pointer;
	}
	.toolbar-button-text{
		display: inline-block;
		vertical-align: middle;
	}
	.toolbar-button-icon{
		vertical-align: middle;
		display: inline-block;
		width: 16px;
		height: 16px;
	}
	.toolbar-button-icon-right-text{
		padding-right: 4px;
	}
	.toolbar-button-icon-left-text{
		padding-right: 4px;
	}
	.toolbar-button-icon-no{
		padding-left: 6px;
		padding-right: 2px;
	}
	.toolbar-button:hover{
		background: #e4f1fb ;
		color: #0070a3;
		border: 1px solid #A9ACB5;
	}
	.toolbar-button:active, .toolbar-button-active, .toolbar-button:focus{
		background: #d6e0e7;
		color: #0070a3;
		border: 1px solid #A9ACB5;
	}
	.toolbar-button-disabled{
		cursor: default !important;
		background: $toolbar-bg-color !important;
		color: #c0c4cc !important;
		border: 1px solid $toolbar-bg-color !important;
		opacity: .7 !important;
	}
	.toolbar-button-input {
		display: inline-block;
		vertical-align: middle;
		.el-input {
			width: 180px;
			input{
			border-radius: 0px;
			padding:0 5px;
			height:26px;
			line-height: 26px;
			}
		}
	}
}
</style>