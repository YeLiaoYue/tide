<template>
  <div class="set-box">
    <header class="set-header">
      <van-icon name="arrow-left" @click="$emit('changeShowSet')" />
      <h3>更多设置</h3>
    </header>
    <ul>
      <li v-if="isLogin[0]"  @click="$emit('changeShowUserMsg')">个人资料</li>
      <li v-if="isLogin[0]">账号与安全</li>
      <li v-else @click="$emit('changeShowLogin')">注册登录</li>
      <li>潮汐PLUS</li>
    </ul>
    <ul>
      <li>声音场景</li>
      <li>个性化定制</li>
      <li>通知</li>
      <li>实验室</li>
      <li>
        每周起始日
        <span>周一</span>
      </li>
    </ul>
    <ul>
      <li>优化使用</li>
      <li>帮助与反馈</li>
      <li>给我们评分</li>
      <li>关于</li>
      <li>缓存管理(256.49MB)</li>
    </ul>
    <div class="log-out" v-if="isLogin[0]" @click="changeShow">登出</div>
    <van-popup v-model="show">
      <div class="msg-box">
        <p>确定要退出账号吗?</p>
        <section class="button-box">
          <div class="cancel" @click="changeShow">取消</div>
          <div class="confirm" @click="changIsLogin">确定</div>
        </section>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Icon, Toast, Popup } from "vant";
import { mapState } from "vuex";

Vue.use(Icon);
Vue.use(Toast);
Vue.use(Popup);
export default {
  data() {
    return {
      show: false
    };
  },
  computed: { ...mapState(["isLogin"]) },
  methods: {
    changeShow(){
      this.show = !this.show;
    },
    changIsLogin() {
      if (this.isLogin[0]) {
        localStorage.setItem("isLogin", JSON.stringify([false, null]));
        Toast("成功退出账号");
        this.$emit("changeShowSet");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.set-box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  padding-top: 50rem;
  background-color: #fff;
  z-index: 999999;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}
.set-header {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 50rem;
  padding-left: 15rem;
  display: flex;
  align-items: center;
  font-size: 20rem;
  font-weight: bold;
  background-color: #fff;
  box-shadow: 0 5rem 5rem 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  z-index: 999999;
  h3 {
    margin-left: 35rem;
    font-size: 16rem;
    font-weight: bold;
  }
}
ul {
  padding: 20rem 60rem;
  box-sizing: border-box;
  &::after {
    position: relative;
    top: 20rem;
    right: 35rem;
    content: "";
    width: 355rem;
    height: 1rem;
    display: block;
    background-color: rgba(0, 0, 0, 0.1);
  }
  li {
    height: 50rem;
    display: flex;
    align-items: center;
    font-size: 14rem;
    font-weight: 600;
    span {
      margin-left: auto;
      color: rgba(0, 0, 0, 0.3);
    }
  }
}
.log-out {
  height: 40rem;
  padding: 10rem 60rem;
  margin: 10rem 0 20rem;
  display: flex;
  align-items: center;
  font-size: 14rem;
  font-weight: bold;
  box-sizing: border-box;
}
.msg-box {
  width: 90vw;
  padding: 20rem;
  box-sizing: border-box;
  p {
    font-size: 16rem;
    font-weight: bold;
  }
  .button-box {
    width: 110rem;
    margin-top: 20rem;
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    div {
      width: 50rem;
      height: 40rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14rem;
      color: #ff5555;
    }
  }
}
</style>