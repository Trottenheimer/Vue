import MainPage from "@/pages/MainPage"
import GroupsPage from "@/pages/GroupsPage"
import RightsPage from "@/pages/RightsPage"
import EmpPage from "@/pages/EmpPage"
import AuthPage from "@/pages/AuthPage"
import TestPage from "@/pages/TestPage"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: '/',
        component: MainPage
    },
    {
        path: '/emp',
        component: EmpPage
    },
    {
        path: '/groups',
        component: GroupsPage
    },
    {
        path: '/rights',
        component: RightsPage
    },
    {
        path: '/auth',
        component: AuthPage
    },
    {
        path: '/test',
        component: TestPage
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router;