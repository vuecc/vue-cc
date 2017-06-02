    /**
     * 1分钟内更新的动态显示为: “刚刚”, 如果isAlwaysShowTime 为true, 则不显示这个值
     * 1小时内更新的动态显示为: “n分钟前”, 如果isAlwaysShowTime 为true, 则不显示这个值
     * 1小时（含）前显示: 具体更新的时间, HH:mm
     * 1天以上（含）显示: X月X日+时间,
     * 跨年显示: X年X月X日 +时间
     * @returns {Function}
     */
    import vue from "vue";

    function twoWords(str){
      if (str && str < 10) {
        return "0" + str;
      }
      return str;
    }

    function dateFilter(data, str) {
      str = str.replace(/[y]{1,4}/g, data.getFullYear())
				.replace(/[M]{1,4}/g, data.getMonth() + 1)
				.replace(/[d]{1,4}/g, data.getDate())
				.replace(/[H]{1,4}/g, twoWords(data.getHours()))
				.replace(/[m]{1,4}/g, twoWords(data.getMinutes()));
      return str;
    }

    vue.filter("moment", function (input, isAlwaysShowTime, isShorterDate) {
      if (!input) {
        return "";
      }
      var date = new Date(input);
      var now = new Date();
      // 和当前时间的分钟差
      var diff = (now.getTime() - date.getTime()) / 60000;

      //今天零点
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // 今天零点和现在的分钟差
      var todayFar = (now.getTime() - today.getTime()) / 60000;

      if (!isAlwaysShowTime && diff < 1) {
        // 1分钟内
        return "刚刚";
      }
      if (!isAlwaysShowTime && diff < 60) {
        // 1小时内
        return parseInt(diff) + "分钟前";
      }

      if (diff < todayFar) {
        // 今天内, 1小时（含）前
        return dateFilter(date, "HH:mm");
      }

      if (isShorterDate) {
        // 1 天有1440 分钟
        if (diff < (todayFar + 1440)) {
          return "昨天";
        }
        return dateFilter(date, "yy/M/d");
      }

      if (now.getFullYear() === date.getFullYear()) {
        // 1天以上（含）, 同年
        return dateFilter(date, "M月d日 HH:mm");
      }

      // 1天以上（含）, 跨年
      return dateFilter(date, "yyyy年M月d日 HH:mm");
    });
