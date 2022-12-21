<template>
    <div class="writer">
        <div class="hello-word">
            不写，就无法思考。「卢曼卡片盒笔记写作法」
        </div>
        <div class="editing-info">
            <span v-if="this.copied_id!=''">已复制卡片ID #{{this.copied_id}}</span>
            <span v-else-if="this.note_id!=''">你正在写卡片#{{this.note_id}}，想<a @click="this.reset_id">创作新卡片</a>？</span>
            <span v-else>你将写一张新卡片，也可以右键任意卡片以编辑</span>
        </div>
        <!-- <div class="change-view">
            <a>切换视图</a>
        </div> -->
        <div class="note-editor">
            <v-md-editor
                v-model="note_content"
                mode="edit"
                height='190px'
                left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
                right-toolbar="preview toc fullscreen"
                :disabled-menus="[]"
            >
            </v-md-editor>
        </div>
        <div class="note-buttons">
            <!-- <button id="preview-button" @click="note_preview">预览</button> -->
            <button id="send-button" href="" @click="send_note">放入卡片盒</button>
        </div>
    </div>
</template>

<script>
import EventBus from '../libs/EventBus.vue'

export default {
    name: 'WriterComponent',
    mounted() {
        EventBus.on('update_login_state', (state) => {
            this.login_state = state
        })
        EventBus.on('focus_note', (note) => {
            if (this.login_state) {
                this.note_id = note.id
                this.note_content = note.content
                EventBus.emit('update_reverse_links', note.id)
                EventBus.emit('update_local_graph', note.id)
            }
        })
        EventBus.on('copy_id_notify', (id) => {
            this.copied_id = id
            // 先清空定时器，避免定时器累加或产生不可预期的bug
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.copied_id = ''
            }, 800)
        })
    },
    data() {
        return {
            note_id: '',
            note_content: '*我有些想法......*',
            login_state: false,
            timer: null,
            copied_id: '',
        }
    },
    methods: {
        note_change() {
            console.log(this.note_content)
        },
        send_note() {
            var linebreak_index = this.note_content.indexOf('\n')
            var note_title = this.note_content.substring(0, linebreak_index)
            if (this.login_state) {
                if (this.note_id == "") {  // 创建新笔记
                    EventBus.emit('create_note', {
                        title: note_title,
                        content: this.note_content
                    })
                    this.note_content = '*我有些想法......*'
                }
                else {  // 更新已有笔记
                    EventBus.emit('update_note', {
                        id: this.note_id,
                        title: note_title,
                        content: this.note_content
                    })
                    this.note_id = ""
                    this.note_content = '*我有些想法......*'
                }
            }
            else {
                alert('请先在左侧登入。')
            }
        },
        reset_id() {
            this.note_id = ""
            EventBus.emit('update_local_graph', this.note_id)
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
    color: #42b983;
}
.writer {
    position: fixed;
    top: 10px;
    right: 15%;
    border: solid;
    margin: 20px;
    padding: 20px;
    height: 200px;
    width: 46%;
}
.hello-word {
    position: absolute;
    top: 10px;
    left: 10px;
    border-bottom: solid 1px;
}
.editing-info {
    position: absolute;
    top: 10px;
    right: 10px;
}
.change-view {
    position: absolute;
    top: 10px;
    right: 10px;
}
.note-editor {
    position: absolute;
    top: 40px;
    left: 10px;
    right: 10px;
    bottom: 10px;
}
.note-preview {
    position: absolute;
    top: 40px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    overflow: scroll;
    border: solid 1px green;
    border-radius: 4px;
    padding-left: 10px;
    padding-right: 10px;
}
#preview-button {
    position: absolute;
    bottom: 15px;
    right: 105px;
}
#send-button {
    position: absolute;
    bottom: 15px;
    right: 20px;
}
</style>
