<template>
    <div class="library">
        <VueFlexWaterfall
            class="cards"
            col="3"
            col-spacing="15"
            :break-at="{ 600: 2, 300: 1}"
        >
            <div class="card-container" v-for="(item,index) in cards" :key="index">
                <VueShowdown
                    v-bind:markdown="item"
                />
            </div>
        </VueFlexWaterfall>
    </div>
</template>

<script>
import { VueFlexWaterfall } from 'vue-flex-waterfall'

export default {
    name: 'LibraryComponent',
    data() {
        return {
            cards: [
                '7月4日\n新开这本日记，也为了督促自己下个学期多下些苦功。先要读完手边的莎士比亚的《亨利八世》……',
                '7月13日\n打牌。',
                '7月14日\n打牌。',
                '7月15日\n打牌。',
                '7月16日\n胡适之啊胡适之！你怎么能如此堕落！先前订下的学习计划你都忘了吗？\n子曰：“吾日三省吾身。”...不能再这样下去了！',
                '7月17日\n打牌。',
                '7月18日\n打牌。',
                '七月四日\n读Plato’s Apology of Socrates。今日为美国独立纪念日，夜八时至湖上观此间庆祝会。士女来游者无算，公园中百戏俱陈，小儿女燃花爆为乐。既而焰火作矣，五光十色，备极精巧。九时半始归。',
                '七月十三日\n上课。读《陶渊明诗》一卷。',
                '七月十四日\n化学第一小试。读拉丁文。夜游公园，适天微雨，众皆避入跳舞厅内。已而乐作，有男女约二十双，双双跳舞。此为余见跳舞之第一次，故记之。',
                '七月十五日\n读拉丁文。读《谢康乐诗》一卷。作书寄友人。夜赴暑期学生之欢迎会。',
                '七月十六日\n游湖上别墅，归后大风雨。读拉丁文。',
                '七月十七日\n上课。化学试卷竟得百分，真出意外。读拉丁文。',
            ]
        }
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
    border: solid;
    margin-bottom: 20px;
    width: 30%;
    padding: 5px;
}
</style>
