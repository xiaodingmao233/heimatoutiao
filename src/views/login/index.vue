<template>
  <div class="login-container">
    <el-form
      class="login-form"
      ref="login-form"
      :model="user"
      :rules="formRules"
      ><div class="login-head"></div>
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onLogin"
          :loading="loginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false
      },
      loginLoading: false,
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      this.$refs['login-form'].validate(valid => {
        if (!valid) {
          return
        }
        this.login()
      })
    },
    login () {
      this.loginLoading = true
      login(this.user).then((res) => {
        // console.log('登录成功', res)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.loginLoading = false
        // this.$router.push('/')
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        this.$router.push({
          name: 'home'
        })
      }).catch((err) => {
        console.log('登录失败', err)
        this.$message({
          message: '登录失败',
          type: 'error'
        })
        this.loginLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url(./login_bg.jpg) no-repeat;
  background-size: cover;
  .login-head {
    background: url(./logo_index.png) no-repeat;
    margin: 0 auto 30px;
    width: 260px;
    height: 57px;
  }
  .login-form {
    background-color: #fff;
    padding: 30px 50px 10px;
    min-width: 300px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>
