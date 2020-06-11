import axios from 'axios'
// import router from '@/router/router'
import { Message } from 'element-ui'
import Loading from '@/components/Loading'
import Url from '@/server/urlPath'
// 后台服务器
const adminServer = axios.create({
	// baseURL: process.env.ADMIN_SERVER,
	timeout: 60000,
})

const downloadUrl = res => { // 导出/下载文件
	const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=UTF-8' })
	const link = document.createElement('a')
	const fileName = res.headers.filename;
	link.download = decodeURI(fileName)
	link.href = window.URL.createObjectURL(blob)
	// console.log('link.download: ', link.download)
	// console.log('link.href: ', link.href)
	// console.log('link: ', link)
	// blob:http://localhost:8080/2586d6ce-8cac-4b43-af90-ee5742da2221
	link.click()
	window.URL.revokeObjectURL(link.href)
}

const methodParamsMap = {
	get: 'params',
	post: 'data',
	put: 'data',
}

//  拦截器配置
adminServer.interceptors.request.use(
	config => {
		let servername="default";
		if(config["params"]!=null&&config.params["server"]!=null)servername=config.params.server;
		config.baseURL=Url.getPath(servername);//获取请求地址
		const baseData = {
			sessionId: sessionStorage.getItem("sessionId"),
			// dataMode: 'general', // 返回参数格式, general,data,detail
			// executeId: String(new Date().getTime()), // 本次行为Id
			// _pageCode: router.history.current.meta.pageCode || '', // 当前页面的编码
			// _pageTitle: router.history.current.meta.pageTitle || '', // 业务类型，如'业务->订单管理->订单详情'
			// _secString: '', // 子权限字符串
			// _button: '', // 当前请求的按钮名称
			// pageIndex: config.params && config.params.params ? config.params.params.pageIndex : '',
			// pageSize: config.params && config.params.params ? config.params.params.pageSize : '',
		}

		const requestConfig = config
		// requestConfig.responseType = 'arraybuffer';
		// 配置头部
		// const originalHeader = requestConfig.headers
		// const requestHeader = { ...baseData, ...originalHeader }
		// if (requestHeader.dataMode && ['general', 'data', 'detail'].indexOf(requestHeader.dataMode) === -1) {
		//   requestHeader.dataMode = 'general'
		// }
		// requestHeader._pageTitle = requestHeader._pageTitle ? encodeURIComponent(requestHeader._pageTitle) : ''
		// requestHeader._button = requestHeader._button ? encodeURIComponent(requestHeader._button) : ''
		// requestConfig.headers = requestHeader

		// 配置请求参数
		const originalParams = { ...requestConfig[methodParamsMap[requestConfig.method]] }
		let ajaxParams = { ...baseData, ...originalParams }
		if (requestConfig.method === 'post' || requestConfig.method === 'put'|| requestConfig.method === 'delete') {
			requestConfig.headers.head = "sessionId=" + sessionStorage.getItem("sessionId");
			// console.log(requestConfig.headers)
			ajaxParams = originalParams.data;
		}
		requestConfig[methodParamsMap[requestConfig.method]] = ajaxParams
		// requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

		// 转为Form Data格式
		// let ajaxData = new URLSearchParams()
		// if (requestConfig.method === 'post' || requestConfig.method === 'put') {
		//   requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
		//   Object.keys(ajaxParams).forEach(key => {
		//     const value = typeof ajaxParams[key] === 'object' ? JSON.stringify(ajaxParams[key]) : ajaxParams[key]
		//     ajaxData.append(key, value)
		//   })
		// } else {
		//   ajaxData = ajaxParams
		// }
		// requestConfig[methodParamsMap[requestConfig.method]] = ajaxData

		// console.log('AxiosRequestConfig: ', requestConfig)
		return requestConfig
	},
	err => {
		return Promise.reject(err)
	},
)

adminServer.interceptors.response.use(
	response => {
		const responseNew = response
		// 若是导出，则执行downloadUrl下载 (responseType === 'arraybuffer'，返回的数据不是 json,是文件流)
		if (responseNew.headers && (responseNew.headers['content-type'] === 'application/vnd.ms-excel;charset=UTF-8')) {
			console.log('responseNew111', responseNew)
			downloadUrl(responseNew)
			return responseNew
		}
		//  导出时responseType === 'arraybuffer'，返回错误信息，json 数据
		if (response.request.responseType === 'arraybuffer' && response.data.toString() === '[object ArrayBuffer]') {
			// 返回的数据是 arraybuffer，内容是 json
			// 备注：可能内容不是 json，这里暂未处理
			const text = Buffer.from(response.data).toString('utf8')
			responseNew.data = JSON.parse(text)
			return responseNew.data
		}

		if (response && response.data) {
			return response.data
		}
		return responseNew
	},
	error => {
		let str = ''
		if (error.response) {
			switch (error.response.status) {
				case 400:
					str = '请求错误'
					break
				case 401:
					str = '未授权，请登录'
					break
				case 403:
					str = '拒绝访问'
					break
				case 404:
					str = `请求地址出错: ${error.response.config.url}`
					break
				case 408:
					str = '请求超时'
					break
				case 500:
					str = '服务器内部错误'
					break
				case 501:
					str = '服务未实现'
					break
				case 502:
					str = '网关错误'
					break
				case 503:
					str = '服务不可用'
					break
				case 504:
					str = '网关超时'
					break
				case 505:
					str = 'HTTP版本不受支持'
					break
				default:
					str = '未知错误！'
					break
			}
			Message.error({ message: str,duration:1000 })
		} else {
			//debugger;
			if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
				Message.error({ message: '请求超时', duration:1000})
			} else if (error.message=="Network Error"){
				Message.error({ message: '服务不可用(Network Error)', duration:1000})
			} else {
				Message.error({ message: '未知错误！', duration:1000})
			}
		}
		try { Loading.close(); } catch (e) { };
		if (error.response && error.response.data) return Promise.reject(error.response.data)
		return Promise.reject(error)
	},
)

export default adminServer
