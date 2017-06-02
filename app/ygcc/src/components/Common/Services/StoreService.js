export default {
  getSingleChatTopicPicId: function (conversationList, currentUser) {
    let topicPicId = "";
    for (let i = 0; i < conversationList.participants.length; i++) {
      let user = conversationList.participants[i];
      if (user.userId != currentUser.userId) {
        console.log(user, currentUser)
        topicPicId = user.userPicId;
        break;
      }
    }
    return topicPicId;
  }
}
