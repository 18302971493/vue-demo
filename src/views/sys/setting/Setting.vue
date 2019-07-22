<style lang="less">
  @import "./Setting.less";
</style>
<template>
  <div>
    <Card>
      <Tabs v-model="tabName" :animated="false" style="overflow: visible">
        <TabPane label="文件对象存储配置" name="oss">
          <div style="position:relative">
            <Form
                    ref="ossForm"
                    :model="oss"
                    :label-width="110"
                    label-position="right"
                    :rules="ossValidate"
            >
              <FormItem label="服务提供商：" prop="serviceName">
                <Select v-model="oss.serviceName" @on-change="changeOss" placeholder="请选择" style="width: 200px">
                  <Option value="LOCAL_OSS">本地服务器</Option>
                  <Option value="QINIU_OSS">七牛云</Option>
                </Select>
              </FormItem>
              <div v-if="oss.serviceName!='LOCAL_OSS'">
                <FormItem label="accessKey：" prop="accessKey">
                  <Input type="text" v-model="oss.accessKey" placeholder="请输入accessKey" style="width: 350px"/>
                </FormItem>
                <FormItem label="secretKey：" prop="secretKey">
                  <Tooltip placement="right" content="无法编辑时请先点击查看图标">
                    <Input class="input-see" type="text" v-model="oss.secretKey" :readonly="!changedOssSK" @on-click="seeSecret(oss.serviceName)" icon="ios-eye" placeholder="请输入secretKey" style="width: 350px"/>
                  </Tooltip>
                </FormItem>
                <FormItem v-if="oss.serviceName=='QINIU_OSS'" label="zone存储区域：" prop="zone">
                  <Select v-model="oss.zone" placeholder="请选择存储区域" style="width: 350px">
                    <Option :value="-1">自动判断</Option>
                    <Option :value="0">华东</Option>
                    <Option :value="1">华北</Option>
                    <Option :value="2">华南</Option>
                    <Option :value="3">北美</Option>
                    <Option :value="4">东南亚</Option>
                  </Select>
                </FormItem>
                <FormItem label="bucket空间：" prop="bucket">
                  <Input type="text" v-model="oss.bucket" placeholder="请输入bucket空间名" style="width: 350px"/>
                </FormItem>
                <FormItem label="endpoint域名：" prop="endpoint" :error="errorMsg">
                  <Input type="text" v-model="oss.endpoint" :placeholder="endpointPH" style="width: 350px">
                    <Select v-model="oss.http" slot="prepend" style="width: 80px" prop="http">
                      <Option value="http://">http://</Option>
                      <Option value="https://">https://</Option>
                    </Select>
                  </Input>
                </FormItem>
              </div>
              <div v-else>
                <FormItem label="存储磁盘路径：" prop="filePath" :error="errorMsg2">
                  <Input type="text" v-model="oss.filePath" placeholder="例如：D:/upload" style="width: 350px"/>
                </FormItem>
                <FormItem label="文件预览接口：" prop="endpoint" :error="errorMsg">
                  <Input type="text" v-model="oss.endpoint" placeholder="请输入文件预览接口" style="width: 350px">
                    <Select v-model="oss.http" slot="prepend" style="width: 80px" prop="http">
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
        <TabPane label="Vaptcha验证码" name="vaptcha">
          <div style="position:relative">
            <Form
                    ref="vaptchaForm"
                    :model="vaptcha"
                    :label-width="110"
                    label-position="right"
                    :rules="vaptchaValidate"
            >
              <FormItem label="VID：" prop="vid">
                <Input type="text" v-model="vaptcha.vid" placeholder="请输入验证单元VID" style="width: 350px"/>
              </FormItem>
              <FormItem label="secretKey：" prop="secretKey">
                <Tooltip placement="right" content="无法编辑时请先点击查看图标">
                  <Input class="input-see" type="text" v-model="vaptcha.secretKey" :readonly="!changedVaptchaSK" @on-click="seeSecret('VAPTCHA_SETTING')" icon="ios-eye" placeholder="请输入验证单元Key" style="width: 350px"/>
                </Tooltip>
              </FormItem>
              <FormItem>
                <Button type="primary" style="width: 100px;margin-right:5px" :loading="saveLoading" @click="saveEditVaptcha">保存更改</Button>
              </FormItem>
            </Form>
            <Spin fix v-if="loading"></Spin>
          </div>
        </TabPane>
        <TabPane label="移动支付" name="appPay">
          <div style="position:relative">
            <Form
                    ref="payForm"
                    :model="payForm"
                    :label-width="120"
                    label-position="right"
                    :rules="appPayValidate"
            >
              <FormItem label="支付方式：" prop="payType">
                <Select v-model="payForm.payType" @on-change="changePay" placeholder="请选择" style="width: 200px">
                  <Option value="aliPay">支付宝支付</Option>
                  <Option value="wxPay">微信支付</Option>
                  <Option value="wxPayProgram">微信小程序支付</Option>
                </Select>
              </FormItem>
              <FormItem label="支付方式名称：">
                <Input type="text" v-model="payForm.payTypeName"  style="width: 350px"/>
              </FormItem>
              <div v-if="payForm.payType=='wxPay'">
                <FormItem label="商户号：" prop="mchId">
                  <Input type="text" v-model="payForm.mchId"  style="width: 350px"/>
                </FormItem>
                <FormItem label="AppId：" prop="appId">
                  <Input type="text" v-model="payForm.appId"  style="width: 350px"/>
                </FormItem>
                <FormItem label="密钥(api key)：" prop="secretKey">
                  <Input type="text" v-model="payForm.secretKey"  style="width: 350px"/>
                </FormItem>
              </div>
              <div v-if="payForm.payType=='aliPay'">
                <FormItem label="合作伙伴id：" prop="partner">
                  <Input type="text" v-model="payForm.partner"  style="width: 350px"/>
                </FormItem>
                <FormItem label="卖家支付宝帐户：" prop="account">
                  <Input type="text" v-model="payForm.account"  style="width: 350px"/>
                </FormItem>
                <FormItem label="商户私钥：" prop="rsaPrivate">
                  <Input type="text" v-model="payForm.rsaPrivate"  style="width: 350px"/>
                </FormItem>
                <FormItem label="商户公钥：" prop="rsaPublic">
                  <Input type="text" v-model="payForm.rsaPublic"  style="width: 350px"/>
                </FormItem>
              </div>
              <div v-if="payForm.payType=='wxPayProgram'">
                <FormItem label="商户号：" prop="mchId">
                  <Input type="text" v-model="payForm.mchId"  style="width: 350px"/>
                </FormItem>
                <FormItem label="AppId：" prop="appId">
                  <Input type="text" v-model="payForm.appId"  style="width: 350px"/>
                </FormItem>
                <FormItem label="密钥(api key)：" prop="secretKey">
                  <Input type="text" v-model="payForm.secretKey"  style="width: 350px"/>
                </FormItem>
              </div>
              <FormItem label="备注：">
                <Input type="textarea" v-model="payForm.remark"  style="width: 350px"/>
              </FormItem>
              <FormItem>
                <Button type="primary" style="width: 100px;margin-right:5px" :loading="saveLoading" @click="saveEditPay">保存更改</Button>
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
  import {seeSecretSet, checkOssSet, getOssSet, editOssSet, getVaptchaSet, editVaptchaSet} from "@/api/sys";
  import {findByPayType, addPayConfig, deletePayConfig} from "@/api/pay";
  export default {
    name: "setting-manage",
    data() {
      return {
        tabName: "oss",
        loading: false, // 表单加载状态
        saveLoading: false,
        oss: {
          serviceName: "",
          accessKey: "",
          secretKey: "",
          endpoint: "",
          bucket: ""
        },
        payForm:{
          payType:'aliPay',
          payTypeName:'支付宝支付',
          mchId:'',
          appId:'',
          secretKey:'',
          remark:'',
          partner:'',
          account:'',
          rsaPrivate:'',
          rsaPublic:''
        },
        changedOssSK: false, // 是否修改oss的secrectKey
        errorMsg: "",
        errorMsg2: "",
        vaptcha: {
          vID: "",
          secretKey: ""
        },
        changedVaptchaSK: false, // 是否修改Vaptcha的secrectKey
        ossValidate: {
          // 表单验证规则
          serviceName: [{ required: true, message: "请选择", trigger: "blur" }],
          accessKey: [{ required: true, message: "不能为空", trigger: "blur" }],
          secretKey: [{ required: true, message: "不能为空", trigger: "blur" }],
          endpoint: [{ required: true, message: "不能为空", trigger: "blur" }],
          bucket: [{ required: true, message: "不能为空", trigger: "blur" }]
        },
        vaptchaValidate: {
          // 表单验证规则
          vID: [{ required: true, message: "不能为空", trigger: "blur" }],
          secretKey: [{ required: true, message: "不能为空", trigger: "blur" }]
        },
        appPayValidate:{
          payType:[{required:true,message:'支付类型不能为空',trigger:'blur'}],
          mchId:[{required:true,message:'商户号不能为空',trigger:'blur'}],
          appId:[{required:true,message:'appId不能为空',trigger:'blur'}],
          secretKey:[{required:true,message:'secretKey不能为空',trigger:'blur'}],
          partner:[{required:true,message:'合作伙伴id不能为空',trigger:'blur'}],
          account:[{required:true,message:'卖家账号不能为空',trigger:'blur'}],
          rsaPrivate:[{required:true,message:'商户私钥不能为空',trigger:'blur'}],
          rsaPublic:[{required:true,message:'商户公钥不能为空',trigger:'blur'}],
        },
        endpointPH: "请输入空间访问域名",
        dictBucketRegions: []
      };
    },
    methods: {
      init() {
        this.initOssSet();
        this.initVaptchaSet();
      },
      initOssSet() {
        this.loading = true;
        checkOssSet().then(res => {
          if (res.success && res.result) {
            let oss = res.result;
            getOssSet(oss).then(res => {
              this.loading = false;
              if (res.result) {
                // 转换null为""
                for (let attr in res.result) {
                  if (res.result[attr] === null) {
                    res.result[attr] = "";
                  }
                }
                this.oss = res.result;
              } else {
                this.changedOssSK = true;
              }
            });
          } else {
            this.loading = false;
            this.changedOssSK = true;
          }
        });
      },
      changePay(v){
        if(v=='wxPay'){
           this.payForm.payTypeName='微信移动支付';
        }else if(v=='aliPay'){
          this.payForm.payTypeName='支付宝支付';
        }else{
          this.payForm.payTypeName='微信小程序支付';
        }
        findByPayType(this.payForm.payType).then(res=>{
          if(res.success){
            if(res.result!=null){
              this.payForm=res.result
            }else{
              this.$refs.payForm.resetFields();
              this.payForm.remark=''
            }
             this.payForm.payType=v
          }
        })
      },
      changeOss(v) {
        if (v == "ALI_OSS") {
          this.endpointPH = "请输入EndPoint(地域节点) 非Bucket域名";
        } else if (v == "TENCENT_OSS") {
          this.endpointPH =
                  "请输入完整请求域名";
        } else {
          this.endpointPH = "请输入空间访问域名";
        }
        getOssSet(v).then(res => {
          if (res.result) {
            // 转换null为""
            for (let attr in res.result) {
              if (res.result[attr] === null) {
                res.result[attr] = "";
              }
            }
            this.oss = res.result;
            this.changedOssSK = false;
          } else {
            this.oss = { serviceName: v };
            if (this.oss.serviceName == "LOCAL_OSS") {
              this.oss.http = "http://";
              this.oss.endpoint = "127.0.0.1:8020/sys/file/view";
            }
            this.changedOssSK = true;
          }
        });
      },
      initVaptchaSet() {
        this.loading = true;
        getVaptchaSet().then(res => {
          this.loading = false;
          if (res.result) {
            // 转换null为""
            for (let attr in res.result) {
              if (res.result[attr] === null) {
                res.result[attr] = "";
              }
            }
            this.vaptcha = res.result;
          } else {
            this.changedVaptchaSK = true;
          }
        });
      },
      seeSecret(name) {
        if (!name) {
          return;
        }
        seeSecretSet(name).then(res => {
          if (res.success) {
            if (this.tabName == "oss") {
              this.oss.secretKey = res.result;
              this.changedOssSK = true;
            } else if (this.tabName == "vaptcha") {
              this.vaptcha.secretKey = res.result;
              this.changedVaptchaSK = true;
            }
          }
        });
      },
      saveEditPay(){
        this.saveLoading = true;
        this.$refs.payForm.validate(valid=>{
           if(valid){
             addPayConfig(JSON.stringify(this.payForm)).then(res=>{
               if(res.success){
                 this.saveLoading = false;
                 this.$Message.success("保存成功");
               }else{
                 this.saveLoading = false;
                 this.$Message.error(res.message);
               }
             })
           }
        })
      },
      saveEditOss() {
        if (this.oss.serviceName == "LOCAL_OSS") {
          if (!this.oss.http) {
            this.errorMsg = "请选择http协议";
            return;
          } else {
            this.errorMsg = "";
          }
          if (!this.oss.endpoint) {
            this.errorMsg = "请输入文件预览接口";
            return;
          } else {
            this.errorMsg = "";
          }
          if (!this.oss.filePath) {
            this.errorMsg2 = "请输入存储磁盘路径";
            return;
          } else {
            this.errorMsg2 = "";
          }
          editOssSet(this.oss).then(res => {
            this.saveLoading = false;
            if (res.success) {
              this.$Message.success("保存成功");
            }
          });
        } else {
          this.$refs.ossForm.validate(valid => {
            if (valid) {
              if (!this.oss.http) {
                this.errorMsg = "请选择http协议";
                return;
              } else {
                this.errorMsg = "";
              }
              this.saveLoading = true;
              this.oss.changed = this.changedOssSK;
              editOssSet(this.oss).then(res => {
                this.saveLoading = false;
                if (res.success) {
                  this.$Message.success("保存成功");
                }
              });
            }
          });
        }
      },
      saveEditVaptcha() {
        this.$refs.vaptchaForm.validate(valid => {
          if (valid) {
            this.saveLoading = true;
            this.vaptcha.changed = this.changedVaptchaSK;
            editVaptchaSet(this.vaptcha).then(res => {
              this.saveLoading = false;
              if (res.success) {
                this.$Message.success("保存成功");
              }
            });
          }
        });
      },
      saveEditOther() {
        this.$refs.otherForm.validate(valid => {
          if (valid) {
            this.saveLoading = true;
            editOtherSet(this.other).then(res => {
              this.saveLoading = false;
              if (res.success) {
                this.$Message.success("保存成功");
              }
            });
          }
        });
      }
    },
    mounted() {
      let name = this.$route.query.name;
      if (name) {
        this.tabName = name;
      }
      this.init();
    }
  };
</script>
