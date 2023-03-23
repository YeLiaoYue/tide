<template>
  <div id="app" :class="$route.path == '/' ? 'view-home' : ''">
    <nav class="nav-home" :class="$router.currentRoute.fullPath == '/' ? 'home-view' : ''">
      <router-link to="/" exact>
        <div class="iconfont">&#xe6e4;</div>首页
      </router-link>
      <router-link to="/discover">
        <div class="iconfont">&#xe610;</div>探索
      </router-link>
      <router-link to="/mine">
        <div class="iconfont">&#xe638;</div>我的
      </router-link>
    </nav>
    <MorePage v-show="showList" />
    <MsgPage
      v-if="showMsg"
      @touchmove.prevent
      @mousewheel.prevent
      @changeShowLogin="changeShowLogin"
      v-on:changeShare="changeShare()"
    />
    <LoginPage v-if="showLogin" @changeShowLogin="changeShowLogin" />
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <transition>
      <router-view @changeShare="changeShare()" @changeShowLogin="changeShowLogin" />
    </transition>
  </div>
</template>

<script>
import MorePage from "@/components/MorePage.vue";
import MsgPage from "@/components/MsgPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import store from "./store";
import { mapState } from "vuex";
import Vue from "vue";
import { ShareSheet,Toast } from "vant";

Vue.use(ShareSheet);
Vue.use(Toast);

export default {
  data() {
    return {
      showShare: false,
      showLogin: false,
      options: [
        [
          { name: "微信", icon: "wechat" },
          { name: "朋友圈", icon: "wechat-moments" },
          { name: "微博", icon: "weibo" },
          { name: "QQ", icon: "qq" }
        ],
        [
          { name: "复制链接", icon: "link" },
          { name: "分享海报", icon: "poster" },
          { name: "二维码", icon: "qrcode" },
          { name: "小程序码", icon: "weapp-qrcode" }
        ]
      ]
    };
  },
  created() {
    this.getData();
    this.getQuery();
  },
  components: { MorePage, MsgPage, LoginPage },
  computed: { ...mapState(["showMsg", "showList"]) },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        this.getData();
      }
      this.getQuery();
    },
    showLogin:function(){
      store.commit("updateIsLogin")
    }
  },
  methods: {
    getData() {
      store.commit("initializeData");
      switch (this.$route.path) {
        case "/":
          this.axios({
            url:
              "/v2/explorer/recommendation/CN?local_time=2022-12-25T11%3A11%3A31Z&lang=zh-CN",
            headers: {
              "ml-sign": "0pJ7D+i45N3C7KsHD7VyUg1QGpHJYvY5Mqg6IcAxwsY=",
              "ml-timestamp": "1671937891"
            }
          }).then(res => {
            store.commit("changeData", res.data.groups);
          });
          break;
        case "/discover":
          this.axios({
            url: "/v3/explorer/pages?type=home",
            headers: {
              "ml-sign": "eBI+X+GgIjgognbVxVGq94gvQmOR5awnYqJH6T6p5Rs=",
              "ml-timestamp": "1678176114"
            }
          }).then(res => {
            store.commit("changeData", res.data);
          });
          this.axios({
            url: "/v2/explorer/today_recommendations/cn?offset=0&limit=512",
            headers: {
              "ml-sign": "GbDutmJArFE4k3wWrEMnViowrzXpPy/Ntk7nDQSrAH8=",
              "ml-timestamp": "1678176114"
            }
          }).then(res => {
            store.commit("changeRecommendations", res.data);
          });
          break;
        case "/discover/meditation":
          this.axios({
            url: "/v2/explorer/meditation_pages/cn",
            headers: {
              "ml-sign": "v5jmkFuGfs1WkuzDxwzZvg4Qep0N6j/cRRxPhewAD+M=",
              "ml-timestamp": "1675745413"
            }
          }).then(res => {
            store.commit("changeData", res.data);
          });
          break;
        case "/discover/sleep":
          this.axios({
            url: "/v2/explorer/sleep_story_pages/cn",
            headers: {
              "ml-sign": "iR2zS7a8dfA68VDr6P6AJErCVBEw59nwAMIaSKr/4sg=",
              "ml-timestamp": "1675746348"
            }
          }).then(res => {
            store.commit("changeData", res.data);
          });
          break;
        case "/discover/sleep/sleepMeditation":
          this.axios({
            url: "/v2/explorer/sleep_meditation_pages/cn",
            headers: {
              "ml-sign": "lfSnCDk5XdYffHgGGAjbG8z4pUSx4gH8MiBkT3MkQ1U=",
              "ml-timestamp": "1676012544"
            }
          }).then(res => {
            store.commit("changeData", res.data);
          });
          break;
        case "/discover/sleep/sleepScene":
          this.axios({
            url: "/v2/explorer/sleep_scene_pages/cn?offset=0&limit=511",
            headers: {
              "ml-sign": "vlJZUyYHOF2KFz4YlDvsdY/mZDSTwze7L2Z9x/5RsX4=",
              "ml-timestamp": "1676012927"
            }
          }).then(res => {
            store.commit("changeData", res.data);
          });
          break;
        case "/discover/scene":
          this.axios({
            url: "/v2/explorer/scene_pages/cn",
            headers: {
              "ml-sign": "4yYCyMX+Tb3H8wdQeghPuQRjfa+GHrywPqHYyy2XOZ0=",
              "ml-timestamp": "1675746403"
            }
          }).then(res => {
            store.commit("changeData", res.data);
          });
          break;
        case "/addScene":
          this.axios({
            url: "/v2/explorer/scene_pages/cn",
            headers: {
              "ml-sign": "4yYCyMX+Tb3H8wdQeghPuQRjfa+GHrywPqHYyy2XOZ0=",
              "ml-timestamp": "1675746403"
            }
          }).then(res => {
            store.commit("changeData", res.data);
          });
          break;
      }
    },
    getQuery() {
      if (this.$route.query.id) {
        store.commit("changeQuery", this.$route.query.id);
      }
    },
    changeShare() {
      this.showShare = true;
    },
    onSelect(option) {
      Toast(option.name);
      this.showShare = false;
    },
    changeShowLogin() {
      this.showLogin = !this.showLogin;
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "iconfont"; /* Project id 3890809 */
  src: url("../font/iconfont.woff2?t=1676359850867") format("woff2"),
    url("../font/iconfont.woff?t=1676359850867") format("woff"),
    url("../font/iconfont.ttf?t=1676359850867") format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 24rem;
}

body {
  margin: 0;
  box-sizing: border-box;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
  padding: 0;
  font-weight: normal;
  font-size: 12rem;
}

.auto-img {
  width: 100%;
  height: 100%;
  display: block;
}

.view-home {
  box-shadow: 0 -0.2rem 0.5rem #eee;

  .nav-home {
    background-color: #a69791;

    a {
      color: #ccc;
    }

    a.router-link-active {
      color: #efefef;
    }
  }
}

.nav-home {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  padding: 10rem 20rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 -0.2rem 2rem #aaa;
  z-index: 9999;
  box-sizing: border-box;

  .iconfont {
    margin-bottom: 3rem;
  }

  a {
    color: #e5e5e5;
  }

  a.router-link-active {
    color: #444;
  }
}
.msg-box {
  // position: fixed;
  // bottom: 0;
  // left: 0;
  // z-index: 99999;
  .icon-box {
    display: flex;
    padding: 0 25rem;
    .right {
      display: flex;
      width: 70rem;
      justify-content: space-between;
      margin-left: auto;
    }
  }
  .img-box {
    width: 100vw;
  }
}
.van-overlay,
.van-popup {
  z-index: 99999999 !important;
}
.van-toast{
    z-index: 9999999 !important;
}
</style>
