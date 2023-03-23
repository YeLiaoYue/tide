<template>
  <div class="mine-box">
    <div class="message iconfont">&#xe7d8;</div>
    <div class="user" v-if="isLogin[0]" @click="changeShowUserMsg">
      <section class="user-msg">
        <div class="name">{{userMsg.name}}</div>
        <div class="msg">与潮汐相遇的第{{(Math.ceil((Date.now()-userMsg.createTime)/(24*60*60*1000)))}}天</div>
      </section>
      <div class="user-img iconfont" v-if="userMsg.image">
        <img :src="userMsg.image" alt class="auto-img" />
      </div>
      <div class="user-img iconfont" v-else>&#xe639;</div>
    </div>
    <div class="user" @click="$emit('changeShowLogin')" v-else>
      <section class="user-msg">
        <div class="name">登录潮汐</div>
        <div class="msg">开始冲浪者之旅</div>
      </section>
      <div class="user-img iconfont">&#xe639;</div>
    </div>
    <div class="today">
      <section class="title-box">
        <div class="icon iconfont">&#xe627;</div>
        <span class="title">今日</span>
        <div class="enter iconfont">&#xe626;</div>
      </section>
      <div class="ct-box">
        <section :style="{backgroundColor: '#f0f1fc'}">
          <h6>睡眠</h6>
          <span>{{today?.[0]||0}}</span>分钟
        </section>
        <section :style="{backgroundColor: '#f2fbfd'}">
          <h6>冥想</h6>
          <span>{{ today?.[1]||0 }}</span>分钟
        </section>
        <section :style="{backgroundColor: '#fef2f0'}">
          <h6>专注</h6>
          <span>{{today?.[2]||0}}</span>分钟
        </section>
      </div>
    </div>
    <div class="my-tide">
      <section class="title-box">
        <div class="icon iconfont">&#xe710;</div>
        <span class="title">
          我的潮汐
          <div class="s-icon iconfont" @click="changeShowAsk()">&#xe629;</div>
        </span>
        <div class="enter iconfont">&#xe626;</div>
      </section>
      <section class="msg">开始你的潮汐之旅</section>
      <section class="img-box">
        <img src="../images/month.png" alt srcset />
      </section>
    </div>
    <ul class="list">
      <li>
        <div class="icon iconfont">&#xe675;</div>
        <span class="title">每日提醒</span>
        <div class="enter iconfont">&#xe626;</div>
        <i class="line"></i>
      </li>
      <li>
        <div class="icon iconfont">&#xe60d;</div>
        <span class="title">日帖收藏</span>
        <div class="enter iconfont">&#xe626;</div>
        <i class="line"></i>
      </li>
      <li>
        <div class="icon iconfont">&#xe6bc;</div>
        <span class="title">我的下载</span>
        <div class="enter iconfont">&#xe626;</div>
        <i class="line"></i>
      </li>
      <li>
        <div class="icon iconfont">&#xe632;</div>
        <span class="title">扫一扫</span>
        <div class="enter iconfont">&#xe626;</div>
        <i class="line"></i>
      </li>
      <li @click="changeShowSet">
        <div class="icon iconfont">&#xe684;</div>
        <span class="title">更多设置</span>
        <div class="enter iconfont">&#xe626;</div>
      </li>
    </ul>
    <div class="my-tide-ask" v-show="showAsk" @touchmove.prevent @mousewheel.prevent>
      <section class="ct-box">
        <div class="icon iconfont" @click="changeShowAsk()">&#xe601;</div>
        <h3>我的潮汐</h3>
        <p>在这里，记录你的潮汐之旅。每一次的睡眠、冥想、专注和呼吸，都会点亮每一天的小格子，时间越长，颜色越深。同时，你的「TIDE Days」也会随之增加。</p>
        <div class="area-chart">
          <section>
            <h6>睡眠</h6>
            <ul class="color-area-chart">
              <li :style="{backgroundColor: '#dfdef9'}"></li>
              <li :style="{backgroundColor: '#a9a8ee'}"></li>
              <li :style="{backgroundColor: '#7977e4'}"></li>
            </ul>
            <div class="hint">
              <span>短</span>
              <span>长</span>
            </div>
          </section>
          <section>
            <h6>冥想</h6>
            <ul class="color-area-chart">
              <li :style="{backgroundColor: '#e3f6f9'}"></li>
              <li :style="{backgroundColor: '#b3e7ee'}"></li>
              <li :style="{backgroundColor: '#89dae5'}"></li>
            </ul>
            <div class="hint">
              <span>短</span>
              <span>长</span>
            </div>
          </section>
          <section>
            <h6>专注</h6>
            <ul class="color-area-chart">
              <li :style="{backgroundColor: '#ffe9dd'}"></li>
              <li :style="{backgroundColor: '#fec5a5'}"></li>
              <li :style="{backgroundColor: '#fea472'}"></li>
            </ul>
            <div class="hint">
              <span>短</span>
              <span>长</span>
            </div>
          </section>
        </div>
      </section>
      <section class="after" @click="changeShowAsk()"></section>
    </div>
    <MoreSetPage
      v-if="showMoreSet"
      @changeShowSet="changeShowSet"
      @changeShowUserMsg="changeShowUserMsg"
      @changeShowLogin="$emit('changeShowLogin')"
    />
    <UserMsgPage v-if="showUserMsg" @changeShowUserMsg="changeShowUserMsg" />
  </div>
</template>

<script>
import MoreSetPage from "@/components/MoreSetPage.vue";
import UserMsgPage from "@/components/UserMsgPage.vue";

import { mapState } from "vuex";
import store from "../store";
export default {
  data() {
    return {
      showAsk: false,
      userMsg: true,
      showMoreSet: false,
      showUserMsg: false,
      today: []
    };
  },
  computed: { ...mapState(["isLogin"]) },
  methods: {
    changeShowAsk() {
      this.showAsk = !this.showAsk;
    },
    changeShowSet() {
      this.showMoreSet = !this.showMoreSet;
    },
    changeShowUserMsg() {
      this.showUserMsg = !this.showUserMsg;
      this.userMsg = JSON.parse(localStorage.getItem("user")).filter(
        item => item.id == this.isLogin[1]
      )[0];
    }
  },
  components: { MoreSetPage, UserMsgPage },
  created() {
    if (this.isLogin[0]) {
      this.userMsg = JSON.parse(localStorage.getItem("user")).filter(
        item => item.id == this.isLogin[1]
      )[0];
      let todaySleepTime = 0;
      JSON.parse(localStorage.getItem("sleep"))
        ?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )?.[0]
        ?.time.map(item => (todaySleepTime += item * 1));
      JSON.parse(localStorage.getItem("rest"))
        ?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )?.[0]
        ?.time.map(item => (todaySleepTime += item * 1));
      let todayBreatheTime = 0;
      JSON.parse(localStorage.getItem("breathe"))
        ?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )?.[0]
        ?.time.map(item => (todayBreatheTime += item * 1));
      let todayConcentrationTime = 0;
      JSON.parse(localStorage.getItem("concentration"))
        ?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )?.[0]
        ?.time.map(item => (todayConcentrationTime += item * 1));
      this.today = [todaySleepTime, todayBreatheTime, todayConcentrationTime];
    }
  },
  watch: {
    isLogin: function() {
      this.userMsg = JSON.parse(localStorage.getItem("user"))?.filter(
        item => item.id == this.isLogin[1]
      )[0];
    },
    showMoreSet: function() {
      store.commit("updateIsLogin");
    }
  }
};
</script>

<style lang="scss" scoped>
.mine-box {
  background-color: #f2f2f2;
  padding-bottom: 135rem;
}
.message {
  padding: 10rem 20rem;
  font-size: 20rem;
  font-weight: bold;
}
.user {
  padding: 10rem 20rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .name {
    font-size: 28rem;
    font-weight: bold;
    margin-bottom: 10rem;
  }
  .msg {
    font-size: 13rem;
    color: #888888;
  }
  .user-img {
    width: 70rem;
    height: 70rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #999;
    border-radius: 50%;
    font-size: 38rem;
    color: #dddddd;
    overflow: hidden;
  }
}
.today {
  margin: 20rem 15rem 20rem;
  height: 135rem;
  padding: 15rem;
  border-radius: 15rem;
  background-color: #fff;
  box-sizing: border-box;
  .title-box {
    display: flex;
    align-items: center;
    .icon {
      width: 25rem;
      height: 25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5rem;
      background-color: #cbd9e7;
      font-size: 16rem;
      color: #fff;
    }
    .title {
      margin-left: 10rem;
      font-size: 16rem;
      font-weight: bold;
    }
    .enter {
      color: #bbb;
      font-size: 14rem;
      margin-left: auto;
    }
  }
  .ct-box {
    margin-top: 10rem;
    display: flex;
    justify-content: space-between;
    color: #aaa;
    section {
      width: 100rem;
      height: 65rem;
      padding: 10rem 5rem;
      border-radius: 7rem;
      background-color: #999;
      box-sizing: border-box;
      h6 {
        margin-bottom: 5rem;
      }
      span {
        color: #000;
        font-size: 18rem;
        margin-right: 2rem;
      }
    }
  }
}
.my-tide {
  margin: 10rem 15rem 20rem;
  height: 300rem;
  padding: 15rem;
  border-radius: 15rem;
  background-color: #fff;
  box-sizing: border-box;
  .title-box {
    display: flex;
    align-items: center;
    .icon {
      width: 25rem;
      height: 25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5rem;
      background-color: #cbd9e7;
      font-size: 16rem;
      color: #fff;
    }
    .title {
      margin-left: 10rem;
      font-size: 16rem;
      font-weight: bold;
      display: flex;
      .s-icon {
        margin-left: 3rem;
        width: 16rem;
        height: 16rem;
        border-radius: 50%;
        color: #ffffff;
        background-color: #eeeeee;
        align-self: end;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14rem;
      }
    }
    .enter {
      color: #bbb;
      font-size: 14rem;
      margin-left: auto;
    }
  }
  .msg {
    margin: 40rem 0 60rem;
    display: flex;
    font-size: 16rem;
    color: #bbbbbb;
    justify-content: center;
  }
  .img-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.list {
  margin: 10rem 15rem;
  border-radius: 15rem;
  background-color: #fff;
  box-sizing: border-box;
  li {
    position: relative;
    width: 100%;
    height: 60rem;
    padding: 0 15rem;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    .iconfont {
      color: #bbb;
    }
    .title {
      font-size: 15rem;
      text-shadow: 1rem 1rem 2rem #999;
    }
    .icon {
      font-size: 24rem;
      font-weight: bold;
      margin-right: 20rem;
    }
    .enter {
      margin-left: auto;
      font-size: 14rem;
    }
    .line {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 285rem;
      height: 1rem;
      background-color: #eee;
    }
  }
}
.my-tide-ask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  .after {
    content: "";
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }
  .ct-box {
    position: relative;
    width: 280rem;
    height: 270rem;
    padding: 20rem 25rem;
    border-radius: 15rem;
    background-color: #fff;
    box-sizing: border-box;
    z-index: 99999;
    .icon {
      margin-left: auto;
      width: 25px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      background-color: #d6d6d6;
    }
    h3 {
      margin-bottom: 20rem;
      text-align: center;
      font-size: 18rem;
      font-weight: 600;
    }
    p {
      letter-spacing: 0.5rem;
      font-size: 12rem;
      color: #b7b7b7;
      font-weight: 600;
    }
    .area-chart {
      margin-top: 30rem;
      display: flex;
      justify-content: space-around;
      color: #b7b7b7;
      section {
        display: flex;
        flex-direction: column;
        align-items: center;
        .color-area-chart {
          margin-top: 10px;
          width: 30rem;
          height: 10rem;
          border-radius: 3rem;
          overflow: hidden;
          display: flex;
          li {
            width: 10rem;
            height: 10rem;
          }
        }
      }
    }
    .hint {
      width: 30rem;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>