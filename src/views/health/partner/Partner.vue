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
                            <span v-if="drop">
                    <Form-item label="联系人电话" prop="mobile">
                      <Input type="text" v-model="searchForm.mobile" clearable placeholder="请输入联系人电话"
                             style="width: 200px"/>
                    </Form-item>
                  <Form-item label="医院等级" prop="hospitalLevel">
                    <Select v-model="searchForm.hospitalLevel" placeholder="请选择" clearable style="width: 200px">
                      <Option v-for="(item, i) in dictData" :key="i"
                              :value="item.value">{{item.label}}</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="项目自定义" prop="ifCustomize">
                    <Select v-model="searchForm.ifCustomize" placeholder="请选择" clearable style="width: 200px">
                      <Option value="1">支持</Option>
                      <Option value="2">不支持</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="状态" prop="state">
                    <Select v-model="searchForm.state" placeholder="请选择" clearable style="width: 200px">
                      <Option value="0">正常</Option>
                      <Option value="1">无效</Option>
                    </Select>
                  </Form-item>
                </span>
                            <Form-item style="margin-left:-35px;" class="br">
                                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handleReset">重置</Button>
                                <a class="drop-down" @click="dropDown">{{dropDownContent}}
                                    <Icon :type="dropDownIcon"></Icon>
                                </a>
                            </Form-item>
                        </Form>
                    </Row>
                    <Row class="operation">
                        <Button @click="add" type="primary" icon="md-add">添加</Button>
                        <Button @click="delAll" icon="md-trash">批量删除</Button>
                    </Row>
                    <Row>
                        <Alert show-icon>
                            已选择 <span class="select-count">{{selectCount}}</span> 项
                            <a class="select-clear" @click="clearSelectAll">清空</a>
                        </Alert>
                    </Row>
                    <Row>
                        <Table :loading="loading" border :columns="columns" :data="data" sortable="custom"
                               @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize"
                              @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]"
                              size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false' width="55%" :styles="{top: '30px'}">
            <Form ref="form" :model="form" :rules="ruleValidate" :label-width="120" inline>
                <FormItem label="统一社会信用代码" prop="businessLicenseCode" >
                    <Input v-model="form.businessLicenseCode" placeholder="请输入统一社会信用代码" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="企业类型" prop="type">
                    <Select v-model="form.type" placeholder="请选择" style="width: 330px;">
                        <Option :value="item.value" v-for="(item,index) in typeData" :key="index">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="企业全称" prop="fullName">
                    <Input v-model="form.fullName" placeholder="请输入企业全称" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="企业简称" prop="name">
                    <Input v-model="form.name" placeholder="请输入企业简称" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="体检项目自定义" prop="ifCustomize">
                    <RadioGroup v-model="form.ifCustomize" style="width: 330px;">
                        <Radio label="支持"></Radio>
                        <Radio label="不支持"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="医院等级" prop="hospitalLevel">
                    <Select v-model="form.hospitalLevel" placeholder="请选择" style="width: 330px;">
                        <Option value="1">一级甲等</Option>
                    </Select>
                </FormItem>
                <FormItem label="法人" prop="corporation">
                    <Input v-model="form.corporation" placeholder="请输入法人" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="联系人姓名" prop="linkMan">
                    <Input v-model="form.linkMan" placeholder="请输入联系人姓名" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="联系人电话" prop="mobile">
                    <Input v-model="form.mobile" placeholder="请输入联系人电话" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="开户行" prop="bankName">
                    <Input v-model="form.bankName" placeholder="请输入开户行" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="开户名称" prop="accountName">
                    <Input v-model="form.accountName" placeholder="请输入开户名称" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="开户账号" prop="accountNumber">
                    <Input v-model="form.accountNumber" placeholder="请输入开户账号" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="地区" style="width: 450px;" :error="errorMsg">
                    <area-select v-model="address" @on-change="changeAddress" level="3" searchable/>
                </FormItem>
                <FormItem label="详细地址" prop="addressDetail" >
                    <Input v-model="form.addressDetail" placeholder="请输入详细地址" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="企业标签" prop="tagList">
                    <CheckboxGroup v-model="form.tagList" @on-change="checkAllGroupChange" style="width: 330px;">
                        <Checkbox
                                :indeterminate="indeterminate"
                                :value="checkAll"
                                @click.prevent.native="handleCheckAll">全选</Checkbox>
                        <Checkbox :label="item.value" v-for="(item,index) in tagData" :key="index">{{item.label}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="折扣比例" prop="discount">
                    <InputNumber
                            :max="100"
                            v-model="form.discount"
                            :formatter="value => `${value}%`"
                            :parser="value => value.replace('%', '')" style="width: 330px"></InputNumber>
                </FormItem>
                <FormItem label="销售经理" prop="salesManager">
                    <Input v-model="form.salesManager" placeholder="请输入销售经理" style="width: 330px;"></Input>
                </FormItem>
                <FormItem label="合同附件" prop="contract" style="width: 330px;">
                    <Upload
                            :action="uploadFileUrl"
                            :headers="accessToken"
                    >
                        <Button icon="ios-cloud-upload-outline">点击上传</Button>
                    </Upload>
                </FormItem>
                <FormItem label="营业执照" prop="businessLicense">
                    <upload-pic-input v-model="form.businessLicense" @on-change="handleUploadFile" ref="uploadPic" width="220px"></upload-pic-input>
                </FormItem>
                <FormItem label="企业介绍">
                    <Input v-model="form.remarks" type="textarea" :rows="5" placeholder="企业介绍..." style="width: 800px" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button @click="modalVisible=false" style="margin-left: 8px">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {getPartnerList, remove,checkMethod} from "../../../api/health";
    import {findDictByType,uploadFile} from "../../../api/sys";
    import common from "../../../libs/common";
    import areaSelect from "@/components/my-components/area-select";
    import uploadPicInput from "@/components/own-space/upload-pic-input";
    export default {
        name: "Partner",
        components:{
            areaSelect,
            uploadPicInput
        },
        data() {
            const validateName = (rule, value, callback) => {
                checkMethod({name:value}).then(res=>{
                    if(res){
                        callback(new Error("机构简称【"+value+"】已存在"));
                    }else{
                        callback();
                    }
                })
            };
            const validateFullName = (rule, value, callback) => {
                checkMethod({fullName:value}).then(res=>{
                    if(res){
                        callback(new Error("机构全称【"+value+"】已存在"));
                    }else{
                        callback();
                    }
                })
            };
            const validateCode = (rule, value, callback) => {
                checkMethod({businessLicenseCode:value}).then(res=>{
                    if(res){
                        callback(new Error("统一社会信用代码【"+value+"】已存在"));
                    }else{
                        callback();
                    }
                })
            };
            return {
                loading: true,
                operationLoading: false,
                drop: false,
                accessToken:{},
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                selectCount: 0,
                address:{},
                uploadFileUrl:uploadFile,
                modalVisible:false,
                indeterminate: true,
                checkAll: false,
                errorMsg:'',
                tagList: [],
                modalTitle:'新增',
                searchForm: {
                    fullName: "",
                    linkMan: "",
                    mobile: "",
                    type: 0,
                    hospitalLevel: "",
                    ifCustomize: "",
                    state:0,
                    pageNo: 1,
                    pageSize: 10,
                    sort: "create_time",
                    order: "desc",
                },
                form: {
                    businessLicenseCode: '',
                    type: 0,
                    fullName: '',
                    name: '',
                    ifCustomize: '',
                    hospitalLevel: '',
                    corporation: '',
                    linkMan: '',
                    mobile:'',
                    bankName:'',
                    accountName:'',
                    accountNumber:'',
                    provinceId:'',
                    cityId:'',
                    countyId:'',
                    addressDetail:'',
                    discount:0,
                    salesManager:'',
                    contract:'',
                    businessLicense:'',
                    remarks:'',
                    tagList:[]

                },
                ruleValidate: {
                    businessLicenseCode: [
                        {required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
                        {validator: validateCode,required: true,  trigger: 'blur' }
                    ],
                    type: [
                        {required: true, message: '请选择企业类型', trigger: 'change'}
                    ],
                    fullName: [
                        {required: true, message: '请输入企业全称', trigger: 'blur'},
                        {validator: validateFullName,required: true,  trigger: 'blur' },
                    ],
                    name: [
                        {required: true, message: '请输入企业简称', trigger: 'blur'},
                        {validator: validateName,required: true,  trigger: 'blur' }
                    ],
                    ifCustomize: [
                        {required: true, message: '请选择是否支持自定义', trigger: 'change'}
                    ],
                    hospitalLevel: [
                        {required: true,  message: '请选择医院等级', trigger: 'change'}
                    ],
                    corporation: [
                        {required: true, message: '请输入法人', trigger: 'blur'}
                    ],
                    linkMan: [
                        {required: true, message: '请输入联系人', trigger: 'blur'},
                    ],
                    mobile: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                    ],
                    bankName: [
                        {required: true, message: '请输入开户行', trigger: 'blur'},
                    ],
                    accountName: [
                        {required: true, message: '请输入开户名称', trigger: 'blur'},
                    ],
                    accountNumber: [
                        {required: true, message: '请输入开户账号', trigger: 'blur'},
                    ],
                    addressDetail:[
                        {required: true, message: '请输入详细地址', trigger: 'blur'},
                    ],
                    discount:[
                        {required: true, type:'number',message: '请输入折扣比例', trigger: 'change'},
                    ],
                    salesManager:[
                        {required: true,type:'number', message: '请输入客户经理', trigger: 'blur'},
                    ],
                    contract:[
                        {required: true, message: '请上传合同附件', trigger: 'blur'},
                    ],
                    businessLicense:[
                        {required: true, message: '请上传营业执照', trigger: 'blur'},
                    ],
                    tagList:[
                        { required: true, type: 'array', min: 1, message: '请选择企业标签', trigger: 'change' },
                    ]
                },
                columns: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center",
                        fixed: "left"
                    },
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
                        width: 160
                    },
                    {
                        title: "企业类型",
                        key: "type",
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
                        title: "状态",
                        key: "state",
                        align: "center",
                        width: 140,
                        render: (h, params) => {
                            let re = "";
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
                        },
                        filters: [
                            {
                                label: "有效",
                                value: 0
                            },
                            {
                                label: "无效",
                                value: 1
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            if (value === 0) {
                                return row.state === 0;
                            } else if (value === 1) {
                                return row.state === 1;
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
                dictData: [],
                tagData:[],
                typeData:[],
            };
        },
        methods: {
            init() {
                this.getList();
                this.getDictData();
                this.getTagData();
                this.getTypeData();
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
            },
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;
                if (this.checkAll) {
                    this.tagData.forEach(obj=>{
                        this.form.tagList.push(obj.value)
                    })
                } else {
                    this.form.tagList = [];
                }
            },
            changePage(v) {
                this.searchForm.pageNo = v;
                this.getList();
            },
            checkAllGroupChange (data) {
                if (data.length === 3) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            handleSubmit () {
                if(common.isObjectNull(this.address)){
                    this.errorMsg='请选择地区';
                }else{
                    this.errorMsg="";
                }
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            changeAddress(v){
               this.address=v;
            },
            handleUploadFile(v){
                this.form.businessLicense=v;
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.getList();
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            add(){
                this.errorMsg=''
                this.$refs.form.resetFields();
                this.modalVisible=true;
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
            handleSearch() {
                this.searchForm.pageNo = 1;
                this.searchForm.pageSize = 10;
                this.getList();
            },
            handleReset() {
                this.$refs.searchForm.resetFields();
                this.searchForm.pageNo = 1;
                this.searchForm.pageSize = 10;
                this.selectDate = null;
                this.selectDep = [];
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
            remove(v) {
                if (v.id == '1') {
                    this.$Message.error("不能删除超级管理员");
                    return
                }
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除用户 " + v.username + " ?",
                    onOk: () => {
                        this.operationLoading = true;
                        deleteUser(v.id).then(res => {
                            this.operationLoading = false;
                            if (res.success === true) {
                                this.$Message.success("删除成功");
                                this.getUserList();
                            }
                        });
                    }
                });
            },
            getDictData() {
                // 获取企业类型字典数据
                findDictByType({type: 'organization_type'}).then(res => {
                    if (res.success) {
                        this.dictData = res.result
                    }
                })
            },
            getTagData() {
                // 获取企业标签数据
                findDictByType({type: 'organization_tag'}).then(res => {
                    if (res.success) {
                        this.tagData = res.result
                    }
                })
            },
            getTypeData() {
                // 获取企业标签数据
                findDictByType({type: 'organization_type'}).then(res => {
                    if (res.success) {
                        this.typeData = res.result
                    }
                })
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
                        this.selectList.forEach(function (e) {
                            ids += e.id + ",";
                        });
                        ids = ids.substring(0, ids.length - 1);
                        this.operationLoading = true;
                        remove(ids).then(res => {
                            this.operationLoading = false;
                            if (res.success === true) {
                                this.$Message.success("删除成功");
                                this.clearSelectAll();
                                this.getUserList();
                            }
                        });
                    }
                });
            },
            showSelect(e) {
                this.exportData = e;
                this.selectList = e;
                this.selectCount = e.length;
            },
        },
        mounted() {
            this.init();
        }
    };
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
    .drawer-footer{
        z-index: 10;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>
