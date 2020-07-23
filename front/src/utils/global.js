/*
注册全局方法
 */
import Vue from 'vue'
import axios from 'axios'

// 创建axios实例
const client = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 60000 // 请求超时时间,60秒
})

Object.assign(Vue.prototype, {
  /**
   * 请求接口
   * @param uri uri，如：goods.get,goods.get/1.0
   * @param data 请求数据
   * @param callback 成功时回调
   * @param errorCallback 错误时回调
   */
  post: function(uri, data, callback, errorCallback) {
    const that = this
    client.post(uri, data).then(function(response) {
      const resp = response.data
      const code = resp.code
      if (code === '0') { // 成功
        callback && callback.call(that, resp)
      } else {
        that.$message.error(resp.msg)
      }
    }).catch(function(error) {
      console.error('err' + error) // for debug
      errorCallback && errorCallback(error)
      that.$message.error(error.message)
    })
  },
  /**
   * tip，使用方式：this.tip('操作成功')，this.tip('错误', 'error')
   * @param msg 内容
   * @param type success / info / warning / error
   * @param stay 停留几秒，默认3秒
   */
  tip: function(msg, type, stay) {
    stay = parseInt(stay) || 3
    this.$message({
      message: msg,
      type: type || 'success',
      duration: stay * 1000
    })
  },
  /**
   * 提醒框
   * @param msg 消息
   * @param okHandler 成功回调
   * @param cancelHandler
   */
  confirm: function(msg, okHandler, cancelHandler) {
    const that = this
    this.$confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          okHandler.call(that, done)
        } else if (action === 'cancel') {
          if (cancelHandler) {
            cancelHandler.call(that, done)
          } else {
            done()
          }
        } else {
          done()
        }
      }
    }).catch(function() {})
  },
  /**
   * 重置表单
   * @param formName 表单元素的ref
   */
  resetForm(formName) {
    const frm = this.$refs[formName]
    frm && frm.resetFields()
  },
  logout: function() {
    const fullPath = this.$route.fullPath
    if (fullPath.indexOf('login?redirect') === -1) {
      this.$router.push({ path: `/login?redirect=${fullPath}` })
    }
  },
  goRoute: function(path) {
    this.$router.push({ path: path })
  },
  cellStyleSmall: function() {
    return { padding: '5px 0' }
  },
  headCellStyleSmall: function() {
    return { padding: '5px 0' }
  }
})
