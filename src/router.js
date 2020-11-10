import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: '/Welcome',
            children: [
                { path: '/Welcome', component: Welcome },
                { path: '/Users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Cate }
            ]
        }
    ]
})

router.beforeEach((to, form, next) => {
    // to表示将要访问的路径
    // from表示从哪个路径跳转而来
    // next是一个函数，表示放行
    // next()放行 next('/login')强制放行
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router