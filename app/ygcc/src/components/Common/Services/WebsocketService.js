import StorageService from '@/components/Common/Services/StorageService';
import NativeService from '@/components/Common/Services/NativeService';
import HttpService from '@/components/Common/Services/HttpService';
let localStorage = StorageService.getLocalStorage();
let webSocket = null;
let reconnCount = 1;
let websocketMissCount = 0;
let currentUser = localStorage.getItem("current_user");
let listenFlags = "Conversation, RemindMessage, noteRemind, pushChannelItem, pushTaskMsg, RetractDirective, readMessage";
let MSG_PUSH_URI = "ws" + HttpService.getHost + "/msgpush";
let result = {};
let headerLenFieldLength = 4;
let notifyLenFieldLength = 6;

function parseMessage(msg) {
  if (!msg || msg.length < headerLenFieldLength) {
    return null;
  }
  let notify = msg.substring(0, notifyLenFieldLength);
  if (notify == 'ACK1') {
    return notify;
  } else if (notify == 'CMDKCK') { // 踢掉本人其他设备
    return {
      header: 'notify',
      extras: {
        listenFlag: "noteRemind",
        noteType: 0,
        content: "您" + msg.replace("CMDKCK:", "") + " 设备离线"
      }
    };
  } else if (notify == 'CMDOFL') { // 本人其他设备下线通知
    return {
      header: 'notify',
      extras: {
        listenFlag: "noteRemind",
        noteType: 0,
        content: "您" + msg.replace("CMDOFL:", "") + " 设备离线"
      }
    };
  } else if (notify == 'CMDONL') { // 本人其他设备上线通知
    return {
      header: 'notify',
      extras: {
        listenFlag: "noteRemind",
        noteType: 0,
        content: "您" + msg.replace("CMDONL:", "") + "设备在线"
      }
    };
  }
  let headerLength = parseInt(msg.substring(0, headerLenFieldLength));
  if (!headerLength) {
    return null;
  }
  return {
    header: msg.substring(headerLenFieldLength, headerLength + headerLenFieldLength),
    content: msg.substring(headerLength + headerLenFieldLength)
  };
}

export default {
  openMsgPush: function (onMsg, onReconn, onFail) {
    function conn() {
      return new Promise(function (resolve, reject) {

        console.log('openMsgPush');
        if (currentUser) {
          console.log(currentUser);
          try {
            let client = new WebSocket(MSG_PUSH_URI +
              '/YGWebSocket?userId=' + currentUser.userId +
              "&userName=" + currentUser.email +
              "&password=" + currentUser.password +
              "&listenFlags=" + listenFlags +
              "&clientFlag=" + "4" +
              "&deviceId=" + "00:15:5d:04:0f:00" +
              "&reuqestIp=" + "10.0.75.1" +
              "&appVersion=" + "2.5.13");
            client.onopen = function (event) {
              resolve(client, event);
            };
            client.onclose = function (event) {
              reject(event);
            };
          } catch (e) {
            console.log(e);
          }
        }
      });
    }

    function reConn() {
      // 重连间隔定为10秒
      let time = 10000;
      if (reconnCount < 6) {
        // 如果是在1 分钟之内的, 则时间是递增的
        time = Math.pow(1.5, reconnCount) * 2000;
        console.log("第" + reconnCount + "次尝试重连，间隔时间：" + time);
        setTimeout(function () {
          doConn().then(function () {
            // 在reConn 里面表示进行重连了
            // 进入这个回调表示成功了.
            onReconn();
          });
        }, time);
      } else {
        // 超过重试次数不成功就转到断线页面手动重连
        onFail();
      }
    }

    function doConn() {
      return conn().then(function (client, openEvent) {
        webSocket = client;
        initEvents(openEvent);
        reconnCount = 1;
      }, function () {
        reconnCount++;
        reConn();
      });
    }

    doConn();

    function initEvents(openEvent) {
      //与服务端建立连接失败的回调
      webSocket.onerror = function (event) {
        console.log("与消息服务器建立连接出错");
        console && console.info(event);
      };
      // 与服务端建立连接成功的回调
      webSocket.onopen = function (event) {
        console.log("Connection established");
      };
      if (openEvent) {
        // 由于到这里的时候onopen 的事件已经触发过了, 所以这里再直接执行一次.
        webSocket.onopen(openEvent);
      }
      //服务端关闭连接的回调
      webSocket.onclose = function (event) {
        console.log("Connection closed");
        console && console.info(event);
        if (event.code !== 1000) {
          // 不是正常关闭, 尝试重连
          reConn();
        } else {
          // 如果服务端已经主动关闭了，那客户端不应该停留在主界面
          onFail();
          //   TODO
          //   if (window.clientQuit === undefined || window.clientQuit === false) {
          //     window.clientQuit = false;
          //     onFail();
          //   }
        }
      };
      let msgs = {};
      // 定义Message事件处理函数(收取服务端消息并处理)
      webSocket.onmessage = function (event) {
        let msg = parseMessage(event.data);
        if (msg == null) {
          onMsg(null);
          return;
        } else if (msg == 'ACK1') {
          websocketMissCount = 0;
          return;
        }
        if (msg.header == 'notify') {
          // 停掉移动端上下线提示
          return;
        }
        // send confirm
        webSocket.send('CFM' + msg.header);
        if (msgs[msg.header]) {
          // 已经处理过这个消息了.
          return;
        }
        msgs[msg.header] = new Date().getTime();
        let data = JSON.parse(msg.content);
        onMsg(data);
        setTimeout(clearMsgs, 1000);
      };
      let HALF_HOUR = 30 * 60 * 1000;

      function clearMsgs() {
        let now = new Date().getTime();
        for (let header in msgs) {
          if (msgs.hasOwnProperty(header)) {
            let time = msgs[header];
            if (time + HALF_HOUR < now) {
              // 删除半个小时前的信息
              delete msgs[header];
            }
          }
        }
      }
    }
    // 返回关闭的函数, 直接调用则关闭socket
    return {
      close: function () {
        if (webSocket) {
          webSocket.close();
        }
        webSocket = null;
      },
      send: function (message) {
        if (webSocket) {
          webSocket.send(message);
          if (message == 'HBT1') {
            websocketMissCount++;
            if (websocketMissCount > 6) {
              reConn();
            }
          }
        } else {
          doConn();
        }
      }
    };
  }
};
