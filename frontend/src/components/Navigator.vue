<template>
    <div class="navigator">
        <div class="logo">
            <h1>WEWO</h1>
            <p>基于微服务架构的双链笔记应用</p>
            <hr/>
        </div>
        <div class="user-info">
            <p>胡适（<a>登出</a>）</p>
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
        <hr/>
        <div class="pinned">
            <h3>置顶</h3>
            <ul>
                <li>留学日记第1篇</li>
                <li>留学日记第2篇</li>
                <li>留学日记第3篇</li>
            </ul>
        </div>
        <div class="graph-container">
            <div ref="graph" id="graph"></div>
        </div>
    </div>
</template>

<script>
// import { CalendarHeatmap } from 'vue3-calendar-heatmap'
import ForceGraph from 'force-graph'

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
                    { id: "6399c7bbfe5e0b1ee272cfb7", name: "测试", val: 1 },
                    { id: "6399d84192b59d475cc41195", name: "留学日记", val: 1 },
                    { id: "639ae195edb0c50919926013", name: "留学日记", val: 1 },
                    { id: "639ae195edb0c50919926012", name: "留学日记", val: 1 },
                    { id: "639ae4e76265b20d24978e94", name: "留学日记", val: 1 },
                ],
                links: [
                    { "source": "6399c7bbfe5e0b1ee272cfb7", "target": "6399d84192b59d475cc41195" },
                    { "source": "6399c7bbfe5e0b1ee272cfb7", "target": "639ae195edb0c50919926013" },
                    { "source": "6399c7bbfe5e0b1ee272cfb7", "target": "639ae195edb0c50919926012" },
                    { "source": "6399c7bbfe5e0b1ee272cfb7", "target": "639ae4e76265b20d24978e94" },
                ],
            },
        }
    },
    mounted() {
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
    border-radius: 2px;
    border: solid 1px;
}
</style>
  