import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Login from '@/components/Login/Login';
import Home from '@/components/Home/Home';
import Chat from '@/components/Chat/Chat';
import Address from '@/components/Address/Address';
import Channel from '@/components/Channel/Channel';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'Login',
    component: Login
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [{
      path: 'chat',
      name: 'chat',
      component: Chat,
    }, {
      path: 'address',
      name: 'address',
      component: Address,
    }, {
      path: 'channel',
      name: 'channel',
      component: Channel,
    }]
  }]
});
