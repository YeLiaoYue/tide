<template>
  <div class="rest-box" :class="[show==false?'sleep-time-box': '']">
    <header class="header-box">
      <div class="iconfont" @click="goBack">&#xe601;</div>
      <h3>小憩</h3>
      <div class="after"></div>
    </header>
    <section class="middle-box" v-if="show">
      <van-picker
        :columns="columns"
        :visible-item-count="3"
        ref="select"
        :default-index="1"
        @change="onChange"
      />
      <div class="unit">分钟</div>
      <div
        class="sleep-time"
      >闹钟将于 {{ sleepTime?.[0]<=12?'上午':'下午' }} {{ sleepTime?.[0]<10?'0'+sleepTime?.[0]:sleepTime?.[0] }}:{{ sleepTime?.[1]<10?'0'+sleepTime?.[1]:sleepTime?.[1] }} 响起</div>
      <div class="start-button" @click="changeShow(true)">
        <div class="iconfont">&#xe60f;</div>
        <div class="msg">开始小憩</div>
      </div>
    </section>
    <div class="else-box" v-else>
      <div class="else-content">
        <div
          class="hour"
        >{{ (nowData?.[0]>=12?(nowData?.[0]-12)<10?'0'+(nowData?.[0]-12):(nowData?.[0]-12):nowData?.[0]) }}</div>
        <footer class="footer">
          <div class="m">{{ nowData?.[1] }}</div>
          <div class="time-frame">{{ nowData?.[0]<12?'上午':'下午' }}</div>
        </footer>
      </div>
      <div class="alarm-clock">
        <van-icon name="underway-o" color="rgba(255,255,255,.3)" size="16rem" />
        <div
          class="alarm-clock-time"
        >{{ ringTime?.[0]<=12?'上午':'下午' }} {{ (ringTime?.[0]>12?ringTime?.[0]-12:ringTime?.[0])<10?'0'+(ringTime?.[0]>12?ringTime?.[0]-12:ringTime?.[0]):(ringTime?.[0]>12?ringTime?.[0]-12:ringTime?.[0]) }}:{{ ringTime?.[1]<10?'0'+ringTime?.[1]:ringTime[1] }}</div>
      </div>
      <div class="finish-button" @click="changeShow(false)">
        <van-icon name="stop-circle-o" color="rgba(255,255,255,.3)" size="55rem" />
        <p>结束小憩</p>
      </div>
    </div>
    <div class="ring-box" v-if="isRing">
      <header class="header">
        <div>正在闹铃</div>
        <div class="msg">流 · 时间简史</div>
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
      <p>在潮汐的第{{time}}次小憩</p>
      <div class="finish-middle">
        <header>
          <div class="month-and-day">{{ new Date().getMonth()+1 }}月{{ new Date().getDate() }}日</div>
          <div class="time">{{ startTime }}-{{ endTime }}</div>
        </header>
        <p>我刚刚小憩了{{ pastime }}分钟。</p>
        <div class="line"></div>
        <footer>
          <div>
            <section>小憩时长</section>
            <section class="msg">{{ pastime }}分钟</section>
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
export default {
  data() {
    return {
      columns: [
        "05",
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
        "100",
        "105",
        "110",
        "115",
        "120"
      ],
      value: ["10"],
      nowData: null,
      sleepTime: null,
      show: true,
      ringTime: null,
      isRing: false,
      timer: null,
      startTime: null,
      endTime: null,
      start: null,
      end: null,
      pastime: null,
      finish: false,
      time: null,
      changeNowTime: null
    };
  },
  created() {
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
  watch: {
    nowData: function() {
      this.onChange();
    }
  },
  methods: {
    goBack() {
      history.go(-1);
    },
    onChange() {
      this.value = this?.$refs?.select?.getValues() || this.value;
      let nowTime = new Date()
        .toString()
        .split(" ")[4]
        .split(":");
      if (nowTime[1] * 1 + this.value * 1 >= 120) {
        this.sleepTime = [
          nowTime[0] * 1 + 2,
          nowTime[1] * 1 + this.value * 1 - 120
        ];
      } else if (nowTime[1] * 1 + this.value * 1 >= 60) {
        this.sleepTime = [
          nowTime[0] * 1 + 1,
          nowTime[1] * 1 + this.value * 1 - 60
        ];
      } else {
        this.sleepTime = [nowTime[0] * 1, nowTime[1] * 1 + this.value * 1];
      }
    },
    changeShow(item) {
      if (item) {
        this.show = !this.show;
        this.ringTime = this.sleepTime;
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
        }, this.value[0] * 60 * 1000);
      } else {
        clearTimeout(this.timer);
        this.show = true;
      }
    },
    againSleep() {
      this.ringTime = this.sleepTime;
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
      if (
        JSON.parse(localStorage.getItem("rest"))?.filter(
          item =>
            item.date ==
            new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
        )[0].time?.length > 0
      ) {
        localStorage.setItem(
          "rest",
          JSON.stringify([
            {
              date:
                new Date().getMonth() + 1 + "月" + new Date().getDate() + "日",
              time: [
                ...JSON.parse(localStorage.getItem("rest")).filter(
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
            ...JSON.parse(localStorage.getItem("rest")).filter(
              item =>
                item.date !=
                new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
            )
          ])
        );
      } else {
        localStorage.setItem(
          "rest",
          JSON.stringify([
            {
              date:
                new Date().getMonth() + 1 + "月" + new Date().getDate() + "日",
              time: [this.value[0]]
            }
          ])
        );
      }
      this.time = JSON.parse(localStorage.getItem("rest")).filter(
        item =>
          item.date !=
          new Date().getMonth() + 1 + "月" + new Date().getDate() + "日"
      )?.[0]?.time?.length;
      this.finish = true;
      this.isRing = false;
    },
    changeFinish() {
      this.finish = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.rest-box {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #a7a8a1;
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
    top: 162rem;
  }
  .sleep-time {
    margin-top: 10rem;
    font-size: 14rem;
    color: rgba(255, 255, 255, 0.3);
  }
  .start-button {
    margin-top: 50rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .iconfont {
      width: 55rem;
      height: 55rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rem;
      color: rgba(0, 0, 0, 0.5);
      background-color: #fff;
      border-radius: 50%;
    }
    .msg {
      margin-top: 10rem;
      font-size: 14rem;
      color: rgba(255, 255, 255, 0.3);
    }
  }
}
.else-box {
  margin: 115rem 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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
    color: rgba(255, 255, 255, 0.1);
    p {
      margin-top: 10rem;
      font-size: 14rem;
      text-align: center;
    }
  }
}
.else-content {
  width: 85rem;
  padding-left: 28rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  font-size: 50rem;
  .hour {
    background-image: linear-gradient(#5c96dd, #6b9fdd);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: end;
    background-image: linear-gradient(#56769c, #80abdc);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    .time-frame {
      font-size: 14rem;
      background-image: linear-gradient(#56769c, #80abdc);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
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
      -webkit-text-fill-color: #fff;
    }
    .footer {
      background-image: none;
      justify-content: start;
      -webkit-text-fill-color: #fff;
      .time-frame {
        margin-bottom: 5rem;
        background-image: none;
        -webkit-text-fill-color: #fff;
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