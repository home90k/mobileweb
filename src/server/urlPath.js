const urlParam={
   dev:{//开发模式
      devtools:"http://127.0.0.1:7400/api",
      base:    "http://127.0.0.1:8010/api",
      fin:     "http://127.0.0.1:8020/api",
      oa:      "http://127.0.0.1:8050/api",
      tms:     "http://127.0.0.1:8050/api",
      default: "http://127.0.0.1:8010/api",
   },
   prod:{//生产模式
      devtools:"http://api2.tiulo.com:7400/api",
      base:    "http://api2.tiulo.com:8010/api",
      fin:     "http://api2.tiulo.com:8020/api",
      oa:      "http://api2.tiulo.com:8050/api",
      tms:     "http://api2.tiulo.com:8050/api",
      default: "http://api2.tiulo.com:8010/api",
   },
   test:{//测试模式

   }
};
const Url={};
Url.getServer=()=>{return [{value:"devtools",label:"表设计-devtools"},
                           {value:"base",label:"基础模块-base"},
                           {value:"fin",label:"财务模块-fin"},
                           {value:"oa",label:"模块-oa"},
                           {value:"tms",label:"运输-tms"},
                           {value:"default",label:"默认-default"}
                        ]
                  },
Url.getPath=(servername)=>{
	// const origin = window.location.origin;
   const href = window.location.href;
   let modular=servername;//模块
   if(servername=="default"){//没有指定server
      if (href.indexOf("/devtools/") > 0) {
         modular ="devtools";
      } else if (href.indexOf("/base/") > 0) {
         modular ="base";
      } else if (href.indexOf("/fin/") > 0) {
         modular ="fin";
      } else if (href.indexOf("/oa/") > 0) {
         modular ="oa";
      } else if (href.indexOf("/tms/") > 0) {
         modular ="tms";
      } else {
         modular ="default";
      }
   };
   let  path="",mode="dev";
   if (href.indexOf("http://127.0.0.1:8080")>=0 ) {
      mode="dev"; 
   }else{
      mode="prod";
   }
   if(urlParam[mode]!=null&&urlParam[mode][modular]!=null)path=urlParam[mode][modular];
   return path;
}
export default Url;
