let REG_IMAGE = /\[([\da-zA-Z]{24})\]/g;

export default {
  listText: function (item) {
    if (item && item.dialogueVo && item.dialogueVo.dialogueInfo) {
      let info = item.dialogueVo.dialogueInfo;
      let dialogueType = item.dialogueVo.dialogueType;
      let topicType = item.converVo.topicType;
      switch (dialogueType) {
        case 0:
          info = info.replace(/<[^>]*?>/g, '');
          info = info.replace(/&nbsp;/g, '');
          if (REG_IMAGE.test(info)) {
            info = info.replace(REG_IMAGE, '[图片]');
          }
          break;
        case 1:
          info = '[图片]';
          break;
        case 3:
          info = '[语音]';
          break;
        case 5:
          info = '[链接]';
          break;
        case 6:
          try {
            info = '[附件]' + item.dialogueVo.attachsVo[0].attachsName;
          } catch (e) {
            info = '[附件]';
          }
          break;
        case 7:
          info = '[资讯]' + item.dialogueVo.dialogueInfo;
          break;
        case 10:
          info = '[名片]';
          break;
        case 12:
          info = '[投票]';
          break;
        case 13:
          info = '[智能服务]';
          break;
        case 14:
          info = '[红包]';
          break;
      }
      if (topicType != 1) {
        info = item.dialogueVo.userName + " : " + info;
      }
      item.dialogueVo.dialogueInfo = info;
    }
    return item;
  }
};
