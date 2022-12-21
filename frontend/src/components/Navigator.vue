<template>
    <div class="navigator">
        <div class="logo">
            <h1>WEWO</h1>
            <p>基于微服务架构的双链笔记应用</p>
            <hr/>
        </div>
        <div class="user-info">
            <div ref="login_container" v-if="!this.login_state">
                <p>用户：<input v-model="this.username" type="text" maxlength="16"/></p>
                <p>密码：<input v-model="this.password" type="password" maxlength="16"/></p>
                <button @click="login">登入</button> <button @click="signup">注册</button>
                <div v-if="fail_not_empty">用户或密码不能为空</div>
                <div v-if="fail_wrong_info">登入失败，用户名或密码错误</div>
                <div v-if="fail_user_exists">注册失败，用户已存在</div>
                <div v-if="success_login">登入成功</div>
                <div v-if="success_signup">注册成功</div>
            </div>
            <div ref="user_info" v-if="this.login_state">
                <p>{{ this.username }}（<a @click="logout">登出</a>），一共有{{ this.notes.length }}张卡片</p>
            </div>
        </div>
        <div class="heatmap-calendar">
            <!-- <calendar-heatmap 
                :values="calendar_nums" 
                :end-date="end_date"
                :round="0"
                :dark-mode="false"
                :range-color="['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']"
                :max="10"
                :no-data-text="这一天没有写东西哦"
            /> -->
        </div>
        <div class="view-container">
            <h3>视图</h3>
            <p><input v-model="this.keyword" class="search-input" type="text" /></p>
            <a @click="this.toggle_display_ids" v-if="this.display_ids">切换卡片ID显示（<b>Y</b>/N）</a>
            <a @click="this.toggle_display_ids" v-if="!this.display_ids">切换卡片ID显示（Y/<b>N</b>）</a>
            <br />
            <a @click="this.toggle_display_delete" v-if="this.display_card_delete">切换卡片删除显示（<b>Y</b>/N）</a>
            <a @click="this.toggle_display_delete" v-if="!this.display_card_delete">切换卡片删除显示（Y/<b>N</b>）</a>
            <br />
            <a @click="this.toglle_cards_order" v-if="this.cards_in_order">卡片按时间排序（<b>Y</b>/N)</a>
            <a @click="this.toglle_cards_order" v-if="!this.cards_in_order">卡片按时间排序（Y/<b>N</b>)</a>
        </div>
        <div class="graph-container">
            <h3>图谱</h3>
            <div ref="graph" id="graph"></div>
        </div>
        <div class="linked-notes-container">
            <h3>反向链接</h3>
            <p v-if="this.linked_notes.length==0">没有卡片链接到这里</p>
            <p class="reverse-link" v-for="(item, index) in this.linked_notes" :key="index">
                [{{index+1}}] {{ item.title }}<br /><a>[#id:{{ item.id }}]</a>
            </p>
        </div>
    </div>
</template>

<script>
// import { CalendarHeatmap } from 'vue3-calendar-heatmap'
import axios from 'axios'
import ForceGraph from 'force-graph'
import EventBus from '../libs/EventBus.vue'

export default {
    name: 'NavigatorComponent',
    data() {
        return {
            // calendar_nums: [
            //     { date: '2022-12-16', count: 6 }, { date: '2022-12-17', count: 3 }, { date: '2022-12-18', count: 5 }
            // ],
            // end_date: new Date('2022-12-31'),
            graph: null,
            graph_data: {  // test data
                nodes: [],
                links: [],
            },
            login_state: false,
            username: "",
            password: "",
            fail_not_empty: false,
            fail_wrong_info: false,
            fail_user_exists: false,
            success_login: false,
            success_signup: false,
            // notes: [
                // '7月4日\n新开这本日记，也为了督促自己下个学期多下些苦功。先要读完手边的莎士比亚的《亨利八世》……',
                // '7月13日\n打牌。',
                // '7月14日\n打牌。',
                // '7月15日\n打牌。',
                // '7月16日\n胡适之啊胡适之！你怎么能如此堕落！先前订下的学习计划你都忘了吗？\n子曰：“吾日三省吾身。”...不能再这样下去了！',
                // '7月17日\n打牌。',
                // '7月18日\n打牌。',
                // '![image.png](https://realenet-1301408934.cos.ap-nanjing.myqcloud.com/markdown/material/zhishiku/material/1660791733099/1/image.png)',
                // '七月四日\n读Plato’s Apology of Socrates。今日为美国独立纪念日，夜八时至湖上观此间庆祝会。士女来游者无算，公园中百戏俱陈，小儿女燃花爆为乐。既而焰火作矣，五光十色，备极精巧。九时半始归。',
                // '七月十三日\n上课。读《陶渊明诗》一卷。',
                // '七月十四日\n化学第一小试。读拉丁文。夜游公园，适天微雨，众皆避入跳舞厅内。已而乐作，有男女约二十双，双双跳舞。此为余见跳舞之第一次，故记之。',
                // '七月十五日\n读拉丁文。读《谢康乐诗》一卷。作书寄友人。夜赴暑期学生之欢迎会。',
                // '七月十六日\n游湖上别墅，归后大风雨。读拉丁文。',
                // '七月十七日\n上课。化学试卷竟得百分，真出意外。读拉丁文。',
            // ],
            notes: [ { id:'0000', title: '当前没有笔记', content: '当前没有笔记\n请先登陆' } ],
            links: [],
            display_ids: true,
            display_card_delete: false,
            cards_in_order: true,
            linked_notes: [],
            keyword: '',
            keywords: [],
        }
    },
    watch: {
        keyword: function (newValue) {
            if (this.login_state) {
                // 先恢复卡片库，再检索
                EventBus.emit('update_library', {
                    notes: this.notes,
                    links: this.links
                })
                EventBus.emit('keyword_change', newValue)
            }
        }
    },
    mounted() {
        EventBus.on('update_data', () => {
            this.update_notes()
        })

        EventBus.on('create_note', (data) => {
            axios.post(
                '/note/create',
                {
                    title: data.title,
                    author: this.username,
                    content: data.content,
                }
            )
            .then((response) => {
                var note_id = response.data.id
                // 解析该笔记的出链
                var links = this.parse_links(note_id, data.content, this.username)
                // 更新该笔记的图谱
                axios.post(
                    '/graph/update',
                    {
                        links: links,
                        author: this.username
                    }
                ).then(() => {
                    this.update_notes()
                }).catch((error) => {
                    console.log(error)
                })
                // this.update_notes()
            })
            .catch((error) => {
                console.log(error)
            })
        })

        EventBus.on('update_note', (data) => {
            axios.post(
                '/note/update',
                {
                    id: data.id,
                    title: data.title,
                    author: this.username,
                    content: data.content,
                }
            )
            .then((response) => {
                var note_id = response.data.id
                // 解析该笔记的出链
                var links = this.parse_links(note_id, data.content, this.username)
                // 更新该笔记的图谱
                axios.post(
                    '/graph/update',
                    {
                        links: links,
                        author: this.username
                    }
                ).then(() => {
                    this.update_notes()
                }).catch((error) => {
                    console.log(error)
                })
                // this.update_notes()
            })
            .catch((error) => {
                console.log(error)
            })
        })

        EventBus.on('delete_note', (data) => {
            axios.post(
                '/note/delete',
                {
                    id: data.id,
                }
            ).then((response) => {
                var note_id = response.data.id
                // 更新该笔记的图谱
                axios.post(
                    '/graph/delete',
                    {
                        note: note_id,
                        author: this.username
                    }
                ).then(() => {
                    // 重置Writer编辑器状态，防止编辑已删除的笔记
                    EventBus.emit('focus_note', {
                        note_id: '',
                        note_content: '*我有些想法......*'
                    })
                    this.update_notes()
                }).catch((error) => {
                    console.log(error)
                })
                // this.update_notes()
            }).catch((error) => {
                console.log(error)
            })
        })

        EventBus.on('update_reverse_links', (target) => {
            if (this.login_state) {
                axios.get('/graph/get_reverse_links', { params: {
                    target: target,
                    author: this.username
                }}).then((response) => {
                    var reverse_links = response.data
                    this.linked_notes = []
                    reverse_links.forEach((link) => {
                        // 找到反向链接的笔记标题
                        let note_data = this.notes.find((note) => {
                            return note.id == link.source
                        })
                        this.linked_notes.push({
                            id: link.source,
                            title: note_data.title,
                        })
                    })
                }).catch((err) => {
                    console.log(err)
                })
            }
        })

        EventBus.on('update_local_graph', (note_id) => {
            // 局部图谱：以note_id为中心的图谱
            // 还原图谱节点和边
            this.update_graph()

            // 如果笔记ID为空，代表新建卡片或者重置为全局图谱，跳过节点过滤
            if (note_id != '') {
                // 过滤graph_data的节点和链接，但this.nodes和this.links始终保存完整数据
                var local_nodes = [note_id]
                // TODO: 目前还不能展示所有相关的节点和边，只支持直接相连
                this.graph_data.links = this.graph_data.links.filter((link) => {
                    if (link.source == note_id || link.target == note_id) {
                        local_nodes.push(link.source)
                        local_nodes.push(link.target)
                        return true
                    }
                    else {
                        return false
                    }
                })
                this.graph_data.nodes = this.graph_data.nodes.filter((node) => {
                    return local_nodes.indexOf(node.id) != -1
                })
                // console.log('update_local_graph')
                // console.log(this.graph_data.nodes)
                // console.log(this.graph_data.links)
                
                this.initGraph2D()
            }
        })

        EventBus.emit('update_login_state', this.login_state)
        EventBus.emit('update_library', {
            notes: this.notes,
            links: this.links
        })

        this.initGraph2D()
    },
    methods: {
        async initGraph2D() {
            this.graph = ForceGraph()(this.$refs.graph)
                .graphData(this.graph_data)
                .width(this.$refs.graph.parentElement.offsetWidth)
                .height(this.$refs.graph.parentElement.offsetWidth)
                .nodeAutoColorBy('id')
                .onNodeClick(node => {
                    // Center/zoom on node
                    this.graph.centerAt(node.x, node.y, 1000);
                    // this.graph.zoom(2, 1000);
                })
                // .onNodeClick(node => window.open(`https://bl.ocks.org/${node.user}/${node.id}`, '_blank'))
        },
        login() {
            if (this.username == "" || this.password == "") {
                this.clear_notifications()
                this.fail_not_empty = true
            }
            else {
                axios.post(
                    '/user/login', 
                    { userdata: {username: this.username, password: this.password} })
                    .then((response) => {
                        var result = response.data.result
                        if (result == 'success') {
                            this.clear_notifications()
                            this.success_login = true
                            this.login_state = true

                            this.update_notes()

                            EventBus.emit('update_login_state', this.login_state)
                        }
                        else {
                            this.clear_notifications()
                            this.fail_wrong_info = true
                        }
                    }
                )
            }
        },
        signup() {
            if (this.username == "" || this.password == "") {
                this.fail_not_empty = true
            }
            else {
                axios.post(
                    '/user/signup', 
                    { userdata: {username: this.username, password: this.password} })
                    .then((response) => {
                        var result = response.data.result
                        if (result == 'success') {
                            this.clear_notifications()
                            this.success_signup = true
                        }
                        else {
                            this.clear_notifications()
                            this.fail_user_exists = true
                        }
                    }
                )
            }
        },
        logout() {
            this.login_state = false
            EventBus.emit('update_login_state', this.login_state)

            this.username = ""
            this.password = ""
            this.notes = []
            this.links = []
            EventBus.emit('update_library', {
                notes: this.notes,
                links: this.links
            })

            this.clear_notifications()
        },
        clear_notifications() {
            this.success_login = false
            this.success_signup = false
            this.fail_not_empty = false
            this.fail_wrong_info = false
            this.fail_user_exists = false
        },
        update_notes() {
            if (this.login_state) {
                axios.get('/note/get_all', { params: { 
                    author: this.username
                }}).then((response) => {
                    this.notes = response.data

                    // 串联起来，以避免重复更新
                    this.update_links()
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        update_links() {
            if (this.login_state) {
                axios.get('/graph/get_all', { params: {
                    author: this.username
                }}).then((response) => {
                    this.links = response.data

                    // 等待返回笔记数据后再更新卡片盒，以正确显示。
                    EventBus.emit('update_library', {
                        notes: this.notes,
                        links: this.links,
                    })

                    this.update_graph()
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        toggle_display_ids() {
            this.display_ids = !this.display_ids
            EventBus.emit('toggle_display_ids', this.display_ids)
        },
        toggle_display_delete() {
            this.display_card_delete = !this.display_card_delete
            EventBus.emit('toggle_display_delete', this.display_card_delete)
        },
        toglle_cards_order() {
            this.notes.reverse()
            EventBus.emit('update_library', {
                notes: this.notes,
                links: this.links
            })
            EventBus.emit('keyword_change', this.keyword)
        },
        update_graph() {
            // 更新图谱节点和边
            this.graph_data.nodes = []
            for (let i = 0; i < this.notes.length; i++) {
                this.graph_data.nodes.push({
                    id: this.notes[i].id,
                    name: this.notes[i].title,
                })
            }
            
            this.graph_data.links = []
            for (let i = 0; i < this.links.length; i++) {
                this.graph_data.links.push({
                    source: this.links[i].source,
                    target: this.links[i].target
                })
            }

            this.initGraph2D()
        },
        parse_links(source, source_content, author) {
            // 解析该笔记的出链
            var patt = /\[#id:\S+?]/g
            var links = []
            var match
            while((match = patt.exec(source_content)) != null) {
                links.push({
                    source: source,
                    target: match[0].substring(5, match[0].length - 1),
                    author: author
                })
            }
            return links
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
    color: #42b983;
}
.navigator {
    position: fixed;
    top: 10px;
    left: 15%;
    bottom: 10px;
    border: solid;
    margin: 20px;
    padding: 20px;
    width: 15%;
    overflow: auto;
}
.graph-container {
    width: 100%;
}
</style>
  