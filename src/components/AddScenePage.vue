<template>
  <div class="scene-box">
    <nav class="nav-box">
      <router-link to="/addScene" exact>全部</router-link>
      <router-link
        v-for="item in data?.all_tags"
        :key="item.key"
        :to="'/addScene?id='+item.key"
      >{{ item?.name?.['zh-Hans'] }}</router-link>
    </nav>
    <TVT :data=" navData?.scenes|| data?.scenes" />
  </div>
</template>
    
<script>
import TVT from "@/components/TVT.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      ml: {
        Video: ["qzOYdyF9CcKthFCtPPuFRTCS2zfuiSzZ1n94AyIT2hA=", "1676343942"],
        Free: ["FiLFKbD3xhJd2uPDSNIG+XDroUxNhFvj+iIPloQ5TRY=", "1676509076"],
        Mix: ["GGRI4UHyAlX5JnWhVgF+/4n/eMBWFCyI+5iusw5rU6U=", "1676342915"],
        Melody: ["o+9xwcdm7fMGp/w1k6Rb7SVtr4YvVLC5lVlw8VZ3aL0=", "1676509130"],
        Nature: ["JoWwX3AXRDoW/A3yg9yuFsnBPgAv3ZlBZ/4ZS2je0aM=", "1676509161"],
        Modern: ["zRf2WG/NLoKy2pktexbHkrt43N9G550rskv6uZ7mmFc=", "1676509228"],
        Meditation: [
          "NnQYWVkfGPS9vOOoRSraFavRVFCICxArPeywsmXAXUM=",
          "1676509267"
        ],
        Sleep: ["X7z+X2rwaF6mQpI1C7/CJiPQ0DM3Gnr8jGe6O3xDlKs=", "1676509294"],
        Focus: ["L/On5w5tsA2jpne+E8DN9n2KRYKn3YdK/AhaFUGlE5I=", "1676509337"],
        Relax: ["VtTuo1Lm72dsUfl6KZUDqnZmRLfw1S2RrvYh8yhc8/Y=", "1676509371"]
      },
      navData: null
    };
  },
  computed: { ...mapState(["data"]) },
  components: { TVT },
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
          url: `/v2/explorer/scene_pages/cn?tag=${this.$route.query.id}`,
          headers: {
            "ml-sign": this.ml[this.$route.query.id][0],
            "ml-timestamp": this.ml[this.$route.query.id][1]
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
.scene-box {
  padding-bottom: 200rem;
}
.nav-box {
  width: 100vw;
  height: 30px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  padding-left: 8rem;
  overflow: hidden;
  overflow-x: auto;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }

  a {
    font-size: 16px;
    display: flex;
    justify-content: center;
    line-height: 30px;
    width: 58px;
    height: 28px;
    color: #999;
    flex-shrink: 0;
    margin-left: 10px;
  }
  a.router-link-exact-active {
    color: #fff;
    border-radius: 15px;
    background-color: #78d79c;
  }
}
</style>