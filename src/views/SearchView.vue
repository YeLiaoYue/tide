<template>
  <div>
    <form action="/">
      <van-search
        v-model="value"
        clear-trigger="always"
        show-action
        shape="round"
        placeholder="YogaNidra休息冥想"
        @clear="onClear"
        @keydown.enter.native="changeValue"
      >
        <template #right-icon>
          <div></div>
        </template>
        <template #action>
          <div @click="onReturn">取消</div>
        </template>
      </van-search>
    </form>
    <section class="recommend" v-show="showRecommend">
      <h3>此时此刻</h3>
      <ul class="recommend-list">
        <li
          class="list"
          v-for="(item,index) in recommend"
          :key="index"
          @click="searchItem(item)"
        >{{ item }}</li>
      </ul>
    </section>
    <section class="search-record" v-show="search&&showRecommend">
      <header class="record-header">
        <h3>搜索历史</h3>
        <div class="iconfont" @click="removeRecord">&#xe601;</div>
      </header>
      <ul class="search-list">
        <li
          class="list"
          v-for="(item,index) in search"
          :key="index"
          @click="searchItem(item)"
        >{{ item }}</li>
      </ul>
    </section>
    <VTC :data="data?.items" v-show="showRecommend==false" />
  </div>
</template>

<script>
import Vue from "vue";
import { Search } from "vant";
import store from "../store";
import VTC from "@/components/VTC.vue";
import { mapState } from "vuex";

Vue.use(Search);

export default {
  data() {
    return {
      value: "",
      recommend: [
        "YogaNidra休息冥想",
        "冥想入门",
        "声音之旅",
        "上新",
        "睡眠故事",
        "缓解焦虑",
        "专注",
        "学习"
      ],
      search: JSON.parse(localStorage.getItem("search")) || [],
      searchMl:{
        "YogaNidra休息冥想":["xQituRAFYA9+7GbCHCc4dBsbCLe7p1+94cRk/YVkrUw=","1678174785"],
        "冥想入门":["JcxoqMgAKe/gRsz4M/mW3wCiXWCpBd90eMtm91BYVlA=","1678174858"],
        "声音之旅":["rfkFKqWchV55sEQd6yyxFVvHEvFikHhvn+wxa4W5xIg=","1678174945"],
        "上新":["HUc6N8AsfYp+eV+sV23gb58LOrS/2gVfyryQ//aRXsA=","1678175055"],
        "睡眠故事":["hi2ba/0sHTmowIumS9iEwflIwAMiuPm2g+S8DjkF1EA=","1678175117"],
        "缓解焦虑":["hrhJItUDtFobSJ0BikCRR6b60BTFOi+p/IKzxy8TRrs=","1678175178"],
        "专注":["UqYIuVStF/axsisZPKnkOQs7UVAkDvkY/T0sGRYASNw=","1678175272"],
        "学习":["/FPTkxyGwfOhXDIvI1x9xr7loulSd7fhg0m6WU5VloI=","1678175325"]
      },
      showRecommend:true,
    };
  },
  components: { VTC },
  computed: { ...mapState(["data"]) },
  methods: {
    onReturn() {
      this.$router.go(-1);
    },
    onClear(){
      this.showRecommend = true
    },
    changeValue() {
      if (this.value == "") {
        this.value = "YogaNidra休息冥想";
      }
      this.getSearchRecord();
    },
    getSearchRecord() {
      localStorage.setItem(
        "search",
        JSON.stringify([
          ...new Set([
            this.value,
            ...(JSON.parse(localStorage.getItem("search")) || [])
          ])
        ])
      );
      (this.search = JSON.parse(localStorage.getItem("search"))),
        this.axios({
          url: `/v1/search?keyword=${this.value}&type=meditation&offset=0&limit=120&locale=zh-Hans&region=CN`,
          query: {},
          headers: {
            "ml-sign": this.searchMl[this.value][0],
            "ml-timestamp": this.searchMl[this.value][1]
          }
        }).then(res => {
          this.showRecommend = false
          store.commit("changeData", res.data);
        });
    },
    searchItem(item) {
      this.value = item;
      this.getSearchRecord();
    },
    removeRecord(){
      localStorage.removeItem("search")
      this.search = null
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend {
  padding: 0 25rem;
  h3 {
    padding: 20rem 0 10rem;
    font-size: 16rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.3);
  }
  .recommend-list {
    display: flex;
    flex-wrap: wrap;
    .list {
      width: 162.5rem;
      padding: 5rem 0;
      font-size: 16rem;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
.search-record {
  padding: 20rem 25rem 0;
  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(0, 0, 0, 0.3);
    h3 {
      padding: 20rem 0;
      font-size: 16rem;
      font-weight: bold;
    }
    .iconfont {
      font-size: 16rem;
    }
  }
  .search-list {
    display: flex;
    flex-wrap: wrap;
    .list {
      margin: 0 8rem 8rem 0;
      padding: 5rem 15rem;
      border-radius: 5rem;
      font-size: 16rem;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.5);
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>