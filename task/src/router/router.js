import { createRouter, createWebHistory } from "vue-router"

import MainPage from "@/pages/MainPage"
import GroupsPage from "@/pages/GroupsPage"
import RightsPage from "@/pages/RightsPage"
import EmpPage from "@/pages/EmpPage"
import AuthPage from "@/pages/AuthPage"
import TestPage from "@/pages/TestPage"
import ProfilePage from "@/pages/ProfilePage"

const routes = [
    {
        path: '/',
        component: MainPage,
        name: 'main'
    },
    {
        path: '/emp',
        component: EmpPage,
        name: 'emp'
    },
    {
        path: '/groups',
        component: GroupsPage,
        name: 'groups'
    },
    {
        path: '/rights',
        component: RightsPage,
        name: 'rights'
    },
    {
        path: '/auth',
        component: AuthPage,
        name: 'auth'
    },
    {
        path: '/profile',
        component: ProfilePage,
        name: 'profile'
    },
    {
        path: '/test',
        component: TestPage,
        name: 'test'
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router;