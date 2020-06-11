function isNull(obj){
   if(typeof(obj)=="boolean" || typeof(obj)=="number") return false;
   var ret=false;
   if(typeof(obj)=="undefined" || obj==null || obj=="null" || obj==""|| obj=="undefined") ret=true;
   return ret;
}