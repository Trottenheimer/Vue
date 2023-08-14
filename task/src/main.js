import { createApp } from 'vue'
import components from '@/components/UI';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus);

components.forEach(component =>  {
    app.component(component.name, component);
})
app.mount('#app');
