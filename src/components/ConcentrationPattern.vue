<template>
  <div class="concentration-box">
    <header class="header-box">
      <div class="iconfont" @click="goBack">&#xe601;</div>
      <h3>专注</h3>
      <div class="after"></div>
    </header>
    <section class="middle-box" v-if="showChange">
      <van-picker :columns="columns" :visible-item-count="3" :default-index="1" @change="onChange" />
      <div class="unit">分钟</div>
    </section>
    <section class="count-down-box" v-else>
      <van-count-down :time="time" format="mm:ss" ref="countDown" />
    </section>
    <div class="start-box" @click="start" v-if="showItem == 1">
      <div class="iconfont">&#xe66e;</div>
      <div class="msg">开始专注</div>
    </div>
    <div class="pause" v-else-if="showItem==2" @click="pause">暂停</div>
    <div class="continue-finish" v-else>
      <div class="continue" @click="continueTime">继续</div>
      <div class="finish" @click="reset">结束</div>
    </div>
    <section class="finish-box" v-if="finish">
      <div class="icon-box" @click="changeFinish">
        <van-icon name="cross" />
      </div>
      <h3>继续加油</h3>
      <p>在潮汐的第{{ times }}次专注</p>
      <div class="finish-middle">
        <header>
          <div class="month-and-day">{{ new Date().getMonth()+1 }}月{{ new Date().getDate() }}日</div>
          <div class="time">{{ startTime }}-{{ endTime }}</div>
        </header>
        <p>我刚刚专注了{{ parseInt(value) }}分钟。</p>
        <div class="line"></div>
        <footer>
          <div>
            <section>专注时长</section>
            <section class="msg">{{ parseInt(value) }}分钟</section>
          </div>
          <div>
            <section>专注分数</section>
            <section class="msg">75</section>
          </div>
          <div>
            <section>今日专注</section>
            <section class="msg">{{ today }}分钟</section>
          </div>
        </footer>
      </div>
      <div class="button" @click="$emit('changeShare')">分享</div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { Picker, CountDown } from "vant";

Vue.use(Picker);
Vue.use(CountDown);

export default {
  data() {
    return {
      columns: [
        "03",
        "05",
        "08",
        "10",
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
        "100"
      ],
      value: "05",
      time: 300 * 1000,
      showChange: true,
      showItem: 1,
      finish: false,
      startTime: null,
      endTime: null,
      times: null,
      timer: null,
      surplus: null,
      isEndTime: null,
      today: 0
    };
  },
  methods: {
    goBack() {
      history.go(-1);
    },
    onChange(picker, value, index) {
      picker, index;
      this.value = value;
      this.time = value * 60 * 1000;
    },
    start() {
      this.showChange = false;
      this.showItem = 2;
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
      this.isEndTime = Date.now() + this.time;
      this.timer = setTimeout(() => {
        if (
          JSON.parse(localStorage.getItem("concentration"))?.filter(
            item =>
              item.date ==
              new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
          )?.[0]?.time?.length > 0
        ) {
          localStorage.setItem(
            "concentration",
            JSON.stringify([
              {
                date:
                  new Date().getMonth() +
                  1 +
                  "月" +
                  new Date().getDate() +
                  "日",
                time: [
                  ...JSON.parse(localStorage.getItem("concentration")).filter(
                    item =>
                      item.date ==
                      new Date().getMonth() +
                        1 +
                        "月" +
                        new Date().getDate() +
                        "日"
                  )[0].time,
                  this.value
                ]
              },
              ...JSON.parse(localStorage.getItem("concentration")).filter(
                item =>
                  item.date !=
                  new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
              )
            ])
          );
        } else {
          localStorage.setItem(
            "concentration",
            JSON.stringify([
              {
                date:
                  new Date().getMonth() +
                  1 +
                  "月" +
                  new Date().getDate() +
                  "日",
                time: [this.value]
              }
            ])
          );
        }
        this.finish = true;
        this.showChange = true;
        this.showItem = 1;
        this.endTime =
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
        this.times = JSON.parse(localStorage.getItem("concentration"))?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )?.[0]?.time?.length;
        JSON.parse(localStorage.getItem("concentration"))?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )?.[0]?.time.map(item => this.today += item*1)
      }, this.time);
    },
    pause() {
      this.showItem = 3;
      this.surplus = this.isEndTime - Date.now();
      clearTimeout(this.timer);
      this.$refs.countDown.pause();
    },
    reset() {
      this.showChange = true;
      this.showItem = 1;
    },
    continueTime() {
      this.showItem = 2;
      this.$refs.countDown.start();
      this.isEndTime = Date.now() + this.surplus;
      this.timer = setTimeout(() => {
        if (
          JSON.parse(localStorage.getItem("concentration"))?.filter(
            item =>
              item.date ==
              new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
          )?.[0]?.time?.length > 0
        ) {
          localStorage.setItem(
            "concentration",
            JSON.stringify([
              {
                date:
                  new Date().getMonth() +
                  1 +
                  "月" +
                  new Date().getDate() +
                  "日",
                time: [
                  ...JSON.parse(localStorage.getItem("concentration")).filter(
                    item =>
                      item.date ==
                      new Date().getMonth() +
                        1 +
                        "月" +
                        new Date().getDate() +
                        "日"
                  )[0].time,
                  this.value
                ]
              },
              ...JSON.parse(localStorage.getItem("concentration")).filter(
                item =>
                  item.date !=
                  new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
              )
            ])
          );
        } else {
          localStorage.setItem(
            "concentration",
            JSON.stringify([
              {
                date:
                  new Date().getMonth() +
                  1 +
                  "月" +
                  new Date().getDate() +
                  "日",
                time: [this.value]
              }
            ])
          );
        }
        this.finish = true;
        this.showChange = true;
        this.showItem = 1;
        this.endTime =
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
        this.times = JSON.parse(localStorage.getItem("concentration"))?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )?.[0]?.time?.length;
        JSON.parse(localStorage.getItem("concentration"))?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )?.[0]?.time.map(item => this.today += item*1)
      }, this.surplus);
    },
    changeFinish() {
      this.finish = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.concentration-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background-color: #a8a9a3;
  box-sizing: border-box;
}
.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rem 25rem;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
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
  .van-picker {
    margin-top: 55rem;
  }
  .unit {
    position: absolute;
    font-size: 20rem;
    color: rgba(255, 255, 255, 0.7);
    right: 125rem;
    top: 102rem;
  }
}
.count-down-box {
  width: 60vw;
  height: 60vw;
  margin: 50rem auto 0;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  background-color: #a8a9a3;
  user-select: none;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
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
    font-size: 14rem;
  }
}
.pause {
  width: 125rem;
  height: 50rem;
  margin: 80rem auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18rem;
  color: rgba(255, 255, 255, 0.7);
  border: 1rem solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 1rem 0 rgba(255, 255, 255, 0.7);
  border-radius: 25rem;
}
.continue-finish {
  width: 230rem;
  height: 50rem;
  margin: 80rem auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .continue {
    width: 105rem;
    height: 50rem;
    background-color: #fff;
    border-radius: 25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.5);
  }
  .finish {
    width: 105rem;
    height: 50rem;
    box-shadow: 0 0 1rem 0 rgba(255, 255, 255, 0.7);
    border: 1rem solid rgba(255, 255, 255, 0.7);
    border-radius: 25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: bold;
    box-sizing: border-box;
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
    background-image: linear-gradient(#5d8fc7, #eecdb0);
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
      margin: 65rem 0 25rem;
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