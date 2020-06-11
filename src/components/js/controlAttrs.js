/**属性名称必须全部小写*/
const CalendarAttr={
   now:"",
   showtype:"tian",
   format:"yyyy-MM-dd",
   years:[],
   days:[],
   year:"2020",
   month:"05",
   tian:"11",
   hours:"00",
   minutes:"00",
   seconds:"00",
   value:"",
   label:"",
   minvalue:"",
   maxvalue:"",
   readonly:false,
   disabled:false,
   autoopen:true,
   type:""
};
const ReportAttr={
   name:"",
   dataset:"",
   width:0,
   height:0,
   rowfields:"",
   cellfields:"",
   valuefields:"",
   columns:[],
   head:[],
   footer:[],
   showzero:true
};
export {
   CalendarAttr,ReportAttr
};
export default {};