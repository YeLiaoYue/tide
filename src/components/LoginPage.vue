<template>
  <div class="login-box" v-if="indexPage" @touchmove.prevent @mousewheel.prevent>
    <video
      class="background-video"
      src="https://pics.tide.moreless.io/scenes/FmjsimStawGdx2ZLd-S4dfBYQi7C"
      autoplay
      loop="loop"
    ></video>
    <header class="login-header" @click="$emit('changeShowLogin')">
      <van-icon name="cross" size="26rem" color="#fff" />
    </header>
    <section class="title-box">
      <h1>潮汐</h1>
      <p>和潮汐一起平静身心</p>
    </section>
    <section class="login-method">
      <div class="button mobile-phone" @click="openVerification">
        <span class="iconfont">&#xe651;</span>手机登录
      </div>
      <div class="button micro-blog" @click="showPopup">
        <span class="iconfont">&#xe641;</span>微博登录
      </div>
      <div class="qq-mail">
        <div class="qq iconfont" @click="showPopup">&#xe600;</div>
        <div class="mail iconfont" @click="showPopup">&#xe7d8;</div>
      </div>
    </section>
    <footer class="login-footer">
      <div class="select-box" @click="changeSelectClause">
        <div class="select already" v-if="selectClause">
          <van-icon name="success" color="#fff" size="12rem" />
        </div>
        <div class="select" v-else></div>
        <p>已阅读同意以下条款</p>
      </div>
      <div class="clause-box">
        <div class="clause">服务条款</div>
        <div class="clause">隐私协议</div>
      </div>
    </footer>
    <van-popup v-model="show">
      <h3>请阅读并同意以下条款</h3>
      <p>
        若需要注册或登录潮汐，请先阅读并同意
        <span>服务条款</span>和
        <span>隐私协议</span>
      </p>
      <div class="button-box">
        <div class="cancel" @click="showPopup">取消</div>
        <div class="consent" @click="consentAndContinue">同意并继续</div>
      </div>
    </van-popup>
  </div>
  <div class="my-swipe" @touchmove.prevent @mousewheel.prevent v-else>
    <van-swipe
      :loop="false"
      :show-indicators="false"
      :touchable="false"
      ref="loginSwipe"
      @change="onChange"
    >
      <van-swipe-item class="mobile-phone-verification-code">
        <header class="header" @click="prevPage">
          <van-icon name="arrow-left" size="24rem" />
        </header>
        <section class="middle">
          <h1>手机验证码登录</h1>
          <p>未注册绑定的手机号将自动注册</p>
          <div class="input-box">
            <div class="country-code">+86</div>
            <input
              type="tel"
              class="tel"
              placeholder="手机号码"
              v-model="telephone"
              @keydown.enter="checkMobile('getVerification','0')"
            />
            <div class="delete-value" v-if="telephone" @click="deleteValue">
              <van-icon name="cross" size="14rem" color="#fff" />
            </div>
          </div>
          <div class="button-box">
            <div class="button" @click="checkMobile('getVerification','0')">获取验证码</div>
            <div class="change-login" @click="nextPage">使用密码登录</div>
          </div>
        </section>
      </van-swipe-item>
      <van-swipe-item class="enter-the-verification-code" v-if="showLoginVerificationCode">
        <header class="header" @click="prevPage">
          <van-icon name="arrow-left" size="24rem" />
        </header>
        <section class="middle">
          <h1>输入验证码</h1>
          <p>我们以向 +86 {{ telephone }} 发送了一个4位验证码。</p>
          <div class="input-box">
            <van-password-input
              :value="value"
              :gutter="'25rem'"
              :length="4"
              :mask="false"
              :focused="showKeyboard"
              @focus="showKeyboard = true"
            />
          </div>
          <div class="button-box">
            <div class="change-login count-down" v-if="showGet" @click="nextPage">重新发送 · 60</div>
            <div class="change-login" v-else @click="getVerification">重新获取</div>
          </div>
        </section>
        <van-number-keyboard v-model="value" :show="showKeyboard" @blur="showKeyboard = false" />
      </van-swipe-item>
      <van-swipe-item class="change-password" v-show="showPassword">
        <header class="header" @click="prevPage()">
          <van-icon name="arrow-left" size="24rem" />
        </header>
        <section class="middle">
          <h1>设置新密码</h1>
          <p>密码最少6位,可由数字、字母或常用符号组成</p>
          <div class="password">
            <input
              type="password"
              v-model="newPassword"
              class="password-input"
              placeholder="登录密码"
              @keydown.enter="changePassword"
            />
          </div>
          <div class="button-box">
            <div class="button" @click="changePassword(true)">完成绑定</div>
          </div>
        </section>
      </van-swipe-item>
      <van-swipe-item class="password-login">
        <header class="header" @click="prevPage">
          <van-icon name="arrow-left" size="24rem" />
        </header>
        <section class="middle">
          <h1>手机号密码登录</h1>
          <div class="input-box">
            <div class="country-code">+86</div>
            <input
              type="tel"
              class="tel"
              placeholder="手机号码"
              v-model="telephone"
              @keydown.enter="userLogin"
            />
            <div class="delete-value" v-if="telephone" @click="deleteValue">
              <van-icon name="cross" size="14rem" color="#fff" />
            </div>
          </div>
          <div class="password">
            <input type="password" v-model="UserPassword" class="password-input" placeholder="登录密码" @keydown.enter="userLogin" />
            <div class="forget-password" @click="nextPage">忘记密码 ?</div>
          </div>
          <div class="button-box">
            <div class="button" @click="userLogin">登录</div>
            <div class="change-login" @click="prevPage">使用验证码登录</div>
          </div>
        </section>
      </van-swipe-item>
      <van-swipe-item class="forget-password-page">
        <header class="header" @click="prevPage">
          <van-icon name="arrow-left" size="24rem" />
        </header>
        <section class="middle">
          <h1>确认账号</h1>
          <p>确认需要重置密码的账户。</p>
          <div class="input-box">
            <div class="country-code">+86</div>
            <input
              type="tel"
              class="tel"
              placeholder="手机号码"
              v-model="telephone"
              @keydown.enter="checkMobile('getVerification','1')"
            />
            <div class="delete-value" v-if="telephone" @click="deleteValue">
              <van-icon name="cross" size="14rem" color="#fff" />
            </div>
          </div>
          <div class="button-box">
            <div class="button" @click="checkMobile('getVerification','1')">继续</div>
          </div>
        </section>
      </van-swipe-item>
      <van-swipe-item class="enter-the-verification-code">
        <header class="header" @click="prevPage">
          <van-icon name="arrow-left" size="24rem" />
        </header>
        <section class="middle">
          <h1>输入验证码</h1>
          <p>我们以向 +86 {{ telephone }} 发送了一个4位验证码。</p>
          <div class="input-box">
            <van-password-input
              :value="value"
              :gutter="'25rem'"
              :length="4"
              :mask="false"
              :focused="showKeyboard"
              @focus="showKeyboard = true"
            />
          </div>
          <div class="button-box">
            <div class="change-login count-down" v-if="showGet" @click="nextPage">重新发送 · 60</div>
            <div class="change-login" v-else @click="getVerification">重新获取</div>
          </div>
        </section>
        <van-number-keyboard v-model="value" :show="showKeyboard" @blur="showKeyboard = false" />
      </van-swipe-item>
      <van-swipe-item class="change-password">
        <header class="header" @click="prevPage">
          <van-icon name="arrow-left" size="24rem" />
        </header>
        <section class="middle">
          <h1>设置新密码</h1>
          <p>密码最少6位,可由数字、字母或常用符号组成</p>
          <div class="password">
            <input
              type="password"
              v-model="newPassword"
              class="password-input"
              placeholder="登录密码"
              @keydown.enter="changePassword(false)"
            />
          </div>
          <div class="button-box">
            <div class="button" @click="changePassword(false)">确定</div>
          </div>
        </section>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, Swipe, SwipeItem, PasswordInput, NumberKeyboard } from "vant";

Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Toast);
Vue.use(PasswordInput);
Vue.use(NumberKeyboard);
export default {
  data() {
    return {
      selectClause: false,
      show: false,
      indexPage: true,
      telephone: null,
      nowMethod: null,
      index: 0,
      value: "",
      showKeyboard: false,
      showGet: false,
      verificationCode: "",
      showLoginVerificationCode: false,
      newPassword: null,
      alreadyRegister: false,
      showPassword: false,
      UserPassword: null
    };
  },
  watch: {
    value: function() {
      if (this.value.length == 4 && this.value == this.verificationCode) {
        if (
          this.showLoginVerificationCode &&
          JSON.parse(localStorage.getItem("user"))?.filter(
            item => item.id == this.telephone
          ).length == 1
        ) {
          this.alreadyRegister = true;
        }
        if (this.showLoginVerificationCode && this.alreadyRegister) {
          localStorage.setItem(
            "isLogin",
            JSON.stringify([true, this.telephone])
          );
          this.$emit("changeShowLogin");
          Toast("登录成功");
        } else if (
          this.showLoginVerificationCode &&
          this.alreadyRegister == false
        ) {
          this.showPassword = true;
          this.$refs.loginSwipe.next();
          this.showLoginVerificationCode = false;
        } else {
          this.$refs.loginSwipe.next();
        }
      } else if (
        this.value.length == 4 &&
        this.value != this.verificationCode
      ) {
        Toast({ message: "验证码错误", position: "top" });
      }
    },
    telephone: function() {
      if (
        JSON.parse(localStorage.getItem("user"))?.filter(
          item => item.id == this.telephone
        ).length == 1
      ) {
        this.alreadyRegister = true;
      }
    }
  },
  methods: {
    changeSelectClause() {
      this.selectClause = !this.selectClause;
    },
    showPopup() {
      if (!this.selectClause) {
        this.show = !this.show;
      }
    },
    deleteValue() {
      this.telephone = null;
    },
    checkMobile(item, index) {
      let reg = /^1[3456789]\d{9}$/;
      if (this.telephone == null) {
        Toast({ message: "手机号不能为空", position: "top" });
      } else if (!reg.test(this.telephone)) {
        Toast({ message: "手机号码格式错误", position: "top" });
      } else {
        if (index == 0) {
          this[item](index);
        } else if (
          JSON.parse(localStorage.getItem("user"))?.filter(
            item => item.id == this.telephone
          ).length != 1
        ) {
          Toast("该手机号尚未注册");
        } else if(index== 1){
          this[item](index)
        }
      }
    },
    getVerification(index) {
      this.verificationCode = "";
      this.value = "";
      for (let i = 0; i < 4; i++) {
        let radomNum = Math.floor(Math.random() * 9 + 1);
        this.verificationCode += radomNum;
      }
      Toast({position: 'top',duration: 5000,message:this.verificationCode});
      if (this.showLoginVerificationCode == false && this.index != 3) {
        this.$refs.loginSwipe.next();
      }
      if (index == 0) {
        this.showLoginVerificationCode = true;
      }
    },
    openVerification() {
      if (!this.selectClause) {
        this.show = !this.show;
        this.nowMethod = "openVerification";
      } else {
        this.indexPage = false;
      }
    },
    consentAndContinue() {
      this.selectClause = true;
      this.show = false;
      this[this.nowMethod]();
    },
    onChange(index) {
      this.index = index;
    },
    nextPage() {
      this.telephone = null;
      this.$refs.loginSwipe.next();
    },
    prevPage() {
      if (this.index == 0) {
        this.indexPage = true;
      } else {
        this.$refs.loginSwipe.prev();
      }
      this.telephone = null;
      setTimeout(() => {
        this.showLoginVerificationCode = false;
        this.showPassword = false;
      }, 500);
    },
    changePassword(user) {
      let reg = /^[\w.@#$%^&*()_+-=]{6,}$/;
      if (reg.test(this.newPassword)) {
        if (user) {
          localStorage.setItem(
            "isLogin",
            JSON.stringify([true, this.telephone])
          );
          this.$emit("changeShowLogin");
          Toast("注册成功");
          this.addUser();
        } else {
          localStorage.setItem(
            "user",
            JSON.stringify([
              Object.assign(
                JSON.parse(localStorage.getItem("user"))?.filter(
                  item => item.id == this.telephone
                )[0],
                { password: this.newPassword }
              ),
              ...(JSON.parse(localStorage.getItem("user"))?.filter(
                item => item.id != this.telephone
              ) || [])
            ])
          );
          Toast("密码修改成功,请重新登录");
          this.indexPage = true;
          this.newPassword = null
        }
      } else if (this.newPassword.length < 6) {
        Toast("密码最少6位");
      } else {
        Toast("密码只能由数字、字母或常用符号组成");
      }
    },
    addUser() {
      localStorage.setItem(
        "user",
        JSON.stringify([
          {
            id: this.telephone,
            image: null,
            createTime: Date.now(),
            name: `冲浪者${JSON.parse(localStorage.getItem("user"))?.length || 0}`,
            birthday: "保密",
            sex: "保密",
            password: this.newPassword
          },
          ...(JSON.parse(localStorage.getItem("user")) || [])
        ])
      );
    },
    userLogin() {
      let reg = /^1[3456789]\d{9}$/;
      if (this.telephone == null) {
        Toast({ message: "手机号不能为空", position: "top" });
      } else if (!reg.test(this.telephone)) {
        Toast({ message: "手机号码格式错误", position: "top" });
      } else {
        if (this.alreadyRegister) {
          if (
            JSON.parse(localStorage.getItem("user"))?.filter(
              item => item.id == this.telephone
            )?.[0]?.password == this.UserPassword
          ) {
            localStorage.setItem(
              "isLogin",
              JSON.stringify([true, this.telephone])
            );
            this.$emit("changeShowLogin");
            Toast("登录成功");
          } else {
            Toast("密码错误");
          }
        } else {
          this.$refs.loginSwipe.prev();
          Toast("该手机号尚未注册，请先注册");
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999999;
  .background-video {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
  }
}
.login-header {
  position: relative;
  width: max-content;
  height: max-content;
  margin: 15rem 20rem 0;
}
.title-box {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  h1 {
    margin: 70rem 0 40rem;
    font-size: 40rem;
  }
  p {
    color: rgba(255, 255, 255, 0.7);
  }
}
.login-method {
  position: relative;
  margin-top: 100rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .button {
    width: 300rem;
    height: 47rem;
    margin-bottom: 25rem;
    border-radius: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18rem;
    font-weight: bold;
    color: #fff;
    background-color: #ff4949;
    .iconfont {
      font-weight: normal;
      margin-right: 10rem;
    }
  }
  .micro-blog {
    color: #000;
    background-color: #fff;
    .iconfont {
      color: #ff4949;
    }
  }
  .qq-mail {
    width: 190rem;
    margin-top: 45rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .iconfont {
      width: 50rem;
      height: 50rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20rem;
      color: #fff;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
    }
    .qq {
      padding-bottom: 5rem;
      font-size: 18rem;
      box-sizing: border-box;
    }
  }
}
.login-footer {
  position: relative;
  margin-top: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .select-box {
    display: flex;
    padding-right: 22rem;
    align-items: center;
    color: rgba(255, 255, 255, 0.3);
    .select {
      width: 12rem;
      height: 12rem;
      margin-right: 10rem;
      border: 1rem solid #fff;
      border-radius: 50%;
      box-sizing: border-box !important;
    }
    .already {
      padding-top: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      background-color: rgb(0, 211, 0);
      box-sizing: border-box;
      .van-icon::before {
        transform: scale(0.8);
      }
    }
  }
  .clause-box {
    width: 110rem;
    display: flex;
    justify-content: space-between;
    color: #fff;
  }
}
.van-popup {
  width: 310rem;
  height: 160rem;
  padding: 20rem;
  border-radius: 8rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  h3 {
    font-size: 18rem;
    font-weight: bold;
  }
  p {
    margin-top: 10rem;
    font-size: 14rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.3);
    span {
      margin: 0 2rem;
      color: #000;
    }
  }
  .button-box {
    margin-top: auto;
    display: flex;
    align-self: end;
    font-size: 16rem;
    color: rgba(0, 0, 0, 0.3);
    font-weight: bold;
    .consent {
      margin-left: 20rem;
      color: #ff4949;
    }
  }
}
.my-swipe {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 9999999;
}
.mobile-phone-verification-code,
.password-login,
.forget-password-page,
.enter-the-verification-code,
.change-password {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 99999;
  .header {
    position: relative;
    width: max-content;
    height: max-content;
    margin: 10rem 20rem 0;
  }
  .middle {
    position: relative;
    padding: 0 40rem;
    margin-top: 50rem;
    display: flex;
    flex-direction: column;
    align-items: start;
    h1 {
      font-size: 34rem;
      font-weight: bold;
    }
    p {
      margin: 25rem 0 40rem;
      font-size: 14rem;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.3);
    }
    .input-box {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 14rem;
      .country-code {
        width: 70rem;
        height: 55rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 15rem;
        &::after {
          content: "";
          margin: 4rem 0 0 6rem;
          width: 0;
          height: 0;
          display: block;
          border: 5rem solid transparent;
          border-top-color: #000;
        }
      }
      .tel {
        width: 215rem;
        padding: 0 15rem;
        border: none;
        font-size: 16rem;
        border-radius: 15rem;
        background-color: rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        caret-color: red;
      }
      .delete-value {
        position: absolute;
        top: 15rem;
        right: 15rem;
        width: 20rem;
        height: 20rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
      }
    }
    .button-box {
      width: 100%;
      margin-top: 45rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 16rem;
      font-weight: bold;
      .button {
        width: 100%;
        height: 50rem;
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(255, 255, 255, 0.9);
        background-color: #ff4949;
        border-radius: 8rem;
      }
    }
  }
}
.password-login,
.change-password {
  .input-box {
    margin-top: 45rem;
  }
  .password {
    width: 100%;
    margin-top: 15rem;
    display: flex;
    flex-direction: column;
    align-items: end;
    .password-input {
      width: 100%;
      height: 55rem;
      padding: 0 15rem;
      border: none;
      font-size: 16rem;
      border-radius: 15rem;
      background-color: rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      caret-color: red;
    }
    .forget-password {
      margin-top: 10rem;
      font-size: 14rem;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.3);
    }
  }
}
.enter-the-verification-code {
  .middle {
    .input-box {
      display: block;
      .van-password-input {
        margin: 0;
        .van-password-input__item {
          border-radius: 10rem;
        }
      }
    }
    .button-box {
      margin-top: 65rem;
      .count-down {
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }
  .van-number-keyboard {
    position: absolute;
  }
}
</style>