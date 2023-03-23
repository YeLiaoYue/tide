<template>
  <div>
    <nav class="nav-box">
      <router-link to="/discover/meditation" exact>全部</router-link>
      <router-link
        v-for="item in data?.all_tags"
        :key="item.id"
        :to="'/discover/meditation?id='+item.key"
      >{{ item?.name?.['zh-Hans'] }}</router-link>
    </nav>
    <VTC :data="navData?.albums || data?.albums" />
  </div>
</template>

<script>
import VTC from "@/components/VTC.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      ml: {
        Series: ["a6XaEZeIsGAKyhmOinmxegSKGkcynQsovK+LyEpp1Jo=", "1676343839"],
        Sleep2: ["pkrW0CRCaoQy3KDoXS8V6Dr1OiyYYgUAb0RLGj/EqJk=", "1676343871"],
        Stress: ["qILIvL4dyJGFFQX46f3G7xmSEHxY6wADqmZBWiobBKA=", "1676449761"],
        Beginner: [
          "H+lqmy0Ng5HTWRNLlok3FrnLmnYYvTxuooWTogwqac0=",
          "1676449864"
        ],
        Performance: [
          "iAIL6tNQFU6SEz2g59An6quPFsE/ERLH5nE3sJqZhkk=",
          "1676449943"
        ],
        Emotions: [
          "1PTrVoWGKDd3/lp2NgjgFVLalyB/UHF7R7cBRZ7WGOU=",
          "1676450034"
        ],
        Sleep1: ["5/JOV7EzabHOaOSUl8SdvIt8qpNJAY221466pveYijc=", "1676450076"],
        Health: ["Kt6eNGV1afHT7E3+TIb1s+d5TEazrS/IWZKtDnc/5kU=", "1676450199"],
        Lifestyle: [
          "zUn9+1Tg+eRN/gSklQWVNduz18dpP6jextpN4jBcPRQ=",
          "1676450255"
        ],
        Inspiration: [
          "MYP7Y3KO/joMXTqkJifFnLivdxJxJk/y1adneCI5oXs=",
          "1676450307"
        ],
        Relationship: [
          "crVuEOzjZk3FaQtdrR5kmsa86qXE7xthmdn3DDVXDkc=",
          "1676450376"
        ],
        PersonalGrowth: [
          "qdu95pZ2tDltIDYlbG1rSdnxjXi0ZRhCpFYJ/RaRvl4=",
          "1676450474"
        ]
      },
      navData: null
    };
  },
  components: { VTC },
  computed: { ...mapState(["data"]) },
  created() {
    this.getQuery();
  },
  watch: {
    $route() {
      this.getQuery();
    }
  },
  methods: {
    getQuery() {
      if (this.$route.query.id) {
        this.axios({
          url: `/v2/explorer/meditation_pages/cn?tag=${this.$route.query.id}`,
          headers: {
            "ml-sign": this.ml[this.$route.query.id.replace(/[ ]/g, "")][0],
            "ml-timestamp": this.ml[this.$route.query.id.replace(/[ ]/g, "")][1]
          }
        }).then(res => {
          this.navData = res.data;
        });
      } else {
        this.navData = this.data;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.meditation-box {
  width: 100vw;
  padding-top: 50px;
}
.nav-box {
  width: 100vw;
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 25rem 0 10rem;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  overflow-x: auto;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }

  a {
    font-size: 16rem;
    display: flex;
    justify-content: center;
    line-height: 30rem;
    height: 28rem;
    padding: 3rem 10rem;
    color: #999;
    flex-shrink: 0;
    margin-left: 10rem;
  }
  a.router-link-exact-active {
    color: #fff;
    border-radius: 18rem;
    background-color: #86d5e7;
  }
}
.all-box {
  width: 88vw;
  display: flex;
  margin-top: 20rem;
  margin-left: 6vw;
  justify-content: space-between;
  flex-wrap: wrap;
  .all-img {
    .all-img-box {
      width: 40vw;
      height: 40vw;
      margin: 10px 0;
      .auto-img {
        border-radius: 10px;
      }
    }
    .big-img {
      width: 88vw;
      height: 58.67vw;
    }
    h4 {
      font-size: 16rem;
    }
    .time {
      font-size: 14rem;
      color: #aaa;
    }
  }
}
.big-img-box {
  position: relative;
  display: flex;
  justify-content: space-between;
  .title-time-play {
    .title-time {
      position: absolute;
      left: 20rem;
      bottom: 20rem;
    }
    .play {
      position: absolute;
      right: 20rem;
      bottom: 30rem;
      width: 30rem;
      height: 30rem;
      border-radius: 50%;
      background-color: #000;
    }
  }
}
</style>