import ajax from '@/libs/axios';
import gbs from '../libs/constant';

/**
 * 获取分类列表数据
 * @param params
 */
export function getCategoryList(params){
  return ajax({
    method: 'get',
    params: params,
    url: gbs.SERVICE.base+"/category/list",
  });
}

export function addCategory(params){
  return ajax({
    method: 'post',
    data: params,
    url: gbs.SERVICE.base+"/category/save",
    headers:{"Content-Type":"application/json"}
  });
}

export function deleteCategory(id){
  return ajax({
    method: 'delete',
    url: gbs.SERVICE.base+`/category/delete/${id}`,
  });
}

export function editCategory(params){
  return ajax({
    method: 'put',
    url: gbs.SERVICE.base+`/category/edit`,
    params:params
  });
}
