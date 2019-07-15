<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title" style="text-align: center;font-size: 16px;">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName"  size="large" clearable placeholder="请输入用户名" :maxlength="10"  />
            </FormItem>
            <FormItem prop="password">
              <Input v-model="form.password" type="password" size="large" clearable placeholder="请输入密码" :maxlength="10"  />
            </FormItem>
            <FormItem prop="imageCode">
              <Row type="flex" justify="space-between" style="align-items: center;overflow: hidden;flex-wrap: nowrap;">
                <Input v-model="form.imageCode" size="large" clearable placeholder="请输入验证码" :maxlength="10" class="input-verify" />
                <div style="position:relative;margin-left: 5px;">
                  <Spin v-if="loadingCode" fix></Spin>
                  <img :src="verifyCodeImg"  @click="getVerifyCode" alt="加载验证码失败" style="width:100px;cursor:pointer;display:block">
                </div>
              </Row>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" :loading="loading" type="primary" long>
                <span v-if="!loading">登录</span>
                <span v-else>登录中...</span>
              </Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import {login,userInfo,drawCodeImage,init,} from '../../api/sys'
  import util from "@/libs/util.js";
  export default {
    data () {
      return {
        loading:false,
        captchaId:Math.random(),
        loadingCode:false,
        verifyCodeImg:'',
        form: {
          userName: 'admin',
          password: '',
          imageCode:''
        },
        rules: {
          userName: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          imageCode: [
            {
              required: true,
              message: "图形验证码不能为空",
              trigger: "blur"
            }
          ],
        }
      };
    },
    methods: {
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            login({username:this.form.userName,password:this.form.password,code:this.form.imageCode,captchaId:this.captchaId}).then(res=>{
                 if(typeof(res.code)!='undefined'){
                    if(res.code!=200){
                       this.getVerifyCode();
                       this.loading = false;
                    }
                 }else {
                   this.setStore("accessToken",res.access_token);
                   userInfo().then(res => {
                     if (res.success) {
                       this.setStore("userInfo", res.result);
                       this.$store.commit("setAvatarPath", res.result.avatar);
                       // 加载菜单
                       util.initRouter(this);
                       this.$router.push({
                         name: "home_index"
                       });
                     } else {
                       this.loading = false;
                     }
                   });
                 }
            })
          }
        });
      },
      initImage(){
        this.verifyCodeImg=drawCodeImage+this.captchaId
      },
      getVerifyCode(){
        this.captchaId=Math.random();
        this.initImage()
      },
    },
    mounted() {
      this.initImage()
    }
  };
</script>

<style>

</style>
