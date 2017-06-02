import Vue from 'vue';
import Vuex from 'vuex';
import httpService from '@/components/Common/Services/HttpService';
import formatService from '@/components/Common/Services/FormatService';
import storeService from '@/components/Common/Services/StoreService';

let instance = httpService.getAxios;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: {},
    converContacts: [],
    conversationLists: {},
    currentConversationList: {}
  },

  actions: {
    queryConverContacts(context, payload) {
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
      });
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
              ConversationList: temp
            });
          }
        });
      } else {
        context.commit('updateCurrnetConversationList', {
          currentConversationList: conversationLists[payload.topicId]
        });
      }
    }
  },

  mutations: {
    updateCurrentUser: function (state, payload) {
      state.currentUser = payload.user;
    },
    updateConverContacts: function (state, payload) {
      let temp = payload.converContacts.filter((item) => {
        return item.converVo.topicType != 8;
      }).map((item) => {
        return formatService.listText(item);
      })
      state.converContacts = state.converContacts.concat(temp);
    },
    updateConversationLists: function (state, payload) {
      let conversationList = payload.ConversationList;
      state.conversationLists[conversationList.topicId] = conversationList;
      state.currentConversationList = conversationList;
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
