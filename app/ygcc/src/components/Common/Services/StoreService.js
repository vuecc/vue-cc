import findIndex from "lodash/findIndex";
import cloneDeep from 'lodash/cloneDeep';

export default {
  getSingleChatTopicPicId: function (conversationList, currentUser) {
    let topicPicId = "";
    for (let i = 0; i < conversationList.participants.length; i++) {
      let user = conversationList.participants[i];
      if (user.userId != currentUser.userId) {
        topicPicId = user.userPicId;
        break;
      }
    }
    return topicPicId;
  },
  // topicId, pageSize, timeStamp
  getCachedConversationList: function (ConversationList, payload) {
    if (!ConversationList) {
      return null;
    }
    let index = -1;
    if (payload.timeStamp) {
      index = findIndex(ConversationList.dialogues, function (item) {
        return item.createDate == payload.timeStamp;
      });
    } else {
      index = ConversationList.length;
    }
    if (index > payload.pageSize) {
      let temp = cloneDeep(ConversationList);
      temp.dialogues = temp.dialogues.splice(index - payload.pageSize, payload.pageSize);
      return temp;
    }
    return null;
  },
  mergeCachedConversationList: function (push, cache) {
    let index = -1;
    if (cache && cache.dialogues && cache.dialogues.length > 0) {
      index = findIndex(push.dialogues, function (item) {
        return item.createDate == cache.dialogues[0].timeStamp;
      });
      if (index != -1) {
        push.dialogues = push.dialogues.splice(0, index).concat(cache.dialogues);
      } else {
        push.dialogues = push.dialogues.concat(cache.dialogues);
      }
    }
    return push;
  }
};
