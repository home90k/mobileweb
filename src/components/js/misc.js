import server from '@/server/server';
import { Misc }  from '@/components/js/controls'
import { Message } from 'element-ui'
import Loading from '@/components/Loading'
export default{
   install(Vue){
      Vue.prototype.ajax=function(p){
         const duration=1000;
         const toLowerCase=(p)=>{
            if(p==null)return {};
            const np={};
            for(const k in p){
               const k2=k.toLowerCase().trim();
               let v=p[k]
               if(k2==="type")v=v.toLowerCase().trim();
               np[k2]=v;
            };
            return np;
         };
         const mr={headers:{},server:"default",url:"",type:"get",data:{},success:function(req){},error:function(req){}};
         const setting={};
         const init=()=>{const p2=toLowerCase(p);for(let k in mr){setting[k]=p2[k]==null?mr[k]:p2[k];}};
         const executeEvt=(req)=>{
            try{Loading.close();}catch(ee){} 
            try{	
               if(req.status==="1" ||req.status===1 ||  req.success===true||req.status*1==200||req.code*1==200){
                  setting.success(req);
                  Message.closeAll();
                  Message.success({message:req.msg,duration:duration});
                  //if(typeof(this.refreshForm)!="undefined"){ try{this.refreshForm();}catch(er){console.error(er)};}
                  if(typeof(this.executeEvent)!="undefined")this.executeEvent("synchData");
               }else if(
                  req.status==="0" || 
                  req.status===0 ||
                  req.success===false||
                  (req.status!=null&&req.status*1!=200)||
                  (req.code!=null&&req.code*1!=200)){
                     Message.closeAll();
                     Message.error({ message: req.msg,duration:duration});
                     setting.error(req);
               }else{
                  setting.success(req);
               }
            }catch(e){
               console.error(e);
               Message.closeAll()
               Message.error({ message: e.msg==null?"有错误":e.msg,duration:duration});
            };
         };
         const errorEvt=(err)=>{
            try{Loading.close();}catch(ee){};
            try{setting.error(err);}catch(e){};
         };
         init();
         if(setting.url==="")return;
         const header=setting.headers,params=setting["data"]==null?{}:setting.data,src=setting.url;
         params.server=setting.server;
         params.executeId=new Date().getTime();
         Loading.open("正在加载...");
         if(setting.type=="get"){
            Promise.resolve(server.get(src, {params, headers: { ...header } })).then(req => {executeEvt(req);},err=>{errorEvt(err)});
         }else if(setting.type=="post"){
            Promise.resolve(server.post(src,{data:params}, { headers: { ...header } })).then(req => {executeEvt(req);},err=>{errorEvt(err);});
         }else if(setting.type=="delete"){
            Promise.resolve(server.delete(src, {params, headers: { ...header } })).then(req => {executeEvt(req);},err=>{errorEvt(err)});
         }
      };
      Vue.prototype.tip=function(str){ 
         Message.closeAll(); 
         const duration=1000;
         let type="success",msg=str;
         if(typeof(str)=="undefined")msg="执行成功";
         if(typeof(str)=="object"){
            if(str["type"]!=null){
               type=str.type.trim().toLowerCase();
            };
            if(str["msg"]!=null)msg=str.msg;
            else if(str["text"]!=null)msg=str.text;
            else if(str["title"]!=null)msg=str.title;
         };
         if(type=="success")Message.success({message:msg,duration:duration});
         else if(type=="warning")Message.warning({message:msg,duration:duration});
         else if(type=="info")Message.info({message:msg,duration:duration});
         else if(type=="error")Message.error({message:msg,duration:duration});
      };
      Vue.prototype.isModify="";
      Vue.prototype.datasetMap={};
      Vue.prototype.alert=function(options){ Misc.alert(options);};
      Vue.prototype.ask=function(options){Misc.ask(options);};
      Vue.prototype.isNull=function(options){return Misc.isNull(options);};
      Vue.prototype.setTokenValue=function(key,name){const ab=(a,b)=>{const a1=a.trim(); sessionStorage.setItem(a1,b);}; if(typeof(key)=="string"&&typeof(name)!="undefined"){ab(key,name); }else if(typeof(key)=="object"&&typeof(name)=="undefined"){for(let k in key){ab(k,key[k]);}; }};
      Vue.prototype.getTokenValue=function(key){ 
         const k=key==null?"":key.trim(); let v=sessionStorage.getItem(k); return v;
      };
      Vue.prototype.$eventsMap={};
      Vue.prototype.$now=function(){
         const date=new Date(),m=date.getMonth()+1,d=date.getDate();
         return date.getFullYear()+"-"+(m<10?"0":"")+m+"-"+(d<10?"0":"")+d;
      };
      Vue.prototype.$nowTime=function(){
         const date=new Date(),m=date.getMonth()+1,d=date.getDate(),h=date.getHours(),f=date.getMinutes(),s=date.getSeconds();
         return date.getFullYear()+"-"+(m<10?"0":"")+m+"-"+(d<10?"0":"")+d+" "+(h<10?"0":"")+h+":"+(f<10?"0":"")+f+":"+(s<10?"0":"")+s;
      };
      Vue.prototype.addEvent=function(eventname,evt){
         const key=eventname.toLowerCase().trim(); 
         if(this.$eventsMap[key]==null)this.$eventsMap[key]=[]; this.$eventsMap[key].push(evt);
      };
      Vue.prototype.executeEvent=function(eventname,params){
         const key=eventname.toLowerCase().trim(), arr=this.$eventsMap[key];
         if(arr==null||arr.length==0)return;
         for(let i=0;i<arr.length;i++){ try{ const evt=arr[i]; if(evt!=null)evt(params);}catch(e){}};
      };
   }
};