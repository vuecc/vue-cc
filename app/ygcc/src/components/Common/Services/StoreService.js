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
  }
}
