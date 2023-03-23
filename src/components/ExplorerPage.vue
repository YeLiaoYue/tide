<template>
  <div class="Ex-box">
      <van-swipe
        class="my-swipe slideshow"
        :autoplay="3000"
        indicator-color="white"
        @change="onChange"
      >
        <van-swipe-item class="slideshow-box" v-for="(item,index) in data?.banners" :key="index">
          <div class="slideshow-img" :style="{backgroundImage: 'url(' + item?.image + ')'}">
            <footer class="slideshow-title">
              <h6>{{ item?.tag?.['zh-Hans'] }}</h6>
              <h3>{{ item?.title?.['zh-Hans'] }}</h3>
            </footer>
          </div>
        </van-swipe-item>
        <template #indicator>
          <div
            v-for="(item,index) in data?.banners"
            :key="index"
            class="custom-indicator"
            :class="index == current ?'active':''"
            :style="{left: 'calc(15rem*(' + index + '))'}"
          ></div>
        </template>
      </van-swipe>
    <HT v-for="item in data?.groups" :key="item.id" :item="item" />
    <section class="line"></section>
    <h2>为你推荐</h2>
    <CommentModule v-for="item in recommendations" :key="item.id" :item="item" />
  </div>
</template>

<script>
import HT from "@/components/HT.vue";
import CommentModule from "@/components/CommentModule.vue";
import { mapState } from "vuex";
import Vue from "vue";
import { Swipe, SwipeItem } from "vant";
import store from "../store";

Vue.use(Swipe);
Vue.use(SwipeItem);

export default {
  data() {
    return {
      current: 0,
    };
  },
  components: { HT, CommentModule },
  computed: {
    ...mapState(["data", "recommendations", "listData", "showList"])
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
    changeShowList() {
      store.commit("changeShowList", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.Ex-box {
  padding-bottom: 160rem;
}
.slideshow {
  margin: 20rem 0 30rem;
  padding-left: 30rem;
  box-sizing: border-box;
  display: flex;

  &::-webkit-scrollbar {
    display: none;
  }
  .slideshow-box {
    width: 100%;
    .slideshow-img {
      position: relative;
      width: 315rem;
      height: 210rem;
      flex-shrink: 0;
      border-radius: 15rem;
      background: center center no-repeat;
      background-size: cover;
      .slideshow-title {
        position: absolute;
        left: 15rem;
        bottom: 40rem;

        h6 {
          font-size: 14rem;
          color: #ffffff;
        }

        h3 {
          margin-top: 5rem;
          font-size: 24rem;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
  }
  .custom-indicator {
    position: absolute;
    margin-left: 45rem;
    bottom: 20rem;
    width: 10rem;
    height: 4rem;
    border-radius: 2rem;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .custom-indicator.active {
    background-color: rgba(255, 255, 255, 1);
  }
}
.line {
  margin-top: 50rem;
  width: 350rem;
  height: 1rem;
  margin-left: auto;
  background-color: #e8e8e8;
}
h2 {
  margin: 35rem 0 25rem 25rem;
  font-size: 20rem;
  font-weight: 600;
  color: #000;
}
</style>