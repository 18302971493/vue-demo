<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="100" class="search-form">
                            <Form-item label="企业全称" prop="fullName">
                                <Input type="text" v-model="searchForm.fullName" clearable placeholder="请输入企业全称"
                                       style="width: 200px"/>
                            </Form-item>
                            <Form-item label="联系人姓名" prop="linkMan">
                                <Input type="text" v-model="searchForm.linkMan" clearable placeholder="请输入联系人姓名"
                                       style="width: 200px"/>
                            </Form-item>
                            <Form-item label="联系人电话" prop="mobile">
                                <Input type="text" v-model="searchForm.mobile" clearable placeholder="请输入联系人电话"
                                       style="width: 200px"/>
                            </Form-item>
                            <Form-item style="margin-left:-35px;" class="br">
                                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handleReset">重置</Button>
                            </Form-item>
                        </Form>
                    </Row>
                    <Row>
                        <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" ref="table"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize"
                              @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]"
                              size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false'  :styles="{top: '30px'}" width="70%" >
            <Row>
                <Form ref="searchForm" :model="itemSearchForm" inline :label-width="100" class="search-form">
                    <Form-item label="项目编码">
                        <Input type="text" v-model="itemSearchForm.fullName" clearable placeholder="请输入项目编码"
                               style="width: 200px"/>
                    </Form-item>
                    <Form-item label="项目名称">
                        <Input type="text" v-model="itemSearchForm.linkMan" clearable placeholder="请输入项目名称"
                               style="width: 200px"/>
                    </Form-item>
                    <Form-item style="margin-left:-35px;" class="br">
                        <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    </Form-item>
                </Form>
            </Row>
            <Row class="operation">
                <Button  type="primary" icon="md-add" @click="add">新增体检项目</Button>
                <Button type="primary" icon="ios-cloud-download" @click="download">下载项目模板</Button>
                <Upload style="display: inline-block" :action="uploadFileUrl" :headers="accessToken" :show-upload-list="false" :data="{organizationId:form.organizationId}"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :format="['xls','xlsx']"
                        accept=".xls, .xlsx"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="beforeUpload">
                 <Button  type="primary" icon="ios-cloud-upload">批量导入项目</Button>
                </Upload>
            </Row>
            <Row>
                <Table :loading="itemLoading" border :columns="itemColumns" :data="itemDataList" sortable="custom" ref="table"></Table>
            </Row>
            <Row type="flex" justify="end" class="page">
                <Page :current="itemSearchForm.pageNumber" :total="itemTotal" :page-size="itemSearchForm.pageSize"
                      @on-change="changeItemPage" @on-page-size-change="changeItemPageSize" :page-size-opts="[10,20,50]"
                      size="small" show-total show-elevator show-sizer></Page>
            </Row>
            <div slot="footer">
                <Button  type="primary" @click="modalVisible=false" style="margin-left: 8px">关闭</Button>
            </div>
        </Modal>
        <Modal
                :title="itemTitle"
                v-model="itemModalVisible"
                :closable="false" :mask-closable='false' :styles="{top: '30px'}">
            <Form ref="form" :model="form" :rules="ruleValidate" :label-width="120">
                <FormItem label="项目编码" prop="itemCode" >
                    <Input v-model="form.itemCode" placeholder="请输入项目编码"></Input>
                </FormItem>
                <FormItem label="项目名称" prop="itemName">
                    <Input v-model="form.itemName" placeholder="请输入项目名称"></Input>
                </FormItem>
                <FormItem label="价格" prop="itemPrice">
                    <InputNumber
                            :max="10000"
                            v-model="form.itemPrice" placeholder="请输入项目价格"
                            :formatter="value => `￥${value}`"
                            :parser="value => value.replace('￥', '')"></InputNumber>
                </FormItem>
                <FormItem label="临床意义" prop="itemDescribe">
                    <Input v-model="form.itemDescribe" type="textarea" :rows="5" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="itemSubmit">提交</Button>
                <Button style="margin-left: 8px" @click="itemModalVisible=false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {getPartnerList,getItemList,downLoadFile,uploadFile} from "../../../api/health";
    import gbs from '../../../libs/constant'
    export default {
        name: "Partner",
        data() {
            return {
                modal7: false,
                loading: true,
                itemLoading:true,
                selectCount: 0,
                defaultList:[],
                modalVisible:false,
                itemModalVisible:false,
                itemTitle:'新增项目',
                modalTitle:"配置体检项目",
                uploadFileUrl:uploadFile,
                accessToken:{},
                searchForm: {
                    fullName: "",
                    linkMan: "",
                    mobile: "",
                    pageNumber: 1,
                    state:0,
                    pageSize: 10,
                    sort: "create_time",
                    order: "desc",
                },
                itemSearchForm:{
                    itemCode:'',
                    itemName:'',
                    pageNumber: 1,
                    pageSize: 10,
                    sort: "create_time",
                    order: "desc",
                },
                form:{
                    itemName:'',
                    itemCode:'',
                    itemPrice:0.00,
                    itemDescribe:'',
                    organizationId:'',
                },
                ruleValidate: {
                    itemName: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                    ],
                    itemCode: [
                        {required: true, message: '请输入项目编码', trigger: 'blur'}
                    ],
                    itemPrice: [
                        {required: true, message: '请输入项目价格', trigger: 'blur'},
                    ],
                    itemDescribe: [
                        {required: true, message: '请输入临床意义', trigger: 'blur'},
                    ],
                },
                columns: [
                    {
                        type: "index",
                        width: 60,
                        align: "center",
                        fixed: "left"
                    },
                    {
                        title: "同一社会信用代码",
                        key: "businessLicenseCode",
                        width: 160,
                        sortable: true,
                        fixed: "left"
                    },
                    {
                        title: "企业全称",
                        key: "fullName",
                        width: 200
                    },
                    {
                        title: "企业类型",
                        key: "typeName",
                        width: 120
                    },
                    {
                        title: "联系人姓名",
                        key: "linkMan",
                        width: 115
                    },
                    {
                        title: "联系人电话",
                        key: "mobile",
                        width: 180,
                        sortable: true
                    },
                    {
                        title:'提供项目数',
                        key:'itemNum',
                        width:150,
                    },
                    {
                        title: "状态",
                        key: "state",
                        align: "center",
                        width: 140,
                        render: (h, params) => {
                            if (params.row.state === 0) {
                                return h("div", [
                                    h(
                                        "Tag",
                                        {
                                            props: {
                                                type: "dot",
                                                color: "success"
                                            }
                                        },
                                        "有效"
                                    )
                                ]);
                            } else if (params.row.state === 1) {
                                return h("div", [
                                    h(
                                        "Tag",
                                        {
                                            props: {
                                                type: "dot",
                                                color: "error"
                                            }
                                        },
                                        "无效"
                                    )
                                ]);
                            }
                        }
                    },
                    {
                        title: "状态时间",
                        key: "stateTime",
                        sortable: true,
                        sortType: "desc",
                        width: 150
                    },
                    {
                        title: "操作",
                        key: "action",
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.setItem(params.row);
                                            }
                                        }
                                    },
                                    "配置体检项目"
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
                                    "配置套餐分类"
                                )
                            ]);
                        }
                    }
                ],
                itemColumns:[
                    {
                        title: "id",
                        key: "id",
                        sortable: true,
                        align:'center'
                    },
                    {
                        title: "项目编码",
                        key: "itemCode",
                        align:'center'
                    },
                    {
                        title: "项目名称",
                        key: "itemName",
                        align:'center'
                    },
                    {
                        title: "价格",
                        key: "itemPrice",
                        width: 150
                    },
                    {
                        title: "临床意义",
                        key: "itemDescribe",
                        width: 150
                    },
                    {
                        title: "操作",
                        key: "action",
                        width: 200,
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
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
                total: 0,
                itemTotal:0,
                itemDataList:[],
                fileLoading:false,
            };
        },
        methods: {
            init() {
                this.getList();
                this.accessToken = gbs.accessToken;
            },
            add(){
                this.itemModalVisible=true;
            },
            itemSubmit(){
                this.$refs.form.validate((valid) => {
                    if (valid) {

                    }
                })
            },
            handleFormatError(file) {
                this.fileLoading = false;
                this.$Notice.warning({
                    title: "不支持的文件格式",
                    desc:
                        "所选文件‘ " +
                        file.name +
                        " ’格式不正确, 请选择 .jpg .jpeg .png .gif .bmp格式文件"
                });
            },
            handleMaxSize(file) {
                this.fileLoading = false;
                this.$Notice.warning({
                    title: "文件大小过大",
                    desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
                });
            },
            beforeUpload() {
                this.fileLoading = true;
                return true;
            },
            handleSuccess(res) {
                this.fileLoading = false;
                if (res.success) {
                    this.$Message.success(res.message);
                    this.getItemList();
                } else {
                    this.$Message.error(res.message);
                }
            },
            handleError(error) {
                this.fileLoading = false;
                this.$Message.error(error.toString());
            },
            changePage(v) {
                this.searchForm.pageNumber = v;
                this.getList();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.getList();
            },
            changeItemPage(v) {
                this.itemSearchForm.pageNumber = v;
                this.getItemList();
            },
            changeItemPageSize(v) {
                this.itemSearchForm.pageSize = v;
                this.getItemList();
            },
            getList() {
                // 多条件搜索用户列表
                this.loading = true;
                getPartnerList(this.searchForm).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.data = res.result.records;
                        this.total = res.result.total;
                    }
                });
            },
            /**
             * 下载文件
             */
            download(){
                downLoadFile().then(res=>{
                    const blob = new Blob([res], {
                        type: "application/vnd.ms-excel"
                    });
                    let fileName = "importItem.xls";
                    if ("download" in document.createElement("a")) {
                        const elink = document.createElement("a");
                        elink.download = fileName;
                        elink.style.display = "none";
                        elink.href = URL.createObjectURL(blob);
                        document.body.appendChild(elink);
                        elink.click();
                        URL.revokeObjectURL(elink.href); // 释放URL 对象
                        document.body.removeChild(elink);
                    } else {
                        navigator.msSaveBlob(blob, fileName);
                    }
                })
            },
            getItemList() {
                // 多条件搜索用户列表
                this.itemLoading = true;
                getItemList(this.itemSearchForm).then(res => {
                    this.itemLoading = false;
                    if (res.success === true) {
                        this.itemDataList = res.result.records;
                        this.total = res.result.total;
                    }
                });
            },
            handleSearch() {
                this.searchForm.pageNo = 1;
                this.searchForm.pageSize = 10;
                this.getList();
            },
            handleReset() {
                this.$refs.searchForm.resetFields();
                this.searchForm.pageNo = 1;
                this.searchForm.pageSize = 10;
                // 重新加载数据
                this.getList();
            },
            changeSort(e) {
                this.searchForm.sort = e.key;
                this.searchForm.order = e.order;
                if (e.order === "normal") {
                    this.searchForm.order = "";
                }
                this.getList();
            },
            setItem(v){
                this.modalVisible=true;
                this.getItemList();
                this.form.organizationId=v.id
            }
        },
        mounted() {
            this.init();
        }
    };
</script>
<style lang="less" scoped>
    .bm-view{
        width: 542px;
        height: 440px
    }
    .operation {
        margin-bottom: 2vh;
    }

</style>
