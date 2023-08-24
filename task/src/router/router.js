import MainPage from "@/pages/MainPage"
import GroupsPage from "@/pages/GroupsPage"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: '/',
        component: MainPage
    },
    {
        path: '/groups',
        component: GroupsPage
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router;