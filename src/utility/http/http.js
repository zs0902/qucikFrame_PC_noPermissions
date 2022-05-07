import axios from "axios";
import store  from '@/store'
axios.defaults.timeout = 500000;
axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "/api";
axios.defaults.baseURL = "/"; // 前端自行mock配置
import AES from "../aes.js";

//http request 拦截器
axios.interceptors.request.use(
  (config) => {
    config.headers = {
      "Content-Type": "application/json",
      'token':store.state.token
    };
    //加密&&process.env.NODE_ENV=='production'
    if(config.url.indexOf('upload/file') == -1&&process.env.NODE_ENV=='production'){
      config.data = JSON.stringify(config.data)
      config.data = {'ciphertext': AES.encrypt(config.data, process.env.VUE_APP_AES_KEY)}
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  (response) => {
    // if(store.state.token){
    //   response.headers.common['token']=store.state.token
    // }
    if (response.data.code == 401) {
      redirecLoginUrl()
    }
    // 存在ciphertext表明返回结果已加密
    if(response.data.ciphertext){ 
         
      var result = JSON.parse(AES.decrypt(response.data.ciphertext,process.env.VUE_APP_AES_KEY))
      response.data = result 
    } 

    // 接口异常响应 全局统一处理
    // if(response.data.result && response.data.result.code=='system_error'){
    //   console.log('网络异常')
    //   window.confirm('系统开了一会儿小差，请稍后重试吧!')
    // }
        
    return response;
  },
 
  (err) => {
    console.log('http 响应异常:', err)
    if (err.response && err.response.status == 401) {
      redirecLoginUrl()
    }
    return Promise.reject(err);
  }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}, responseType) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        url, 
        {
            params: params,
            responseType: responseType
        }
      )
      .then((response) => {
        if (response.status == 200) {
          resolve(response.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}, header = {}) {
  // data = Qs.stringify(data)
  return new Promise((resolve, reject) => {
    axios.post(url, data, header).then(
      (response) => {
        // console.log("response",JSON.stringify(response),response)
        if (response.status == 200) {
          resolve(response.data);
        }
      },
      (err) => {
        // console.log("err",JSON.stringify(err),err)
        reject(err);
      }
    );
  });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      (response) => {
        if (response.status == 200) {
          resolve(response.data);
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  data = Qs.stringify(data);
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      (response) => {
        if (response.status == 200) {
          resolve(response.data);
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function del(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data).then(
      (response) => {
        if (response.status == 200) {
          resolve(response.data);
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
}

function redirecLoginUrl(){
  store.commit('del_token')
  window.location.href = process.env.VUE_APP_LOGIN_HOME_URL + "/Member/LoginOn?redirectUrl=" + encodeURI(window.location.origin)
}
