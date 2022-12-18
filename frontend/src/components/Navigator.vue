<template>
    <div class="navigator">
        <div class="logo">
            <h1>WEWO</h1>
            <p>基于微服务架构的双链笔记应用</p>
            <hr/>
        </div>
        <div class="user_info">
            <p>胡适（<a>登出</a>）</p>
        </div>
        <div class="heatmap_calendar">
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
        <div class="recent">
            <h3>最近</h3>
            <ul>
                <li>留学日记第4篇</li>
            </ul>
        </div>
    </div>
</template>

<script>
// import { CalendarHeatmap } from 'vue3-calendar-heatmap'

export default {
    name: 'NavigatorComponent',
    data() {
        return {
            // calendar_nums: [
            //     { date: '2022-12-16', count: 6 }, { date: '2022-12-17', count: 3 }, { date: '2022-12-18', count: 5 }
            // ],
            // end_date: new Date('2022-12-31'),
        }
    },
    props: {
        // msg: String
    },
    components: {
        // CalendarHeatmap,
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
</style>
  