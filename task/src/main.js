import { createApp } from 'vue'
import App from './App.vue'
import components from '@/components/UI';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const app = createApp(App)

components.forEach(component =>  {
    app.component(component.name, component)
})

app.mount('#app')
