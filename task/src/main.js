//import "bootstrap/dist/css/bootstrap.min.css"
//import "bootstrap"
import { createApp } from 'vue'
import App from './App.vue'
import components from '@/components';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from "@/store"
import router from './router/router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import globalPlugin from "@/components/globalPlugin"
import VueCookies from 'vue-cookies'
import { VueCookieNext } from 'vue-cookie-next';

const app = createApp(App)

components.forEach(component =>  {
    app.component(component.name, component);
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app
    .use(globalPlugin)
    .use(router)
    .use(ElementPlus)
    .use(store)
    .use(VueCookies)
    .use(VueCookieNext)
    .mount('#app');
