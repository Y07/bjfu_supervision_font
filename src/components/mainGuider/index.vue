<style scoped lang="less">
  .ivu-layout-header {
    padding: 0px;
    background-color: #ffffff;
  }

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: scroll;
    height: 100%;
  }

  .content-wrapper {
    padding: 19px;
    min-height: 650px;
    height: ~"calc(100% - 80px)";
    overflow: scroll;
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #f3fffe;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-nav {
    width: 100%;
    margin: 0 auto;
    margin-right: 0px;
  }

  .layout-footer-center {
    text-align: center;
  }
</style>
<template>
  <div style="height: 100%">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="primary" :active-name="activity_name" @on-select="onMenuSelect">
          <div class="layout-nav">
            <MenuItem name="notice_lesson" v-role="['督导','管理员']">
              <Icon type="ios-paper"/>
              学期重点关注
            </MenuItem>
            <MenuItem name="lesson_model" v-role="['督导','管理员']">
              <Icon type="ios-keypad"/>
              好评课堂
            </MenuItem>
            <MenuItem name="lesson_form" v-role="['督导','管理员']">
              <Icon type="ios-construct"/>
              课程表
            </MenuItem>
            <MenuItem name="judge" v-role="['督导','管理员']">
              <Icon type="ios-paper"/>
              填评价表
            </MenuItem>

            <MenuItem name="my_form" v-role="['督导','管理员']">
              <Icon type="ios-construct"/>
              已做评价
            </MenuItem>

            <MenuItem name="leader_lookup" v-role="['督导','管理员']">
              <Icon type="ios-construct"/>
              学院教学院长
            </MenuItem>

            <MenuItem name="attend">
              <Icon type="ios-people"/>
              活动报名
            </MenuItem>
            <MenuItem name="consult_apply">
              <Icon type="ios-construct"/>
              咨询申请
            </MenuItem>
          </div>

          <user :user-avator="userAvator" style="float: right; margin-right: 40px"/>
          <userNotices style="margin-right: 10px; float: right;color: #E6EFFA"></userNotices>
          <language v-if="$config.useI18n" @on-lang-change="setLocal"
                    style="margin-right: 10px; float: right;color:#E6EFFA" :lang="local"/>
          <!--<error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount" style="float: right; margin-right: 10px;color:#E6EFFA"></error-store>-->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px; float: right;color:#E6EFFA"/>
          <span @click="handleClickToAdmin" style="margin-right: 10px; float: right;color:#E6EFFA"
                v-role="['管理员', '学院领导', '小组长', '大组长']"> 切换到管理员端 </span>
        </Menu>

      </Header>
      <Content class="content-wrapper">
        <router-view/>
      </Content>
      <Footer class="layout-footer-center">2011-2016 &copy; BJFU-SUPERVIERSION</Footer>
    </Layout>
  </div>
</template>
<script>
import HeaderBar from '_c/main/components/header-bar'
import User from '_c/mainGuider/components/user'
import Fullscreen from '_c/mainGuider/components/fullscreen'
import Language from '_c/mainGuider/components/language'
import userNotices from '_c/user_notices'
import ErrorStore from '_c/mainGuider/components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'mainGuider',
  components: {
    Fullscreen,
    // HeaderBar,
    Language,
    // TagsNav,
    // Fullscreen,
    ErrorStore,
    User,
    userNotices
  },
  data () {
    return {
      // collapsed: false,
      // minLogo,
      // maxLogo,
      isFullscreen: false,
      activity_name: 'consult_apply'
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    }
  },
  methods: {
    onMenuSelect: function (name) {
      if (this.$route.path === '/_guider') {
        this.$router.push({ path: '/_guider/' + name })
      } else {
        this.$router.push({ path: '/_guider/' + name })
      }
    },
    highlightMenu () {
      let path = this.$route.path
      if (path === '/_guider/judge') {
        this.activity_name = 'judge'
      } else if (path === '/_guider/attend') {
        this.activity_name = 'attend'
      } else if (path === '/_guider/consult_apply') {
        this.activity_name = 'consult_apply'
      } else if (path === '/_guider/lesson_form') {
        this.activity_name = 'lesson_form'
      }
    },
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleClickToAdmin: function () {
      this.$router.push({ name: 'home' })
    }
  },
  watch: {
    '$route' (newRoute) {
      this.highlightMenu()
    }
  },
  mounted () {
    if (this.$route.path === '/_guider') {
      this.$router.replace('/_guider/consult_apply')
    }
    console.log(this)
    this.highlightMenu()
    /**
       * @description 初始化设置面包屑导航和标签导航
       */
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
  }
}
</script>
