import vue from "vue";

let isloading = false;

function fire(ele, direction){
	if (direction.indexOf('bottom') > -1) {
		if (ele.scrollHeight - ele.clientHeight - ele.scrollTop <= 50) {
			return true;
		}
	}
	if (direction.indexOf('top') > -1) {
		if (ele.scrollTop <= 20) {
			return true;
		}
	}
	return false;
}

vue.directive("inifiniteScroll", {
  inserted: function (el, binding) {
    let callback = binding.value.scrollHandler;
    let direction = binding.value.direction;
    el.addEventListener("scroll", function (e) {
      let ele = e.target;
      if (fire(ele, direction)) {
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
