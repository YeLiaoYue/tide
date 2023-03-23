<template>
  <div class="home-box">
    <header class="header-box">
      <div class="msg" v-if="isLogin[0]">Hi,{{userMsg.name}}</div>
      <div class="msg" v-else>Hi,新朋友</div>
      <div class="time-share">
        <h3>{{new Date().getHours()<10?"早上好":new Date().getHours()<14?"中午好":new Date().getHours()<19?"下午好":"晚上好"}}</h3>
        <div class="icon-box">
          <div class="share iconfont" @click="$emit('changeShare')">&#xe606;</div>
          <div class="add iconfont" @click="$router.push('addScene')">&#xe607;</div>
        </div>
      </div>
    </header>
    <van-swipe class="my-swipe" :autoplay="null" indicator-color="white" @change="onChange">
      <van-swipe-item class="video-box" v-for="item, index in videoPlay" :key="item.id">
        <video :src="item.video_cover_demo_url" :id="'video' + index" loop="loop"></video>
        <div class="play iconfont" @click="playPause" v-show="!videoState">&#xe66e;</div>
        <div class="mask" @click="playPause"></div>
      </van-swipe-item>
      <template #indicator>
        <div class="custom-indicator"></div>
      </template>
    </van-swipe>
    <section class="middle-box">
      <nav class="m-box">
        <router-link to="/concentration" class="list">
          <div class="iconfont">&#xe623;</div>专注
        </router-link>
        <router-link to="/sleepPattern" class="list">
          <div class="iconfont">&#xe764;</div>睡眠
        </router-link>
        <router-link to="/restPattern" class="list">
          <div class="iconfont">&#xe60f;</div>小憩
        </router-link>
        <router-link to="/breathePattern" class="list">
          <div class="iconfont">&#xe605;</div>呼吸
        </router-link>
      </nav>
      <section class="today">
        <div class="img-box">
          <img :src="today?.[0]?.pic_url" alt class="auto-img" />
          <section class="msg">
            <div class="day">{{ getNowDate[0].split("-")[2] }}</div>
            <div class="mon">{{ getNowDate[1] }}</div>
          </section>
        </div>
        <div class="msg-box">
          <h3>潮汐日帖</h3>
          <p>{{ today?.filter(item => item.date == this.getNowDate[0])?.[0]?.content?.['zh-Hans'].quote.text }}</p>
        </div>
        <div class="button-box">
          <section class="button">查看</section>
        </div>
      </section>
      <div class="my-collect" v-if="isLogin[0]&&myCollect" @click="changeShowMyCollect">
        <header class="collect-header">
          <div class="icon">
            <van-icon class="like" name="like" color="#efedec" size="14rem" />
          </div>
          <div class="title">我的收藏</div>
        </header>
        <footer class="collect-footer">
          <div class="img-box">
            <img v-view-lazy="myCollect?.[0]?.image+'?imageView2/1/w/200/h/200/q/99/format/webp'" alt class="auto-img" />
          </div>
        </footer>
      </div>
      <HT v-for="item in data" :key="item.id" :item="item" />
      <div class="my-collect-page" v-if="showMyCollect">
        <div class="iconfont" @click="changeShowMyCollect">&#xe601;</div>
        <div class="title">我的收藏</div>
        <VTC :data="myCollect" />
      </div>
    </section>
  </div>
</template>

<script>
import HT from "@/components/HT.vue";
import VTC from "@/components/VTC.vue";
import { mapState } from "vuex";
import Vue from "vue";
import { Swipe, SwipeItem } from "vant";

Vue.use(Swipe);
Vue.use(SwipeItem);

export default {
  data() {
    return {
      videoData: null,
      videoState: false,
      current: 0,
      today: null,
      myCollect: null,
      showMyCollect: false,
      userMsg: null
    };
  },
  components: { HT, VTC },
  computed: {
    ...mapState(["data", "listData", "showList", "showMsg", "isLogin"]),
    videoPlay() {
      return this?.videoData?.filter(item => item.video_cover_demo_url != "");
    },
    getStartDate() {
      var date = date || new Date(),
        timestamp,
        newDate;
      if (!(date instanceof Date)) {
        date = new Date(date.replace(/-/g, "/"));
      }
      timestamp = date.getTime();
      newDate = new Date(timestamp - 7 * 24 * 3600 * 1000);
      return [
        [
          newDate.getFullYear(),
          newDate.getMonth() + 1 < 10
            ? "0" + (newDate.getMonth() + 1)
            : newDate.getMonth() + 1,
          newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()
        ].join("-")
      ].join(" ");
    },
    getNowDate() {
      const timeOne = new Date();
      const year = timeOne.getFullYear();
      let month = timeOne.getMonth() + 1;
      let day = timeOne.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      const date = `${year}-${month}-${day}`;
      return [
        date,
        new Date()
          .toDateString()
          .split(" ")[1]
          .toUpperCase()
      ];
    },
    getEndDate() {
      var date = date || new Date(),
        timestamp,
        newDate;
      if (!(date instanceof Date)) {
        date = new Date(date.replace(/-/g, "/"));
      }
      timestamp = date.getTime();
      newDate = new Date(timestamp + 7 * 24 * 3600 * 1000);
      return [
        [
          newDate.getFullYear(),
          newDate.getMonth() + 1 < 10
            ? "0" + (newDate.getMonth() + 1)
            : newDate.getMonth() + 1,
          newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()
        ].join("-")
      ].join(" ");
    }
  },
  watch: {
    showMsg: function() {
      this.myCollect =
        JSON.parse(localStorage.getItem("collect"))?.length == 0
          ? null
          : JSON.parse(localStorage.getItem("collect"));
    },
    isLogin: function() {
      this.userMsg = JSON.parse(localStorage.getItem("user")).filter(
        item => item.id == this.isLogin[1]
      )[0];
    }
  },
  created() {
    this.axios({
      method: "post",
      data: {
        ids: [
          "6018b4936a15220001c5339d",
          "5e54abfcc496e0000669d2c9",
          "5e54a9c8c496e0000669d2c3",
          "5a787347fbcf3900067aac0b",
          "5a5323f3edc9de0005e85ba6",
          "5a560d113ea0bf00086a36a8",
          "5fbdfa18fd5de000069bc0db",
          "6018b5286a15220001c533a0",
          "6018b3416a15220001c5339a",
          "6018b1c76a15220001c53394"
        ],
        updated_at: 0
      },
      url: "/v1/scenes/get_by_ids",
      headers: {
        "ml-sign": "mZu00M5Cu/2qwVROZ0YYJ4ZW9kaLUI2ndKzXF/FPVDg=",
        "ml-timestamp": "1676337392",
        "content-type": "application/json; charset=UTF-8"
      }
    }).then(res => {
      this.videoData = res.data;
    });
    this.axios({
      url: `/v1/dailypics?from=${this.getStartDate}&to=${this.getEndDate}`,
      headers: {
        "ml-sign": "5B+twdX7H6SD4QfUjazDG5276DvcQ1Rl0yC1+jW+Gv4=",
        "ml-timestamp": "1676337392"
      }
    }).then(res => {
      this.today = res.data;
    });
    this.myCollect =
      JSON.parse(localStorage.getItem("collect"))?.length == 0
        ? null
        : JSON.parse(localStorage.getItem("collect"));
    this.userMsg = JSON.parse(localStorage.getItem("user")).filter(
      item => item.id == this.isLogin[1]
    )[0];
  },
  methods: {
    playPause() {
      var myVideo = document.getElementById("video" + this.current);
      if (myVideo.paused) {
        this.videoState = true;
        myVideo.play();
      } else {
        this.videoState = false;
        myVideo.pause();
      }
    },
    onChange(index) {
      var myVideo = document.getElementById("video" + this.current);
      this.videoState = false;
      myVideo.pause();
      this.current = index;
    },
    changeShowMyCollect() {
      this.showMyCollect = !this.showMyCollect;
      this.myCollect =
        JSON.parse(localStorage.getItem("collect"))?.length == 0
          ? null
          : JSON.parse(localStorage.getItem("collect"));
    }
  }
};
</script>

<style lang="scss" scoped>
.home-box {
  padding-bottom: 70rem;
  background-color: #a69791;
  .van-swipe{
    height: 90vh;
  }
}

.header-box {
  position: absolute;
  width: 100vw;
  z-index: 999;

  .msg {
    top: 0;
    padding: 20rem 25rem 10rem;
    font-size: 14rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .time-share {
    padding: 0 25rem 40rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;

    h3 {
      font-size: 30rem;
    }

    .icon-box {
      display: flex;
      justify-content: space-between;
      width: 70rem;

      .iconfont {
        font-size: 24rem;
      }

      .add {
        font-size: 26rem;
      }
    }
  }
}

.my-swipe {
  position: relative;

  .video-box {
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    video {
      width: 160vw;
      height: 90vh;
      margin: 0 auto;
    }
  }

  .play {
    position: absolute;
    width: 100vw;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40rem;
    color: rgba(255, 255, 255, 0.6);
    z-index: 99;
  }

  .mask {
    position: absolute;
    width: 100vw;
    height: 90vh;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 9;
  }
}

.middle-box {
  position: relative;
  top: -140rem;
}

.m-box {
  width: 100vw;
  display: flex;
  padding-bottom: 30rem;
  justify-content: space-around;

  .list {
    text-align: center;
    font-size: 16rem;
    color: rgba(255, 255, 255, 0.5);

    .iconfont {
      width: 50rem;
      height: 50rem;
      margin-bottom: 10rem;
      border-radius: 50%;
      font-size: 22rem;
      color: #fff;
      background-color: rgba(255, 255, 255, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.today {
  display: flex;
  margin: 0 25rem 15rem;
  padding: 10rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10rem;
  align-items: center;

  .img-box {
    position: relative;
    width: 50rem;
    height: 50rem;
    border-radius: 5rem;
    margin-right: 10rem;
    overflow: hidden;

    .msg {
      position: absolute;
      top: 0;
      left: 0;
      width: 50rem;
      height: 50rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;

      .day {
        font-size: 16rem;
      }
    }
  }

  h3 {
    font-size: 16rem;
    font-weight: bold;
    color: #ffffff;
  }

  p {
    width: 200rem;
    font-size: 14rem;
    color: rgba(255, 255, 255, 0.8);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .button-box {
    .button {
      width: 40rem;
      height: 30rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15rem;
      background-color: #fff;
      color: #ddd;
    }
  }
}
.my-collect {
  width: 325rem;
  height: 75rem;
  margin: 25rem;
  padding: 10rem;
  border-radius: 10rem;
  background-color: rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .collect-header {
    display: flex;
    justify-content: start;
    align-items: center;
    .title {
      margin-left: 5rem;
      font-size: 14rem;
      color: #efefef;
    }
  }
  .collect-footer {
    align-self: end;
    .img-box {
      width: 25rem;
      height: 25rem;
      border-radius: 50%;
      overflow: hidden;
    }
  }
}
.my-collect-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  overflow-y: auto;
  z-index: 9999;
  .iconfont {
    width: 30rem;
    height: 30rem;
    margin: 10rem 0 0 30rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 14rem;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .title {
    margin: 10rem 0 0 30rem;
    font-size: 30rem;
    color: #000;
  }
}
</style>
