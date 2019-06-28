// 统一请求路径前缀在libs/axios.js中修改
import ajax from '@/libs/axios';
import gbs from '../libs/constant';
let Base64 = require('js-base64').Base64;


let base="/sparrow"

// 文件上传接口
export const uploadFile =base+gbs.SERVICE.sys+"/common/upload/imageUpload"
// 验证码渲染图片接口
export const drawCodeImage = base+gbs.SERVICE.sys+"/code/"

export const ws = "http://www.maqueezu.com/sparrow/webSocketServer.do"
// 登陆
export function login(params){
  params.grant_type = gbs.oauth.grant_type;
  params.client_id = gbs.oauth.client_id;
  params.client_secret = gbs.oauth.client_secret;
  return ajax({
    method: 'post',
    url: "/auth/oauth/token",
    params: params,
    headers:{"Authorization":"Basic "+Base64.encode(gbs.oauth.client_id+":"+gbs.oauth.client_secret)}
  });
}
export function logout(params){
  return ajax({
    method: 'get',
    url: "/auth/logout",
    params: params
  });
}
export function getMenuList(params){

  return ajax({
    method: 'get',
    url:  gbs.SERVICE.sys+"/menus/getMenuList",
    params: params
  });
}
// 获取用户登录信息
export function userInfo(params){

  return ajax({
    method: 'get',
    url: "/auth/admin/user",
    params: params,
  });
}
// 发送短信验证码
export function sendSms(mobile){
  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+`/smsCode/${mobile}`
  });
}
// 短信验证码登录
export function smsLogin(params){
  params.grant_type = "mobile"
  params.client_id = gbs.oauth.client_id
  params.client_secret = gbs.oauth.client_secret
  return ajax({
    method: 'post',
    url: "/auth/oauth/token",
    params: params
  });
}
// IP天气信息
export function ipInfo(params){

  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+'/common/ip/info',
    params: params
  });
}
// 个人中心编辑
export function userInfoEdit(params){

  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+'/users/edit',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 个人中心修改密码
export function changePass(params){

  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+'/users/modifyPass',
    params: params
  });
}
// 解锁
export function unlock(params){

  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+'/users/unlock',
    params: params
  });
}
// 获取用户数据 多条件
export function getUserListData(params){

  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+'/users/getUserList',
    params: params,
    headers: {'Content-Type':'application/x-www-form-urlencoded'}
  });
}
// 获取全部用户数据
export function getAllUserData(params){

  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+'/users/getAll',
    params: params
  });
}
// 添加用户
export function addUser(params){

  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+'/users/admin/add',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 编辑用户
export function editUser(params){

  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+'/users/admin/edit',
    data: params,
    headers: {
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 启用用户
export function enableUser(id, params){

  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+`/users/admin/enable/${id}`,
    params: params
  });
}
// 禁用用户
export function disableUser(id, params){

  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+`/users/admin/disable/${id}`,
    params: params
  });
}
// 删除用户
export function deleteUser(id, params){

  return ajax({
    method: 'delete',
    url: gbs.SERVICE.sys+`/users/delByIds/${id}`,
    params: params
  });
}


// 获取一级部门
export function initDepartment(params){

  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+'/office/getByParentId/0',
    params: params
  });
}
// 加载部门子级数据
export function loadDepartment(id, params){

  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+`/office/getByParentId/${id}`,
    params: params
  });
}
// 添加部门
export function addDepartment(params){

  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+'/office/add',
    params: params
  });
}
// 编辑部门
export function editDepartment(params){

  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+'/office/edit',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 删除部门
export function deleteDepartment(ids,params){

  return ajax({
    method: 'delete',
    url: gbs.SERVICE.sys+`/office/delByIds/${ids}`,
    params: params
  });
}
// 搜索部门
export function searchDepartment(params){

  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+'/office/search',
    params: params
  });
}


// 获取全部角色数据
export function getAlLRoleList(params){

  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+'/role/getAllList',
    params: params
  });
}
// 分页获取角色数据
export function getRoleList(params){

  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+'/role/getAllByPage',
    params: params
  });
}
// 添加角色
export function addRole(params){

  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/role/save',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 编辑角色
export function editRole(params){

  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/role/edit',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 设为或取消注册角色
export function setDefaultRole(params){

  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/role/setDefault',
    params: params
  });
}
// 分配角色权限
export function editRolePerm(params){

  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/role/editRolePerm',
    params: params
  });
}
// 分配角色数据权限
export function editRoleDep(params){

  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/role/editRoleDep',
    params: params
  });
}
// 删除角色
export function deleteRole(ids,params){

  return ajax({
    method: 'delete',
    url:gbs.SERVICE.sys+`/role/delAllByIds/${ids}`,
    params: params
  });
}

// 获取全部字典
export function findDictList(params){

  return ajax({
    method: 'get',
    url:gbs.SERVICE.sys+'/dict/findDictList',
    params: params
  });
}
// 添加字典
export function addDict(params){

  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/dict/add',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 编辑字典
export function editDict(params){

  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/dict/edit',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 删除字典
export function deleteDict(ids){
  return ajax({
    method: 'delete',
    url:gbs.SERVICE.sys+`/dict/delByIds/${ids}`
  });
}

/**
 * 根据类型查询字典
 * @param params
 */
export function findDictByType(params){
  return ajax({
    method: 'get',
    url:gbs.SERVICE.sys+'/dict/findDictByType',
    params: params
  });
}
export function enableDict(params){
  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/dict/enableDict',
    params: params,
  });
}
// 通过类型获取字典数据

// 获取全部权限数据
export function getAllMenuList(params){
  return ajax({
    method: 'get',
    url:gbs.SERVICE.sys+'/menus/getAllList',
    params: params
  });
}
// 添加权限
export function addMenu(params){
  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/menus/add',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 编辑权限
export function editMenu(params){
  console.log(params)
  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/menus/edit',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
// 删除权限
export function deleteMenu(ids,params){
  return ajax({
    method: 'delete',
    url:gbs.SERVICE.sys+`/menus/delByIds/${ids}`,
    params: params
  });
}
// 搜索权限
export function searchMenu(params){

  return ajax({
    method: 'get',
    url:gbs.SERVICE.sys+'/menus/search',
    params: params
  });
}


// 分页获取日志数据
export function getLogListData(params){

  return ajax({
    method: 'get',
    url:gbs.SERVICE.sys+'/log/getAllByPage',
    params: params
  });
}
// 删除日志
export function deleteLog(ids){

  return ajax({
    method: 'delete',
    url:gbs.SERVICE.sys+`/log/delByIds/${ids}`
  });
}
// 清空日志
export function deleteAllLog(params){

  return ajax({
    method: 'delete',
    url:gbs.SERVICE.sys+'/log/delAll',
    params: params
  });
}

/**
 * 查询路由列表
 * @param params
 */
export function findListZuul(params) {
  return ajax({
    method: 'get',
    url:gbs.SERVICE.sys+'/zuul/findPage',
    params: params
  });
}

/**
 * 添加路由
 * @param params
 */
export function addZuul(params) {
  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/zuul/save',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}

/**
 * 更新路由
 * @param params
 */
export function updateZuul(params) {
  return ajax({
    method: 'post',
    url:gbs.SERVICE.sys+'/zuul/update',
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}

/**
 * 删除路由
 * @param ids
 */
export function deleteZuul(ids){
  return ajax({
    method: 'delete',
    url:gbs.SERVICE.sys+`/zuul/delAllByIds/${ids}`
  });
}
