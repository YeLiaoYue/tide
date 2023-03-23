<template>
  <div class="breathe-pattern" :class="[showTime?'breathe-time-page': '']">
    <header class="header-box">
      <div class="iconfont" @click="goBack">&#xe601;</div>
      <h3>呼吸</h3>
      <div class="after"></div>
    </header>
    <section class="middle-box" v-if="show">
      <van-picker
        :columns="columns"
        :visible-item-count="3"
        ref="select"
        :default-index="2"
        @change="onChange"
      />
      <div class="unit">分钟</div>
      <div class="breathe-num">{{ breatheNum }}次呼吸</div>
      <div class="start-box" @click="changeShow">
        <div class="iconfont">&#xe66e;</div>
        <div class="msg">开始呼吸</div>
      </div>
    </section>
    <section class="else-box" v-else>
      <div class="breathe-box">
        <div class="inhale" v-if="showZoom">吸气</div>
        <div class="expiration" v-else>呼气</div>
      </div>
      <div class="stop-button" @click="stopShow">结束</div>
    </section>
    <section class="finish-box" v-if="finish">
      <div class="icon-box" @click="changeFinish">
        <van-icon name="cross" />
      </div>
      <h3>恭喜你</h3>
      <p>在潮汐的第{{time}}次呼吸</p>
      <div class="finish-middle">
        <header>
          <div class="month-and-day">{{ new Date().getMonth()+1 }}月{{ new Date().getDate() }}日</div>
          <div
            class="time"
          >{{ startTime}}-{{ (new Date().getHours()>12?"下午":"上午")+(new Date().getHours()>12?((new Date().getHours()-12)<10?"0"+(new Date().getHours()-12):(new Date().getHours()-12)):new Date().getHours()<10?"0"+new Date().getHours():new Date().getHours())+":"+(new Date().getMinutes()<10?"0"+new Date().getMinutes():new Date().getMinutes()) }}</div>
        </header>
        <p>我刚刚进行了{{ parseInt(value[0]) }}分钟的呼吸练习。</p>
        <div class="line"></div>
        <footer>
          <div>
            <section>时长</section>
            <section class="msg">{{ parseInt(value[0]) }}分钟</section>
          </div>
          <div>
            <section>呼吸模式</section>
            <section class="msg">平衡呼吸</section>
          </div>
          <div>
            <section>今日呼吸</section>
            <section class="msg">{{ todayTime }}分钟</section>
          </div>
        </footer>
      </div>
      <div class="button" @click="$emit('changeShare')">分享</div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
        "60",
        "65",
        "70",
        "75",
        "80",
        "85",
        "90",
        "95",
        "100",
        "105",
        "110",
        "115",
        "120"
      ],
      show: true,
      value: ["03"],
      breatheNum: 21,
      showZoom: false,
      showTime: false,
      animation: null,
      startTime: null,
      finish: false,
      timer: null,
      time: null,
      todayTime: null
    };
  },
  methods: {
    goBack() {
      history.go(-1);
      this.stopShow();
    },
    onChange() {
      this.value = this?.$refs?.select?.getValues() || this.value;
      this.breatheNum = this.value * 7;
    },
    changeShow() {
      this.show = !this.show;
      this.showTime = true;
      this.showZoom = true;
      this.animation = setInterval(() => {
        this.showZoom = !this.showZoom;
      }, (30 / 7) * 1000);
      this.startTime =
        (new Date().getHours() > 12 ? "下午" : "上午") +
        (new Date().getHours() > 12
          ? new Date().getHours() - 12 < 10
            ? "0" + (new Date().getHours() - 12)
            : new Date().getHours() - 12
          : new Date().getHours() < 10
          ? "0" + new Date().getHours()
          : new Date().getHours()) +
        ":" +
        (new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes());
      this.timer = setTimeout(() => {
        if (
          JSON.parse(localStorage.getItem("breathe"))?.filter(
            item =>
              item.date ==
              new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
          )?.length > 0
        ) {
          localStorage.setItem(
            "breathe",
            JSON.stringify([
              {
                date:
                  new Date().getMonth() +
                  1 +
                  "月" +
                  new Date().getDate() +
                  "日",
                time: [
                  ...JSON.parse(localStorage.getItem("breathe")).filter(
                    item =>
                      item.date ==
                      new Date().getMonth() +
                        1 +
                        "月" +
                        new Date().getDate() +
                        "日"
                  )[0].time,
                  this.value[0]
                ]
              },
              ...JSON.parse(localStorage.getItem("breathe")).filter(
                item =>
                  item.date !=
                  new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
              )
            ])
          );
        } else {
          localStorage.setItem(
            "breathe",
            JSON.stringify([
              {
                date:
                  new Date().getMonth() +
                  1 +
                  "月" +
                  new Date().getDate() +
                  "日",
                time: [this.value[0]]
              }
            ])
          );
        }
        let timeNum = 0;
        JSON.parse(localStorage.getItem("breathe")).map(
          item => (timeNum += item.time.length)
        );
        this.time = timeNum;
        let today = 0;
        JSON.parse(localStorage.getItem("breathe"))
          .filter(
            item =>
              item.date ==
              new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
          )[0]
          .time.map(item => (today += item * 1));
        this.todayTime = today;
        this.show = true;
        this.showTime = false;
        this.showZoom = false;
        this.finish = true;
      }, this.value[0]*60*1000);
    },
    stopShow() {
      this.show = !this.show;
      this.showTime = false;
      clearInterval(this.animation);
      this.animation = null;
      clearTimeout(this.timer);
    },
    changeFinish() {
      this.finish = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.breathe-pattern {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #a4a49e;
  z-index: 99999;
}
@keyframes changeBack {
  0% {
    background-color: rgba(0, 0, 0, 0.3);
  }
  50% {
    background-color: rgba(0, 255, 0, 0.4);
  }
  60% {
    background-color: rgba(0, 0, 0, 0.3);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

.breathe-time-page {
  position: relative;
  background-image: url(https://pics.tide.moreless.io/scenes/Fr2CY3uy5AfjjSH4cIUL8Cd8O2vo);
  background-size: cover;
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 100vw;
    height: 100vh;
    animation: changeBack calc(60s / 7) linear infinite;
    z-index: 100000;
  }
}
.header-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rem 25rem;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
  z-index: 999999;
  .iconfont {
    font-size: 20rem;
  }

  h3 {
    font-size: 18rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .after {
    width: 24rem;
    height: 24rem;
  }
}
.middle-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .van-picker {
    margin-top: 55rem;
  }
  .unit {
    position: absolute;
    font-size: 20rem;
    color: rgba(255, 255, 255, 0.7);
    right: 125rem;
    top: 157rem;
  }
  .breathe-num {
    margin-top: 20rem;
    font-size: 14rem;
    color: rgba(255, 255, 255, 0.3);
  }
  .start-box {
    width: 125rem;
    height: 50rem;
    margin: 80rem auto 0;
    padding: 0 20rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 25rem;
    box-sizing: border-box;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.5);
    .iconfont {
      font-size: 14rem;
    }
    .msg {
      font-size: 16rem;
      font-weight: bold;
    }
  }
}
.else-box {
  .breathe-box {
    margin-top: 50rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .inhale,
    .expiration {
      width: 200rem;
      height: 200rem;
      font-size: 16rem;
      color: rgba(255, 255, 255, 0.5);
      border: 1px solid rgb(255, 255, 255);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
    }
    .inhale {
      animation: IZoom calc(30s / 7);
    }
    .expiration {
      animation: EZoom calc(30s / 7);
    }
    @keyframes IZoom {
      from {
        transform: scale(0.5);
      }
      to {
        transform: scale(1);
      }
    }
    @keyframes EZoom {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(0.5);
      }
    }
  }
  .stop-button {
    position: relative;
    width: 95rem;
    height: 45rem;
    margin: 150rem auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 23rem;
    z-index: 999999;
  }
}
.finish-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 15rem 25rem;
  background-color: #565c5c;
  z-index: 999999;
  box-sizing: border-box;
  .icon-box {
    width: 30rem;
    height: 30rem;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18rem;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  h3 {
    margin-top: 20rem;
    font-size: 34rem;
    color: #fff;
  }
  p {
    margin-top: 10rem;
    font-size: 14rem;
    color: rgba(255, 255, 255, 0.3);
  }
  .finish-middle {
    width: 325rem;
    height: 315rem;
    margin-top: 10rem;
    padding: 23rem 20rem;
    border-radius: 20rem;
    background-image: linear-gradient(#92d388, #2b945b);
    box-sizing: border-box;
    header {
      .month-and-day {
        font-size: 16rem;
        color: rgba(255, 255, 255, 0.5);
      }
      .time {
        margin: 5rem 0 65rem;
        font-size: 14rem;
        color: rgba(255, 255, 255, 0.2);
      }
    }
    p {
      font-size: 22rem;
      font-weight: bold;
      color: #fff;
    }
    .line {
      width: 100%;
      height: 1rem;
      margin: 45rem 0 15rem;
      background-color: rgba(255, 255, 255, 0.2);
    }
    footer {
      display: flex;
      justify-content: space-between;
      div {
        color: rgba(255, 255, 255, 0.2);
        .msg {
          margin-top: 5rem;
          font-size: 14rem;
          color: #fff;
        }
      }
    }
  }
  .button {
    width: 325rem;
    height: 40rem;
    margin-top: 75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16rem;
    background-color: #fff;
    border-radius: 20rem;
  }
}
</style>