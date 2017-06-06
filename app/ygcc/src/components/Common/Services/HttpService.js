import axios from 'axios';

let baseUrl = "https://yg.ismartwork.cn/webapp/restful";
let instance = axios.create({
  baseURL: baseUrl
});
instance.defaults.headers.post['FORGED-USER-AGENT'] = 'pcclient';

function saveConversation(data) {
  if (data.dialogueInfo && data.topicId) {
    let sendVo = {
      atUserId: data.atUserId || [],
      dialogueInfo: data.dialogueInfo,
      topicId: data.topicId,
      dialogueType: data.dialogueType || 0
    };
    return instance.post("/conversation/saveConversation", sendVo);
  }
}

export default {
  getAxios: instance,
  getBaseUrl: baseUrl,
  saveConversation: saveConversation
};
