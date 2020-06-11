/**控制表格样式*/
const gridStyle = {
   default:{
      borderColor:"hsla(0, 0%, 66%, 0.5)",//表格线颜色

      bodyFont:"14px sans-serif",       //新增---替换font
      bodyColor:"black",                //新增---替换color
      bodyOverBjColor:"#EDEDED;#EE9A00",//鼠标移到行显示的背景颜色---新增
      numberColor:"white;#C2C2C2",// 序号列背景颜色 ---新增

      headColor:"#333",     //head  字体颜色
      headFont:"14px sans-serif",   //head   字体大小 字体
      headBackgroundColor:"white;#C2C2C2",      //标题背景颜色 

      checkboxColor1:"#CCC",//边框颜色  ---新增
      checkboxColor2:"white;#e7e5e5",//背景颜色      ---新增
      checkboxColor3:"white;#e7e5e5",//选中背景颜色  ---新增
      checkboxColor4:"blue",//对勾颜色

      errorBorderColor:"red",//可以不设置
      errorBjColor:"",//rgb(255,255,224) 可以不设置

      footerColor:"black",   //footer字体颜色
      footerFont:"bolder 14px sans-serif", //footer 字体大小 字体
      footerBackgroundColor:"white;#C2C2C2",    //页脚背景颜色

     // barbordercolor1:"#A9A9A9",          //滚动条边框颜色-作废
     // barbordercolor2:"#A9A9A9",          //移上去边框颜色-作废
      barColor1:"rgb(245,245,245)",        //滚动条背景 颜色
      barColor2:"#BEBEBE;#E5E5E5;#BEBEBE",//滚动条 颜色
      barColor3:"#EBEBEB",                //鼠标移上去  滚动条背景颜色
      barColor4:"#8B8B83;#B3B3B3;#8B8B83",//鼠标移上去  滚动条 颜色
      barColor5:"rgb(220,220,220)",       //滚动条重叠背景颜色 --新

      dataColor1:"#FFFFF0",               //数据->偶数行背景颜色
      dataColor2:"#F8F8FF",               //数据->奇数行背景颜色

      currentBackgroundColor:"#ebe1c0;#ebe1c0;#c7b369", //当前行背景颜色 #E8B400
      editorBorderColor:"#EE9A00",               //当前编辑框颜色 -可编辑
      editorBackgroundColor:"#f3efe1",    //当前编辑框背景颜色 -可编辑
      editorReadOnlyColor:"#E8B400",    //当前编辑框背景颜色 -不可编辑
     // editorBorderColor:"#c7b369",      //当前编辑框背景颜色 -边框颜色
     // checkboxBackgroundColor:"#DBDBDB",//checkbox 背景颜色 选中时候---作废
      notNullColor:"blue" ,            //不能为空时候 表头颜色
      moveBorderColor:"#333",         //移动表格时候，边框颜色
      changeSizeBjColor:"rgb(139,134,130,0.2)",    //调整列宽 背景颜色
      posionColor:"#6A5ACD",          //调整位置时候，边框颜色
      moverowbjcolor:"rgb(240,230,140,0.5)", //移动行时背景颜色 新增
      moveRowColor:"#6A5ACD",         //移动行时，行边框颜色
      moverowlinecolor:"rgb(255,165,0)",            //移动行时，目标位置颜色

     // startbjcolor:"rgb(255,255,255)",//表格背景开始颜色  ----将作废 bodyBjColor替换
    //  endbjcolor:"rgb(230,230,250)",   //表格背景结束颜色 ----将作废 bodyBjColor替换
      bodyBjColor:"rgb(255,255,255);rgb(230,230,250)",//
      linkOverColor:"blue",
      modifyColor:"green",
      modifytext:"改",
      insertColor:"blue",
      insertText:"新",
      deleteText:"删",
      deleteColor:"red",
      multiLineColor:"#FFA500"  //多行时,边框颜色                   
   },
   black:{
      borderColor:"#343639",//表格线颜色
      bodyFont:"14px sans-serif",        //新增
      bodyColor:"#C1C0C1",               //新增
      bodyOverBjColor:"#EDEDED;#EE9A00",//鼠标移到行显示的背景颜色---新增

      headColor:"#C1C0C1",     //head  字体颜色
      headFont:"14px sans-serif",   //head   字体大小 字体
      // headoverbjcolor:"#EDEDED",
      // headovercolor:"#D2691E",
      // headoverbordercolor:"hsla(0, 0%, 66%, 0.5)",

      checkboxColor1:"#6d6e6d",//边框颜色  ---新增
      checkboxColor2:"#6d6e6d",   //背景颜色      ---新增
      checkboxColor3:"#3F9EFE",//选中背景颜色  ---新增
      checkboxColor4:"white",  //对勾颜色

      footerColor:"#C1C0C1",   //footer字体颜色
      footerFont:"14px sans-serif", //footer 字体大小 字体
      footerBackgroundColor:"#000;#313030;#464242;#000",    //页脚背景颜色

      barColor1:"#454545",                //滚动条背景 颜色
      barColor4:"#989898;#E5E5E5;#989898",//滚动条 颜色
      barColor3:"#454545",                //鼠标移上去  滚动条背景颜色
      barColor2:"#8B8B83;#B3B3B3;#8B8B83",//鼠标移上去  滚动条 颜色
      
      dataColor1:"#282828",               //数据->偶数行背景颜色 292929
      dataColor2:"#1E1E1E",               //数据->奇数行背景颜色

      numberColor:"#000;#313030;#2b2727;#000",         //序号列背景颜色 ---新增
      headBackgroundColor:"#000;#313030;#2b2727;#000", //标题背景颜色  black;#52545B
      currentBackgroundColor:"#453B50;#454B50",//当前行背景颜色#0058CF;#0549a1
      bodyOverBjColor:"#453B50;#454B50",       //鼠标移到行显示的背景颜色---新增

      editorBackgroundColor:"#453A50",  //当前编辑框背景颜色 -可编辑  606161
      editorReadOnlyColor:"#36363C",    //当前编辑框背景颜色 -不可编辑 171616
      editorBorderColor:"#451B50",      //当前编辑框背景颜色 -边框颜色 342000

      notNullColor:"#3F9EFE",            //不能为空时候 表头颜色 4295E3 F26B3A
      moveBorderColor:"#333",        //移动表格时候，边框颜色
      changeSizeBjColor:"rgb(139,134,130,0.2)",    //调整列宽 背景颜色
      posionColor:"#6A5ACD",         //调整位置时候，边框颜色
      moveRowColor:"#6A5ACD",        //移动行时，行边框颜色

      bodyBjColor:"#0B0B0B;#363636", //大背景
      linkOverColor:"blue",
      modifyColor:"#87CEFA",
      insertColor:"#32CD32",
      modifytext:"改",
      insertText:"新",
      deleteText:"删",
      deleteColor:"red",
      multiLineColor:"red"//多行时,边框颜色 
   }
};
//导航样式
const navMenuStyle={
   default:{
      style1:{//风格I 矩形 上角椭圆形
         font:"14px sans-serif",//字体 默认
         buttonBackgroundColor:"rgb(207,207,207)",
         barBackgroundColor:"",//导航条背景颜色
         color:"rgb(130,130,130)",//字体颜色
         backgroundColor:"rgb(220,220,220,0.5)",
         activeColor:"white",
         activeBackgroundColor:"black",
         overColor:"rgb(28,28,28)",
         overBackgroundColor:"rgb(211,211,211)",
         radius:5
      },
      style2:{//风格II 梯形
         font:"14px sans-serif",
         buttonBackgroundColor:"rgb(207,207,207)",
         barBackgroundColor:"",
         color:"rgb(130,130,130)",//字体颜色
         backgroundColor:"rgb(220,220,220,0.5)",
         activeColor:"white",
         activeBackgroundColor:"black",
         overColor:"rgb(28,28,28)",
         overBackgroundColor:"rgb(211,211,211)",
         radius:5,
         slope:4//坡度
      },
      style3:{//风格III 谷歌浏览器风格
         font:"14px sans-serif",
         buttonBackgroundColor:"rgb(207,207,207)",
         barBackgroundColor:"rgb(220,220,220)",
         color:"black",
         backgroundColor:"rgb(220,220,220)",
         activeColor:"white",
         activeBackgroundColor:"black",
         overColor:"#A8A8A8",
         overBackgroundColor:"#EAEAEA",
         radius:10
      }
   },black:{
      style1:{//风格I 矩形 上角椭圆形
         buttonBackgroundColor:"rgb(230,230,250)",//按钮背景颜色
         font:"14px sans-serif",//字体 默认
         barBackgroundColor:"",//导航条背景颜色
         color:"black",//字体颜色
         backgroundColor:"rgb(220,220,220,0.5)",
         activeColor:"white",
         activeBackgroundColor:"black",
         overColor:"#A8A8A8",
         overBackgroundColor:"rgb(105,105,105)",
         radius:5
      },
      style2:{//风格II 梯形
         buttonBackgroundColor:"rgb(230,230,250)",//按钮背景颜色
         font:"14px sans-serif",
         barBackgroundColor:"",
         color:"black",
         backgroundColor:"rgb(220,220,220,0.5)",
         activeColor:"white",
         activeBackgroundColor:"black",
         overColor:"#A8A8A8",
         overBackgroundColor:"rgb(105,105,105)",
         radius:5,
         slope:4//坡度
      },
      style3:{//风格III 谷歌浏览器风格
         buttonBackgroundColor:"rgb(230,230,250)",//按钮背景颜色
         font:"14px sans-serif",
         barBackgroundColor:"black",
         color:"black",
         backgroundColor:"rgb(220,220,220)",
         activeColor:"white",
         activeBackgroundColor:"rgb(190,190,190);rgb(139,134,130)",
         overColor:"#A8A8A8",
         overBackgroundColor:"rgb(105,105,105)",
         radius:10
      }
   }
};
export {
   gridStyle,
   navMenuStyle
};
export default {};

// /**控制表格样式*/
// const gridStyle = {
//    default:{
//       borderColor:"hsla(0, 0%, 66%, 0.99)",//表格线颜色
//       color:"black",        //body  字体颜色
//       headColor:"#333",     //head  字体颜色
//       footerColor:"#333",   //footer字体颜色
//       font:"14px sans-serif",       //body   字体大小 字体
//       headFont:"14px sans-serif",   //head   字体大小 字体
//       footerFont:"14px sans-serif", //footer 字体大小 字体

//       barColor1:"#FFF0F5",                //滚动条背景 颜色
//       barColor2:"#BEBEBE;#E5E5E5;#BEBEBE",//滚动条 颜色
//       barColor3:"#EBEBEB",                //鼠标移上去  滚动条背景颜色
//       barColor4:"#8B8B83;#B3B3B3;#8B8B83",//鼠标移上去  滚动条 颜色

//       dataColor2:"hsla(240, 8%, 90%, 0.1)",               //数据->奇数行背景颜色
//       dataColor1:"rgba(194, 194, 194, 0.3)",              //数据->偶数行背景颜色

//       headBackgroundColor:"hsla(60, 100%, 97%, 0.1);rgba(194, 194, 194, 0.9)",      //标题背景颜色 
//       currentBackgroundColor:"#ebe1c0;#ebe1c0;#c7b369", //当前行背景颜色 #E8B400
//       footerBackgroundColor:"white;#C2C2C2",    //页脚背景颜色
//       editorBackgroundColor:"#f3efe1",    //当前编辑框背景颜色 -可编辑
//       editorReadOnlyColor:"#E8B400",    //当前编辑框背景颜色 -不可编辑
//       editorBorderColor:"#c7b369",      //当前编辑框背景颜色 -边框颜色
//       checkboxBackgroundColor:"#DBDBDB",//checkbox 背景颜色 选中时候
//       notNullColor:"blue" ,            //不能为空时候 表头颜色
//       moveBorderColor:"#333",         //移动表格时候，边框颜色
//       changeSizeBjColor:"#8B8682",    //调整列宽 背景颜色
//       posionColor:"#6A5ACD",          //调整位置时候，边框颜色
//       moveRowColor:"#6A5ACD",         //移动行时，行边框颜色
//       startbjcolor:"rgba(255,255,255,0.5)",//表格背景开始颜色  
//       endbjcolor:"rgba(222,222,250,0.9)"   //表格背景结束颜色
//    },
//    black:{
//       borderColor:"#343639",//表格线颜色
//       color:"#C1C0C1",      //body  字体颜色
//       headColor:"#C1C0C1",  //head  字体颜色
//       footerColor:"red",    //footer字体颜色
//       font:"14px sans-serif",      //body   字体大小 字体
//       headFont:"14px sans-serif",  //head   字体大小 字体
//       footerFont:"14px sans-serif",//footer 字体大小 字体

//       barColor1:"#454545",                //滚动条背景 颜色
//       barColor4:"#989898;#E5E5E5;#989898",//滚动条 颜色
//       barColor3:"#454545",                //鼠标移上去  滚动条背景颜色
//       barColor2:"#8B8B83;#B3B3B3;#8B8B83",//鼠标移上去  滚动条 颜色
      
//       dataColor1:"#282828",               //数据->偶数行背景颜色 292929
//       dataColor2:"#1E1E1E",               //数据->奇数行背景颜色

//       headBackgroundColor:"#111;#282828;#111", //标题背景颜色  black;#52545B
//       currentBackgroundColor:"#453B50;#454B50",//当前行背景颜色#0058CF;#0549a1
//       footerBackgroundColor:"white;#3F4046",   //页脚背景颜色
//       editorBackgroundColor:"#453A50",  //当前编辑框背景颜色 -可编辑  606161
//       editorReadOnlyColor:"#36363C",    //当前编辑框背景颜色 -不可编辑 171616
//       editorBorderColor:"#451B50",      //当前编辑框背景颜色 -边框颜色 342000
//       checkboxBackgroundColor:"#DBDBDB",//checkbox 背景颜色 选中时候
//       notNullColor:"#3F9EFE",            //不能为空时候 表头颜色 4295E3 F26B3A
//       moveBorderColor:"#333",       //移动表格时候，边框颜色
//       changeSizeBjColor:"#8B8682",  //调整列宽 背景颜色
//       posionColor:"#6A5ACD",        //调整位置时候，边框颜色
//       moveRowColor:"#6A5ACD",       //移动行时，行边框颜色
//       startbjcolor:"#0B0B0B",       //表格背景开始颜色  
//       endbjcolor:"#363636"          //表格背景结束颜色
//    }
// };
// export default gridStyle