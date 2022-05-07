import moment from 'moment/moment'
export default {

    /**
     * 格式化日期 
     * ---------------------------------------------------
     * @UTC bool date如果是UTC格式的日期类型，请将UTC=true
     */
    toString: function (date, format, UTC) {
        format = format || "yyyy-MM-dd HH:mm:ss";
        let o = {
            "M+": (UTC ? date.getUTCMonth() : date.getMonth()) + 1,
            "d+": UTC ? date.getUTCDate() : date.getDate(),
            "h+": UTC ? date.getUTCHours() : date.getHours(),
            "m+": UTC ? date.getUTCMinutes() : date.getMinutes(),
            "s+": UTC ? date.getUTCSeconds() : date.getSeconds(),
            "q+": Math.floor(((UTC ? date.getUTCMonth() : date.getMonth()) + 3) / 3),
            /*季度*/
            "S": UTC ? date.getUTCMilliseconds() : date.getMilliseconds(),
            "W": ["日", "一", "二", "三", "四", "五", "六"][date.getDay()]
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, ((UTC ? date.getUTCFullYear() : date.getFullYear()) + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },
    /**
     * 以字符串格式创建时间对象
     * 创建不出来，返回null
     * 支持:yyyy yyyy([-/]MM)([-/]dd)([ ]HH)([:]mm)([:]ss)
     */
    create: function (val) {

        let reg_yyyyMMddHHmmss = new RegExp("^(\\d{4})[-\/]?([0-1]\\d{1})[-\/]?([0-3]\\d{1})\\s*([0-2]\\d{1})[:]?([0-5]\\d{1})[:]?([0-5]\\d{1})$"),
            reg_yyyyMMddHHmm = new RegExp("^(\\d{4})[-\/]?([0-1]\\d{1})[-\/]?([0-3]\\d{1})\\s*([0-2]\\d{1})[:]?([0-5]\\d{1})$"),
            reg_yyyyMMddHH = new RegExp("^(\\d{4})[-\/]?([0-1]\\d{1})[-\/]?([0-3]\\d{1})\\s*([0-2]\\d{1})$"),
            reg_yyyyMMdd = new RegExp("^(\\d{4})[-\/]?([0-1]\\d{1})[-\/]?([0-3]\\d{1})$"),
            reg_yyyyMM = new RegExp("^(\\d{4})[-\/]?([0-1]\\d{1})$"),
            reg_yyyy = new RegExp("^(\\d{4})$"),
            arr = reg_yyyy.exec(val) ||
            reg_yyyyMM.exec(val) ||
            reg_yyyyMMdd.exec(val) ||
            reg_yyyyMMddHH.exec(val) ||
            reg_yyyyMMddHHmm.exec(val) ||
            reg_yyyyMMddHHmmss.exec(val);

        if (arr && arr.length > 0) {
            let yMdHms = new Array(1970, 1, 1, 0, 0, 0);
            for (let i = 1, len = arr.length; i < len; i++) {
                yMdHms[i - 1] = parseInt(arr[i], 10);
            }
            return new Date(yMdHms[0], yMdHms[1] - 1, yMdHms[2], yMdHms[3], yMdHms[4], yMdHms[5]);
        } else {
            return null;
        }
    },

    //增加月份
    AddMonths: function (date, months) {
        return moment(date).add(months, 'M').toDate()
    },
    AddWeeks: function (date, weeks) {
        return moment(date).add(weeks, 'w').toDate()
    },
    AddDays: function (date, days) {
        return moment(date).add(days, 'd').toDate()
    },
    AddHours: function (date, hours) {
        return moment(date).add(hours, 'h').toDate()
    },
    AddMinutes: function (date, minutes) {
        return moment(date).add(minutes, 'm').toDate()
    },
    AddSeconds: function (date, seconds) {
        return moment(date).add(seconds, 's').toDate()
    },
    AddMilliseconds: function (date, milliseconds) {
        return moment(date).add(milliseconds, 'ms').toDate()
    },
    CurrentZero: function () {
        return moment().startOf('day').toDate()
    },
    EndOfTheDay: function () {
        return moment().endOf('day').toDate()
    },
    Trunc: function (date, pattern) {
        pattern = pattern || "dd";
        if (pattern == "dd") {
            return this.create(this.toString(date, "yyyy-MM-dd"));
        } else if (pattern == "mm") {
            return this.create(this.toString(date, "yyyy-MM"));
        } else if (pattern == "hh") {
            return this.create(this.toString(date, "yyyy-MM-dd hh"));
        } else if (pattern == "mi") {
            return this.create(this.toString(date, "yyyy-MM-dd hh:mm"));
        } else {
            return this.create(this.toString(date, "yyyy-MM-dd hh:mm:ss"));
        }
    }
}