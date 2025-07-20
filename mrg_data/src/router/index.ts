import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import HomeView from '../views/HomeView.vue'


const routes: Array<RouteRecordRaw> = [
    {
        name: 'Home',
        path: '/', component: HomeView,
        meta: {
            title: 'Home'
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
