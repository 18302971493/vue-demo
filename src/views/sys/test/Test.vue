<style lang="less">
  @import "Test.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
            <Form ref="userForm" :model="userForm" :label-width="70" style="width: 50%">
              <FormItem label="用户名" prop="username">
                <Input v-model="userForm.username" autocomplete="off"/>
              </FormItem>
              <FormItem label="邮箱" prop="email">
                <Input v-model="userForm.email"/>
              </FormItem>
              <FormItem label="手机号" prop="mobile">
                <Input v-model="userForm.mobile"/>
              </FormItem>
              <FormItem label="性别" prop="sex">
                <RadioGroup v-model="userForm.sex">
                  <Radio v-for="(item, i) in dictSex" :key="i" :label="Number(item.value)">{{item.label}}</Radio>
                </RadioGroup>
              </FormItem>
              <Form-item label="头像" prop="avatar">
                <Poptip trigger="hover" title="图片预览" placement="right" width="350">
                  <Input v-model="userForm.avatar" placeholder="可直接填入网络图片链接" clearable/>
                  <div slot="content">
                    <img :src="userForm.avatar" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
                    <a @click="viewPic()" style="margin-top:5px;text-align:right;display:block">查看原图</a>
                  </div>
                </Poptip>
              </Form-item>
              <FormItem label="用户类型" prop="type">
                <Select v-model="userForm.type" placeholder="请选择">
                  <Option :value="0">普通用户</Option>
                  <Option :value="1">管理员</Option>
                </Select>
              </FormItem>
              <FormItem label="区域" prop="type">
               <area-select v-model="address" @on-change="changeAddress" level="3" searchable/>
              </FormItem>
              <!--<FormItem label="备注" >-->
                <!--<VueEditor path="/test/" :content="this.path" ref="editor"></VueEditor>-->
              <!--</FormItem>-->
            </Form>
            <div >
              <Button type="text" @click="cancelUser">取消</Button>
              <Button type="primary" :loading="submitLoading" @click="submit">提交</Button>
            </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import VueEditor from '@/views/editor/VueEditor.vue'
  import circleLoading from "../../../components/my-components/circle-loading";
  import areaSelect from "@/components/my-components/area-select";
  export default {
    name: "user-manage",
    components: {
      circleLoading,
      VueEditor,
      areaSelect
    },
    data() {
      return {
        accessToken: {},
        dpLoading: false, // 部门树加载
        loading: true,
        address:{"proId":463,"cityId":505,"countyId":509},
        path:"<img src=\"http://tx.haiqq.com/uploads/allimg/160824/1126355296-0.jpg\" style=\"max-width:100%;\"><br></p>",
        userForm: {
          sex: 1,
          type: 0,
          avatar: "http://tx.haiqq.com/uploads/allimg/160824/1126355296-0.jpg",
          roles: [],
          officeId: "",
          officeTitle: "",
          menuList: []
        },
        userFormValidate: {
          username: [
            {required: true, message: "账号不能为空", trigger: "blur"}
          ],
          mobile: [
            {required: true, message: "手机号不能为空", trigger: "blur"},
          ],
          email: [
            {required: true, message: "请输入邮箱地址"},
            {type: "email", message: "邮箱格式不正确"}
          ]
        },
        submitLoading: false,
        dictSex: []
      };
    },
    methods: {
      clearSelectDep() {
        this.userForm.officeId = "";
        this.userForm.officeTitle = "";
      },
      handleChangeDep(value, selectedData) {
        // 获取最后一个值
        if (value && value.length > 0) {
          this.searchForm.officeId = value[value.length - 1];
        } else {
          this.searchForm.officeId = "";
        }
      },
      changePage(v) {
        this.searchForm.pageNo = v;
        this.getUserList();
        this.clearSelectAll();
      },
      changePageSize(v) {
        this.searchForm.pageSize = v;
        this.getUserList();
      },
      changeAddress(data) {
        console.log(data)
        this.address=data
      },
      submit(){
        this.myeditor=this.$refs.editor.getHtml();
        this.$refs.editor.setHtml("<img src='http://tx.haiqq.com/uploads/allimg/160824/1126355296-0.jpg'/>")
        console.log(this.myeditor)
      },
      handleSearch() {
        this.searchForm.pageNo = 1;
        this.searchForm.pageSize = 10;
        this.getUserList();
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.searchForm.pageNo = 1;
        this.searchForm.pageSize = 10;
        this.selectDate = null;
        this.selectDep = [];
        this.searchForm.officeId = "";
        // 重新加载数据
        this.getUserList();
      },
      changeSort(e) {
        this.searchForm.sort = e.key;
        this.searchForm.order = e.order;
        if (e.order === "normal") {
          this.searchForm.order = "";
        }
        this.getUserList();
      },

      cancelUser() {
        this.userModalVisible = false;
      },
      viewPic() {
        this.viewImage = true;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: "不支持的文件格式",
          desc:
            "所选文件‘ " +
            file.name +
            " ’格式不正确, 请选择 .jpg .jpeg .png .gif格式文件"
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "文件大小过大",
          desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
        });
      },
      beforeUpload() {
        // if (!this.$route.meta.permTypes.includes("upload")) {
        //   this.$Message.error("此处您没有上传权限(为演示功能，该按钮未配置隐藏)");
        //   return false;
        // }
        return true;
      },
      handleSuccess(res, file) {
        if (res.success === true) {
          file.url = res.result.filePath;
          this.userForm.avatar = res.result.filePath;
        } else {
          this.$Message.error(res.message);
        }
      },
      handleError(error, file, fileList) {
        this.$Message.error(error.toString());
      },

      dropDown() {
        if (this.drop) {
          this.dropDownContent = "展开";
          this.dropDownIcon = "ios-arrow-down";
        } else {
          this.dropDownContent = "收起";
          this.dropDownIcon = "ios-arrow-up";
        }
        this.drop = !this.drop;
      },
      showSelect(e) {
        this.exportData = e;
        this.selectList = e;
        this.selectCount = e.length;
      },
      clearSelectAll() {
        this.$refs.table.selectAll(false);
      },
    },
    mounted() {
    }
  };
</script>
