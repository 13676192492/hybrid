import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

service.defaults.headers = {
  "Content-Type": 'application/json',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
}


service.interceptors.request.use(
  config => {
    const url = config.url.replace(config.baseURL, '');

    // if (store.getters.token) {
    config.headers["Authorization"] = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjA2NDE3NzE3NTM2ODk0OTc2IiwibmFtZSI6IldXV1dXIiwiZXhwIjoxNTgzODI4MzA2fQ.k7MQww63zc3h4lNuUfAUcUxvtldkxQp4djObk0HUJ8g';
    //config.headers["Authorization"] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE1ODUwMzUzNjMsImV4cCI6MTU4NTExOTA1MiwiaXNzIjoiaHR0cHM6Ly91Y2xvdWQudGFpY2h1YW4ubmV0IiwiYXVkIjoidWhvbWUiLCJjbGllbnRfaWQiOiJ1aG9tZS5pb3MiLCJzdWIiOiIxMTk3NjgwNTE4MjgwNjU0ODQ4IiwiYXV0aF90aW1lIjoxNTg1MDM1MzYzLCJpZHAiOiJsb2NhbCIsInJvbGUiOiJVU0VSIiwibmFtZSI6IjEzNjAwMDAwMDA3IiwidGVuYW50X2lkIjoiMTAwMDAiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwidWhvbWUiLCJ1aG9tZS5vMm8iLCJ1aG9tZS5wYXJrIiwidWhvbWUucmtlIl0sImFtciI6WyJwd2QiXSwianRpIjoiNDQyOTU1N2QtYjM5NC00ZGUyLWE5ZDQtNTE2YjNjOWI4NGQ1IiwiaWF0IjoxNTg1MTE1NDUyfQ.gvZQOoGIHrTIbN_uWypS1GE8Wm66BWSSvC--uMbi4gk' ;

    // }

    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug

    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    // console.log('err' + error) // for debug

    return Promise.reject(error)
  }
)

export default service