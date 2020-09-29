<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <el-dialog
        v-dialogDrag
        title="密码重置"
        :visible.sync="dialogFormVisible"
        :close-on-press-escape="close_on_press_escape"
        :show-close="show_close"
        :close-on-click-modal="false"
        width="30%"
      >
        <el-form ref="password_reset" :model="password_entity" :rules="checkRules">
          <input type="password" name="username" style="position: absolute;left: -10000px;">
          <el-form-item label="原始密码" prop="oldPassword" :label-width="formLabelWidth">
            <el-input v-model="password_entity.oldPassword" autocomplete="off" type="password" show-password />
          </el-form-item>
          <input type="password" name="username" style="position: absolute;left: -10000px;">
          <el-form-item label="新密码" prop="password" :label-width="formLabelWidth">
            <el-input v-model="password_entity.password" autocomplete="off" type="password" show-password />
          </el-form-item>
          <input type="password" name="username" style="position: absolute;left: -10000px;">
          <el-form-item label="确认密码" prop="confirmPassword" :label-width="formLabelWidth">
            <el-input v-model="password_entity.confirmPassword" autocomplete="off" type="password" show-password />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updatePassword()">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { checkPasswordExpireTime, checkPasswordConfim, updatePassword } from '@/api/user'
import { queryByKey } from '@/api/param'
import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],

  data() {
    const validateOldPassward = (rule, value, callback) => {
      if (value != null && value !== '') {
        checkPasswordConfim(value).then(response => {
          if (response.data) {
            callback()
          } else {
            callback(new Error('原密码错误'))
          }
        }).catch(() => {
          callback(new Error('密码校验失败'))
        })
      } else {
        callback(new Error('请输入原密码'))
      }
    }
    const validatePassward = (rule, value, callback) => {
      if (value != null && value !== '') {
        if (value.length >= 6) {
          callback()
        } else {
          callback(new Error('密码长度不能低于6个字符'))
        }
      } else {
        callback(new Error('请输入新密码'))
      }
    }

    const validateConfirmPassword = (rule, value, callback) => {
      if (value != null) {
        if (value.length >= 6) {
          if (value === this.password_entity.password) {
            callback()
          } else {
            callback(new Error('两次输入的密码不一致'))
          }
        } else {
          callback(new Error('密码长度不能低于6个字符'))
        }
      } else {
        callback(new Error('请确认新密码'))
      }
    }
    return {
      dialogFormVisible: false,

      close_on_press_escape: false,
      show_close: false,
      formLabelWidth: '120px',
      key: 'password_expire_time',
      day: 7,
      password_entity: {
        oldPassword: null,
        password: null,
        confirmPassword: null
      },
      checkRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassward }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
        oldPassword: [{ required: true, trigger: 'blur', validator: validateOldPassward }]

      }
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),

    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    this.checkPassword()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },

    checkPassword() {
      queryByKey(this.key).then(response => {
        if (response.data != null && /^[1-9]\d*$/.test(response.data.paramValue)) {
          this.day = Number(response.data.paramValue)
        }

        this.checkExpireTime()
      }).catch(() => {
        this.$message.error('检查密码周期失败')
      })
    },

    checkExpireTime() {
      checkPasswordExpireTime(this.day).then(response => {
        this.dialogFormVisible = response.data
      }).catch(() => {

      })
    },

    updatePassword() {
      this.$refs.password_reset.validate((valid) => {
        if (valid) {
          updatePassword(this.password_entity).then(response => {
            this.dialogFormVisible = false
            this.$message.success('密码重置成功')
          }).catch(() => {
            this.dialogFormVisible = false
            this.$message.error('密码重置失败')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
