<template>
<div class="calendar control" :id="calendar.id">
	<div class="calendar-day" v-show="attrs.showtype==='tian'">
		<div class="calendar-year-month">
			<span class="calendar-year-prev" @click="change2('year',-1)"><i class="el-icon-d-arrow-left"></i></span>
			<span class="calendar-month-prev"  @click="change2('month',-1)" style="margin-right:10px;">
				<i class="el-icon-arrow-left"></i>
			</span>
			<span class="calendar-show-year" @click="changeYear">
				<span  v-text="attrs.year"></span>
				<span>年</span>
			</span>
			<span class="calendar-show-year" @click="changeMonth">
				<span  v-text="attrs.month"></span>
				<span>月</span>
			</span>
			<span class="calendar-month-next"  @click="change2('month',1)" style="margin-left:10px;"><i class="el-icon-arrow-right"></i></span>
			<span class="calendar-year-next" @click="change2('year',1)"><i class="el-icon-d-arrow-right"></i></span>
		</div>
		<div class="calendar-date-week">
			<div class="calendar-date-week-item" v-for="item in week" :key="item" v-text="item"></div>
		</div>
		<div class="calendar-day-items">
			<div :class="addclass(item)" v-for="item in attrs.days" @click="clickTime(item)" :key="item.date" v-text="item.label"></div>
		</div>
		<div v-show="attrs.type=='datetime'" class="calendar-datetime middle-center" style="text-align:center;justify-content:center;">
			<Select  @change="changeTime" v-show="attrs.format.indexOf('HH')!=-1||attrs.format.indexOf('H')!=-1" :name="'hour'" :hideLabel="true" :width=50 :type="'select'"  :options="hoursoptions" v-model="attrs.hours"></Select>
			<span  v-show="attrs.format.indexOf('mm')!=-1||attrs.format.indexOf('m')!=-1">:</span>
			<Select  @change="changeTime" v-show="attrs.format.indexOf('mm')!=-1||attrs.format.indexOf('m')!=-1" :name="'mm'" :hideLabel="true" :label="':'" :labelWidth=10 :labelAlign="'center'" :width=50 :type="'select'" :options="minutesoptions" v-model="attrs.minutes"></Select>
			<span  v-show="attrs.format.indexOf('ss')!=-1||attrs.format.indexOf('s')!=-1">:</span>
			<Select  @change="changeTime" v-show="attrs.format.indexOf('ss')!=-1||attrs.format.indexOf('s')!=-1" :name="'ss'" :hideLabel="true" :label="':'" :labelWidth=10 :labelAlign="'center'" :width=50 :type="'select'" :options="ssoptioins" v-model="attrs.seconds"></Select>
			<el-button class="button-default" type="primary"  v-on:click="close" plain size="mini" >确定</el-button>
		</div>
	</div>
	<div v-show="attrs.showtype==='year'" class="calendar-year-items" :for="calendar.id">
		<div @click="exChangeMonth(item,'year')" :class="item.value==attrs.year?'calendar-date-month calendar-selected':'calendar-date-month'" v-for="item in  attrs.years" :key="item.value" v-text="item.label"></div>
	</div>
	<div v-show="attrs.showtype==='month'" class="calendar-month-items" :for="calendar.id">
		<div @click="exChangeMonth(item,'month')" :class="item.value==attrs.month?'calendar-date-month calendar-selected':'calendar-date-month'" v-for="item in months" :key="item.value" v-text="item.label"></div>
	</div>
</div>
</template>

<script>
import Select from '@/components/Select'
import {CalendarAttr} from '@/components/js/controlAttrs'
export default {
	props:{
		calendar:{type:Object,default:()=>{
			return {days:[]}
		}}
	},
	data(){
		return {
			hoursoptions:[],
			minutesoptions:[],
			ssoptioins:[],
			week:["一","二","三","四","五","六","日"],
			months:[
				{label:"一月",value:1},
				{label:"二月",value:2},
				{label:"三月",value:3},
				{label:"四月",value:4},
				{label:"五月",value:5},
				{label:"六月",value:6},
				{label:"七月",value:7},
				{label:"八月",value:8},
				{label:"九月",value:9},
				{label:"十月",value:10},
				{label:"十一月",value:11},
				{label:"十二月",value:12}
			],
			attrs:eval("("+JSON.stringify(CalendarAttr)+")")
		}
	},
	beforeMount(){
		this.hoursoptions=[];
		this.minutesoptions=[];
		this.ssoptioins=[];
		const cp=eval("("+JSON.stringify(CalendarAttr)+")");
		for(let i=0;i<24;i++){const v=(i<10?"0":"")+""+i;this.hoursoptions.push({value:v,label:v});}
		for(let i=0;i<60;i++){
			const v=(i<10?"0":"")+""+i;
			this.minutesoptions.push({value:v,label:v});
			this.ssoptioins.push({value:v,label:v});
		};
		for(let k in cp){
			this.attrs[k]=this.calendar[k];
		};
		this.calendar.addEvent("attr",(p)=>{
			const attrname=p.attrname;
			if(cp[attrname]!=null){this.attrs[attrname]=p.value;};
		});
	},
	components:{Select},
	methods:{
		addclass(item){
			const cls=["calendar-day-item"];
			if(item.disabled){
				cls.push("calendar-disabled-selected");
			}else	if(item.date==this.attrs.year+'-'+Number(this.attrs.month)+'-'+Number(this.attrs.tian)){
				cls.push("calendar-selected");
			}else if(item.date==this.attrs.now){
				cls.push("calendar-current-date");
			}
			if(item.status==='current'){
				cls.push("calendar-current-month");
			}else{
				cls.push("calendar-no-month");
			};
			return cls.join(" ");
		},
		changeYear(){
			this.calendar.attr("showtype","year");
		},
		changeTime(obj){
			const name=obj.name;
			const attrname=name=="mm"?"minutes":name=="ss"?"seconds":"hours";
			this.calendar.attr(attrname,Number(obj.value));
			if(this.calendar.isopen)this.calendar.change(false);
		},
		changeMonth(){
			this.calendar.attr("showtype","month");
		},
		exChangeMonth(item,tp){
			if(tp=="year"){
				this.calendar.attr({showtype:"month",year:item.value});
			}else if(tp=="month"){
				this.calendar.attr({showtype:"tian",month:item.value});
			}
		},
		change2(tp,v){
			if(tp=="year"){
				this.calendar.attr({year:Number(this.attrs.year)+v});
			}else{
				let month=Number(this.attrs.month)+v;
				let year=Number(this.attrs.year);
				if(month==13){month=1;year+=1;}else if(month==0) {month=12;year-=1;};
				this.calendar.attr({year:year,month:month});
			}
		},
		close(){
			const isTT=this.calendar.change(true);
			if(isTT)this.calendar.close();
		},
		clickTime(row){
			this.calendar.changeDate(row);
		}
	}
}
</script>

<style>

</style>