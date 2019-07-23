<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card>
        <p slot="title" style="text-align: center;font-size: 16px;">
          <Icon type="ios-contact"></Icon>
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
                  <img :src="verifyCodeImg"  @click="getVerifyCode" alt="加载验证码失败" style="width:100%;cursor:pointer;display:block">
                </div>
              </Row>
            </FormItem>
            <!--<FormItem>-->
              <!--<div style="width: 100%;height: 36px;">-->
                <!--<div id="vaptchaContainer"></div>-->
                <!--<div v-if="loadingVaptcha" class="vaptcha-init-main">-->
                  <!--<div class="vaptcha-loading">-->
                    <!--<img src="@/assets/vaptcha-loading.gif" />-->
                    <!--<span class="vaptcha-text">Vaptcha启动中...</span>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
            <!--</FormItem>-->
            <FormItem>
              <Button @click="handleSubmit" :loading="loading" type="primary" size="large" long>
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
  import {login,userInfo,drawCodeImage,vaptchaID} from '../../api/sys'
  import util from "@/libs/util.js";
  var vaptchaObject;
  export default {
    data () {
      return {
        loading:false,
        loadingVaptcha: true,
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
              if(res.success){
                this.setStore("accessToken",res.result.accessToken);
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
              }else{
                this.getVerifyCode();
                this.loading = false;
              }
            })
          }
        });
      },
      initImage(){
        this.verifyCodeImg=drawCodeImage+this.captchaId
      },
      initVaptcha() {
        let that = this;
        vaptcha({
          //配置参数
          vid: vaptchaID, // 验证单元id
          type: "click", // 展现类型 点击式
          container: "#vaptchaContainer"
        }).then(function(vaptchaObj) {
          vaptchaObject = vaptchaObj;
          vaptchaObj.render(); // 加载验证按钮
          that.loadingVaptcha = false;
          vaptchaObj.listen("pass", function() {
            // 验证成功
            that.verified = true;
            that.form.token = vaptchaObj.getToken();
          });
        });
      },
      getVerifyCode(){
        this.captchaId=Math.random();
        this.initImage()
      },
    },
    mounted() {
      this.initImage();
      //this.initVaptcha()
    }
  };
</script>

<style>

</style>
