/**常用的下拉框 */
import {Dataset,DropDown}  from '@/components/js/controls'
const DropDownFactory={};
DropDownFactory.options=[
   {value:"ddCompany",label:"ddCompany"},
   {value:"ddDealer",label:"ddDealer"},
   {value:"ddCity",label:"ddCity"},
   {value:"ddMaterialType",label:"ddMaterialType"}
];
DropDownFactory.create=(view,name,read,write)=>{
   if(name=="ddCompany"){//公司下拉框
      if(view["dsDD"+name]==null)new Dataset(view,{
         name:"dsDD"+name,
         action:"company",
         showloading:false,
         server:"base",
         fields:[
            {name:"id",label:"id",visible:false,width:80},
            {name:"code",label:"编码",width:100},
            {name:"name",label:"简称",width:140}
         ]
      });
      if(view["dd"+name]==null)new DropDown(view,{
         dataset:"dsDD"+name,
         name:name,
         read:typeof(read)=="undefined"?"id,name":read,
         write:typeof(write)=="undefined"?"id,name":write
      });
      return true;
   }else if(name=="ddDealer"){//收款人
      if(view["dsDD"+name]==null)new Dataset(view,{
         name:"dsDD"+name,
         action:"dealer",
         showloading:false,
         server:"base",
         fields:[
            {name:"id",label:"收款方Id",width:140} ,
            {name:"companyName",label:"所属公司",width:140} ,
            {name:"fullName",label:"名称",width:140} ,
            {name:"companyId",label:"公司Id",width:140} 
         ]
      });
      if(view["dd"+name]==null)new DropDown(view,{
         dataset:"dsDD"+name,
         name:name,
         read:typeof(read)=="undefined"?"fullName":read,
         write:typeof(write)=="undefined"?"fchPayeeName":write,
         columns:view["dsDD"+name].fields
      });
      return true;
   }else if(name=="ddCity"){//公司下拉框
      if(view["dsDD"+name]==null)new Dataset(view,{
         name:"dsDD"+name,
         action:"baseDistrict",
         showloading:false,
         server:"base",
         fields:[
            {name:"id",label:"id",visible:false,width:80},
            {name:"name",label:"名称",width:140}
         ]
      });
      if(view["dd"+name]==null)new DropDown(view,{
         dataset:"dsDD"+name,
         name:name,
         read:typeof(read)=="undefined"?"id,name":read,
         write:typeof(write)=="undefined"?"id,name":write
      });
      return true;
   }else if(name=="ddMaterialType"){//公司下拉框
      if(view["dsDD"+name]==null)new Dataset(view,{
         name:"dsDD"+name,
         action:"baseMaterialType",
         showloading:false,
         server:"base",
         fields:[
            {name:"id",label:"id",visible:false,width:80},
            {name:"name",label:"名称",width:140}
         ]
      });
      if(view["dd"+name]==null)new DropDown(view,{
         dataset:"dsDD"+name,
         name:name,
         read:typeof(read)=="undefined"?"id,name":read,
         write:typeof(write)=="undefined"?"id,name":write
      });
      return true;
   };
   return false;
};
export default DropDownFactory;
