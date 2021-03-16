import Vue from 'vue';
import VueRouter from 'vue-router';
const Auth = () => import('../views/Auth.vue')
const Home = () => import('../views/Home.vue')

import store from '../store'
Vue.use(VueRouter);

const routes = [
    {
        path: '/auth',
        name: 'auth',
        component: Auth,
        
    },
    {
        path: '/',
        name: 'home',
        component: Home,
        meta:{
            requiresAuth: true
        }
    }
]

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(async(to, from, next)=>{
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !await(store.dispatch('user/getCurrentUser'))) {
        console.log('Requiere auth');
        next({name: 'auth'})
    }else if (!requiresAuth && await(store.dispatch('user/getCurrentUser'))) {
        console.log('No requiere auth')
        next({name: 'home'})
    } else {
        console.log('Estoy en el elese')
        next();
    }
})

export default router