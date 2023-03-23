<template>
  <div class="user-box" @touchmove.prevent @mousewheel.prevent>
    <header class="user-header">
      <van-icon name="arrow-left" @click="$emit('changeShowUserMsg')" />
      <h3>账号</h3>
    </header>
    <section class="middle">
      <van-uploader :after-read="afterRead">
        <div class="user-img" v-if="userMsg.image">
          <img :src="userMsg.image" class="auto-img" />
        </div>
        <div class="user-img iconfont" v-else>&#xe639;</div>
        <div class="change-image">修改头像</div>
      </van-uploader>
    </section>
    <ul>
      <li>
        潮汐ID
        <span>{{ userMsg.createTime }}</span>
      </li>
      <li @click="changeShowUserName">
        昵称
        <span>{{ userMsg.name }}</span>
      </li>
      <li @click="changeShow">
        性别
        <span>{{ userMsg.sex || "保密" }}</span>
      </li>
      <li @click="changeShowBirthday">
        生日
        <span>{{ userMsg?.birthday!="保密"? userMsg?.birthday.join("-"): "保密" }}</span>
      </li>
    </ul>
    <section class="changeUserName" v-if="showUserName">
      <header class="user-header">
        <van-icon name="arrow-left" @click="changeShowUserName" />
        <h3>修改昵称</h3>
      </header>
      <div class="middle-box">
        <h5>昵称</h5>
        <input type="text" v-model="Username" autofocus />
        <div class="button" @click="changeUserName">保存</div>
      </div>
    </section>
    <van-popup v-model="show">
      <h3>性别</h3>
      <van-radio-group v-model="radio">
        <van-radio name="男" checked-color="#ee0a24">男</van-radio>
        <van-radio name="女" checked-color="#ee0a24">女</van-radio>
        <van-radio name="保密" checked-color="#ee0a24">保密</van-radio>
      </van-radio-group>
      <section class="button-box">
        <div class="cancel" @click="changeShow">取消</div>
        <div class="confirm" @click="changUserSex">确定</div>
      </section>
    </van-popup>
    <van-popup
      class="birthday-box"
      round
      v-model="showBirthday"
      position="bottom"
      :style="{ height: '45%' }"
    >
      <h3>出生日期</h3>
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :show-toolbar="false"
        :min-date="minDate"
        :max-date="maxDate"
        :visible-item-count="3"
        :formatter="formatter"
      />
      <div class="button" @click="changeUserBirthday">确定</div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Uploader, RadioGroup, Radio, Popup, DatetimePicker } from "vant";

Vue.use(Uploader);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Popup);
Vue.use(DatetimePicker);
import { mapState } from "vuex";
export default {
  data() {
    return {
      userMsg: true,
      showUserName: false,
      Username: null,
      show: false,
      radio: null,
      showBirthday: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2018, 11, 31),
      currentDate: new Date(2017, 0, 1)
    };
  },
  computed: { ...mapState(["isLogin"]) },
  created() {
    this.userMsg = JSON.parse(localStorage.getItem("user")).filter(
      item => item.id == this.isLogin[1]
    )[0];
    this.Username = this.userMsg.name;
    this.radio = this.userMsg.sex;
    this.currentDate = new Date(
      this.userMsg?.birthday!="保密" ? this.userMsg?.birthday.join("-") : 2000, 0, 1
    );
  },
  methods: {
    afterRead(file) {
      localStorage.setItem(
        "user",
        JSON.stringify([
          Object.assign(
            JSON.parse(localStorage.getItem("user"))?.filter(
              item => item.id == this.isLogin[1]
            )[0],
            { image: file.content }
          ),
          ...(JSON.parse(localStorage.getItem("user"))?.filter(
            item => item.id != this.isLogin[1]
          ) || [])
        ])
      );
      this.userMsg = JSON.parse(localStorage.getItem("user")).filter(
        item => item.id == this.isLogin[1]
      )[0];
    },
    changeShowUserName() {
      this.showUserName = !this.showUserName;
    },
    changeUserName() {
      localStorage.setItem(
        "user",
        JSON.stringify([
          Object.assign(
            JSON.parse(localStorage.getItem("user"))?.filter(
              item => item.id == this.isLogin[1]
            )[0],
            { name: this.Username }
          ),
          ...(JSON.parse(localStorage.getItem("user"))?.filter(
            item => item.id != this.isLogin[1]
          ) || [])
        ])
      );
      this.userMsg = JSON.parse(localStorage.getItem("user")).filter(
        item => item.id == this.isLogin[1]
      )[0];
      this.showUserName = !this.showUserName;
    },
    changeShow() {
      this.show = !this.show;
    },
    changUserSex() {
      localStorage.setItem(
        "user",
        JSON.stringify([
          Object.assign(
            JSON.parse(localStorage.getItem("user"))?.filter(
              item => item.id == this.isLogin[1]
            )[0],
            { sex: this.radio }
          ),
          ...(JSON.parse(localStorage.getItem("user"))?.filter(
            item => item.id != this.isLogin[1]
          ) || [])
        ])
      );
      this.userMsg = JSON.parse(localStorage.getItem("user")).filter(
        item => item.id == this.isLogin[1]
      )[0];
      this.show = !this.show;
    },
    changeShowBirthday() {
      this.showBirthday = !this.showBirthday;
    },
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      return val;
    },
    changeUserBirthday() {
      let date = this.currentDate;
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      localStorage.setItem(
        "user",
        JSON.stringify([
          Object.assign(
            JSON.parse(localStorage.getItem("user"))?.filter(
              item => item.id == this.isLogin[1]
            )[0],
            { birthday: [year, month, strDate] }
          ),
          ...(JSON.parse(localStorage.getItem("user"))?.filter(
            item => item.id != this.isLogin[1]
          ) || [])
        ])
      );
      this.userMsg = JSON.parse(localStorage.getItem("user")).filter(
        item => item.id == this.isLogin[1]
      )[0];
      this.showBirthday = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  padding-top: 50rem;
  background-color: #fff;
  z-index: 999999;
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}
.user-header {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 50rem;
  padding-left: 15rem;
  display: flex;
  align-items: center;
  font-size: 20rem;
  font-weight: bold;
  background-color: #fff;
  box-shadow: 0 8rem 8rem 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  z-index: 999999;
  h3 {
    margin-left: 35rem;
    font-size: 16rem;
    font-weight: bold;
  }
}
.middle {
  margin-top: 80rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-img {
    width: 80rem;
    height: 80rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eee;
    border-radius: 50%;
    font-size: 38rem;
    color: #d0cdcd;
    overflow: hidden;
  }
  .change-image {
    margin-top: 25rem;
    text-align: center;
    font-size: 14rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.3);
  }
}
ul {
  width: 100vw;
  margin-top: 70rem;
  padding: 0 25rem;
  box-sizing: border-box;
  li {
    width: 100%;
    height: 55rem;
    font-size: 16rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    span {
      margin-left: auto;
      color: rgba(0, 0, 0, 0.3);
    }
  }
}
.changeUserName {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 9999999;
  .user-header {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 50rem;
    padding-left: 15rem;
    display: flex;
    align-items: center;
    font-size: 20rem;
    font-weight: bold;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: none;
    h3 {
      margin-left: 35rem;
      font-size: 16rem;
      font-weight: bold;
    }
  }
  .middle-box {
    margin-top: 50rem;
    padding-left: 25rem;
    font-size: 14rem;
    color: #ff4949;
    input {
      width: 325rem;
      margin-top: 10rem;
      padding: 5rem 0;
      font-size: 16rem;
      font-weight: bold;
      color: #000;
      border: 0 solid #ff4949;
      border-bottom-width: 2rem;
    }
    .button {
      width: 85rem;
      height: 35rem;
      margin: 20rem 25rem 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14rem;
      font-weight: bold;
      color: #fff;
      border-radius: 8rem;
      background-color: #ff4949;
    }
  }
}
.van-popup {
  width: 315rem;
  height: 255rem;
  padding: 20rem;
  box-sizing: border-box;
  h3 {
    font-size: 20rem;
    font-weight: bold;
  }
  .van-radio-group {
    margin-top: 10rem;
    font-size: 16rem;
    font-weight: bold;
    .van-radio {
      height: 45rem;
      display: flex;
      align-items: center;
    }
  }
  .button-box {
    width: 110rem;
    margin-top: 20rem;
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    div {
      width: 50rem;
      height: 20rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14rem;
      color: #ff5555;
    }
  }
}
.van-popup.birthday-box {
  width: 100vw;
  h3 {
    text-align: center;
    margin-bottom: 20rem;
  }
  .van-datetime-picker {
    font-size: 16rem;
    font-weight: bold;
  }
  .button {
    width: 315rem;
    height: 45rem;
    margin: 20rem auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16rem;
    font-weight: bold;
    border-radius: 15rem;
    background-color: #ebebeb;
  }
}
</style>