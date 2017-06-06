export default {
  // <seep-alive>的组件每次重现把缓存的chatListScrollTop重现
  // 被缓存的list需要加上ref = "scrollList"标记
  // vue对象需要增加mixins: [scrollList]
  activated: function () {
    let self = this;
    let ele = self.$refs.scrollList;
    let scrollHandler = function (e) {
      self._chatListScrollTop = e.target.scrollTop;
    };
    ele.removeEventListener("scroll", scrollHandler);
    ele.addEventListener("scroll", scrollHandler);
    if (ele) {
      ele.scrollTop = self._chatListScrollTop;
    }
  }
};
