<style lang="less">
    @import "User.less";
</style>
<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
                            <Form-item label="用户名称" prop="username">
                                <Input type="text" v-model="searchForm.username" clearable placeholder="请输入用户名"
                                       style="width: 200px"/>
                            </Form-item>
                            <Form-item label="部门" prop="department">
                                <Cascader v-model="selectDep" :data="department" :load-data="loadData"
                                          @on-change="handleChangeDep"
                                          change-on-select filterable placeholder="请选择或输入搜索部门"
                                          style="width: 200px"></Cascader>
                            </Form-item>
                            <span v-if="drop">
                <Form-item label="手机号" prop="mobile">
                  <Input type="text" v-model="searchForm.mobile" clearable placeholder="请输入手机号"
                         style="width: 200px"/>
                </Form-item>
                  <Form-item label="邮箱" prop="email">
                    <Input type="text" v-model="searchForm.email" clearable placeholder="请输入邮箱"
                           style="width: 200px"/>
                  </Form-item>
                  <Form-item label="性别" prop="sex">
                    <Select v-model="searchForm.sex" placeholder="请选择" clearable style="width: 200px">
                      <Option v-for="(item, i) in dictSex" :key="i"
                              :value="item.value">{{item.label}}</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="用户类型" prop="type">
                    <Select v-model="searchForm.type" placeholder="请选择" clearable style="width: 200px">
                      <Option value="0">普通用户</Option>
                      <Option value="1">管理员</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="用户状态" prop="status">
                    <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
                      <Option value="0">正常</Option>
                      <Option value="-1">禁用</Option>
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
                        <Button @click="add" type="primary" icon="md-add">添加用户</Button>
                        <Button @click="delAll" icon="md-trash">批量删除</Button>
                        <Dropdown @on-click="handleDropdown">
                            <Button>
                                更多操作
                                <Icon type="md-arrow-dropdown"/>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem name="refresh">刷新</DropdownItem>
                                <DropdownItem name="exportData">导出所选数据</DropdownItem>
                                <DropdownItem name="exportAll">导出全部数据</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <circleLoading v-if="operationLoading"/>
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
                        <Table :columns="exportColumns" :data="exportData" ref="exportTable"
                               style="display:none"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize"
                              @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]"
                              size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal :title="modalTitle" v-model="userModalVisible" :mask-closable='false' :width="500"
               :styles="{top: '30px'}">
            <Form ref="userForm" :model="userForm" :label-width="70" :rules="userFormValidate">
                <FormItem label="用户名" prop="username">
                    <Input v-model="userForm.username" autocomplete="off"/>
                </FormItem>
                <FormItem label="密码" prop="password" v-if="modalType===0" :error="errorPass">
                    <Input type="password" v-model="userForm.password" autocomplete="off"/>
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
                    <upload-pic-input v-model="userForm.avatar" @on-change="handleUploadFile" ref="uploadPic"></upload-pic-input>
                </Form-item>
                <Form-item label="所属部门" prop="officeTitle">
                    <!--<Poptip trigger="click" placement="right" title="选择部门">-->
                    <!--<div style="display:flex;">-->
                    <!--<Input v-model="userForm.officeTitle" readonly style="margin-right:10px;"/>-->
                    <!--<Button icon="md-trash" @click="clearSelectDep">清空已选</Button>-->
                    <!--</div>-->
                    <!--<div slot="content" class="tree-bar">-->
                    <!--<Input v-model="searchKey" suffix="ios-search" @on-change="searchDp" placeholder="输入部门名搜索"-->
                    <!--clearable/>-->
                    <!--<Tree :data="dataDep" :load-data="loadDataTree" @on-select-change="selectTree"></Tree>-->
                    <!--<Spin size="large" fix v-if="dpLoading"></Spin>-->
                    <!--</div>-->
                    <!--</Poptip>-->
                    <office-tree-choose @on-change="handleSelectDepTree" ref="depTree"></office-tree-choose>
                </Form-item>
                <FormItem label="用户类型" prop="type">
                    <Select v-model="userForm.type" placeholder="请选择">
                        <Option :value="0">普通用户</Option>
                        <Option :value="1">管理员</Option>
                    </Select>
                </FormItem>
                <FormItem label="角色分配" prop="roles">
                    <Select v-model="userForm.roles" multiple>
                        <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">
                            <div style="display:flex;flex-direction:column">
                                <span style="margin-right:10px;">{{ item.name }}</span>
                                <span style="color:#ccc;">{{ item.description }}</span>
                            </div>
                        </Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelUser">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
            </div>
        </Modal>
        <Modal title="图片预览" v-model="viewImage" :styles="{top: '30px'}" draggable>
            <img :src="userForm.avatar" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
            <div slot="footer">
                <Button @click="viewImage=false">关闭</Button>
            </div>
        </Modal>
        <Modal
                v-model="modalExportAll"
                title="确认导出"
                :loading="loadingExport"
                @on-ok="exportAll">
            <p>您确认要导出全部 {{total}} 条数据？</p>
        </Modal>
    </div>
</template>

<script>
    import {
        initDepartment,
        loadDepartment,
        getUserListData,
        getAlLRoleList,
        addUser,
        editUser,
        enableUser,
        disableUser,
        deleteUser,
        getAllUserData,
        uploadFile,
        findDictByType
    } from "../../../api/sys";
    import circleLoading from "../../../components/my-components/circle-loading";
    import uploadPicInput from "@/components/own-space/upload-pic-input";
    import officeTreeChoose from "@/components/own-space/office-tree-choose";

    export default {
        name: "user-manage",
        components: {
            circleLoading,
            uploadPicInput,
            officeTreeChoose
        },
        data() {
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error("密码长度不得小于6位"));
                } else {
                    callback();
                }
            };
            const validateMobile = (rule, value, callback) => {
                var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!reg.test(value)) {
                    callback(new Error("手机号格式错误"));
                } else {
                    callback();
                }
            };
            return {
                accessToken: {},
                uploadFileUrl: uploadFile,
                dpLoading: false, // 部门树加载
                loading: true,
                operationLoading: false,
                loadingExport: true,
                modalExportAll: false,
                drop: false,
                dropDownContent: "展开",
                dropDownIcon: "ios-arrow-down",
                selectCount: 0,
                selectList: [],
                viewImage: false,
                department: [],
                selectDep: [],
                dataDep: [],
                searchKey: "",
                searchForm: {
                    username: "",
                    officeId: "",
                    mobile: "",
                    email: "",
                    sex: "",
                    type: "",
                    status: "",
                    pageNo: 1,
                    pageSize: 10,
                    sort: "create_time",
                    order: "desc",
                },
                selectDate: null,
                modalType: 0,
                userModalVisible: false,
                modalTitle: "",
                userForm: {
                    sex: 1,
                    type: 0,
                    avatar: "",
                    roles: [],
                    officeId: "",
                    officeTitle: "",
                    menuList: []
                },
                userRoles: [],
                roleList: [],
                errorPass: "",
                userFormValidate: {
                    username: [
                        {required: true, message: "账号不能为空", trigger: "blur"}
                    ],
                    mobile: [
                        {required: true, message: "手机号不能为空", trigger: "blur"},
                        {validator: validateMobile, trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: "密码不能为空", trigger: "blur"},
                        {validator: validatePassword, trigger: "blur"}
                    ],
                    email: [
                        {required: true, message: "请输入邮箱地址"},
                        {type: "email", message: "邮箱格式不正确"}
                    ]
                },
                submitLoading: false,
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
                        title: "用户名",
                        key: "username",
                        width: 145,
                        sortable: true,
                        fixed: "left"
                    },
                    {
                        title: "头像",
                        key: "avatar",
                        width: 80,
                        align: "center",
                        render: (h, params) => {
                            return h("Avatar", {
                                props: {
                                    src: params.row.avatar
                                }
                            });
                        }
                    },
                    {
                        title: "所属部门",
                        key: "officeTitle",
                        width: 120
                    },
                    {
                        title: "手机",
                        key: "mobile",
                        width: 115,
                        sortable: true,
                        render: (h, params) => {
                            return h("span", params.row.mobile);
                        }
                    },
                    {
                        title: "邮箱",
                        key: "email",
                        width: 180,
                        sortable: true
                    },
                    {
                        title: "性别",
                        key: "sex",
                        width: 70,
                        align: "center",
                        render: (h, params) => {
                            let re = "";
                            this.dictSex.forEach(e => {
                                if (e.value == params.row.sex) {
                                    re = e.label;
                                }
                            });
                            return h("div", re);
                        }
                    },
                    {
                        title: "用户类型",
                        key: "type",
                        align: "center",
                        width: 100,
                        render: (h, params) => {
                            let re = "";
                            if (params.row.type === 1) {
                                re = "管理员";
                            } else if (params.row.type === 0) {
                                re = "普通用户";
                            }
                            return h("div", re);
                        }
                    },
                    {
                        title: "状态",
                        key: "status",
                        align: "center",
                        width: 140,
                        render: (h, params) => {
                            let re = "";
                            if (params.row.status === 0) {
                                return h("div", [
                                    h(
                                        "Tag",
                                        {
                                            props: {
                                                type: "dot",
                                                color: "success"
                                            }
                                        },
                                        "正常启用"
                                    )
                                ]);
                            } else if (params.row.status === -1) {
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
                            }
                        },
                        filters: [
                            {
                                label: "正常启用",
                                value: 0
                            },
                            {
                                label: "禁用",
                                value: -1
                            }
                        ],
                        filterMultiple: false,
                        filterMethod(value, row) {
                            if (value === 0) {
                                return row.status === 0;
                            } else if (value === -1) {
                                return row.status === -1;
                            }
                        }
                    },
                    {
                        title: "创建时间",
                        key: "createTime",
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
                            let enableOrDisable = "";
                            if (params.row.status == 0) {
                                enableOrDisable = h(
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
                                                this.disable(params.row);
                                            }
                                        }
                                    },
                                    "禁用"
                                );
                            } else if (params.row.status == -1) {
                                enableOrDisable = h(
                                    "Button",
                                    {
                                        props: {
                                            type: "success",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.enable(params.row);
                                            }
                                        }
                                    },
                                    "启用"
                                );
                            }
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
                                enableOrDisable,
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
                exportColumns: [
                    {
                        title: "用户名",
                        key: "username"
                    },
                    {
                        title: "头像",
                        key: "avatar"
                    },
                    {
                        title: "所属部门ID",
                        key: "officeId"
                    },
                    {
                        title: "所属部门",
                        key: "officeTitle"
                    },
                    {
                        title: "手机",
                        key: "mobile"
                    },
                    {
                        title: "邮箱",
                        key: "email"
                    },
                    {
                        title: "性别",
                        key: "sex"
                    },
                    {
                        title: "用户类型",
                        key: "type"
                    },
                    {
                        title: "状态",
                        key: "status"
                    },
                    {
                        title: "删除标志",
                        key: "delFlag"
                    },
                    {
                        title: "创建时间",
                        key: "createTime"
                    },
                    {
                        title: "更新时间",
                        key: "updateTime"
                    }
                ],
                data: [],
                exportData: [],
                total: 0,
                dictSex: []
            };
        },
        methods: {
            init() {
                this.initDepartmentData();
                this.getUserList();
                this.initDepartmentTreeData();
                this.getDictSexData();
            },
            handleSelectDepTree(v) {
                this.userForm.officeId = v[0];
                this.userForm.officeTitle = v[1];
            },
            initDepartmentData() {
                initDepartment().then(res => {
                    if (res.success === true) {
                        res.result.forEach(function (e) {
                            if (e.isParent) {
                                e.value = e.id;
                                e.label = e.title;
                                e.loading = false;
                                e.children = [];
                            } else {
                                e.value = e.id;
                                e.label = e.title;
                            }
                            if (e.status === -1) {
                                e.label = "[已禁用] " + e.label;
                                e.disabled = true;
                            }
                        });
                        this.department = res.result;
                    }
                });
            },
            initDepartmentTreeData() {
                initDepartment().then(res => {
                    if (res.success === true) {
                        res.result.forEach(function (e) {
                            if (e.isParent) {
                                e.loading = false;
                                e.children = [];
                            }
                            if (e.status === -1) {
                                e.title = "[已禁用] " + e.title;
                                e.disabled = true;
                            }
                        });
                        this.dataDep = res.result;
                    }
                });
            },
            loadData(item, callback) {
                item.loading = true;
                loadDepartment(item.value).then(res => {
                    item.loading = false;
                    if (res.success === true) {
                        res.result.forEach(function (e) {
                            if (e.isParent) {
                                e.value = e.id;
                                e.label = e.title;
                                e.loading = false;
                                e.children = [];
                            } else {
                                e.value = e.id;
                                e.label = e.title;
                            }
                            if (e.status === -1) {
                                e.label = "[已禁用] " + e.label;
                                e.disabled = true;
                            }
                        });
                        item.children = res.result;
                        callback();
                    }
                });
            },
            loadDataTree(item, callback) {
                loadDepartment(item.id).then(res => {
                    if (res.success === true) {
                        res.result.forEach(function (e) {
                            if (e.isParent) {
                                e.loading = false;
                                e.children = [];
                            }
                            if (e.status === -1) {
                                e.title = "[已禁用] " + e.title;
                                e.disabled = true;
                            }
                        });
                        callback(res.result);
                    }
                });
            },
            selectTree(v) {
                if (v.length > 0) {
                    // 转换null为""
                    for (let attr in v[0]) {
                        if (v[0][attr] === null) {
                            v[0][attr] = "";
                        }
                    }
                    let str = JSON.stringify(v[0]);
                    let data = JSON.parse(str);
                    this.userForm.officeId = data.id;
                    this.userForm.officeTitle = data.title;
                }
            },
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
            getUserList() {
                // 多条件搜索用户列表
                this.loading = true;
                getUserListData(this.searchForm).then(res => {
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
            getRoleList() {
                getAlLRoleList().then(res => {
                    if (res.success === true) {
                        this.roleList = res.result;
                    }
                });
            },
            handleDropdown(name) {
                if (name === "refresh") {
                    this.getUserList();
                } else if (name === "exportData") {
                    if (this.selectCount <= 0) {
                        this.$Message.warning("您还未选择要导出的数据");
                        return;
                    }
                    this.$Modal.confirm({
                        title: "确认导出",
                        content: "您确认要导出所选 " + this.selectCount + " 条数据?",
                        onOk: () => {
                            this.$refs.exportTable.exportCsv({
                                filename: "用户数据"
                            });
                        }
                    });
                } else if (name === "exportAll") {
                    this.modalExportAll = true;
                }
            },
            exportAll() {
                getAllUserData().then(res => {
                    this.modalExportAll = false;
                    if (res.success) {
                        this.exportData = res.result;
                        setTimeout(() => {
                            this.$refs.exportTable.exportCsv({
                                filename: "用户全部数据"
                            });
                        }, 1000);
                    }
                });
            },
            cancelUser() {
                this.userModalVisible = false;
            },
            submitUser() {
                this.$refs.userForm.validate(valid => {
                    if (valid) {
                        if (this.modalType === 0) {
                            // 添加用户 避免编辑后传入id
                            delete this.userForm.id;
                            delete this.userForm.status;
                            if (
                                this.userForm.password == "" ||
                                this.userForm.password == undefined
                            ) {
                                this.errorPass = "密码不能为空";
                                return;
                            }
                            if (this.userForm.password.length < 6) {
                                this.errorPass = "密码长度不得少于6位";
                                return;
                            }
                            this.submitLoading = true;
                            addUser(JSON.stringify(this.userForm)).then(res => {
                                this.submitLoading = false;
                                if (res.success === true) {
                                    this.$Message.success("操作成功");
                                    this.getUserList();
                                    this.userModalVisible = false;
                                }
                            });
                        } else {
                            this.submitLoading = true;
                            editUser(JSON.stringify(this.userForm)).then(res => {
                                this.submitLoading = false;
                                if (res.success === true) {
                                    this.$Message.success("操作成功");
                                    this.$store.commit("setAvatarPath", this.userForm.avatar);
                                    this.getUserList();
                                    this.userModalVisible = false;
                                }
                            });
                        }
                    }
                });
            },
            viewPic() {
                this.viewImage = true;
            },

            add() {
                this.modalType = 0;
                this.modalTitle = "添加用户";
                this.$refs.userForm.resetFields();
                this.userModalVisible = true;
            },
            edit(v) {
                if (v.id == '1') {
                    this.$Message.error("不能编辑超级管理员");
                    return
                }
                this.modalType = 1;
                this.modalTitle = "编辑用户";
                this.$refs.userForm.resetFields();
                let str = JSON.stringify(v);
                let userInfo = JSON.parse(str);
                this.userForm = userInfo;
                this.$refs.depTree.setData([this.userForm.officeId], this.userForm.officeTitle);
                this.$refs.uploadPic.setCurrentValue(this.userForm.avatar);
                let selectRolesId = [];
                this.userForm.roleList.forEach(function (e) {
                    selectRolesId.push(e.id);
                });
                this.userForm.roles = selectRolesId;
                this.userModalVisible = true;
            },
            enable(v) {
                if (v.id == '1') {
                    this.$Message.error("不能操作超级管理员");
                    return
                }
                this.$Modal.confirm({
                    title: "确认启用",
                    content: "您确认要启用用户 " + v.username + " ?",
                    onOk: () => {
                        this.operationLoading = true;
                        enableUser(v.id).then(res => {
                            this.operationLoading = false;
                            if (res.success === true) {
                                this.$Message.success("操作成功");
                                this.getUserList();
                            }
                        });
                    }
                });
            },
            disable(v) {
                if (v.id == '1') {
                    this.$Message.error("不能禁用超级管理员");
                    return
                }
                this.$Modal.confirm({
                    title: "确认禁用",
                    content: "您确认要禁用用户 " + v.username + " ?",
                    onOk: () => {
                        this.operationLoading = true;
                        disableUser(v.id).then(res => {
                            this.operationLoading = false;
                            if (res.success === true) {
                                this.$Message.success("操作成功");
                                this.getUserList();
                            }
                        });
                    }
                });
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
            getDictSexData() {
                // 获取性别字典数据
                findDictByType({type: 'gender'}).then(res => {
                    if (res.success) {
                        this.dictSex = res.result
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
            showSelect(e) {
                this.exportData = e;
                this.selectList = e;
                this.selectCount = e.length;
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            handleUploadFile(v){
               this.userForm.avatar=v;
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
                        deleteUser(ids).then(res => {
                            this.operationLoading = false;
                            if (res.success === true) {
                                this.$Message.success("删除成功");
                                this.clearSelectAll();
                                this.getUserList();
                            }
                        });
                    }
                });
            }
        },
        mounted() {
            this.init();
            this.getRoleList();
        }
    };
</script>
