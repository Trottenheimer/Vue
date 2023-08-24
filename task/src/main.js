import { createApp} from 'vue'
import components from '@/components';
//import "bootstrap/dist/css/bootstrap.min.css"
//import "bootstrap"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from "@/store"
import App from './App.vue'
import router from './router/router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

components.forEach(component =>  {
    app.component(component.name, component);
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app
    .use(router)
    .use(ElementPlus)
    .use(store)
    .mount('#app');
