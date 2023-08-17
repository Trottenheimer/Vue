import { createApp} from 'vue'
import components from '@/components';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import App from './App.vue'

const app = createApp(App)

components.forEach(component =>  {
    app.component(component.name, component);
})
app.mount('#app');
