<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row>
                        <Form ref="searchForm" :model="searchForm"   inline :label-width="100">
                            <Form-item label="门店名称" prop="storeName">
                                <Input type="text" v-model="searchForm.storeName" clearable placeholder="请输入门店名称"
                                       style="width: 200px"/>
                            </Form-item>
                            <Form-item label="联系电话"  prop="storeMobile">
                                <Input type="text" v-model="searchForm.storeMobile" clearable placeholder="请输入联系电话"
                                       style="width: 200px"/>
                            </Form-item>
                            <Form-item label="归属企业">
                                <Select v-model="searchForm.organizationId" placeholder="请选择" filterable clearable style="width: 200px">
                                    <Option v-for="(item,i) in data" :key="i"
                                            :value="item.id">{{item.name}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="状态" prop="state">
                                <Select v-model="searchForm.state" placeholder="请选择" clearable style="width: 200px">
                                    <Option value="0">正常</Option>
                                    <Option value="1">无效</Option>
                                </Select>
                            </Form-item>
                            <Form-item style="margin-left:-35px;" class="br">
                                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handleReset">重置</Button>
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
                        <Table :loading="loading" border :columns="columns" :data="dataList" sortable="custom"
                               @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNo" :total="total" :page-size="searchForm.pageSize"
                              @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]"
                              size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false' width="60%" :styles="{top: '30px'}">
            <Form ref="form" :model="form" :rules="ruleValidate" :label-width="120">
                <Row>
                    <Col :span="12">
                        <FormItem label="门店名称" prop="storeName" >
                            <Input v-model="form.storeName" placeholder="请输入门店名称"></Input>
                        </FormItem>
                        <FormItem label="归属企业" prop="organizationId">
                            <Select v-model="form.organizationId" placeholder="请选择" >
                                <Option :value="item.id" v-for="(item,index) in data" :key="index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="工作日" prop="workDay">
                            <Input v-model="form.workDay" placeholder="请输入工作日"></Input>
                        </FormItem>
                        <FormItem label="工作时间" prop="workTime">
                            <Input v-model="form.workTime" placeholder="请输入工作时间"></Input>
                        </FormItem>
                        <FormItem label="门店电话" prop="storeMobile">
                            <Input v-model="form.storeMobile" placeholder="请输入门店电话"></Input>
                        </FormItem>
                        <FormItem label="地区" :required="true" style="width: 450px;" :error="errorMsg">
                            <area-select v-model="address" @on-change="changeAddress" level="3" searchable/>
                        </FormItem>
                        <FormItem label="门店地址" prop="storeAddress" >
                            <Input v-model="form.storeAddress" placeholder="请输入详细地址"></Input>
                        </FormItem>
                        <FormItem label="经纬度">
                        <Row>
                            <Col :span="12">
                                <FormItem  prop="storeLongitude" >
                                    <Input v-model="form.storeLongitude"  ></Input>
                                </FormItem>
                            </Col>
                            <Col :span="12">
                                <FormItem  prop="storeLatitude" >
                                    <Input v-model="form.storeLatitude" ></Input>
                                </FormItem>
                            </Col>
                        </Row>
                        </FormItem>
                        <FormItem label="介绍图片" prop="storeIntroPicture">
                            <upload-pic-input v-model="form.storeIntroPicture" @on-change="handleUploadFile" ref="uploadPic"></upload-pic-input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <map-component v-model="location" height="450px;" @on-change="getMapInfo"></map-component>
                    </Col>
                </Row>
                <FormItem label="备注">
                    <Input v-model="form.remarks" type="textarea" :rows="5"  style="width: 800px" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit" :loading="submitLoading">提交</Button>
                <Button @click="modalVisible=false" style="margin-left: 8px">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {getStoreList, getOrganizationList,removeStore,saveStore,updateStore} from "../../../api/health";
    import {uploadFile} from "../../../api/sys";
    import {validateMobile} from '../../../libs/validate'
    import common from "../../../libs/common";
    import areaSelect from "@/components/my-components/area-select";
    import MapComponent from "@/components/my-components/Map-Component";
    import uploadPicInput from "@/components/own-space/upload-pic-input";
    export default {
        name: "StoreManage",
        components:{
            areaSelect,
            uploadPicInput,
            MapComponent
        },
        data() {
            return {
                loading: true,
                accessToken:{},
                selectCount: 0,
                address:{},
                uploadFileUrl:uploadFile,
                modalVisible:false,
                submitLoading:false,
                errorMsg:'',
                defaultList:[],
                fileName:'',
                modalTitle:'新增',
                modalType:1,
                location:{},
                searchForm: {
                    storeName: "",
                    storeMobile: "",
                    organizationId:'',
                    state:0,
                    pageNo: 1,
                    pageSize: 10,
                    sort: "create_time",
                    order: "desc",
                },
                form: {
                    storeName:'',
                    organizationId:'',
                    workDay:'',
                    workTime:'',
                    storeMobile:'',
                    provinceId:'',
                    cityId:'',
                    countyId:'',
                    storeAddress:'',
                    storeLongitude:'',
                    storeLatitude:'',
                    storeIntroPicture:''

                },
                ruleValidate: {
                    storeName: [
                        {required: true, message: '请输入门店名称', trigger: 'blur'},
                    ],
                    organizationId: [
                        {required: true, message: '请选择企业类型', trigger: 'change'}
                    ],
                    workDay: [
                        {required: true, message: '请输入工作日', trigger: 'blur'},
                    ],
                    workTime: [
                        {required: true, message: '请输入工作时间', trigger: 'blur'},
                    ],
                    storeMobile: [
                        {required: true, message: '请输入门店电话', trigger: 'change'},
                        {validator: validateMobile,required: true,  trigger: 'blur' }
                    ],
                    storeAddress: [
                        { required: true, message: '请输入详细地址', trigger: 'change'}
                    ],
                    storeIntroPicture:[
                        { required: true, message: '请上传介绍图片', trigger: 'change'}
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
                    },
                    {
                        title: "门店编码",
                        key: "id",
                        sortable: true,
                        align:'center'
                    },
                    {
                        title: "门店名称",
                        key: "storeName",
                        align:'center'
                    },
                    {
                        title: "归属企业",
                        key: "organizationName",
                        align:'center'
                    },
                    {
                        title: "状态",
                        key: "state",
                        align: "center",
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
                dataList: [],
                data:[],
                total: 0,
            };
        },
        methods: {
            init() {
                this.getList();
                this.getPartnerList();
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
            },
            changePage(v) {
                this.searchForm.pageNo = v;
                this.getList();
            },
            handleUploadFile(){

            },
            getPartnerList(){
                getOrganizationList().then(res=>{
                    if(res.success){
                        this.data=res.result;
                    }
                })
            },
            handleSubmit () {
                if(common.isObjectNull(this.address)){
                    this.errorMsg='请选择地区';
                }else{
                    this.errorMsg="";
                }
                this.submitLoading=true;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.submitLoading=false;
                        if(this.modalType==1){
                            delete this.form.id;
                            saveStore(this.form).then(res=>{
                                if(res.success){
                                    this.$Message.success('保存成功');
                                    this.submitLoading=false;
                                    this.modalVisible=false;
                                    this.getList();
                                }else{
                                    this.$Message.error('保存失败');
                                }
                            })
                        }else{
                            updateStore(this.form).then(res=>{
                                if(res.success){
                                    this.$Message.success('修改成功');
                                    this.submitLoading=false;
                                    this.modalVisible=false;
                                    this.getList();
                                }else{
                                    this.$Message.error('修改失败');
                                }
                            })
                        }
                    }
                    this.submitLoading=false;
                })
            },
            changeAddress(v){
                this.address=v;
                this.form.provinceId=v.proId;
                this.form.cityId=v.cityId;
                this.form.countyId=v.countyId;
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
            getMapInfo(v){
                this.form.storeLongitude=v.lng;
                this.form.storeLatitude=v.lat;
            },
            add(){
                this.errorMsg=''
                this.$refs.form.resetFields();
                this.modalType=1;
                this.modalVisible=true;
            },
            edit(v){
                this.modalTitle='修改';
                this.errorMsg=''
                this.$refs.form.resetFields();
                var str=JSON.stringify(v);
                this.form=JSON.parse(str);
                this.address={"proId":this.form.provinceId,"cityId":this.form.cityId,"countyId":this.form.countyId};
                this.location={lng:this.form.storeLongitude,lat:this.form.storeLatitude}
                this.modalType=2;
                this.modalVisible=true;
            },
            getList() {
                // 多条件搜索用户列表
                this.loading = true;
                getStoreList(this.searchForm).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.dataList = res.result.records;
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
            remove(v) {
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除门店 " + v.storeName + " ?",
                    onOk: () => {
                        removeStore(v.id).then(res => {
                            if (res.success === true) {
                                this.$Message.success("删除成功");
                                this.getList();
                            }
                        });
                    }
                });
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
                        removeStore(ids).then(res => {
                            if (res.success === true) {
                                this.$Message.success("删除成功");
                                this.clearSelectAll();
                                this.getList();
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

        },
    };
</script>
<style lang="less">
    .bm-view{
        width: 542px;
        height: 440px
    }
    .spanClass{
        color: #5cadff;
        cursor: pointer;
        font-size: 14px;
        margin-left: 15px;
    }
    .spanClass :hover{
        color: red;
    }
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
