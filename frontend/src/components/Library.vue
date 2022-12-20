<template>
    <div class="library">
        <VueFlexWaterfall
            class="cards"
            col="3"
            col-spacing="15"
            :break-at="{ 600: 2, 300: 1}"
        >
            <div class="card-container" v-for="(item,index) in cards" :key="index">
                <v-md-editor :model-value="item.content" mode="preview"></v-md-editor>
                <p class="card-id" v-if="this.display_ids">id:{{item.id}}</p>
            </div>
        </VueFlexWaterfall>
    </div>
</template>

<script>
import { VueFlexWaterfall } from 'vue-flex-waterfall'
import EventBus from '../libs/EventBus.vue'

export default {
    name: 'LibraryComponent',
    data() {
        return {
            cards: [],
            links: [],
            display_ids: true,
        }
    },
    mounted() {
        EventBus.on('update_library', (data) => {
            this.cards = data.notes
            this.links = data.links
        })
        EventBus.on('toggle_display_ids', (data) => {
            this.display_ids = data
        })
    },
    methods: {
        
    },
    components: {
        VueFlexWaterfall,
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
    color: #42b983;
}
.library {
    position: fixed;
    top: 275px;
    right: 15%;
    bottom: 10px;
    border: solid;
    margin: 20px;
    padding: 20px;
    width: 46%;
    overflow: auto;
}
.card-container {
    border: solid 2px;
    margin-bottom: 20px;
    width: 30%;
}
.card-container:hover {
    color: lightgrey;
    cursor: pointer;
}
.card-id {
    z-index: 10;
    font-size: 12px;
    color: lightgrey;
    direction: rtl;
}
</style>
