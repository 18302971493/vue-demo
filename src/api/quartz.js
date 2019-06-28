import ajax from '@/libs/axios';
import gbs from '../libs/constant';
/**
 * 查询定时任务列表
 * @param params
 */
export function getQuartzListData(params){
  return ajax({
    method: 'get',
    url: gbs.SERVICE.sys+"/quartzJob/findQuartzJobPage",
    params: params
  });
}

/**
 * 添加定时任务
 * @param params
 */
export function addQuartz(params){
  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+"/quartzJob/addJob",
    data: params
  });
}

/**
 * 修改定时任务
 * @param params
 */
export function editQuartz(params){
  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+"/quartzJob/editJob",
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
export function deleteQuartz(ids){
  return ajax({
    method: 'delete',
    url: gbs.SERVICE.sys+`/quartzJob/deleteQuartz/${ids}`
  });
}

/**
 * 暂停定时任务
 * @param params
 * @param ids
 */
export function pauseQuartz(params){
  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+"/quartzJob/pauseJob",
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}

/**
 * 恢复定时任务
 * @param params
 */
export function resumeQuartz(params){
  return ajax({
    method: 'post',
    url: gbs.SERVICE.sys+"/quartzJob/resumeJob",
    data: params,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  });
}
