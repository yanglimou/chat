<template>
    <div class="me">
        <van-form @submit="logout">
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">退出登录</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>

export default {
    data() {
        return {
        };
    },
    methods: {
        logout() {
            this.$router.replace({ name: 'login' })
        }
    }
}
</script>

<style scoped>
.me {}
</style>
