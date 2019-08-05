import ajax from '@/libs/axios';
import gbs from '../libs/constant';


/**
 * 获取合作伙伴列表数据
 * @param params
 */
export function getPartnerList(params){
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
export function remove(ids,params){
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
export function edit(params){
    return ajax({
        method: 'post',
        url:gbs.SERVICE.health+'/organization/edit',
        params: params
    });
}

/**
 * 保存合作伙伴
 * @param params
 */
export function save(params){
    return ajax({
        method: 'post',
        url:gbs.SERVICE.health+'/organization/save',
        params: params
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
