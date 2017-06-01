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
    login(context, payload) {
      let loginInfo = payload.userInfo;
      instance.post('/login', "userName=" + loginInfo.userName + "&password=" + loginInfo.passWard + "&loginCode=&loginType=1&deviceId=00%3A15%3A5d%3A04%3A0f%3A00").then(function (response) {
        context.commit('updateCurrentUser', {
          user: response.data
        });
      });
    }
  },

  mutations: {
    updateCurrentUser: function (state, payload) {

      console.log(payload, 123);

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
