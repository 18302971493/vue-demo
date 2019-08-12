import ajax from '../libs/ajax';
import gbs from '../libs/constant';
import qs from 'qs'

/**
 * 获取合作伙伴列表数据
 * @param params
 */
export function getPartnerList(params){
    return ajax({
        method: 'get',
        params: params,
        url: gbs.SERVICE.health+"/organization/listPage",
    });
}

/**
 * 查询全部企业列表
 * @param params
 */
export function getOrganizationList(params){
    return ajax({
        method: 'get',
        params: params,
        url: gbs.SERVICE.health+"/organization/list",
    });
}

/**
 * 删除合作伙伴
 * @param ids
 * @param params
 */
export function removeOrganization(ids,params){
    return ajax({
        method: 'delete',
        url:gbs.SERVICE.health+`/organization/delByIds/${ids}`,
        params: params
    });
}

/**
 * 编辑合作伙伴
 * @param params
 */
export function updateOrganization(params){
    return ajax({
        method: 'post',
        url:gbs.SERVICE.health+'/organization/edit',
        params: params,
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }
    });
}

/**
 * 保存合作伙伴
 * @param params
 */
export function saveOrganization(params){
    return ajax({
        method: 'post',
        url:gbs.SERVICE.health+'/organization/save',
        params: params,
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }
    });
}

/**
 * 校验方法
 * @param params
 */
export function checkMethod(params) {
    return ajax({
        method: 'get',
        params: params,
        url: gbs.SERVICE.health+"/organization/checkMethod",
    });
}

/**
 * 查询门店列表
 * @param params
 */
export function getStoreList(params) {
    return ajax({
        method: 'get',
        params: params,
        url: gbs.SERVICE.health+"/store/list",
    });
}
/**
 * 新增门店
 * @param params
 */
export function saveStore(params){
    return ajax({
        method: 'post',
        url:gbs.SERVICE.health+'/store/save',
        params: params,
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }
    });
}

/**
 * 修改门店
 * @param params
 */
export function updateStore(params){
    return ajax({
        method: 'post',
        url:gbs.SERVICE.health+'/store/update',
        params: params,
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }
    });
}

/**
 * 删除门店
 * @param ids
 * @param params
 */
export function removeStore(ids,params){
    return ajax({
        method: 'delete',
        url:gbs.SERVICE.health+`/store/delByIds/${ids}`,
        params: params
    });
}
