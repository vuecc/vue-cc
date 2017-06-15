import findIndex from "lodash/findIndex";
import cloneDeep from 'lodash/cloneDeep';

function itemMoveToTop(converContacts, index, dialogueVo, isCurrentItem) {
  let temp = cloneDeep(converContacts[index]);
  converContacts.splice(index, 1);
  temp.dialogueVo = dialogueVo;
  if (!isCurrentItem) {
    temp.noReadNum = (temp.noReadNum ? temp.noReadNum : 0) + 1;
  }
  converContacts.unshift(temp);
}

function createConverContact(converContacts, dialogueVo) {

}

function createConversationList(dialogueVo) {

}

function pushConversationLists(conversationLists, dialogueVo) {
  let conversationList = conversationLists[dialogueVo.topicId];
  if (conversationList && conversationList.dialogues) {
    conversationList.dialogues.push(dialogueVo);
  } else {
    conversationLists[dialogueVo.topicId] = createConversationList(dialogueVo);
  }
}

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
    if (push && !push.dialogues) {
      push.dialogues = [];
    }
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
  },
  receiveChat: function (state, dialogueVo) {
    let isCurrentItem = false;
    if (state.currentConversationList.topicId == dialogueVo.topicId) {
      isCurrentItem = true;
    }
    let converContacts = state.converContacts;
    let index = findIndex(converContacts, function (element) {
      return element.topicId == dialogueVo.topicId;
    });
    if (index != -1) {
      // 列表中找到
      itemMoveToTop(converContacts, index, dialogueVo, isCurrentItem);
    } else {
      // 列表中未找到
      let converContact = createConverContact(converContacts, dialogueVo);
      converContacts.unshift(converContact);
    }
    pushConversationLists(state.conversationLists, dialogueVo);
  }
};
