<template>
    <div class="systemInfo">
        <van-nav-bar title="系统消息" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div>
            <div class="wrap" v-for="systemInfo in users" :key="systemInfo.noticeId">
                <div class="head">
                    <div class="title">{{ systemInfo.noticeContent }}</div>
                    <div class="time">{{ systemInfo.createTime }}</div>
                </div>
                <div class="content" :class="{ content_close: !systemInfo.isOpen }">
                    {{ systemInfo.noticeTitle }}
                </div>
                <div class="split"></div>
                <div class="foot" @click="changeOpen(systemInfo)" v-if="systemInfo.isOpen === true">收起
                    <van-icon name="arrow-up" />
                </div>
                <div class="foot" @click="changeOpen(systemInfo)" v-else>展开全部
                    <van-icon name="arrow-down" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            users: []
        };
    },
    computed: {
        ...mapState(['systemInfos']),
    },
    async mounted() {
        this.users = this.systemInfos.map(({ noticeId, noticeContent, createTime, noticeTitle }) => {
            return {
                noticeId, noticeContent, createTime, noticeTitle: `你拿一个正则表达式把 \n 替换成 br 就好了。
// 数据data
let message = json.stringify(data); //data是你从json数组里面拿到的字符串
// 然后现在的message 空格变成了 /n
// 然后
message=message.replace(/\n/g, "
"); //到这里请赋值 不要犯错直接 reutrn
console.log(message) //这里就是你转换的东西了。 ok

文章标题：div中的文本内容怎样按“\n”换行，在页面中显示换行后的效果
文章链接：https://www.dianjilingqu.com/540967.html
本文章来源于网络，版权归原作者所有，如果本站文章侵犯了您的权益，请联系我们删除，联系邮箱：saisai#email.cn，感谢支持理解。`, isOpen: false
            }
        })
    },
    methods: {
        changeOpen(systemInfo) {
            systemInfo.isOpen = !systemInfo.isOpen
        },
        onClickLeft() {
            this.$router.go(-1)
        },
    }
}
</script>

<style scoped>
.systemInfo {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #eee;

}

.wrap {
    padding: 1rem;
    background: #ffffff;
    margin-bottom: 0.5rem;
}

.head {
    display: flex;
    align-items: center;
}

.title {
    flex: 1 0 0;
}

.time {
    color: #999;
}

.content {
    margin-top: 0.5rem;
    white-space: pre-wrap;
    word-break: break-all;
}

.content_close {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.split {
    border-top: 1px solid #eee;
    margin: 0.5rem 0;
}

.foot {
    text-align: center;
}
</style>
