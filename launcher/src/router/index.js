import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import Modules from "../views/Modules"
import Accounts from "../views/Accounts"
import Settings from "../views/Settings"

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/modules",
        name: "modules",
        component: Modules
    },
    {
        path: "/accounts",
        name: "accounts",
        component: Accounts
    },
    {
        path: "/settings",
        name: "settings",
        component: Settings
    },
]

const router = new VueRouter({
    routes
})

export default router
