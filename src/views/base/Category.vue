<template>
  <div class="search">
    <!--<Card>-->
      <!--<Row>-->
        <!--<Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">-->
          <!--<Form-item label="用户名称" prop="username">-->
            <!--<Input type="text" clearable placeholder="请输入用户名" style="width: 200px"/>-->
          <!--</Form-item>-->
          <!--<Form-item label="用户名称" prop="username">-->
            <!--<Input type="text" clearable placeholder="请输入用户名" style="width: 200px"/>-->
          <!--</Form-item>-->
          <!--<Form-item label="用户名称" prop="username">-->
            <!--<Input type="text" clearable placeholder="请输入用户名" style="width: 200px"/>-->
          <!--</Form-item>-->
          <!--<Form-item style="margin-left:-35px;" class="br">-->
            <!--<Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>-->
            <!--<Button @click="handleReset">重置</Button>-->
          <!--</Form-item>-->
        <!--</Form>-->
      <!--</Row>-->
    <!--</Card>-->
    <Row class="operation">
      <Button @click="add" type="primary" icon="md-add">添加</Button>
    </Row>
    <tree-grid
      :items='dataList'
      :columns='columns'
      @on-row-click='rowClick'
      @on-selection-change='selectionClick'
      @on-sort-change='sortClick'
    ></tree-grid>
    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}">
      <Form ref="form" :model="form" :label-width="120" :rules="formValidate">
        <FormItem label="分类名称" prop="name">
          <Input v-model="form.name" autocomplete="off"/>
        </FormItem>
        <FormItem label="分类英文名称" prop="nameEn" >
          <Input  v-model="form.nameEn" autocomplete="off"/>
        </FormItem>
        <FormItem label="排序值" prop="orderIndex">
          <InputNumber :max="1000" :min="0" v-model="form.orderIndex"></InputNumber>
          <span style="margin-left:5px">值越小越靠前，支持小数</span>
        </FormItem>
        <FormItem label="是否一级分类">
          <i-switch size="large" v-model="isFirst" :true-value="0" :false-value="1">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <Form-item label="上级分类" prop="parentName" v-if="isFirst=='1'">
          <Poptip trigger="click" placement="right" title="选择分类">
            <div style="display:flex;">
              <Input v-model="form.parentName" readonly style="margin-right:10px;width: 250px;!important;"/>
              <Button icon="md-trash" @click="clearSelect">清空已选</Button>
            </div>
            <div slot="content" class="tree-bar">
              <Input v-model="searchKey" suffix="ios-search" @on-change="search" placeholder="输入分类名搜索" clearable/>
              <Tree :data="dataCategory" :load-data="loadDataTree" @on-select-change="selectTree"></Tree>
              <Spin size="large" fix v-if="treeLoading"></Spin>
            </div>
          </Poptip>
        </Form-item>
        <Form-item label="分类图片" prop="imageUrl">
          <Poptip trigger="hover" title="图片预览" placement="right" width="350">
            <Input v-model="form.imageUrl" placeholder="可直接填入网络图片链接" clearable style="width:250px;"/>
            <div slot="content">
              <img :src="form.imageUrl" alt="无效的图片链接" style="width:250px;!important;margin: 0 auto;display: block;">
              <a @click="viewPic()" style="margin-top:5px;text-align:right;display:block">查看原图</a>
            </div>
          </Poptip>
          <Upload :action="uploadFileUrl"
                  :headers="accessToken"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :format="['jpg','jpeg','png','gif']"
                  :max-size="5120"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="beforeUpload"
                  :show-upload-list="false"
                  ref="up"
                  class="upload">
            <Button icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </Form-item>
        <FormItem label="是否显示">
          <i-switch size="large" v-model="form.isShow" :true-value="0" :false-value="1">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submit">提交</Button>
      </div>
    </Modal>
    <Modal title="图片预览" v-model="viewImage" :styles="{top: '30px'}" draggable>
      <img :src="form.imageUrl" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
      <div slot="footer">
        <Button @click="viewImage=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import TreeGrid from '@/components/main-components/TreeGrid'
  import {getCategoryList,addCategory,deleteCategory,editCategory} from '../../api/base'
  export default {
    data() {
      return {
        accessToken: {},
        isFirst:1,
        uploadFileUrl: process.env.BASE_API+"/sys/common/upload/file",
        viewImage:false,
        modalVisible:false,
        submitLoading:false,
        treeLoading: false, // 部门树加载
        modalTitle:'编辑分类',
        searchKey: "",
        dataCategory: [],
        form:{
          name:'',
          nameEn:'',
          orderIndex:0,
          imageUrl:'',
          parentId:'',
          isShow:0,
          parentName:''
        },
        searchForm:{
          name:''
        },
        formValidate: {
          name: [
            {required: true, message: "分类名称不能为空", trigger: "blur"}
          ],
          nameEn: [
            {required: true, message: "请填写排序值", trigger: "blur"}
          ],
          nameEn: [
            {required: true, message: "请输入分类英文名称"}
          ],
          parentName:[
            {required:true,message:'请选择上级分类'}
          ]
        },
        viewPic() {
          this.viewImage = true;
        },
        columns: [ {
          title: 'id',
          key: 'id',
          align:"center",
          width: '150',
        }, {
          title: '名称',
          sortable: true,
          key: 'name',
          width: '150',
          align:"center"
        },
          {
            title: '是否显示',
            key:'showLabel',
            width:'150',
            align:'center'
          },
          {
            title: '排序',
            key:'orderIndex',
            width:'150',
            align:'center'
          },
          {
            title: '创建时间',
            key:'createTime',
            width:'150',
            align:'center'
          },
          {
            title: '操作',
            type: 'action',
            align:"center",
            actions: [{
              type: 'success',
              text: '编辑',
              actionsType:'edit'
            }, {
              type: 'error',
              text: '删除',
              actionsType:'delete'
            }],
            width: '150',
          }],
        dataList:[]
      }
    },
    components: {
      TreeGrid
    },
    methods: {
      rowClick(data, event,index,text,type) {
        this.form=data
        console.log(data)
        if(type=='edit'){
          if(data.parentId==0){
            this.isFirst=0
          }else{
            this.isFirst=1
          }
          this.modalVisible=true;
        }
        if(type=='delete'){
           this.remove(data.id);
        }
      },
      add(){
        this.modalTitle='添加分类'
        this.modalVisible=true
      },
      cancel(){
        this.modalVisible=false
      },
      submit(){
        this.$refs.form.validate(valid => {
          if(this.isFirst===0){
             this.form.parentId=0
             this.form.parentIds='0,'
          }
          if (valid) {
            this.submitLoading=true

            addCategory(this.form).then(res=>{
              if(res.success){
                this.$Message.success('操作成功')
                this.initData();
                this.initDataTree();
                this.form={}
                this.modalVisible=false
                this.submitLoading=false
              }else{
                this.$Message.error(res.message)
              }
            })
          }
        });
      },
      remove(id){
        this.$Modal.confirm({
          title:'是否删除',
          content:'您确定要删除吗?',
          okText:'确定',
          cancelText:'取消',
          onOk:function(){
            deleteCategory(id).then(res=>{
              if(res.success){
                this.$Message.success("删除成功");
                this.initData();
                this.initDataTree();
              }else{
                this.$Message.error(res.message)
              }
            })
          }
        })
      },
      search() {
        // 搜索部门
        if (this.searchKey) {
          this.treeLoading = true;
          getCategoryList({name:this.searchKey}).then(res=>{
            if (res.success === true) {
              res.result.forEach(function (e) {
                e.title=e.name
                if(e.children!=null&&e.children.length>0){
                  e.children.forEach(function(c){
                    c.title=c.name
                  })
                }
              });
              this.dataCategory = res.result;
            }
          })
        } else {
          this.initDataTree();
        }
      },
      clearSelect(){
        this.form.parentId=''
        this.form.parentName=''
      },
      loadDataTree(item, callback) {
        getCategoryList().then(res => {
          if (res.success === true) {
            res.result.forEach(function (e) {
              e.title=e.name
              if(e.children!=null&&e.children.length>0){
                e.children.forEach(function(c){
                  c.title=c.name
                })
              }
            });
            callback(res.result);
          }
        });
      },
      selectTree(v){
        if (v.length > 0) {
          // 转换null为""
          for (let attr in v[0]) {
            if (v[0][attr] === null) {
              v[0][attr] = "";
            }
          }
          let str = JSON.stringify(v[0]);
          let data = JSON.parse(str);
          this.form.parentId = data.id;
          this.form.parentIds=data.parentIds+data.id
          this.form.parentName = data.title;
        }
      },
      initDataTree() {
        getCategoryList().then(res => {
          if (res.success === true) {
            res.result.forEach(function (e) {
              e.title=e.name
              if(e.children!=null&&e.children.length>0){
                 e.children.forEach(function(c){
                   c.title=c.name
                 })
              }
            });
            this.dataCategory = res.result;
          }
        });
      },
      handleSuccess(res, file) {
        if (res.success === true) {
          file.url = res.result.filePath;
          this.form.imageUrl = res.result.filePath;
        } else {
          this.$Message.error(res.message);
        }
      },
      handleError(error, file, fileList) {
        this.$Message.error(error.toString());
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
        if (!this.$route.meta.permTypes.includes("upload")) {
          this.$Message.error("权限不足");
          return false;
        }
        return true;
      },
      selectionClick(arr) {
        console.log('选中数据id数组:' + arr)
      },
      sortClick(key, type) {
        console.log('排序字段:' + key)
        console.log('排序规则:' + type)
      },
      initData(){
        debugger
        getCategoryList(this.searchForm).then(res=>{
          if(res.success){
            this.dataList=res.result
          }
        })
      }
    },
    created(){
      this.initData();
      this.initDataTree();
    }
  }
</script>
<style lang="less">
  .search {
    .operation {
      margin-bottom: 2vh;
    }
    .select-count {
      font-size: 13px;
      font-weight: 600;
      color: #40a9ff;
    }
    .select-clear {
      margin-left: 10px;
    }
    .page{
      margin-top: 2vh;
    }
    .drop-down{
      font-size: 13px;
      margin-left: 5px;
    }
  }
</style>
