<template>
    <div class="writer">
        <div class="hello-word">
            不写，就无法思考。————「卢曼卡片盒笔记写作法」
        </div>
        <div class="change-view">
            <a>切换视图</a>
        </div>
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
    },
    data() {
        return {
            note_content: '*我有些想法......*',
            cmOptions: {
                mode: "text/markdown",
                theme: "neat",  
                lineNumbers: false,
                smartIndent: true,
                indentUnit: 4,
                styleActiveLine: true,
                matchBrackets: true,
                lineWrapping: true,
            },
            login_state: false,
        }
    },
    methods: {
        note_change() {
            console.log(this.note_content)
        },
        send_note() {
            console.log('send note clicked')
            if (this.login_state) {
                // TODO: 发送新增笔记的请求
                // 通过消息机制通知NavigatorComponent请求新笔记数据，该组件无需所有数据
                EventBus.emit('update_data')
            }
            else {
                alert('请先在左侧登入。')
            }
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
