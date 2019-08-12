import ajax from '@/libs/ajax';
import gbs from '../libs/constant';

/**
 * 根据支付类型获取支付信息
 * @param params
 */
export const findByPayType=(payType)=>{
  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+`/payConfig/findByPayType/${payType}`,
  });
}

/**
 * 添加支付信息
 * @param params
 */
export const  addPayConfig = (params) => {
  return ajax({
    method: 'post',
    data: params,
    url: gbs.SERVICE.sys+"/payConfig/add",
    headers:{"Content-Type":"application/json"}
  });
}

/**
 * 删除支付信息
 * @param id
 */
export const deletePayConfig=(id)=>{
  return ajax({
    method: 'delete',
    url: gbs.SERVICE.sys+`/payConfig/delete/${id}`,
  });
}

