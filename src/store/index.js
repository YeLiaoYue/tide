import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: null,
    record:null,
    recommendations: null,
    listData: null,
    showList: false,
    showMsg: false,
    msg: null,
    isLogin: JSON.parse(localStorage.getItem('isLogin')) || [false,null]
  },
  getters: {
  },
  mutations: {
    changeData(state, data) {
      state.data = data
    },
    initializeData(state){
      state.data = null
    },
    changeQuery(state, data) {
      state.record = data
    },
    changeRecommendations(state, data) {
      state.recommendations = data
    },
    changeListData(state, data) {
      state.listData = data
    },
    changeShowList(state, data) {
      state.showList = data
    },
    changeShowMsg(state, data) {
      state.showMsg = data
    },
    changMsg(state, data) {
      state.msg = data
    },
    updateIsLogin(state){
      state.isLogin = JSON.parse(localStorage.getItem('isLogin')) || [false,null]
    }
  },
  actions: {
  },
  modules: {
  }
})
