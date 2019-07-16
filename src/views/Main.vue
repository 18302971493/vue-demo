<style lang="less">
@import "./main.less";
</style>

<template>
  <div class="main" :class="{'main-hide-text': shrink}" :loading="loading">
    <div class="sidebar-menu-con menu-bar" :style="{width: shrink?'60px':'220px', overflow: shrink ? 'visible' : 'auto'}">
      <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
        <div slot="top" class="logo-con">
          <img v-show="!shrink" src="../../static/images/logo.jpg" key="max-logo" />
          <img v-show="shrink" src="../../static/images/logo-min.jpg" key="min-logo" />
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'220px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                          <Icon type="md-menu" size="32"></Icon>
                      </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <!--<Dropdown @on-click="handleLanDropdown" class="options">-->
            <!--<Icon type="md-globe" :size="24" class="language"></Icon>-->
            <!--<DropdownMenu slot="list">-->
              <!--<DropdownItem name="zh-CN">中文</DropdownItem>-->
              <!--<DropdownItem name="en-US">English</DropdownItem>-->
            <!--</DropdownMenu>-->
          <!--</Dropdown>-->
          <lock-screen></lock-screen>
          <message-tip v-model="mesCount"></message-tip>
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ username }}</span>
                  <Icon type="md-arrow-dropdown" />
                  <Avatar :src="avatarPath" style="background: #619fe7;"></Avatar>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">{{ $t('userCenter') }}</DropdownItem>
                  <!--<DropdownItem name="ownSpaceOld">{{ $t('userCenterOld') }}</DropdownItem>-->
                  <DropdownItem name="changePass">{{ $t('changePass') }}</DropdownItem>
                  <DropdownItem name="logout" divided>{{ $t('logout') }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'220px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import shrinkableMenu from "../components/main-components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "../components/main-components/tags-page-opened.vue";
import breadcrumbNav from "../components/main-components/breadcrumb-nav.vue";
import fullScreen from "../components/main-components/fullscreen.vue";
import lockScreen from "../components/main-components/lockscreen/lockscreen.vue";
import messageTip from "../components/main-components/message-tip.vue";
import Cookies from "js-cookie";
import { logout,ws } from "@/api/sys";
import util from "@/libs/util.js";

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    messageTip
  },
  data() {
    return {
      shrink: false,
      username: "",
      userId: "",
      isFullScreen: false,
      loading:false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr
    };
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatarPath() {
      return this.$store.state.app.avatar;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    }
  },
  stompClient: {
    monitorIntervalTime: 100,
    stompReconnect: true,
    timeout(orgCmd) {}
  },
  methods: {
    init() {
      let pathArr = util.setCurrentPath(this, this.$route.name);
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.username = userInfo.username;
      this.userId = userInfo.id;
      this.checkTag(this.$route.name);
      //this.connectSrv();
    },
    onConnected(frame) {
       console.log("连接ws成功: " + frame);
      // 订阅广播系统通知
      this.$stompClient.subscribe(
        "/topic/subscribe",
        this.responseCallback,
        this.onFailed
      );
      // 订阅点对点 通过用户id指定用户
      this.$stompClient.subscribe(
        "/user/" + this.userId + "/queue/subscribe",
        this.responseCallback,
        this.onFailed
      );
    },
    onFailed(frame) {
      console.log("连接ws失败： " + JSON.stringify(frame));
    },
    connectSrv() {
      var headers = {};
      this.connetWM(ws, headers, this.onConnected, this.onFailed);
    },
    responseCallback(frame) {
       console.log("收到消息：" + frame.body);
      this.$Notice.open({
        title: '消息提醒',
        desc: frame.body,
        duration: 0
      });
    },
    disconnect() {
      this.disconnetWM();
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleLanDropdown(name) {
      localStorage.lang = name;
      this.$store.commit("switchLang", name);
    },
    handleClickUserDropdown(name) {
      if (name === "ownSpace") {
        util.openNewPage(this, "ownspace");
        this.$router.push({
          name: "ownspace"
        });
      }  else if (name === "changePass") {
        util.openNewPage(this, "change_pass");
        this.$router.push({
          name: "change_pass"
        });
      } else if (name === "logout") {
        // 退出登录
        this.$Modal.confirm({
          title: "确认退出",
          content: "您确认要退出系统?",
          onOk: () => {
            this.loading=true;
            logout({token:this.getStore('accessToken')}).then(res=>{
              if(res.success){
                this.loading=false;
                this.$Message.success(res.message);
                this.setStore('accessToken','')
                this.setStore('userInfo','')
                Cookies.remove('accessToken');
                this.$router.push({
                  name: "login"
                });
                this.$store.commit("clearOpenedSubmenu");
              }else{
                this.$Message.error("服务器发生错误，请联系管理员.....");
              }
            })
            this.loading=false;
          }
        });
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // console.log(name)
      return true;
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    }
  },
  watch: {
    $route(to) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    lang() {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    }
  },
  mounted() {
    this.init();
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
  }
};
</script>
