/**
 *  时间工具类
 *  @author lxy
 */

/** 日期格式 命名参考hutool工具类 */
var date_format = {
  /** 标准日期格式：yyyy-MM-dd */
  normDatePattern: "yyyy-MM-dd",
  /** 标准时间格式：hh:mm:ss */
  normTimePattern : "HH:mm:ss",
  /** 标准日期时间格式，精确到分：yyyy-MM-dd HH:mm */
  normDatetimeMinutePattern:"yyyy-MM-dd HH:mm",
  /** 标准日期时间格式，精确到秒：yyyy-MM-dd HH:mm:ss */
  normDatetimePattern:"yyyy-MM-dd HH:mm:ss",
  /** 标准日期时间格式，精确到毫秒：yyyy-MM-dd HH:mm:ss.SSS */
  normDatetimeMsPattern:"yyyy-MM-dd HH:mm:ss.SSS",
  /** 标准日期格式：yyyy年MM月dd日 */
  chineseDatePattern : "yyyy年MM月dd日",
  /** 标准日期格式：yyyyMMdd */
  pureDatePattern : "yyyyMMdd",
  /** 标准日期格式：HHmmss */
  pureTimePattern : "HHmmss",
  /** 标准日期格式：yyyyMMddHHmmss */
  pureDatetimePattern : "yyyyMMddHHmmss",
  /** 标准日期格式：yyyyMMddHHmmssSSS */
  pureDatetimeMsPattern : "yyyyMMddHHmmssSSS",
};

export default {
  /**
   * 当前时间，格式 yyyy-MM-dd HH:mm:ss
   *
   * @return 当前时间的标准形式字符串
   */
  now() {
    return new Date().format("yyyy-MM-dd HH:mm:ss");
  },
  /**
   * 格式化日期时间
   * 格式 yyyy-MM-dd HH:mm:ss
   *
   * @param date 被格式化的日期
   * @param format 格式化 参考 {@link date_format}
   * @return 格式化后的日期
   */
  formatDateTime(date,format) {
    if(format == undefined || format ==null ){
      format = "yyyy-MM-dd HH:mm:ss";
    }
    return date.format(format);
  },
  /**
   * 只支持毫秒级别时间戳，如果需要秒级别时间戳，请自行×1000
   *
   * @param timestamp 时间戳
   * @return 时间对象
   */
  date(timestamp) {
    return new Date(timestamp);
  },
  date_format
};

Date.prototype.format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "H+" : this.getHours(),                   //小时
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
};
