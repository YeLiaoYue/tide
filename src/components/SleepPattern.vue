<template>
  <div class="sleep-box" :class="[show==false?'sleep-time-box': '']">
    <header class="header-box">
      <div class="iconfont" @click="goBack">&#xe601;</div>
      <h3>睡眠</h3>
      <div class="after"></div>
    </header>
    <div class="middle-content" v-if="show">
      <div class="middle-box">
        <van-picker :visible-item-count="3" :columns="columns" ref="select" @change="onChange" />
        <div class="icon">:</div>
      </div>
      <section class="sleep-time">
        预计睡眠：
        <div class="hours" v-show="sleepTime?.[0]!=0">{{ sleepTime?.[0] }}小时</div>
        <div class="m" v-show="sleepTime?.[1]!=0">{{ sleepTime?.[1] }}分钟</div>
      </section>
      <section class="button" @click="changeShow(true)">
        <div class="iconfont">&#xe764;</div>
        <div class="msg">开始睡眠</div>
      </section>
    </div>
    <div class="else-box" v-else>
      <div class="else-content">
        <div
          class="hour"
        >{{ (nowData[0]>=12?nowData[0]-12:nowData[0])<10?'0'+parseInt(nowData[0]>=12?nowData[0]-12:nowData[0]):(nowData[0]>=12?nowData[0]-12:nowData[0]) }}</div>
        <footer class="footer">
          <div class="m">{{ nowData[1] }}</div>
          <div class="time-frame">{{ nowData[0]<12?'上午':'下午' }}</div>
        </footer>
      </div>
      <div class="alarm-clock">
        <van-icon name="underway-o" color="rgba(255,255,255,.3)" size="16rem" />
        <div
          class="alarm-clock-time"
        >{{ value[2] }} {{ value[0]>12?value[0]-12:value[0] }}:{{ value[1] }}</div>
      </div>
      <div class="finish-button" @click="changeShow(false)">
        <van-icon name="stop-circle-o" color="rgba(255,255,255,.7)" size="50rem" />
      </div>
    </div>
    <div class="ring-box" v-if="isRing">
      <header class="header">
        <div>正在闹铃</div>
        <div class="msg">风 · 时间简史</div>
      </header>
      <div class="else-content">
        <h3>闹钟</h3>
        <div
          class="hour"
        >{{ (nowData?.[0]>=12?(nowData?.[0]-12)<10?'0'+(nowData?.[0]-12):(nowData?.[0]-12):nowData?.[0]) }}</div>
        <footer class="footer">
          <div class="m">{{ nowData?.[1] }}</div>
          <div class="time-frame">{{ nowData?.[0]<12?'上午':'下午' }}</div>
        </footer>
      </div>
      <div class="button-box">
        <section class="button again-sleep" @click="againSleep">再睡一会</section>
        <section class="button get-up" @click="getUp">起床</section>
      </div>
    </div>
    <section class="finish-box" v-if="finish">
      <div class="icon-box" @click="changeFinish">
        <van-icon name="cross" />
      </div>
      <h3>{{new Date().getHours()<10?"早上好":new Date().getHours()<14?"中午好":new Date().getHours()<19?"下午好":"晚上好"}}</h3>
      <div class="finish-middle">
        <header>
          <div class="month-and-day">{{ new Date().getMonth()+1 }}月{{ new Date().getDate() }}日</div>
          <div class="time">{{ startTime }}-{{ endTime }}</div>
        </header>
        <p>我刚刚睡眠了{{ pastime }}。</p>
        <div class="line"></div>
        <footer>
          <div>
            <section>睡眠时长</section>
            <section class="msg">{{ pastime }}</section>
          </div>
          <div>
            <section>入睡时间</section>
            <section class="msg">{{startTime}}</section>
          </div>
          <div>
            <section>醒来时间</section>
            <section class="msg">{{ endTime }}</section>
          </div>
        </footer>
      </div>
      <div class="button" @click="$emit('changeShare')">分享</div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { Icon } from "vant";

Vue.use(Icon);
export default {
  data() {
    return {
      columns: [
        {
          values: [],
          defaultIndex: new Date().getHours()>12?new Date().getHours()-12-1:new Date().getHours()-1
        },
        {
          values: [],
          defaultIndex: new Date().getMinutes()
        },
        {
          values: ["上午", "下午"],
          defaultIndex: new Date().getHours()>12?1:0
        }
      ],
      value: null,
      sleepTime: null,
      nowData: new Date()
        .toString()
        .split(" ")[4]
        .split(":"),
      show: true,
      isRing: false,
      timer: null,
      finish: false,
      startTime: null,
      endTime: null,
      start: null,
      end: null,
      pastime: null,
      changeNowTime:null
    };
  },
  created() {
    for (let i = 1; i < 13; i++) {
      this.columns[0].values.push(i < 10 ? "0" + i : i);
    }
    for (let i = 0; i < 60; i++) {
      this.columns[1].values.push(i < 10 ? "0" + i : i);
    }
    this.changeNowTime = setInterval(() => {
      this.nowData = new Date()
        .toString()
        .split(" ")[4]
        .split(":");
    }, 1000);
  },
  beforeDestroy(){
    clearInterval(this.changeNowTime)
  },
  mounted() {
    this.onChange();
  },
  methods: {
    goBack() {
      history.go(-1);
    },
    onChange() {
      let nowTime = new Date()
        .toString()
        .split(" ")[4]
        .split(":");
      this.value = this.$refs.select.getValues();
      if (this.value[2] == "下午") {
        this.value[0] = 12 + this.value[0] * 1;
      }
      if (this.value[0] >= nowTime[0]) {
        if (this.value[0] == nowTime[0] && this.value[1] == nowTime[1]) {
          this.sleepTime = [24, "00"];
        } else {
          this.sleepTime = [
            (this.value[1] >= nowTime[1]
              ? this.value[0] - nowTime[0]
              : this.value[0] - nowTime[0] - 1) < 0
              ? 23
              : this.value[1] >= nowTime[1]
              ? this.value[0] - nowTime[0]
              : this.value[0] - nowTime[0] - 1,
            this.value[1] >= nowTime[1]
              ? this.value[1] - nowTime[1]
              : this.value[1] * 1 + 60 - nowTime[1]
          ];
        }
      } else {
        this.sleepTime = [
          this.value[1] >= nowTime[1]
            ? this.value[0] * 1 + 24 - nowTime[0]
            : this.value[0] * 1 + 24 - nowTime[0] - 1,
          this.value[1] >= nowTime[1]
            ? this.value[1] - nowTime[1]
            : this.value[1] * 1 + 60 - nowTime[1]
        ];
      }
    },
    changeShow(item) {
      if (item) {
        this.show = !this.show;
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
        this.start = Date.now();
        this.timer = setTimeout(() => {
          this.isRing = true;
          this.show = true;
        }, this.sleepTime[0]*60*60*1000+this.sleepTime[1]*60*1000);
      } else {
        this.show = !this.show;
        clearTimeout(this.timer)
      }
    },
    againSleep() {
      this.show = false;
      this.isRing = false;
      this.timer = setTimeout(() => {
        this.isRing = true;
        this.show = true;
      }, 10 * 60 * 1000);
    },
    getUp() {
      this.end = Date.now();
      this.pastime = Math.ceil((this.end - this.start) / 60 / 1000);
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
          if(this.pastime>=30){
      if (
        JSON.parse(localStorage.getItem("sleep"))?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )?.[0]?.time?.length > 0
      ) {
        localStorage.setItem(
          "sleep",
          JSON.stringify([
            {
              date:
                new Date().getMonth() + 1 + "月" + new Date().getDate() + "日",
              time: [
                ...JSON.parse(localStorage.getItem("sleep")).filter(
                  item =>
                    item.date ==
                    new Date().getMonth() +
                      1 +
                      "月" +
                      new Date().getDate() +
                      "日"
                )[0].time,
                this.pastime
              ]
            },
            ...JSON.parse(localStorage.getItem("sleep")).filter(
              item =>
                item.date !=
                new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
            )
          ])
        );
      } else {
        localStorage.setItem(
          "sleep",
          JSON.stringify([
            {
              date:
                new Date().getMonth() + 1 + "月" + new Date().getDate() + "日",
              time: [this.pastime]
            }
          ])
        );
      }
      this.pastime = this.pastime>60?parseInt(this.pastime/60)+"小时"+this.pastime%60+"分钟":this.pastime+"分钟"
      this.finish = true;
      this.isRing = false;
    }else{
      this.isRing = false
      this.show = true
    }
    },
    changeFinish() {
      this.finish = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.sleep-box {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: #60605c;
  z-index: 99999;
}
.sleep-time-box {
  background-color: #1d1d1b;
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
  .icon {
    position: absolute;
    left: 180rem;
    top: 50rem;
    color: #fff;
    font-size: 24rem;
  }
}
.sleep-time {
  margin-top: 45rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14rem;
  color: rgba(255, 255, 255, 0.3);
}
.button {
  display: flex;
  margin-top: 50rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .iconfont {
    width: 50rem;
    height: 50rem;
    margin-bottom: 10rem;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .msg {
    font-size: 14rem;
    color: rgba(255, 255, 255, 0.3);
  }
}
.else-box {
  margin: 115rem 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .else-content {
    width: 85rem;
    padding-left: 28rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    font-size: 50rem;
    .hour {
      background-image: linear-gradient(#373bad, #4c46af, #6d55ae);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: end;
      background-image: linear-gradient(#4c46af, #6d55ae);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      .time-frame {
        font-size: 14rem;
        background-image: linear-gradient(#594db5, #6d55ae);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  .alarm-clock {
    margin-top: 30rem;
    display: flex;
    align-items: center;
    font-size: 16rem;
    padding: 5rem 10rem;
    color: rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20rem;
    .alarm-clock-time {
      margin-left: 5rem;
    }
  }
  .finish-button {
    margin-top: 70rem;
  }
}
.ring-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-image: linear-gradient(#8287c3, #d4a2ad);
  .header {
    margin-top: 70rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14rem;
    color: rgba(255, 255, 255, 0.5);
    .msg {
      margin-top: 5rem;
    }
  }
  .else-content {
    width: 185rem;
    height: 185rem;
    margin: 25rem 0 65rem;
    padding-left: 59rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    font-size: 50rem;
    border: 1px solid #fff;
    border-radius: 50%;
    box-sizing: border-box;
    h3 {
      position: relative;
      left: 21rem;
      bottom: 10rem;
      color: rgba(255, 255, 255, 0.3);
    }
    .hour {
      background-image: none;
      color: #fff;
    }
    .footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: end;
      background-image: none;
      justify-content: start;
      color: #fff;
      .time-frame {
        margin-bottom: 5rem;
        font-size: 14rem;
        color: #fff;
      }
    }
  }
  .button-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .button {
      width: 130rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14rem;
      font-weight: bold;
    }
    .again-sleep {
      height: 55rem;
      color: #bca6c2;
      border-radius: 27rem;
      background-color: #fff;
    }
    .get-up {
      height: 40rem;
      margin-top: 30rem;
      color: rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 20rem;
    }
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
    margin: 30rem 0 40rem;
    font-size: 34rem;
    color: #fff;
  }
  .finish-middle {
    width: 325rem;
    height: 315rem;
    margin-top: 10rem;
    padding: 23rem 20rem;
    border-radius: 20rem;
    background-color: #fff;
    box-sizing: border-box;
    header {
      .month-and-day {
        font-size: 16rem;
        color: rgba(0, 0, 0, 0.5);
      }
      .time {
        margin: 5rem 0 65rem;
        font-size: 14rem;
        color: rgba(0, 0, 0, 0.2);
      }
    }
    p {
      font-size: 22rem;
      font-weight: bold;
      color: #4050d8;
    }
    .line {
      width: 100%;
      height: 1rem;
      margin: 65rem 0 25rem;
      background-color: rgba(0, 0, 0, 0.2);
    }
    footer {
      display: flex;
      justify-content: space-between;
      div {
        color: rgba(0, 0, 0, 0.2);
        .msg {
          margin-top: 5rem;
          font-size: 14rem;
          color: #000;
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