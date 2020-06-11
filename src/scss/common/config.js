const config={    
   //UI界面显示的格式
   //double默认格式  有千分位: #,###.##   无千分位: ####.##
   numberFormat:"####.##", 
   dateFormat:"yyyy-MM-dd",
   datetimeFormat:"yyyy-MM-dd HH:mm:ss",
   
   //Date提交数据强制的格式, 非界面显示的格式
   postDateFormat:"yyyy-MM-dd HH:mm:ss",
   //Datetime提交数据强制的格式, 非界面显示的格式
   postDatetimeFormat:"yyyy-MM-dd HH:mm:ss",

   //表格组件
   girdHeadRowHeight:30,
   girdDataRowHeight:30,
   gridFooterRowHeight:30,
   gridDateFieldWidth:96,
   gridDatetimeFieldWidth:160,
   gridNumberFieldWidth:66,
   gridOtherFieldWidth:80,

   //表单组件
   autoformControlWidth:200,
   autoformControlHeight:28,
   autoformLabelWidth:62,
   autoformSpacing:10,
   autoformRowSpacing:2
}
export {
   config
};
export default {};