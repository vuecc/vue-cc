import vue from "vue";

let isloading = false;

vue.directive("inifiniteScroll", {
  inserted: function (el, binding) {
    let callback = binding.value.scrollHandler;
    el.addEventListener("scroll", function (e) {
      let ele = e.target;
      if (ele.scrollHeight - ele.clientHeight - ele.scrollTop <= 50) {
        if (isloading == false) {
          isloading = true;
          callback();
        }
      }
    });
  },
  componentUpdated: function (el, binding) {
    if (binding && binding.oldValue.itemCount != binding.value.itemCount) {
      isloading = false;
      binding.value.update();
    }
  }
});
