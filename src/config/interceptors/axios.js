import Vue from 'vue'
import router from '@/router'

var bus = new Vue()
export function requestSuccessFunc (requestObj) {
  console.info('requestInterceptorFunc', `url: ${requestObj.url}`, requestObj)
  // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
  // ...

  return requestObj
}

export function requestFailFunc (requestError) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  // ...
  return Promise.reject(requestError)
}

export function responseSuccessFunc (responseObj) {
  // 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
  // ...
  // 假设我们请求体为
  // {
  //     code: 1010,
  //     msg: 'this is a msg',
  //     data: null
  // }

  let resData = responseObj.data
  let { code } = resData

  switch (code) {
    case 200: // 如果业务成功，直接进成功回调
      return responseObj
    case 500:
      // 如果业务失败，根据不同 code 做不同处理
      // 比如最常见的授权过期跳登录
      // 特定弹窗
      // 跳转特定页面等
      bus.$bus.$emit('global.message.error', '系统异常 原因: ' + resData.msg)
      // location.href = xxx // 这里的路径也可以放到全局配置里
      return responseObj
    default:
      // 业务中还会有一些特殊 code 逻辑，我们可以在这里做统一处理，也可以下方它们到业务层
      // !responseObj.config.noShowDefaultError && GLOBAL.vbus.$emit('global.$dialog.show', resData.msg);
      return responseObj
  }
}

export function responseFailFunc (responseError) {
  // 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
  // ...
  let stauts = responseError.response.status

  switch (stauts) {
    case 401:
      bus.$bus.$emit('global.message.warning', '未登录请先登录')
      break
    case 403:
      bus.$bus.$emit('global.message.warning', responseError.response.data.msg)
      break
    case 200: break
    default:
      bus.$bus.$emit('global.message.error', '系统异常')
  }

  return Promise.reject(responseError)
}
