<template>
  <div>
    <div class="msg-box">
      <section v-for="item in data" :key="item.id" class="all-img" @click="changeMsg(item)">
        <div class="img-box">
          <img
            class="auto-img"
            v-view-lazy="item?.image+'?imageView2/1/w/300/h/300/q/99/format/webp'"
          />
        </div>
        <div class="title-time-play">
          <div class="title-time">
            <h4>{{ item?.name?.['zh-Hans'] }}</h4>
            <div class="time">{{ item.stats.using_people_count }}人在听</div>
          </div>
        </div>
        <section class="banner" :style="{backgroundColor:'rgba('+item?.primary_color+')'}"></section>
      </section>
    </div>
  </div>
</template>

<script>
import store from '../store';
export default {
  props: ["data"],
  methods: {
    changeMsg(item) {
      store.commit("changMsg", ["scene", item]);
      store.commit("changeShowMsg", true);
    }
  }
};
</script>

<style lang="scss" scoped>
.msg-box {
  width: 84vw;
  display: flex;
  padding-top: 20rem;
  padding-left: 8vw;
  justify-content: space-between;
  flex-wrap: wrap;
  .all-img {
    position: relative;
    height: 200rem;
    border-radius: 10rem;
    overflow: hidden;
    margin: 5rem 0 10rem;
    .img-box {
      position: relative;
      width: 40vw;
      height: 40vw;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99;
      .auto-img {
        width: 20vw;
        height: 20vw;
        border-radius: 50%;
      }
    }
    .big-img {
      width: 88vw;
      height: 58.67vw;
    }
    .title-time-play {
      .title-time {
        position: absolute;
        bottom: 20rem;
        left: 0;
        z-index: 99;
        width: 100%;
        height: 50rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        h4 {
          font-size: 16rem;
          color: #efefef;
          text-align: center;
        }
        .time {
          font-size: 12rem;
          color: #efefef;
          text-align: center;
        }
      }
    }
    .banner {
      position: absolute;
      left: -50%;
      top: 0;
      width: 94vw;
      height: 300rem;
      filter: blur(100rem);
    }
  }
}
</style>