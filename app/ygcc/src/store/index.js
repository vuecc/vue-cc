import Vue from 'vue';
import Vuex from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import httpService from '@/components/Common/Services/HttpService';
import formatService from '@/components/Common/Services/FormatService';
import storeService from '@/components/Common/Services/StoreService';
import StorageService from '@/components/Common/Services/StorageService';

let instance = httpService.getAxios;
let localStorage = StorageService.getLocalStorage();

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: localStorage.getItem("current_user") || {},
    converContacts: [], // 聊天左边列表
    conversationLists: {}, // 回话详情集合 topicId:vo
    currentConversationList: {}, //当前选中的回话
  },

  actions: {
    queryConverContacts(context, payload) {
      return new Promise((resolve, reject) => {
        instance.get('/contactsController/queryConverContacts', {
          params: {
            pageNo: payload.pageNo,
            pageSize: payload.pageSize,
            replyNeed: payload.replyNeed
          }
        }).then(function (response) {
          if (response && response.data && response.data.length > 0) {
            context.commit('updateConverContacts', {
              converContacts: response.data
            });
          }
          resolve(response.data);
        });
      })
    },
    setConverContactReaded(context, payload) {
      let conversationLists = context.state.converContacts;
      let index = findIndex(conversationLists, function (element) {
        if (element && element.topicId) {
          return element.topicId == payload.topicId;
        }
      });
      if (index != -1 && conversationLists[index].noReadNum !== 0) {
        instance.get('/conversation/setConversationReaded', {
          params: {
            syncMessage: payload.syncMessage || true,
            topicId: payload.topcId,
          }
        });
        let conversationList = cloneDeep(conversationLists[index]);
        conversationList.noReadNum = 0;
        conversationLists.splice(index, 1, conversationList);
      }
    },
    queryConversationList(context, payload) {
      let conversationLists = context.state.conversationLists;
      if (!conversationLists[payload.topicId]) {
        instance.get('/conversation/queryConversationList', {
          params: {
            pageSize: payload.pageSize,
            topicId: payload.topicId
          }
        }).then(function (response) {
          if (response && response.data) {
            let temp = response.data;
            if (temp.converVo && temp.converVo.topicType === 1) {
              temp.converVo.topicPicId = storeService.getSingleChatTopicPicId(temp, context.state.currentUser);
            }
            context.commit('updateConversationLists', {
              newConversationList: temp
            });
          }
        });
      } else {
        let temp = cloneDeep(conversationLists[payload.topicId]);
        if (temp.dialogues && temp.dialogues.length > payload.pageSize) {
          temp.dialogues = temp.dialogues.splice(temp.dialogues.length - payload.pageSize, payload.pageSize);
        }
        context.commit('updateCurrnetConversationList', {
          currentConversationList: temp
        });
      }
    },
    addConversationList(context, payload) {
      // payload -> topicId, pageSize, timeStamp
      let conversationLists = context.state.conversationLists;
      let conversationList = conversationLists[payload.topicId];
      let cachedConversationList = storeService.getCachedConversationList(conversationList, payload);
      if (cachedConversationList) {
        context.commit('updateConversationLists', {
          pushConversationList: cachedConversationList
        });
      } else {
        instance.get('/conversation/queryConversationList', {
          params: {
            pageSize: payload.pageSize,
            topicId: payload.topicId,
            timeStamp: payload.timeStamp
          }
        }).then(function (response) {
          if (response && response.data) {
            let temp = response.data;
            if (temp.converVo && temp.converVo.topicType === 1) {
              temp.converVo.topicPicId = storeService.getSingleChatTopicPicId(temp, context.state.currentUser);
            }
            context.commit('updateConversationLists', {
              pushConversationList: temp
            });
          }
        });
      }
    }
  },

  mutations: {
    emitEvent: function (state, payload) {
      let eventName = payload.name;
      state.eventBus[eventName] = payload.data;
    },
    updateCurrentUser: function (state, payload) {
      state.currentUser = payload.user;
      localStorage.setItem("current_user", state.currentUser);
    },
    updateConverContacts: function (state, payload) {
      let temp = payload.converContacts.filter((item) => {
        return item.converVo.topicType != 8;
      }).map((item) => {
        return formatService.listText(item);
      });
      temp.sort(function (a, b) {
        return b.dialogueVo.createDate - a.dialogueVo.createDate;
      });
      state.converContacts = state.converContacts.concat(temp);
    },
    updateConversationLists: function (state, payload) {
      if (payload.newConversationList) {
        let conversationList = payload.newConversationList;
        state.conversationLists[conversationList.topicId] = conversationList;
        state.currentConversationList = cloneDeep(conversationList);
      }
      if (payload.pushConversationList) {
        let pushConversationList = payload.pushConversationList;
        let conversationList = state.conversationLists[pushConversationList.topicId];
        conversationList = storeService.mergeCachedConversationList(pushConversationList, conversationList);
        state.conversationLists[conversationList.topicId] = conversationList;
        state.currentConversationList = cloneDeep(conversationList);
      }
      if (payload.pushDialogueVo) {
        let dialogueVo = payload.pushDialogueVo;
        if (state.currentConversationList.topicId == dialogueVo.topicId) {
          state.currentConversationList.dialogues.push(dialogueVo);
        }
        storeService.receiveChat(state, dialogueVo);
      }
    },
    updateCurrnetConversationList: function (state, payload) {
      state.currentConversationList = payload.currentConversationList;
    }
  },

  getters: {
    getCurrentUser: function (state) {
      return state.currentUser;
    },
    getConverContacts: function (state) {
      return state.converContacts;
    },
    getConversationList: function (state) {
      return state.currentConversationList;
    }
  }
});

export default store;
