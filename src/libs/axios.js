import axios from 'axios';
import { getStore, setStore } from './storage';
import { router } from '../router/index';
import { Message } from 'iview';
let base="/sparrow"
import qs from 'qs';
// 统一请求路径前缀
// 超时设定
var instance=axios.create({
  baseURL:base,
  withCredentials:true,
  timeout:5000000,
  paramsSerializer:function (params) {
    if(params){
      for(let item of Reflect.ownKeys(params)){
        if(typeof params[item] == 'object'){
          delete params[item]
        }
      }
    }
    return qs.stringify(params)
  }
});

instance.interceptors.request.use(config => {
  if(getStore('accessToken')){
    config.headers.common['Authorization'] = 'Bearer ' + getStore('accessToken')
  }
  return config;
}, err => {
  Message.error('请求超时');
  return Promise.resolve(err);
});

// http response 拦截器
instance.interceptors.response.use(response => {
  if(response.status==200){
    var data = response.data;
    switch (data.code) {
      case 401:
        // 未登录 清除已登录状态
        Message.error(data.message);
        setStore('userInfo', '');
        setStore('accessToken', '');
        if (router.history.current.name != "login") {
          if (data.message !== null) {
            Message.error(data.message);
          } else {
            Message.error("未知错误，请重新登录");
          }
          router.push('/login');
        }
        break;
      case 400:
        if(data.message!=null){
          Message.error(data.message)
        }else{
          Message.error("未知错误");
        }
        break;
      case 403:
        // 没有权限
        if (data.message !== null) {
          Message.error(data.message)
          router.push('/403');
        } else {
          Message.error("未知错误");
        }
        break;
      case 500:
        if (data.message !== null) {
          Message.error(data.message);
        } else {
          Message.error("未知错误");
        }
        break;
      default:
        return data;
    }
    return data;
  }else if(response.status==500){
    Message.error(response.message)
    router.push('/500');
  }
}, (err) => {
  var data=JSON.parse(err.response.data);
  // 返回状态码不为200时候的错误处理
  Message.error(data.message);
  return Promise.resolve(err);
});
export default instance;

