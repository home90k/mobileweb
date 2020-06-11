<template>
<div class="upload-img control">
	<canvas id="canvas_img" style="display:none;"></canvas>
	<subwindow :subwindow="subWind">
		<div slot="subWind-body">
			<div class="img-top-background" >
				<label for="uploads" class="label-button" style="cursor: pointer;">选择图片</label>
				<input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
				<el-button type="primary" plain @click="changeScale(1)" class="button-default">放大</el-button>
				<el-button type="primary" plain @click="changeScale(-1)" class="button-default">缩小</el-button>
				<el-button type="primary" plain @click="rotateLeft" class="button-default">左旋转</el-button>
				<el-button type="primary" plain @click="rotateRight" class="button-default">右旋转</el-button>
				<el-button type="primary" plain @click="finish('blob')" class="button-default">裁剪</el-button>
				<div style="display:inline-block;margin-left:100px">
				宽:<el-input style="width:80px" v-model="option.autoCropWidth"></el-input>
				高:<el-input style="width:80px" v-model="option.autoCropHeight"></el-input>
				</div>
			</div>
			<div style="display:flex;border: 3px solid #49708a;margin: 10px 10px;">
				<div class="info-item" style="flex:1;">
					<div class="cropper-content" style="">
						<div class="cropper">
							<vueCropper
								ref="cropper"
								:img="option.img"
								:outputSize="option.size"
								:outputType="option.outputType"
								:info="true"
								:full="option.full"
								:canMove="option.canMove"
								:canMoveBox="option.canMoveBox"
								:original="option.original"
								:autoCrop="option.autoCrop"
								:autoCropWidth="option.autoCropWidth"
								:autoCropHeight="option.autoCropHeight"
								:fixedBox="option.fixedBox"
								@realTime="realTime"
								@imgLoad="imgLoad"
							></vueCropper>
						</div>
					</div>
				</div>
			</div>
		</div>
	</subwindow>
</div>
</template>

<script>
import adminServer from '@/server/server';
import subwindow from '@/components/Subwindow'
import {Subwindow} from '@/components/js/controls'
import { VueCropper }  from 'vue-cropper'
export default {
	props:{
		open:{type:Boolean,default:false},
		image:{type:String,default:""}
	},
	data(){
		return {
			show_gj:false,
			title:'上传图片',
			//剪切图片上传
			crap: false,
			previews: {},
			option: {
				img: '',//裁剪图片的地址
				outputSize:1, //剪切后的图片质量（0.1-1）
				full: false,//输出原图比例截图 props名full
				outputType: 'png',//裁剪生成图片的格式
				canMove: true, 
				original: false, 
				canMoveBox: true, 
				autoCrop: true, 
				autoCropWidth: 800, 
				autoCropHeight: 470, 
				fixedBox: true ,
			}, 
			fileName:'',  //本机文件地址
			imgFile:'',
			originalURL:'',//选中的原图
		}
	},
	components:{
		VueCropper,
		subwindow
	},
	beforeMount(){
		new Subwindow(this,{
			name:"subWind",
			title:"上传图片",
			width:950
		});
		const view=this;
		this.subWind.addEvent("afterclose",function(){
			view.subWindClose();
		});
	},
	mounted(){
		this.show_gj=this.open;
	},
	watch:{
		open(v){
			if(v){
				this.subWindOpen();
				this.option.img=this.image;
			}
		}
	},
	methods:{
		subWindClose(){
			this.show_gj=false;
			this.$emit("close",true);
		},
		subWindOpen(){
			this.show_gj=true;
			this.subWind.open();
		},
		//放大/缩小
		changeScale(num) { 
		num = num || 1; 
		this.$refs.cropper.changeScale(num); 
		}, 
		//左旋转
		rotateLeft() { 
		this.$refs.cropper.rotateLeft(); 
		}, 
		//右旋转
		rotateRight() { 
		this.$refs.cropper.rotateRight(); 
		}, 
		//保存
		finish(type) { 
		// console.log('finish')
		let _this = this;
		let formData = new FormData();
		// 获取截图的base64 数据
		this.$refs.cropper.getCropData((data) => { 
			this.model = true; 
			this.modelSrc = data; 
			this.$emit("img-cut",{originalURL:this.originalURL,newURL:data});
			this.subWind.close();
		});
		}, 
		// 实时预览函数 
		realTime(data) { 
		// console.log('实时预览函数realTime')
		this.previews = data 
		}, 

		//选择本地图片
		uploadImg(e, num) { 
		//  console.log('uploadImg',e,num);
		var _this = this;
		//上传图片 
		var file = e.target.files[0] 
		_this.fileName = file.name;
		if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) { 
			alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种') 
			return false 
		} 
		var reader = new FileReader(); 
		reader.onload =(e) => { 
			let data; 
			if (typeof e.target.result === 'object') { 
				// 把Array Buffer转化为blob 如果是base64不需要 
				// data = window.URL.createObjectURL(new Blob([e.target.result])) 
			} 
			else { 
				data = e.target.result 
			}
			if (num === 1) { 
				_this.option.img = data 
			} else if (num === 2) { 
				_this.example2.img = data 
			} 
			this.originalURL = data;
		} 
		// 转化为base64 
		reader.readAsDataURL(file)     
		}, 
		imgLoad (msg) { 
		// console.log('imgLoad')
		// console.log(msg) 
		},
		
		
	},

}
</script>

<style lang="scss">
.info {
	width: 720px;
	margin: 0 auto;
	.oper-dv {
		height:20px;
		text-align:right;
		margin-right:100px;
		a {
		font-weight: 500;
		&:last-child {
			margin-left: 30px;
		}
		}
	}
	.info-item {
		margin-top: 15px;
		label {
		display: inline-block;
		width: 100px;
		text-align: right;
		}
		.sel-img-dv {
		position: relative;
		.sel-file {
			position: absolute;
			width: 90px;
			height: 30px;
			opacity: 0;
			cursor: pointer;
			z-index: 2;
		}
		.sel-btn {
			position: absolute;
			cursor: pointer;
			z-index: 1;
		}
		}
	}
}

.cropper-content{
	display: flex;
	display: -webkit-flex;
	justify-content: flex-end;
	-webkit-justify-content: flex-end;
	.cropper{
		width: 100%;
		height: 600px;
	}
	.show-preview{
		flex: 1;
		-webkit-flex: 1;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		-webkit-justify-content: center;
		.preview{
		overflow: hidden;
		border-radius: 50%;
		border:1px solid #cccccc;
		background: #cccccc;
		margin-left: 40px;
		}
	}
}
.cropper-content .show-preview .preview {
	margin-left: 0;
}

.el-button{
	padding: 8px 20px;
	border-radius: 0px;
}

.el-input__inner{
	height: 32px;
	text-align: right;
	width: 70px
}
.label-button{
	color: #FFD91E;
	background: #353535;
	border-color: #353535;
	width: 106px;
	height: 32px;
	display: inline-block;
	text-align: center;
	font-size: 16px;
	line-height: 30px;
	margin-right: 10px;
}
.vue-cropper{
background-repeat: repeat;
	background-size: auto
}
.img-top-background{
	background-color: #EDEDED;
	padding:5px 10px;
}
</style>