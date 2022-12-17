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
            <p>热力图</p>
            <p>热力图</p>
            <p>热力图</p>
            <p>热力图</p>
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
export default {
    name: 'NavigatorComponent',
    props: {
        // msg: String
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
  