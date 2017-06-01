import Vue from 'vue';
import Vuex from 'vuex';
import httpservice from '@/components/Common/Services/HttpService';

let instance = httpservice.getAxios;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: {}
  },

  actions: {
    // https://yg.ismartwork.cn/webapp/restful/contactsController/queryConverContacts?pageNo=1&pageSize=20&replyNeed=1

    queryConverContacts:function(){
    }
  },

  mutations: {
    updateCurrentUser: function (state, payload) {
      state.currentUser = payload.user;
    }
  },

  getters: {
    getCurrentUser: function (state) {
      return state.currentUser;
    }
  }
});

export default store;
