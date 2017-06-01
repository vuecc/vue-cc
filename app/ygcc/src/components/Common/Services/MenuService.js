let menu = [{
	name: '聊天',
	route: 'chat',
	icon: 'chatbox-working'
},{
	name: '通讯录',
	route: 'address',
	icon: 'android-contact'
},{
	name: '资讯号',
	route: 'channel',
	icon: 'ios-book'
},{
	name: '同事圈',
	route: 'colleague',
	icon: 'cube'
},{
	name: '微应用',
	route: 'application',
	icon: 'ios-grid-view'
},{
	name: '任务',
	route: 'task',
	icon: 'checkmark-circled'
}];

export default {
	getMenuList: function(){
		return menu;
	}
};