'use strict'
const data={
	org:[
		{name:"id",label:"id",} ,
		{name:"code",label:"编码"},
		{name:"name",label:"简称"},
		{name:"fullName",label:"全称"},
		{name:"companyId",label:"公司编码"},
		{name:"companyName",label:"公司名称",dropdown:"ddCompany",read:"name",write:"companyName"},
	],
	order:[
		{name:"id",label:"id",} ,
		{name:"code",label:"编码"},
		{name:"name",label:"简称",dropdown:"ddCompany",read:"name",write:"name"},
		{name:"fullName",label:"全称"},
		{name:"companyName",label:"全称公司名称"},
	],
	invoice:[
		{name:"id",label:"开票单号"},
		{name:"companyName",label:"所属机构"},
		{name:"invoiceNo",label:"发票号"},
		{name:"receiptId",label:"收款单号"},
		{name:"billNo",label:"单据号"},
		{name:"billId",label:"单据id"},
		{name:"payeeName",label:"收款方"},
		{name:"payerName",label:"付款方"},
		{name:"customerName",label:"客户名称"},
		{name:"type1",label:"票据类型",options:[{value:'收据',label:"收据"},{value:'发票',label:"发票"}]},
		{name:"status",label:"票据状态",options:[{value:'00',label:"输入完成"},{value:'10',label:"已确认"},{value:'20',label:"已转发票"}]},
		{name:"receiptStatus",label:"收款状态",type:"select",options:[{value:'0',label:"未收款"},{value:'1',label:"已收款"}]},
		{name:"opDateFrom",label:"申请日期",type:"date"},
		{name:"opDateTo",label:"- 至 -",type:"date"},
		{name:"expectDateFrom",label:"应收款日期",type:"date"},
		{name:"expectDateTo",label:"- 至 -",type:"date"},
		{name:"createDateFrom",label:"创建时间",type:"date"},
		{name:"createDateTo",label:"- 至 -",type:"date"},
		{name:"modifyDateFrom",label:"修改时间",type:"date"},
		{name:"modifyDateTo",label:"- 至 -",type:"date"},
		{name:"createUser",label:"创建人"}
	 ],
	charge: [
		{name:"fchBillId1",label:"业务单号1"},
		{name:"fchBillId2",label:"业务单号2"},
		{name:"fchId",label:"费用单号"},
		{name:"fchPayerName",label:"付款方"},
		{name:"fchPayeeName",label:"收款方",readonly:true},
		{name:"fchPayeeId",label:"收款方",visible:false},
		{name:"fchPayerId",label:"付款方",visible:false},
		{name:"fchItemName",label:"费用项目"},
		{name:"fchCreateDateFrom",label:"创建时间",type:"date"},
		{name:"fchCreateTo",label:"- 至 -",type:"date"}
	 ],
	receipt:[
		{name : "id",label : "收款单号"},
		{name : "no1",label : "凭证号"},
		{name : "billId",label : "业务单id"},
		{name : "receiptId",label : "原收款单号"},
		{name : "billType",label : "业务单据",type:"select",options:[{value:'TpBillAmt',label:"物流单运费"},{value:'TpOrderTaskAmt',label:"委托单运费"},{value:'Service1',label:"站点服务费"},{value:'Service2',label:"站点服务费"}]},
		{name : "recvbId",label : "开票单号"},
		{name : "payerName",label : "付款方"},
		{name : "payeeName",label : "收款方"},
		{name : "status",label : "状态",type:"select",options:[{value:'prepared',label:"输入完成"},{value:'approved',label:"已收款"}]},
		{name : "type1",label : "收款类型",type:"select",options:[{value:'*',label:"正常收款"},{value:'bad',label:"坏账单"}]},
		{name : "customerName",label : "客户名称"},
		{name : "receiptMode",label : "收款方式",type:"select",options:[{value:'XJ',label:"现金"},{value:'WBZZ',label:"外部转账"}]},
		{name : "no2",label : "承兑汇票",type:"select",options:[{value:'0',label:"否"},{value:'1',label:"是"}]},
		{type:"line"},
		{name : "opDateFrom",label : "收款日期",type : "date"},
		{name : "opDateTo",label : "- 至 -",type : "date"},
		{name : "expectDateFrom",label : "应收款时间",type : "date"},
		{name : "expectDateTo",label : "- 至 -",type : "date"},
		{name : "approveDateFrom",label : "确认日期",type : "date"},
		{name : "approveDateTo",label : "- 至 -",type : "date"},
		{name : "createDateFrom",label : "创建时间",datatype : "datetime"},
		{name : "createDateTo",label : "- 至 -",datatype : "datetime"},
		{name : "modifyDateFrom",label : "修改时间",datatype : "datetime"},
		{name : "modifyDateTo",label : "- 至 -",datatype : "datetime"},
		{name : "approveDate1From",label : "提现日期",datatype : "datetime"},
		{name : "approveDate1To",label : "- 至 -",datatype : "datetime"},
		{name : "createUser",label : "创建人"},
		{name : "approveUser",label : "确认人"}
	],
	agreement: [
		{name:"fahId",label:"合约号"},
		{name:"fahOrgName",label:"所属机构"},
		{name:"fahOwnerName",label:"发货人"},
		{name:"fahRemark",label:"备注"},
		{name:"fahDateFrom",label:"签订日期"},
		{name:"fahDateTo",label:"- 至 -"},
		{name:"fahCreateDateFrom",label:"创建时间"},
		{name:"fahCreateDateTo",label:"创建时间"},
		{name:"fahModifyDateFrom",label:"修改时间"},
		{name:"fahModifyDateTo",label:"修改时间"},
		{name:"fahCreateUser",label:"创建人"},
	 ],
	 material: [
		{name:"famMaterialType",visible:false},
		{name:"famMaterialTypeName",label:"商品分类",dropdown:"ddMaterialType",read:"id,name",write:"famMaterialType,famMaterialTypeName"},
		{name:"famStartDistrictId",label:"出发地",visible:false},
		{name:"famStartDistrictName",label:"出发地",dropdown:"ddCity",read:"id,name",write:"famStartDistrictId,famStartDistrictName"},
		{name:"famEndDistrictId",visible:false},
		{name:"famEndDistrictName",label:"目的地",dropdown:"ddCity",read:"id,name",write:"famEndDistrictId,famEndDistrictName"}
	 ]
};
const formElements={get:(name)=>{return data[name];},getData:()=>{return data;}};
export default formElements;