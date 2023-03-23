import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DiscoverView from '../views/DiscoverView.vue'
import MineView from '../views/MineView.vue'
import SearchView from '../views/SearchView.vue'
import ExplorerPage from '../components/ExplorerPage.vue'
import MeditationPage from '../components/MeditationPage.vue'
import AddScene from '../components/AddScene.vue'
import SleepPage from '../components/SleepPage.vue'
import ScenePage from '../components/ScenePage.vue'
import SleepStory from '../components/SleepStory.vue'
import SleepMeditation from '../components/SleepMeditation.vue'
import SleepScene from '../components/SleepScene.vue'
import ConcentrationPattern from '../components/ConcentrationPattern.vue'
import SleepPattern from '../components/SleepPattern.vue'
import RestPattern from '../components/RestPattern.vue'
import BreathePattern from '../components/BreathePattern.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/discover',
    // name: 'discover',
    component: DiscoverView,
    children: [
      {
        path: '',
        name: 'explorer',
        component: ExplorerPage,
      },
      {
        path: 'meditation',
        name: 'meditation',
        component: MeditationPage,
      },
      {
        path: 'sleep',
        // name: 'sleep',
        component: SleepPage,
        children: [
          {
            path: '',
            name: 'sleepStory',
            component: SleepStory,
          },
          {
            path: 'sleepMeditation',
            name: 'sleepMeditation',
            component: SleepMeditation,
          },
          {
            path: 'sleepScene',
            name: 'sleepScene',
            component: SleepScene,
          },
        ]
      },
      {
        path: 'scene',
        name: 'scene',
        component: ScenePage,
      },
    ]
  },
  {
    path: '/mine',
    name: 'mine',
    component: MineView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/addScene',
    name: 'addScene',
    component: AddScene
  },
  {
    path: '/concentration',
    name: 'concentration',
    component: ConcentrationPattern
  },
  {
    path: '/sleepPattern',
    name: 'sleepPattern',
    component: SleepPattern
  },
  {
    path: '/restPattern',
    name: 'restPattern',
    component: RestPattern
  },
  {
    path: '/breathePattern',
    name: 'breathePattern',
    component: BreathePattern
  },
]

const router = new VueRouter({
  routes
})

export default router
