<template>
    <div class="login">
        <van-form @submit="onSubmit">
            <van-field v-model="userId" name="用户名" autocomplete="off" label="用户名" placeholder="请输入0-99的数字"
                :rules="[{ pattern: /^([0]|[1-9]\d?)$/, message: '请输入0-99的数字' }]" />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">登录</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
export default {
    data() {
        return {
            userId: ""
        };
    },
    methods: {
        ...mapMutations(["setUserId", "setSessions", "setContacts", "initWs"]),
        ...mapActions(['initWs']),
        async onSubmit() {
            this.setUserId(+this.userId)
            const contacts = await this.$http.post(`/chat/contacts?token=${this.userId}`)
            this.setContacts(contacts)
            const sessions = await this.$http.post(`/chat/sessions?token=${this.userId}`)
            this.setSessions(sessions)
            this.initWs()
            this.$router.replace({ name: 'chat' })
        }
    }
}
</script>

<style scoped>
.login {}
</style>
