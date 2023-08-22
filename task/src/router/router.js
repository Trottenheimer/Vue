import MainPage from "@/pages/MainPage"
import MainPageCompositionApi from "@/pages/MainPageCompositionApi"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: '/',
        component: MainPage
    },
    {
        path: '/composition',
        component: MainPageCompositionApi
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router;