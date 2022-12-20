<template>
    <div class="library">
        <VueFlexWaterfall
            class="cards"
            col="3"
            col-spacing="15"
            :break-at="{ 600: 2, 300: 1}"
        >
            <div 
                class="card-container" 
                v-for="(item,index) in cards" 
                :key="index" 
                @click.left="this.copy_note_id(item)"
                @click.right="this.focus_note(item)" 
                @click.right.prevent
            >
                <v-md-editor :model-value="item.content" mode="preview"></v-md-editor>
                <p class="card-id" v-if="this.display_ids">id:{{item.id}}</p>
                <button 
                    class="card-delete" 
                    v-if="this.display_delete_cards"
                    @click="this.try_delete_card(item)"
                >
                    X
                </button>
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
            cards: [ { id:'0000', title: '当前没有笔记', content: '当前没有笔记\n请先登陆' } ],
            links: [],
            display_ids: true,
            display_delete_cards: false,
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
        EventBus.on('toggle_display_delete', (data) => {
            this.display_delete_cards = data
        })
    },
    methods: {
        focus_note(data) {
            EventBus.emit('focus_note', data)
        },
        try_delete_card(item) {
            EventBus.emit('delete_note', item)
        },
        copy_note_id(item) {
            this.$copyText('[#id:' + item.id + ']').then(
                () => {
                    // console.log(item.id + ' copied to clipboard')
                    EventBus.emit('copy_id_notify', item.id)
                },
                () => {
                    console.log(item.id + ' copy failed to clipboard')
                }
            )
        },
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
    position: relative;
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
.card-delete {
    position: absolute;
    z-index: 10;
    left: 3px;
    bottom: 3px;
}
</style>
