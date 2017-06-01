import axios from 'axios';

let baseUrl = "https://yg.ismartwork.cn/webapp/restful";
let instance = axios.create({
  baseURL: baseUrl
});
instance.defaults.headers.post['FORGED-USER-AGENT'] = 'pcclient';

export default {
	getAxios: instance,
	getBaseUrl: baseUrl
}