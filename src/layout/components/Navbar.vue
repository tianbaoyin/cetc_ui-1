<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div style=" position:fixed;top:10px;right:40%">
      <span style="color:red;font-size:26px">严禁处理涉密信息</span>
    </div>
    <div class="right-menu">
      <el-dropdown>
        <el-badge :value="countMsgUnRead" class="item">
          <el-button type="primary" icon="el-icon-message" style=" padding: 5px 5px" circle size="small" />
        </el-badge>

        <el-dropdown-menu slot="dropdown" style="width:250px">
          <el-dropdown-item disabled>你有{{ countMsgUnRead }}条消息</el-dropdown-item>
          <router-link to="/common/notice">
            <el-dropdown-item align="center">查看全部消息</el-dropdown-item>
          </router-link>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <span style="color:#2E8B57">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided command="out">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { countMsgUnRead } from '@/api/notice'
// import SockJS from 'sockjs-client'
// import Stomp from 'webstomp-client'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      countMsgUnRead: 0,
      stompClient: '',
      timer: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name', // 用户名
      'username' // 登录名
    ])
  },
  mounted() {
    // if ('WebSocket' in window) {
    //   // this.initWebSocket()
    // } else {
    //   alert('当前浏览器 Not support websocket')
    // }
  },
  beforeDestroy: function() {
    // 页面离开时断开连接,清除定时器
    // this.disconnect()
    // clearInterval(this.timer)
  },
  created() {
    this.countMsgs()
  },
  methods: {
    handleCommand(command) {
      if (command === 'out') {
        this.logout()
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      await this.$store.dispatch('tagsView/delAllViews')
      this.$router.push(`/login`)
    },

    countMsgs() {
      countMsgUnRead().then(response => {
        this.countMsgUnRead = response.data
      }).catch(() => {

      })
    }
    // initWebSocket() {
    //   this.connection()
    //   const that = this
    //   // 断开重连机制,尝试发送消息,捕获异常发生时重连
    //   this.timer = setInterval(() => {
    //     try {
    //       that.stompClient.send('/app/test', 'sss', {})
    //     } catch (err) {
    //       console.log('断线了: ' + err)
    //       that.connection()
    //     }
    //   }, 5000)
    // },
    // connection() {
    //   // 指定要连接的服务端
    //   const socket = new SockJS('http://localhost:9205/endpoint-websocket')
    //   this.stompClient = Stomp.over(socket)
    //   this.stompClient.connect({}, (frame) => {
    //     // 指定本客户端的名称，服务端向客户端推送消息
    //     this.stompClient.subscribe('/chat/notice/' + this.username, (result) => {
    //       this.$notify.info({
    //         title: '消息',
    //         message: result.body
    //       })
    //     })
    //     // 指定本客户端的名称，服务端向客户端推送消息
    //     this.stompClient.subscribe('/chat/nums/' + this.username, (result) => {
    //       this.countMsgUnRead = result.body
    //     })
    //   })
    // },
    // disconnect() {
    //   if (this.stompClient) {
    //     this.stompClient.disconnect()
    //   }
    // } // 断开连接
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
 .el-dropdown {
    vertical-align: bottom;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
