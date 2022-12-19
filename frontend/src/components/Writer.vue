<template>
    <div class="writer">
        <div class="hello-word">
            不写，就无法思考。————「卢曼卡片盒笔记写作法」
        </div>
        <div class="change-view">
            <a href="">切换视图</a>
        </div>
        <div class="note-editor">
            <!-- <Codemirror
                v-model:value="note_content"
                :options="cmOptions"
                border
                placeholder="test placeholder"
                @change="note_change"
            /> -->
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
            <button id="send-button" href="">放入卡片盒</button>
        </div>
    </div>
</template>

<script>
// import Codemirror from "codemirror-editor-vue3"
// import "codemirror/mode/markdown/markdown.js"
// import "codemirror/theme/neat.css"

export default {
    name: 'WriterComponent',
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
        }
    },
    methods: {
        note_change() {
            console.log(this.note_content)
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
