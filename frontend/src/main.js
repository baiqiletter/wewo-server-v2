import { createApp } from 'vue'
import App from './App.vue'
import { GlobalCmComponent } from 'codemirror-editor-vue3'
import { VueShowdownPlugin } from 'vue-showdown'
import "@/assets/font.css"

createApp(App)
    .use(GlobalCmComponent)
    .use(VueShowdownPlugin, {flavor: 'github'})
    .mount('#app')
