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
            <a @click="this.toggle_display_ids" v-if="this.display_ids">切换卡片ID显示（<b>Y</b>/N）</a>
            <a @click="this.toggle_display_ids" v-if="!this.display_ids">切换卡片ID显示（Y/<b>N</b>）</a>
            <br />
            <a>按时间排序（<b>Y</b>/N)</a>
        </div>
        <div class="graph-container">
            <h3>图谱</h3>
            <div ref="graph" id="graph"></div>
        </div>
        <div class="linked-notes">
            <h3>反向链接</h3>
            <ul>
                <li>留学日记第1篇</li>
                <li>留学日记第2篇</li>
                <li>留学日记第3篇</li>
            </ul>
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
                nodes: [
                    { id: "6399c7bbfe5e0b1ee272cfb7", name: "测试" },
                    { id: "6399d84192b59d475cc41195", name: "留学日记" },
                    { id: "639ae195edb0c50919926013", name: "留学日记" },
                    { id: "639ae195edb0c50919926012", name: "留学日记" },
                    { id: "639ae4e76265b20d24978e94", name: "留学日记" },
                ],
                links: [
                    { "source": "6399c7bbfe5e0b1ee272cfb7", "target": "6399d84192b59d475cc41195" },
                    { "source": "6399c7bbfe5e0b1ee272cfb7", "target": "639ae195edb0c50919926013" },
                    { "source": "6399c7bbfe5e0b1ee272cfb7", "target": "639ae195edb0c50919926012" },
                    { "source": "6399c7bbfe5e0b1ee272cfb7", "target": "639ae4e76265b20d24978e94" },
                ],
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
        }
    },
    mounted() {
        EventBus.on('update_data', () => {
            this.update_notes()
            this.update_links()
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
            .then(() => {
                this.update_notes()
                this.update_links()
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
            .then(() => {
                this.update_notes()
                this.update_links()
            })
            .catch((error) => {
                console.log(error)
            })
        })

        EventBus.emit('update_login_state', this.login_state)
        
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
                            this.update_links()

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
                axios.get('/note/get_all',
                    { params: { author: this.username, order: 'time_order' } })
                    .then((response) => {
                        this.notes = response.data

                        // 等待返回笔记数据后再更新卡片盒，以正确显示。
                        EventBus.emit('update_library', {
                            notes: this.notes,
                            links: this.links,
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        },
        update_links() {

        },
        toggle_display_ids() {
            this.display_ids = !this.display_ids
            EventBus.emit('toggle_display_ids', this.display_ids)
        }
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
  