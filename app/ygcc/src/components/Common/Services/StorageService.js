let storage;

export default {
  getLocalStorage: function () {
    storage = window.localStorage; // 使用本地缓存
    return {
      setItem: function (key, value) {
        if (typeof value === "object") {
          value = JSON.stringify(value);
        }
        storage.setItem(key, value);
        return storage.getItem(key);
      },
      getItem: function (key) {
        var temp = storage.getItem(key);
        if (temp === 'true') {
          return true;
        } else if (temp === 'false') {
          return false;
        }
        if (temp && (temp.substring(0, 1) === "{" || temp.substring(0, 1) === "[")) {
          return JSON.parse(temp)
        }
        return temp;
      },
      removeItem: function (key) {
        var temp = storage.getItem(key);
        if (temp != null) {
          localStorage.removeItem(key);
        }
      },
      clear: function () {
        storage.clear();
      }
    };
  },
  sessionStorage: function () {
    storage = window.sessionStorage; 
    return {
      setItem: function (key, value) {
        if (typeof value === "object") {
          value = JSON.stringify(value);
        }
        storage.setItem(key, value);
        return storage.getItem(key);
      },
      getItem: function (key) {
        var temp = storage.getItem(key);
        if (temp === 'true') {
          return true;
        } else if (temp === 'false') {
          return false;
        }
        if (temp && (temp.substring(0, 1) === "{" || temp.substring(0, 1) === "[")) {
          return JSON.parse(temp);
        }
        return temp;
      },
      removeItem: function (key) {
        var temp = storage.getItem(key);
        if (temp != null) {
          localStorage.removeItem(key);
        }
      },
      clear: function () {
        storage.clear();
      }
    };
  }
};
