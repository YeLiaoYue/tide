<template>
  <div>
    <div class="VTC">
      <section
        v-for="item in data"
        :key="item?.id || item?.meditation_album?.id"
        class="img-list"
        :class="item?.id == '61ae044028399b000104a330' ? 'special': 'common'"
        @click="changeMsg(item?.meditation_album|| item)"
      >
        <div class="img-box">
          <img
            class="auto-img"
            v-view-lazy="(item.image ||item?.meditation_album?.image) +'?imageView2/1/w/300/h/300/q/99/format/webp'"
          />
        </div>
        <div class="title-time-play">
          <div class="title-time">
            <h4>{{ item?.name?.['zh-Hans'] || item?.meditation_album?.name?.['zh-Hans'] }}</h4>
            <div
              class="img-msg"
              v-if="item?.sections?.length >= 4 || item?.meditation_album?.sections?.length >= 4"
            >{{ item?.sections?.length || item?.meditation_album?.sections?.length}}章 · 系列</div>
            <div
              class="img-msg"
              v-else
            >{{ item?.duration_description?.['zh-Hans'] || item?.meditation_album?.duration_description?.['zh-Hans'] || (item?.resources_v2?.[0]?.duration+"分钟")}} · 时刻</div>
          </div>
          <div v-show="item.id == '61ae044028399b000104a330'" class="play-button iconfont">&#xe66e;</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";
export default {
  props: ["data"],
  computed: { ...mapState["listData"] },
  methods: {
    changeMsg(item) {
      if (item?.resources_v2?.[0]?.duration) {
        store.commit("changMsg", ["sleep_story", item]);
      } else {
        store.commit("changMsg", ["meditation", item]);
      }
      store.commit("changeShowMsg", true);
    }
  }
};
</script>

<style lang="scss" scoped>
.VTC {
  margin-top: 25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 30rem 100rem;
  box-sizing: border-box;
  .img-list {
    margin-bottom: 25rem;
    .img-box {
      width: 150rem;
      height: 150rem;
      border-radius: 10rem;
      overflow: hidden;
    }
    .title-time-play {
      margin-top: 10rem;
      h4 {
        font-weight: 600;
      }
      .img-msg {
        margin-top: 5rem;
        color: #d8d8d8;
      }
    }
  }
  .special {
    position: relative;
    .img-box {
      width: 315rem;
      height: 220rem;
    }
    .title-time-play {
      width: 285rem;
      position: absolute;
      left: 15rem;
      bottom: 15rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h4 {
        margin-bottom: 5rem;
        font-size: 14rem;
        font-weight: bold;
        color: #ffffff;
      }
      .play-button {
        width: 30rem;
        height: 30rem;
        display: flex;
        padding-left: 2rem;
        align-items: center;
        justify-content: center;
        font-size: 12rem;
        color: #fff;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        box-sizing: border-box;
      }
    }
  }
}
</style>