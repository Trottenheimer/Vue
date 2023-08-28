import MainPage from "@/pages/MainPage"
import GroupsPage from "@/pages/GroupsPage"
import RightsPage from "@/pages/RightsPage"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: '/',
        component: MainPage
    },
    {
        path: '/groups',
        component: GroupsPage
    },
    {
        path: '/rights',
        component: RightsPage
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router;