<template>
	<div class="home">
		<ApplicationButtons type="main"></ApplicationButtons>
		<div class="main-menu">
			<div class="user-image">
				<UserImage width="40" height="40" radius="50%" v-bind:user="$store.state.currentUser" v-on:clickimage="mainImageClick"></UserImage>
				<span class="online-state">在线
					<Icon type="arrow-down-b"></Icon>
				</span>
			</div>
			<div class="menu-list">
				<div class="menu-item" v-for="(item, index) in menu" @click="selectMenuItem(item, index)" :title="item.name">
					<Icon size="30" :type="item.icon" v-bind:class="{ 'home-menu-active': activeIndex == index }"></Icon>
				</div>
			</div>
			<div class="user-setting">
			</div>
		</div>
		<div class="main-contain">
			<!--<transition>-->
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
			<!--</transition>-->
		</div>
	</div>
</template>

<script>
import UserImage from '@/components/Common/UserImage';
import ApplicationButtons from '@/components/Common/ApplicationButtons';
import Chat from '@/components/Chat/Chat';
import HttpService from '@/components/Common/Services/HttpService';
import MenuService from '@/components/Common/Services/MenuService';
import NativeService from '@/components/Common/Services/NativeService';
import websocketService from '@/components/Common/Services/WebsocketService';

export default {
	name: 'Home',
	components: {
		ApplicationButtons,
		UserImage,
		Chat
	},
	data() {
		return {
			menu: [],
			currentMenuItem: null,
			activeIndex: -1,
			socket: null,
			websocketTimer: null,
			watchTimer: null
		}
	},
	created: function () {
		let self = this;
		this.menu = MenuService.getMenuList();
		if (this.menu && this.menu.length > 0) {
			this.selectMenuItem(this.menu[0], 0);
		}
		this.socket = websocketService.openMsgPush(onMsg, onReconn, onFail);
		function onMsg(resp) {
			// 根据消息中的flag 来进行处理了.
			if (!resp || !resp.extras) return;
			let flag = resp.listenFlag
			switch (flag) {
				case "Conversation": {
					self.$store.commit('updateConversationLists', {
						pushDialogueVo: resp.extras
					});
					break;
				}
			}
		}
		function onReconn() {
			console.log("onReconn");
		}
		function onFail() {
			console.log("onFail");
			NativeService.show();
			self.$router.replace({ path: "/login" });
		}
		this.websocketTimer = setInterval(function () {
			self.socket.send('HBT1');
		}, 10 * 1000);
		this.watchTimer = setInterval(function () {
			// var flag = $scope.runInBrowser ? "1" : "4";
			// UserExResource.monitorUserId($scope.user.userId, flag).success(function (resp) {
			// 	if ("Inactive" == resp.result) {
			// 		$scope.logout();
			// 	}
			// }).error(function (err) {
			// 	$scope.logout();
			// });
		}, 3 * 60 * 1000);
	},
	destroyed: function () {
		clearInterval(this.websocketTimer);
		clearInterval(this.watchTimer);
		this.socket.close();
	},
	methods: {
		mainImageClick: function (user) {
			console.log(user);
		},
		selectMenuItem: function (item, index) {
			this.activeIndex = index;
			console.log(item.route);
			this.$router.replace({ path: "/home/" + item.route });
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.home {
	display: flex;
	width: 100%;
	height: 100%;
}

.home .main-menu {
	order: 0;
	flex: none;
	width: 60px;
	background-color: #1D232A;
}

.home .main-contain {
	order: 1;
	flex: auto;
	width: 1px;
	background-color: bisque;
}

.main-menu .user-image {
	margin-top: 10px;
	text-align: center;
}

.online-state {
	line-height: 34px;
	cursor: pointer;
}


.home .menu-list {
	display: flex;
	flex-direction: column;
}

.home .menu-list .menu-item {
	flex: none;
	height: 60px;
	padding: 15px;
	cursor: pointer;
}

.home .menu-list .menu-item:hover {
	color: #2c82ce;
}

.home .menu-list .menu-item:active,
.home-menu-active {
	color: #5eb3ff;
}

.none-scrollbar {
	-webkit-overflow-scrolling: touch;
}

.none-scrollbar::-webkit-scrollbar {
	height: 0px;
	width: 0px
}

.fancy-scrollbar {
	-webkit-overflow-scrolling: touch;
}

.fancy-scrollbar::-webkit-scrollbar {
	height: 10px;
	width: 10px
}

.fancy-scrollbar::-webkit-scrollbar-button:end:increment,
.fancy-scrollbar::-webkit-scrollbar-button:start:decrement {
	background: 0 0;
	display: none;
}

.fancy-scrollbar::-webkit-scrollbar-track-piece {
	/*background: #d0d0d0*/
	background: -webkit-gradient(linear, left 0, right 0, from(#ccc), to(#aaa));
}

.fancy-scrollbar::-webkit-scrollbar-track-piece:vertical:start {
	border-radius: 5px 5px 0 0
}

.fancy-scrollbar::-webkit-scrollbar-track-piece:vertical:end {
	border-radius: 0 0 5px 5px
}

.fancy-scrollbar::-webkit-scrollbar-track-piece:horizontal:start {
	border-radius: 5px 0 0 5px
}

.fancy-scrollbar::-webkit-scrollbar-track-piece:horizontal:end {
	border-radius: 0 5px 5px 0
}

.fancy-scrollbar::-webkit-scrollbar-thumb:horizontal,
.fancy-scrollbar::-webkit-scrollbar-thumb:vertical {
	background: -webkit-gradient(linear, left 0, right 0, from(#777), to(#999));
	border-radius: 5px;
	display: block;
	height: 50px
}
</style>
