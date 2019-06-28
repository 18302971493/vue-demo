<style lang="less">
@import "Setting.less";
</style>

<template>
    <div class="own-space">
        <Card>
            <Tabs :animated="false" @on-click="clickSetting">
              <TabPane label="文件对象存储配置" name="oss">
                <div style="position:relative">
                  <Form
                    ref="ossForm"
                    :model="ossForm"
                    :label-width="110"
                    label-position="right"
                    :rules="ossValidate"
                  >
                    <div>
                      <FormItem label="存储磁盘路径：" prop="filePath" :error="errorMsg2">
                        <Input type="text" v-model="ossForm.filePath" placeholder="例如：D:/upload" style="width: 350px"/>
                      </FormItem>
                      <FormItem label="文件预览接口：" prop="endpoint" :error="errorMsg">
                        <Input type="text" v-model="ossForm.endpoint" placeholder="请输入文件预览接口" style="width: 350px">
                          <Select v-model="ossForm.http" slot="prepend" style="width: 80px" prop="http">
                            <Option value="http://">http://</Option>
                            <Option value="https://">https://</Option>
                          </Select>
                        </Input>
                      </FormItem>
                    </div>
                    <FormItem>
                      <Button type="primary" style="width: 100px;margin-right:5px" :loading="saveLoading" @click="saveEditOss">保存并启用</Button>
                    </FormItem>
                  </Form>
                  <Spin fix v-if="loading"></Spin>
                </div>
              </TabPane>
              <TabPane label="短信配置" name="sms">
                <div style="position:relative">
                  <Form
                    ref="smsForm"
                    :model="smsForm"
                    :label-width="110"
                    label-position="right"
                    :rules="smsValidate"
                  >
                    <FormItem label="服务提供商：" prop="serviceName">
                      <Select v-model="smsForm.serviceName" placeholder="请选择" style="width: 200px">
                        <Option value="ALI_SMS">阿里云</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="accessKey：" prop="accessKey">
                      <Input type="text" v-model="smsForm.accessKey" placeholder="请输入" style="width: 350px"/>
                    </FormItem>
                    <FormItem label="secretKey：" prop="secretKey">
                        <Input class="input-see" type="text" v-model="smsForm.secretKey"  placeholder="请输入" style="width: 350px"/>
                    </FormItem>
                    <FormItem label="短信签名：" prop="signName">
                      <Input type="text" v-model="smsForm.signName" placeholder="请输入短信签名，例如XBoot" style="width: 350px"/>
                    </FormItem>
                    <FormItem>
                      <Button type="primary" style="width: 100px;margin-right:5px" :loading="saveLoading" @click="saveEditSms">保存更改</Button>
                    </FormItem>
                  </Form>
                  <Spin fix v-if="loading"></Spin>
                </div>
              </TabPane>
              <TabPane label="邮件配置" name="email">
                <div style="position:relative">
                  <Form
                    ref="emailForm"
                    :model="emailForm"
                    :label-width="110"
                    label-position="right"
                    :rules="emailValidate"
                  >
                    <FormItem label="邮箱服务器：" prop="host">
                      <Input type="text" v-model="emailForm.host" placeholder="请输入邮箱服务器Host，例如QQ邮箱为smtp.qq.com" style="width: 350px"/>
                    </FormItem>
                    <FormItem label="发送邮箱账号：" prop="username">
                      <Input type="text" v-model="emailForm.username" placeholder="请输入发送者Email账号" style="width: 350px"/>
                    </FormItem>
                    <FormItem label="邮箱授权码：" prop="password">
                        <Input class="input-see" type="text" v-model="emailForm.password"   placeholder="请输入邮箱授权码，进入邮箱-设置中可找到" style="width: 350px"/>
                    </FormItem>
                    <FormItem>
                      <Button type="primary" style="width: 100px;margin-right:5px" :loading="saveLoading" @click="saveEditEmail">保存更改</Button>
                    </FormItem>
                  </Form>
                  <Spin fix v-if="loading"></Spin>
                </div>
              </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script>
export default {
  name: "setting",
  data() {
    return {
      form:{},
      errorMsg: "",
      errorMsg2: "",
      saveLoading:false,
      changedSmsSK: false,
      changedEmailPass: false,
      loading:false,
      ossForm: {
        filePath: "",
        endpoint: "",
        http: "",
      },
      emailForm: {
        host: "",
        username: "",
        password: ""
      },
      smsForm: {
        serviceName: "ALI_SMS",
        accessKey: "",
        secretKey: "",
        signName: "",
        type: ""
      },
      ossValidate: {
        // 表单验证规则
        filePath: [{ required: true, message: "不能为空", trigger: "blur" }],
        endpoint: [{ required: true, message: "不能为空", trigger: "blur" }],
        http: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      smsValidate: {
        // 表单验证规则
        serviceName: [{ required: true, message: "请选择", trigger: "blur" }],
        accessKey: [{ required: true, message: "不能为空", trigger: "blur" }],
        secretKey: [{ required: true, message: "不能为空", trigger: "blur" }],
        signName: [{ required: true, message: "不能为空", trigger: "blur" }],
        type: [{ required: true, message: "不能为空", trigger: "blur" }],
        templateCode: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      emailValidate: {
        // 表单验证规则
        host: [{ required: true, message: "不能为空", trigger: "blur" }],
        username: [{ required: true, message: "不能为空", trigger: "blur" }],
        password: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    init(type) {
      getSetting(type).then(res=>{
        if(res.success){
           if(res.result!=null){
             if(type==1){
               this.ossForm=JSON.parse(res.result.paramter)
             }else if(type==2){
               this.smsForm=JSON.parse(res.result.paramter)
             }else{
               this.emailForm=JSON.parse(res.result.paramter)
             }
           }
        }
      })
    },
    saveEditOss(){
      this.saveLoading=true
      this.$refs.ossForm.validate(valid=>{
        if(valid){
          addSetting({type:1,paramter:JSON.stringify(this.ossForm)}).then(res=>{
            if(res.result){
              this.$Message.success('操作成功');
              this.init(1)
            }
            this.saveLoading=false
          })
        }
      })
      this.saveLoading=false
    },
    saveEditSms(){
      this.saveLoading=true
      this.$refs.smsForm.validate(valid=>{
        if(valid){
          addSetting({type:2,paramter:JSON.stringify(this.smsForm)}).then(res=>{
            if(res.result){
              this.$Message.success('操作成功');
              this.init(2)
            }
            this.saveLoading=false
          })
        }
      })
      this.saveLoading=false
    },
    saveEditEmail(){
      this.saveLoading=true
      this.$refs.emailForm.validate(valid=>{
        if(valid){
          addSetting({type:3,paramter:JSON.stringify(this.emailForm)}).then(res=>{
            if(res.result){
              this.$Message.success('操作成功');
              this.init(3)
            }
            this.saveLoading=false
          })
        }
      })
      this.saveLoading=false
    },
    clickSetting(value){
      if(value=="oos"){
        this.init(1)
      }else if(value=="email"){
        this.init(3)
      }else{
        this.init(2)
      }
    }
  },
  mounted() {
     this.init(1)
  }
};
</script>
