<template>
  <div class="msg-page" v-if="msg?.[0] == 'meditation'">
    <div class="header-box" :style="{backgroundImage: 'url(' + msg?.[1]?.image + ')'}">
      <section class="icon-box">
        <div class="left iconfont" @click="changeShowList">&#xe609;</div>
        <div class="right">
          <div class="iconfont" v-if="isLogin[0]&&collect" @click="addCollect">
            <van-icon name="like" color="#ff6757" />
          </div>
          <div class="iconfont" @click="addCollect" v-else>&#xe628;</div>
          <div class="iconfont" @click="$emit('changeShare')">&#xe606;</div>
        </div>
      </section>
      <div class="people-box">
        <div class="count">{{msg?.[1]?.stats?.using_people_count}}人正在听</div>
      </div>
    </div>
    <section class="middle-box">
      <div class="tag-box">
        <section class="tag plus" v-show="msg?.[1]?.sections?.[0]?.access == 'subscribe'">plus</section>
        <section
          class="tag"
          v-for="item in msg?.[1]?.simple_tags"
          :key="item.id"
        >{{ item?.name?.["zh-Hans"] }}</section>
      </div>
      <div class="title-box">
        <section class="title">{{ msg?.[1]?.name?.["zh-Hans"] }}</section>
        <section
          class="time"
          v-if="msg?.[1]?.sections?.length >= 4"
        >{{ msg?.[1]?.sections?.length }}章 · 系列</section>
        <section class="time" v-else>{{ msg?.[1]?.duration_description?.["zh-Hans"] }} · 时刻</section>
      </div>
      <div class="msg-box">
        <div
          class="teacher"
          :class="msg?.[1]?.sections?.length >= 4 ? 'special' : '' "
          is-link
          @click="showPopup"
        >
          <div class="teacher-img">
            <img
              class="auto-img"
              :src=" teacherList?.[0]?.avatar||msg?.[1]?.speaker_groups_v2?.[0]?.avatar"
            />
          </div>
          <div class="teacher-introduce">
            <div class="position">冥想导师</div>
            <div
              class="name"
            >{{ teacherList?.[0]?.name_i18n?.['zh-Hans'] || msg?.[1]?.speaker_groups_v2[0]?.name_i18n?.['zh-Hans'] }}</div>
          </div>
          <div class="more iconfont">&#xe626;</div>
        </div>
        <section class="time-box" v-show="msg?.[1]?.sections?.length < 4" @click="changeShowTime">
          <div class="left">
            <div class="type">时长</div>
            <div
              class="time-content"
            >{{ currentSelectTime || msg?.[1]?.duration_description?.['zh-Hans']?.split('-')[0]?.split('分')?.[0] }}分钟</div>
          </div>
          <div
            class="more iconfont"
            v-if="msg?.[1]?.duration_description?.['zh-Hans']?.split(' ')?.[0]?.split('-').length>1"
          >&#xe626;</div>
        </section>
      </div>
      <div class="information">{{ msg?.[1]?.description?.['zh-Hans'] }}</div>
      <ul class="sections-box" v-show="msg?.[1]?.sections?.length >= 4">
        <li
          v-for="(item,index) in msg?.[1]?.sections"
          :key="item.id"
          :class="index == 0? 'current' : ''"
        >
          <div class="num">{{ index+1<10?'0'+(index+1):(index+1) }}</div>
          <div class="msg">
            <section class="name">{{ item?.name?.['zh-Hans'] }}</section>
            <section class="time">{{ item?.duration_description?.['zh-Hans'] }}</section>
          </div>
          <div class="icon-box iconfont" v-if="index == 0">&#xe66e;</div>
          <div class="icon-box iconfont" v-else>&#xeb50;</div>
        </li>
      </ul>
    </section>
    <footer class="footer-box" @click="getAudio">
      <div class="button">
        <span class="iconfont">&#xeb50;</span> 开始练习
      </div>
      <div class="plus-msg" v-show="msg?.[1]?.sections?.[0]?.access == 'subscribe'">潮汐 Plus 首月6折优惠</div>
    </footer>
    <van-popup v-model="show" position="bottom" :style="{ height: '60%' }">
      <h3>冥想导师</h3>
      <van-swipe :loop="false" @change="onVanChange" ref="swipe" initial-swipe="0">
        <van-swipe-item v-for="item in teacherList || msg?.[1]?.speaker_groups_v2" :key="item.id">
          <div class="img-box">
            <img :src="item?.avatar" alt class="auto-img" />
          </div>
          <div class="name">{{ item?.name_i18n?.['zh-Hans'] }}</div>
          <div class="language">{{ item?.language_name?.['zh-Hans'] }}</div>
          <div class="msg">{{ item?.description?.['zh-Hans'] }}</div>
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator"></div>
        </template>
      </van-swipe>
      <div class="button" v-if="currentTeacher">当前导师</div>
      <div class="button" v-else @click="changeTeacher">切换导师</div>
    </van-popup>
    <van-popup
      class="time-popup"
      v-model="showTime"
      round
      position="bottom"
      :style="{ height: '30%' }"
    >
      <h3>时长</h3>
      <div
        class="time-box"
        v-for="(item,index) in msg?.[1]?.duration_description?.['zh-Hans']?.split(' ')?.[0]?.split('-')"
        :key="index"
      >
        <div class="time-item">{{ item }}分钟</div>
        <div
          class="already-select"
          v-if="(currentSelectTime  || msg?.[1]?.duration_description?.['zh-Hans']?.split('-')[0]?.split('分')?.[0]) == item"
        >
          <van-icon name="checked" />
        </div>
        <div class="select-item" v-else @click="changeSelectTime(item)"></div>
      </div>
    </van-popup>
    <audio
      src="../music/陈慧娴 - 千千阕歌.flac"
      autoplay
      v-if="showPlay"
      ref="audio"
      @durationchange="duration=currentValue"
    ></audio>
    <div class="play-view" v-show="showPlay">
      <div class="play-header">
        <div class="iconfont return" @click="stopAudio">
          <van-icon name="arrow-down" size="14rem" color="#fff" />
        </div>
        <div class="iconfont share" @click="$emit('changeShare')">&#xe606;</div>
      </div>
      <div class="play-middle">
        <h2>{{ msg?.[1]?.name?.["zh-Hans"] }}</h2>
        <div class="continue-stop" v-if="pause">
          <div class="iconfont continue" @click="continueAudio">&#xe66e;</div>
          <div class="stop" @click="stopAudio">
            <van-icon name="stop-circle-o" size="57rem" />
          </div>
        </div>
        <div class="pause iconfont" v-else @click="pauseAudio">&#xe62a;</div>
      </div>
      <footer class="play-footer">
        <input
          type="range"
          class="range"
          :value="currentValue || 0"
          :max="this?.$refs?.audio?.duration"
          @change="onChange"
        />
        <div class="range-box">
          <div
            class="current-box"
            :style="{width:((currentValue/this?.$refs?.audio?.duration)*100)+'%'}"
          ></div>
        </div>
        <div
          class="audio-time"
        >{{ Math.floor(currentValue/60)>10?'0'+Math.floor(currentValue/60):Math.floor(currentValue/60)|| "00" }}:{{ Math.floor(currentValue%60)<10?'0'+Math.floor(currentValue%60):Math.floor(currentValue%60)|| "00" }}/{{ Math.floor(this?.$refs?.audio?.duration/60)<10?"0"+Math.floor(this?.$refs?.audio?.duration/60):Math.floor(this?.$refs?.audio?.duration/60)|| "00" }}:{{ Math.floor(this?.$refs?.audio?.duration%60)<10?'0'+Math.floor(this?.$refs?.audio?.duration%60):Math.floor(this?.$refs?.audio?.duration%60)|| "00" }}</div>
      </footer>
    </div>
  </div>
  <div
    class="msg-page sleep-box"
    v-else-if="msg?.[0] == 'sleep_story'"
    :style="{backgroundColor:'rgba('+msg?.[1]?.primary_color+')'}"
  >
    <div class="header-box" :style="{backgroundImage: 'url(' + msg?.[1]?.image + ')'}">
      <section class="icon-box">
        <div class="left iconfont" @click="changeShowList">&#xe609;</div>
        <div class="right">
          <div class="iconfont" v-if="isLogin[0]&&collect" @click="addCollect">
            <van-icon name="like" color="#ff6757" />
          </div>
          <div class="iconfont" @click="addCollect" v-else>&#xe628;</div>
          <div class="iconfont">&#xe606;</div>
        </div>
      </section>
    </div>
    <div
      class="middle-box"
      :style="[{backgroundColor:'rgba('+msg?.[1]?.primary_color+')'},{boxShadow:'0 -5rem 80rem 80rem rgba('+msg?.[1]?.primary_color+')'}]"
    >
      <div class="content-box">
        <div class="title-box">
          <section class="title">{{ msg?.[1]?.name?.["zh-Hans"] }}</section>
          <section class="time">{{ msg?.[1]?.resources_v2?.[0]?.duration }}分钟</section>
        </div>
        <div class="tag-box">
          <section class="tag plus" v-show="msg?.[1]?.sections?.[0]?.access == 'subscribe'">plus</section>
          <section
            class="tag"
            v-for="item in msg?.[1]?.simple_tags"
            :key="item.id"
          >{{ item?.name?.["zh-Hans"] }}</section>
        </div>
        <div class="people-box">
          <div class="count">{{msg?.[1]?.stats?.using_people_count}}人正在听</div>
        </div>
        <span class="line"></span>
        <div
          class="information"
          style="white-space: pre-wrap;"
        >{{ msg?.[1]?.description?.['zh-Hans'] }}</div>
        <div class="teacher" @click="showPopup">
          <div class="teacher-img">
            <img
              class="auto-img"
              v-view-lazy="msg?.[1]?.speaker_groups_v2?.[0]?.avatar+'?imageView2/1/w/300/h/300/q/99/format/webp'"
            />
          </div>
          <div class="name">{{ msg?.[1]?.speaker_groups_v2?.[0]?.name_i18n?.['zh-Hans'] }}</div>
          <div class="declaimer">朗读者</div>
        </div>
      </div>
    </div>
    <footer
      class="footer-box"
      :style="[{backgroundColor:'rgba('+msg?.[1]?.primary_color+')'},{boxShadow:'0 -1rem 20rem 20rem rgba('+msg?.[1]?.primary_color+')'}]"
      @click="getAudio"
    >
      <div class="button" :style="{color:'rgba('+msg?.[1]?.primary_color+')'}">
        <span class="iconfont">&#xe66e;</span> 播放
      </div>
      <div class="plus-msg" v-show="msg?.[1]?.sections?.[0]?.access == 'subscribe'">潮汐 Plus 首月6折优惠</div>
    </footer>
    <van-popup
      class="sleep-teacher"
      v-model="show"
      round
      position="bottom"
      :style="{ height: '40%' }"
    >
      <div class="teacher">
        <div class="teacher-img">
          <img
            class="auto-img"
            v-view-lazy="msg?.[1]?.speaker_groups_v2?.[0]?.avatar+'?imageView2/1/w/300/h/300/q/99/format/webp'"
          />
        </div>
        <div class="name-declaimer">
          <div class="name">{{ msg?.[1]?.speaker_groups_v2?.[0]?.name_i18n?.['zh-Hans'] }}</div>
          <div class="declaimer">朗读者</div>
        </div>
      </div>
      <div class="msg">{{ msg?.[1]?.speaker_groups_v2?.[0]?.description?.["zh-Hans"] }}</div>
    </van-popup>
    <audio
      src="../music/陈慧娴 - 千千阕歌.flac"
      autoplay
      v-if="showPlay"
      ref="audio"
      @durationchange="duration=currentValue"
    ></audio>
    <div class="play-view" v-show="showPlay">
      <div class="play-header">
        <div class="iconfont return" @click="stopAudio">
          <van-icon name="arrow-down" size="14rem" color="#fff" />
        </div>
        <div class="iconfont share" @click="$emit('changeShare')">&#xe606;</div>
      </div>
      <div class="play-middle">
        <h2>{{ msg?.[1]?.name?.["zh-Hans"] }}</h2>
        <div class="continue-stop" v-if="pause">
          <div class="iconfont continue" @click="continueAudio">&#xe66e;</div>
          <div class="stop" @click="stopAudio">
            <van-icon name="stop-circle-o" size="57rem" />
          </div>
        </div>
        <div class="pause iconfont" v-else @click="pauseAudio">&#xe62a;</div>
      </div>
      <footer class="play-footer">
        <input
          type="range"
          class="range"
          :value="currentValue || 0"
          :max="this?.$refs?.audio?.duration"
          @change="onChange"
        />
        <div class="range-box">
          <div
            class="current-box"
            :style="{width:((currentValue/this?.$refs?.audio?.duration)*100)+'%'}"
          ></div>
        </div>
        <div
          class="audio-time"
        >{{ Math.floor(currentValue/60)>10?'0'+Math.floor(currentValue/60):Math.floor(currentValue/60)|| "00" }}:{{ Math.floor(currentValue%60)<10?'0'+Math.floor(currentValue%60):Math.floor(currentValue%60)|| "00" }}/{{ Math.floor(this?.$refs?.audio?.duration/60)<10?"0"+Math.floor(this?.$refs?.audio?.duration/60):Math.floor(this?.$refs?.audio?.duration/60)|| "00" }}:{{ Math.floor(this?.$refs?.audio?.duration%60)<10?'0'+Math.floor(this?.$refs?.audio?.duration%60):Math.floor(this?.$refs?.audio?.duration%60)|| "00" }}</div>
      </footer>
    </div>
  </div>
  <div
    class="msg-page scene-box"
    v-else
    :style="{backgroundColor:'rgba('+msg?.[1]?.primary_color+')'}"
  >
    <div class="header-box" :style="{backgroundImage: 'url(' + msg?.[1]?.image + ')'}">
      <section class="icon-box">
        <div class="iconfont return" @click="changeShowList">&#xe609;</div>
        <div class="iconfont">&#xe606;</div>
      </section>
    </div>
    <div class="middle-box" :style="{backgroundColor:'rgba('+msg?.[1]?.primary_color+')'}">
      <div class="content-box">
        <div class="title-box">
          <section class="title">{{ msg?.[1]?.name?.["zh-Hans"] }}</section>
          <section class="describe">{{ msg?.[1]?.sub_title?.['zh-Hans'] }}</section>
        </div>
        <div class="tag-box">
          <section class="tag plus" v-show="msg?.[1]?.access?.[0] == 'subscribe'">plus</section>
          <section
            class="tag"
            v-for="item in msg?.[1]?.simple_tags"
            :key="item.id"
            :style="{backgroundColor:'rgba('+msg?.[1]?.primary_color+')'}"
          >{{ item?.name?.["zh-Hans"] }}</section>
        </div>
      </div>
      <div class="people-box">
        <div class="count">{{msg?.[1]?.stats?.using_people_count}}人正在听</div>
      </div>
      <span class="line"></span>
      <div
        class="information"
        style="white-space: pre-wrap;"
      >{{ msg?.[1]?.description?.['zh-Hans'] }}</div>
      <div class="teacher">
        <div class="name">{{ msg?.[1]?.description_author?.['zh-Hans'] }}</div>
      </div>
    </div>
    <footer
      class="footer-box"
      :style="[{backgroundColor:'rgba('+msg?.[1]?.primary_color+')'},{boxShadow:'0 -1rem 20rem 20rem rgba('+msg?.[1]?.primary_color+')'}]"
      @click="getAudio"
    >
      <div class="button" :style="{color:'rgba('+msg?.[1]?.primary_color+')'}">
        <span class="iconfont">&#xeb50;</span> 播放
      </div>
      <div class="plus-msg" v-show="msg?.[1]?.access?.[0] == 'subscribe'">潮汐 Plus 首月6折优惠</div>
    </footer>
    <audio
      src="../music/陈慧娴 - 千千阕歌.flac"
      autoplay
      v-if="showPlay"
      ref="audio"
      @durationchange="duration=currentValue"
    ></audio>
    <div class="play-view" v-show="showPlay">
      <div class="play-header">
        <div class="iconfont return" @click="stopAudio">
          <van-icon name="arrow-down" size="14rem" color="#fff" />
        </div>
        <div class="iconfont share" @click="$emit('changeShare')">&#xe606;</div>
      </div>
      <div class="play-middle">
        <h2>{{ msg?.[1]?.name?.["zh-Hans"] }}</h2>
        <div class="continue-stop" v-if="pause">
          <div class="iconfont continue" @click="continueAudio">&#xe66e;</div>
          <div class="stop" @click="stopAudio">
            <van-icon name="stop-circle-o" size="57rem" />
          </div>
        </div>
        <div class="pause iconfont" v-else @click="pauseAudio">&#xe62a;</div>
      </div>
      <footer class="play-footer">
        <input
          type="range"
          class="range"
          :value="currentValue || 0"
          :max="this?.$refs?.audio?.duration"
          @change="onChange"
        />
        <div class="range-box">
          <div
            class="current-box"
            :style="{width:((currentValue/this?.$refs?.audio?.duration)*100)+'%'}"
          ></div>
        </div>
        <div
          class="audio-time"
        >{{ Math.floor(currentValue/60)>10?'0'+Math.floor(currentValue/60):Math.floor(currentValue/60)|| "00" }}:{{ Math.floor(currentValue%60)<10?'0'+Math.floor(currentValue%60):Math.floor(currentValue%60)|| "00" }}/{{ Math.floor(this?.$refs?.audio?.duration/60)<10?"0"+Math.floor(this?.$refs?.audio?.duration/60):Math.floor(this?.$refs?.audio?.duration/60)|| "00" }}:{{ Math.floor(this?.$refs?.audio?.duration%60)<10?'0'+Math.floor(this?.$refs?.audio?.duration%60):Math.floor(this?.$refs?.audio?.duration%60)|| "00" }}</div>
      </footer>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Popup, Swipe, SwipeItem, Toast } from "vant";

Vue.use(Popup);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Toast);
import store from "../store";
import { mapState } from "vuex";

export default {
  data() {
    return {
      show: false,
      audioItem: null,
      showPlay: false,
      pause: false,
      currentValue: this?.$refs?.audio?.currentTime,
      timer: null,
      currentTeacher: true,
      index: 0,
      teacherList: null,
      showTime: false,
      currentSelectTime: null,
      collect: false
    };
  },
  computed: {
    ...mapState(["msg", "isLogin"])
  },
  created() {
    this.teacherList = JSON.parse(localStorage.getItem("teacher"))?.filter(
      item => Object.keys(item) == this.msg?.[1].id
    )?.[0]?.[this.msg?.[1].id];
    this.currentSelectTime = JSON.parse(localStorage.getItem("time"))?.filter(
      item => Object.keys(item) == this.msg?.[1].id
    )?.[0]?.[this.msg?.[1].id];
    if (
      JSON.parse(localStorage.getItem("collect"))?.filter(
        item => item?.id == this.msg?.[1].id
      )
    ) {
      if (
        JSON.parse(localStorage.getItem("collect"))?.filter(
          item => item?.id == this.msg?.[1].id
        )?.length != 0
      ) {
        this.collect = true;
      }
    }
  },
  methods: {
    changeShowList() {
      store.commit("changeShowMsg", false);
    },
    showPopup() {
      this.show = true;
    },
    getAudio() {
      if (this.isLogin[0]) {
        this.audioItem =
          "http://www.ihaoge.net/kw/41188275/antiserver.kuwo.cn/anti.s?rid=MUSIC_41188275&response=res&format=mp3|aac&type=convert_url&br=128kmp3&agent=iPhone&callback=getlink&jpcallback=getlink.mp3";
        this.showPlay = true;
        this.timer = setInterval(() => {
          this.currentValue = this?.$refs?.audio?.currentTime;
        }, 1000);
        // document.cookie = "tide_sid=c1592dd7d86949b2895544062ea2ab2c; Path=/; Domain=tide-api.moreless.io; Expires=Tue, 05 Mar 2024 06:19:01 GMT; Max-Age=31536000; HttpOnly"
        // this.axios({
        //   url: `/v1/meditation/albums/612746041f0b280001cfdc11/resources/ls7ZXbwzMFcxAyZMfeN_izZFj89-/download_url`,
        //   query: {},
        //   withCredentials: true,
        //   headers: {
        //     "ml-sign": "E4j/9Rg2w1YqQX/1VSMIWrDtABFRoInqMQI92UNCUa4=",
        //     "ml-timestamp": "1678178848",
        //     // "cookie":"tide_sid=c1592dd7d86949b2895544062ea2ab2c; Path=/; Domain=tide-api.moreless.io; Expires=Tue, 05 Mar 2024 06:19:01 GMT; Max-Age=31536000; HttpOnly"
        //   }
        // }).then(res => {
        //   console.log(res.data);
        // });
      } else {
        Toast({position:"top",message:"请登录"});
        this.$emit("changeShowLogin");
      }
    },
    pauseAudio() {
      this.$refs.audio.pause();
      this.pause = true;
      clearInterval(this.timer);
    },
    continueAudio() {
      this.$refs.audio.play();
      this.pause = false;
      this.timer = setInterval(() => {
        this.currentValue = this?.$refs?.audio?.currentTime;
      }, 1000);
    },
    stopAudio() {
      this.audioItem = null;
      this.pause = false;
      this.showPlay = false;
    },
    onChange(event) {
      this.currentValue = event.target.value;
      this.$refs.audio.currentTime = event.target.value;
    },
    onVanChange(index) {
      this.index = index;
      if (index == 0) {
        this.currentTeacher = true;
      } else {
        this.currentTeacher = false;
      }
    },
    changeTeacher() {
      let item = [
        {
          [this.msg?.[1].id]: [
            ...new Set([
              this.teacherList?.[this.index] ||
                this.msg?.[1]?.speaker_groups_v2[this.index],
              ...(this.teacherList || this.msg?.[1]?.speaker_groups_v2)
            ])
          ]
        },
        ...(JSON.parse(localStorage.getItem("teacher"))?.filter(
          item => Object.keys(item) != this.msg?.[1].id
        ) || [])
      ];
      localStorage.setItem("teacher", JSON.stringify(item));
      this.teacherList = JSON.parse(localStorage.getItem("teacher"))?.filter(
        item => Object.keys(item) == this.msg?.[1].id
      )?.[0]?.[this.msg?.[1].id];
      this.$refs.swipe.swipeTo(0);
      this.show = false;
    },
    changeShowTime() {
      if (
        this.msg?.[1]?.duration_description?.["zh-Hans"]
          ?.split(" ")[0]
          ?.split("-").length > 1
      ) {
        this.showTime = true;
      }
    },
    changeSelectTime(itemNum) {
      let item = [
        {
          [this.msg?.[1].id]: itemNum
        },
        ...(JSON.parse(localStorage.getItem("time"))?.filter(
          item => Object.keys(item) != this.msg?.[1].id
        ) || [])
      ];
      localStorage.setItem("time", JSON.stringify(item));
      this.currentSelectTime = JSON.parse(localStorage.getItem("time"))?.filter(
        item => Object.keys(item) == this.msg?.[1].id
      )?.[0]?.[this.msg?.[1].id];
      this.showTime = false;
    },
    addCollect() {
      if (this.isLogin[0] == false) {
        Toast({position:"top",message:"请登录"});
        this.$emit("changeShowLogin");
      } else {
        if (this.collect) {
          localStorage.setItem(
            "collect",
            JSON.stringify([
              ...(JSON.parse(localStorage.getItem("collect"))?.filter(
                item => item?.id != this.msg?.[1].id
              ) || [])
            ])
          );
          this.collect = false;
        } else {
          localStorage.setItem(
            "collect",
            JSON.stringify([
              ...(JSON.parse(localStorage.getItem("collect"))?.filter(
                item => item?.id != this.msg?.[1].id
              ) || []),
              this.msg[1]
            ])
          );
          this.collect = true;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.msg-page {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  overflow-y: auto;
  z-index: 99999;
  .header-box {
    width: 100vw;
    height: 75vw;
    padding: 10rem 25rem;
    box-sizing: border-box;
    background: no-repeat center center;
    background-size: cover;
    .icon-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .iconfont {
        width: 40rem;
        height: 40rem;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        display: flex;
        font-size: 18rem;
        color: #fff;
        justify-content: center;
        align-items: center;
      }
      .left {
        padding-right: 4rem;
        box-sizing: border-box;
      }
      .right {
        display: flex;
        width: 100rem;
        justify-content: space-between;
      }
    }
    .people-box {
      margin-top: 170rem;
      font-size: 14rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
.middle-box {
  position: absolute;
  left: 0;
  top: 260rem;
  width: 100vw;
  padding: 30rem 25rem 100rem;
  background-color: #fff;
  border-radius: 15rem 15rem 0 0;
  box-sizing: border-box;
  .tag-box {
    display: flex;
    align-items: center;
    .tag {
      height: 25rem;
      margin-right: 15rem;
      padding: 0 8rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #bbbbbb;
      border-radius: 3rem;
      background-color: rgba(0, 0, 0, 0.1);
    }
    .plus {
      color: #fff;
      background-color: #cca262;
    }
  }
  .title-box {
    margin: 20rem 0;
    .title {
      font-size: 24rem;
      font-weight: bold;
    }
    .time {
      margin-top: 20rem;
      color: #bbbbbb;
      font-size: 16rem;
      font-weight: bold;
    }
  }
  .msg-box {
    display: flex;
    justify-content: space-between;
    .teacher {
      width: 193rem;
      padding: 10rem 15rem;
      display: flex;
      align-items: center;
      border: 1rem solid #bbb;
      border-radius: 10rem;
      box-sizing: border-box;
      .teacher-img {
        width: 32rem;
        height: 32rem;
        margin-right: 10rem;
        border-radius: 50%;
      }
      .teacher-introduce {
        font-size: 12rem;
        color: #bbbbbb;
        .name {
          font-weight: bold;
          color: #000;
        }
      }
      .more {
        font-size: 12rem;
        color: #bbbbbb;
        margin-left: auto;
      }
    }
    .special {
      width: 325rem;
    }
    .time-box {
      width: 112rem;
      padding: 10rem 15rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1rem solid #bbbbbb;
      border-radius: 10rem;
      box-sizing: border-box;
      .type {
        color: #bbb;
      }
      .time-content {
        font-weight: bold;
      }
      .more {
        font-size: 12rem;
        color: #bbbbbb;
        margin-left: auto;
      }
    }
  }
  .information {
    margin-top: 30rem;
    font-size: 16rem;
    font-weight: bold;
    color: #bbbbbb;
  }
  .sections-box {
    position: absolute;
    left: 0;
    width: 100vw;
    padding: 0 0 100rem;
    box-sizing: border-box;
    li {
      height: 45rem;
      display: flex;
      padding: 0 30rem;
      margin-top: 30rem;
      align-items: center;
      box-sizing: border-box;
      .num {
        height: 45rem;
        width: 45rem;
        margin-right: 15rem;
        font-size: 16rem;
        font-weight: bold;
        color: #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5rem;
        background-color: rgba(0, 0, 0, 0.1);
      }
      .msg {
        .name {
          font-size: 18rem;
          color: #000;
          font-weight: bold;
        }
        .time {
          font-size: 14rem;
          color: #bbb;
        }
      }
      .icon-box {
        font-size: 24rem;
        color: #dcb270;
        margin-left: auto;
      }
    }
    .current {
      border-left: 2rem solid #fa6363;
      .icon-box {
        width: 27rem;
        height: 27rem;
        color: #000;
        border: 1rem solid #333;
        padding-left: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14rem;
        box-sizing: border-box;
      }
    }
  }
}
.footer-box {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 1rem 10rem 10rem rgba(255, 255, 255, 0.5);
  padding: 10rem 25rem;
  .button {
    width: 325rem;
    height: 45rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14rem;
    font-weight: bold;
    color: #ffffff;
    border-radius: 10rem;
    background-color: #ff6757;
    .iconfont {
      font-weight: normal;
      font-size: 20rem;
    }
  }
  .plus-msg {
    color: #bbb;
    margin-top: 10rem;
  }
}
h3 {
  font-size: 16rem;
  font-weight: bold;
  margin: 5rem 0;
  color: rgba(0, 0, 0, 0.3);
  text-align: center;
}
.van-popup {
  .van-swipe {
    width: 375rem;
    box-sizing: border-box;
    .van-swipe-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 15rem;
      background-color: rgba(0, 0, 0, 0.1);
      width: 320rem !important;
      height: 260rem;
      margin: 10rem 30rem;
      padding: 30rem;
      box-sizing: border-box;
      .img-box {
        width: 80rem;
        height: 80rem;
      }
      .msg {
        margin-top: 30rem;
      }
      #indicator {
        position: relative;
        top: 10rem;
      }
    }
  }
  .button {
    width: 325rem;
    height: 45rem;
    margin: 20rem auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14rem;
    color: #fff;
    border-radius: 10rem;
    background-color: #fa5858;
  }
}
.sleep-box {
  .middle-box {
    position: relative;
    top: 15rem;
    .content-box {
      position: absolute;
      top: -160rem;
    }
    .title {
      font-size: 34rem;
      font-weight: normal;
      color: #fff;
    }
    .time {
      margin-top: 15rem;
    }
    .tag-box {
      .tag {
        color: #ccc;
      }
    }
    .people-box {
      margin-top: 30rem;
      color: rgba(255, 255, 255, 0.5);
    }
    .line {
      display: block;
      width: 325rem;
      height: 1rem;
      margin: 30rem auto 0;
      background-color: rgba(255, 255, 255, 0.7);
    }
    .information {
      padding-right: 25rem;
      font-size: 16rem;
      font-weight: normal;
      line-height: 30rem;
    }
    .teacher {
      width: 50rem;
      margin: 70rem 0 120rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .teacher-img {
        width: 50rem;
        height: 50rem;
      }
      .name {
        font-size: 14rem;
        color: #bbb;
      }
      .declaimer {
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }
  .footer-box {
    .button {
      background-color: #fff;
    }
  }
}
.scene-box {
  .header-box {
    .icon-box {
      .return {
        padding-right: 2rem;
        box-sizing: border-box;
      }
    }
  }
  .middle-box {
    top: 280rem;
    .content-box {
      position: absolute;
      top: -170rem;
      .title-box {
        .title {
          font-size: 34rem;
          color: #ffffff;
        }
        .describe {
          font-size: 14rem;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
    .tag-box {
      flex-wrap: wrap;
      .tag {
        margin-bottom: 10rem;
      }
    }
    .people-box {
      .count {
        font-size: 14rem;
        color: rgba(255, 255, 255, 0.5);
      }
    }
    .information {
      color: rgba(255, 255, 255, 0.8);
    }
    .teacher {
      display: flex;
      justify-content: end;
      margin-top: 30rem;
      .name {
        font-size: 18rem;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  .footer-box {
    .button {
      background-color: #fff;
      font-size: 14rem;
      .iconfont {
        font-weight: 1000;
      }
    }
  }
}
.play-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 10rem 25rem;
  background-color: #a8aaa6;
  z-index: 999999;
  box-sizing: border-box;
  .play-header {
    display: flex;
    justify-content: space-between;
    .return {
      width: 25rem;
      height: 25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
    }
    .share {
      color: #fff;
    }
  }
  .play-middle {
    margin-top: 100rem;
    height: 65vh;
    margin-bottom: 50rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    h2 {
      font-size: 26rem;
      color: rgba(255, 255, 255, 0.7);
    }
    .continue-stop {
      width: 155rem;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .continue {
        width: 50rem;
        height: 50rem;
        padding-left: 3rem;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20rem;
        color: rgba(0, 0, 0, 0.5);
        box-sizing: border-box;
      }
      .stop {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    .pause {
      width: 50rem;
      height: 50rem;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      font-size: 50rem;
      color: #fff;
    }
  }
  .play-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    .range {
      position: absolute;
      width: 200rem;
      opacity: 0;
      z-index: 9999999;
    }
    .range-box {
      position: absolute;
      width: 200rem;
      height: 6rem;
      border-radius: 3rem;
      background-color: #fff;
      overflow: hidden;
      .current-box {
        position: absolute;
        height: 6rem;
        border-radius: 3rem;
        background-color: #727372;
      }
    }
    .audio-time {
      color: #fff;
      position: relative;
      bottom: 20rem;
    }
  }
}
.van-popup.time-popup {
  padding: 0 0 20rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
  .time-box {
    padding: 0 25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .time-item {
      font-size: 18rem;
      color: #000;
    }
    .already-select {
      font-size: 29rem;
    }
    .select-item {
      width: 25rem;
      height: 25rem;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
    }
  }
}
.van-popup.sleep-teacher {
  padding: 25rem;
  box-sizing: border-box;
  .teacher {
    display: flex;
    align-items: center;
    .teacher-img {
      width: 55rem;
      margin-right: 10rem;
    }
    .name-declaimer {
      .name {
        font-size: 16rem;
        font-weight: bold;
      }
      .declaimer {
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }
  .msg {
    font-weight: bold;
    margin-top: 20rem;
    color: rgba(0, 0, 0, 0.3);
  }
}
</style>