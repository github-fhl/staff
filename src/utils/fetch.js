import * as qs from 'querystring';
import {host} from '../common/config'

/**
 * easyfetch 重构的系统fetch。
 * @constructor
 * @param {string} url - 请求的地址.
 * @param {string} type - 请求的类型 get(默认) | post | put | delete.
 * @param {object} data - 发送到服务器的数据,如果type='get' 则追加的get url 后面.
 * @param {string} contentType -
 *        get 为: 'application/x-www-form-urlencoded; charset=UTF-8'
 *        其他请求为: 'application/json; charset=UTF-8'
 *        设置为false: 不设置任何请求头
 *
 */

function checkStatus(response) {

  if (!response.ok) {   // (response.status < 200 || response.status > 300)
    const error = new Error(response.statusText,-1);
    error.response = response;
    throw error;
  }
  return response;
}

function parseJSON(response) {
  return response.json();
}

function checkRsponseStatus(response) {
  if (response.status!='success') {   // (response.status < 200 || response.status > 300)
    let error = new Error(response.msg,response.code,response.flag);
    error.code=response.code;
    throw error;
  }
  return response;
}

export  function easyfetch(params){
  const defaultParams={
    host,
    type:'get'
  }

  // 合并参数
  if(params!==null && typeof params==='object'){
    params={...defaultParams,...params}
  }else if(typeof params==='string'){
    params={...defaultParams,url:params}
  }

  // headers
  let fetchHeaders=null;
  if(params.contentType!==false){
    if(params.type.toLowerCase()==='get'){
      fetchHeaders = {
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }else{
      fetchHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }
  }

  // fetch 代码
  let result;
  const fetchUrl=`${params.host}${params.url}`;
  switch (params.type.toLowerCase()) {
    case 'post':
    case 'put':
    case 'delete':
      const postParams={
        mode: 'cors',
        cache: 'default',
        method: params.type,
        credentials: 'include',
      };
      if(fetchHeaders){
        postParams.headers = fetchHeaders
        postParams.body = JSON.stringify(params.data)
      }else{
        postParams.body = params.data
      }
      result = fetch(fetchUrl, postParams)
      break;
    case 'get':
      let argstr="";
      if(params.data){
        argstr=qs.stringify(params.data);
        if(argstr) {
          if (fetchUrl.indexOf('?') < 0) {
            argstr = "?" + argstr;
          }
          else {
            argstr = '&' + argstr;
          }
        }
      }
      const getParams={
        method: params.type,
        credentials: 'include',
      }
      if(fetchHeaders){
        getParams.headers = getParams
      }
      result = fetch(fetchUrl+argstr, getParams)
      break;
  }
  return result.then(checkStatus).then(parseJSON).then(checkRsponseStatus);
}