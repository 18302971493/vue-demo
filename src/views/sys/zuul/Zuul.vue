<style lang="less">
@import "Zuul.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="路由地址">
                <Input type="text" v-model="searchForm.name" clearable placeholder="请输入路由地址" style="width: 200px"/>
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset" >重置</Button>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="addZuul" type="primary" icon="md-add">添加路由</Button>
            <Button @click="delAll" icon="md-trash">批量删除</Button>
            <Button @click="init" icon="md-refresh">刷新</Button>
            <circleLoading v-if="operationLoading"/>
          </Row>
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="searchForm.pageNo" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- 编辑 -->
    <Modal :title="modalTitle" v-model="zuulModalVisible" :mask-closable='false' :width="500">
      <Form ref="zuulForm" :model="zuulForm" :label-width="120" :rules="formValidate">
        <FormItem label="路由地址" prop="path">
          <Input v-model="zuulForm.path"/>
        </FormItem>
        <FormItem label="服务id" prop="serviceId">
          <Input v-model="zuulForm.serviceId"/>
        </FormItem>
        <FormItem label="是否重试" >
          <i-switch size="large" v-model="zuulForm.retryable" :true-value="1" :false-value="0">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <FormItem label="是否启用" >
          <i-switch size="large" v-model="zuulForm.enabled" :true-value="1" :false-value="0">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <FormItem label="转发去掉前缀" >
          <i-switch size="large" v-model="zuulForm.stripPrefix" :true-value="1" :false-value="0">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  findListZuul,
  addZuul,
  updateZuul,
  deleteZuul
} from "@/api/sys";
import circleLoading from "@/components/my-components/circle-loading";
export default {
  name: "role-manage",
  components: {
    circleLoading
  },
  data() {
    return {
      loading: true,
      searchKey: "",
      sortColumn: "createTime",
      sortType: "desc",
      modalType: 0,
      modalTitle: "",
      operationLoading:false,
      zuulModalVisible:false,
      searchForm:{
        name:'',
        pageNo:1,
        pageSize: 10,
        sort: this.sortColumn,
        order: this.sort
      },
      formValidate: {
        path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }],
        serviceId: [{ required: true, message: "服务id不能为空", trigger: "blur" }]
      },
      zuulForm:{
        path:'',
        serviceId:'',
        retryable:1,
        enabled:1,
        stripPrefix:1
      },
      submitLoading: false,
      selectCount: 0,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "路由地址",
          key: "path",
          width: 150,
        },
        {
          title: "服务ID",
          key: "serviceId",
          width: 190
        },
        {
          title:"是否重试",
          key:"retryable",
          width: 150,
          render: (h, params) => {
            if (params.row.retryable === 1) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "error"
                    }
                  },
                  "否"
                )
              ]);
            } else if (params.row.retryable === 0) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "success"
                    }
                  },
                  "是"
                )
              ]);
            }
          },
        },
        {
          title:"是否启用",
          key:"enabled",
          width: 150,
          render: (h, params) => {
            if (params.row.enabled === 0) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "error"
                    }
                  },
                  "禁用"
                )
              ]);
            } else if (params.row.enabled === 1) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "success"
                    }
                  },
                  "启用"
                )
              ]);
            }
          },
        },
        {
          title:"转发去掉前缀",
          key:"stripPrefix",
          width: 150,
          render: (h, params) => {
            if (params.row.stripPrefix === 0) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "error"
                    }
                  },
                  "否"
                )
              ]);
            } else if (params.row.stripPrefix === 1) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "success"
                    }
                  },
                  "是"
                )
              ]);
            }
          },
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 160,
          sortable: true,
          sortType: "desc"
        },
        {
          title: "更新时间",
          key: "updateTime",
          width: 160,
          sortable: true
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 300,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    init() {
      this.getZuulList();
      // 获取所有菜单权限树
    },
    changePage(v) {
      this.pageNo = v;
      this.getZuulList();
      this.clearSelectAll();
    },
    handleSearch() {
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      this.getZuulList();
    },
    changeRetryable(status){
      this.zuulForm.retryable=status
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getZuulList();
    },
    changeSort(e) {
      this.sortColumn = e.key;
      this.sortType = e.order;
      if (e.order === "normal") {
        this.sortType = "";
      }
      this.getZuulList();
    },
    getZuulList() {
      this.loading = true;
      console.log(this.searchForm)
      findListZuul(this.searchForm).then(res => {
        this.loading = false;
        if (res.success === true) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    addZuul() {
      this.modalType = 0;
      this.modalTitle = "添加路由";
      this.$refs.zuulForm.resetFields();
      delete this.zuulForm.id;
      this.zuulModalVisible = true;
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑路由";
      let str = JSON.stringify(v);
      let zuulInfo = JSON.parse(str);
      this.zuulForm = zuulInfo;
      this.zuulModalVisible = true;
    },
    submit(){
      this.$refs.zuulForm.validate(valid => {
        if (valid) {
          if (this.modalType === 0) {
            // 添加
            this.submitLoading = true;
            addZuul(JSON.stringify(this.zuulForm)).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.getZuulList();
                this.zuulModalVisible = false;
              }
            });
          } else {
            this.submitLoading = true;
            updateZuul(JSON.stringify(this.zuulForm)).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.getZuulList();
                this.zuulModalVisible = false;
              }
            });
          }
        }
      });
    },
    cancel(){
      this.zuulModalVisible = false;
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除路由 " + v.path + "，删除后可能会影响系统使用?",
        onOk: () => {
          this.operationLoading = true;
          deleteZuul(v.id).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.getZuulList();
            }
          });
        }
      });
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      // 重新加载数据
      this.getUserList();
    },
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          this.operationLoading = true;
          deleteZuul(ids).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.clearSelectAll();
              this.getZuulList();
            }
          });
        }
      });
    },
  },
  mounted() {
    this.init();
  }
};
</script>
