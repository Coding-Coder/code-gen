/*
注册全局方法
 */
import Vue from 'vue'
import axios from 'axios'
import ClipboardJS from 'clipboard'

// 创建axios实例
const client = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 60000 // 请求超时时间,60秒
})

Object.assign(Vue.prototype, {
  /**
   * 请求接口
   * @param uri uri
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
        errorCallback && errorCallback.call(that, resp)
        that.$message.error(resp.msg)
      }
    }).catch(function(error) {
      console.error(error)
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
  handleCommand: function(command) {
    command()
  },
  /**
   * 重置表单
   * @param formName 表单元素的ref
   */
  resetForm(formName) {
    const frm = this.$refs[formName]
    frm && frm.resetFields()
  },
  setAttr: function(key, val) {
    if (val === undefined) {
      val = ''
    }
    localStorage.setItem(key, val + '')
  },
  getAttr: function(key) {
    return localStorage.getItem(key)
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
  },
  initCopy: function() {
    const _this = this
    const clipboard = new ClipboardJS('.copyBtn')
    clipboard.on('success', function() {
      _this.tip('复制成功')
    })
    this.clipboard = clipboard
  },
  cleanCopy: function() {
    if (this.clipboard) {
      this.clipboard.destroy()
    }
  },
  /**
   *  文件必须放在public下面
   * @param path 相对于public文件夹路径，如文件在public/static/sign.md，填：static/sign.md
   * @param callback 回调函数，函数参数是文件内容
   */
  getFile: function(path, callback) {
    axios.get(path)
      .then(function(response) {
        callback.call(this, response.data)
      })
  },
  downloadText(filename, text) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }
})
