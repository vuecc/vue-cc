import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Login from '@/components/Login/Login';
import Home from '@/components/Home/Home';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'chat',
          component: Hello,
        }
      ]
    }
  ]
});
