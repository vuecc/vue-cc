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
					<Icon size="30" :type="item.icon" v-bind:class="{ active: activeIndex == index }"></Icon>
				</div>
			</div>
			<div class="user-setting">
			</div>
		</div>
		<div class="main-contain">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import UserImage from '@/components/Common/UserImage';
import ApplicationButtons from '@/components/Common/ApplicationButtons';
import Chat from '@/components/Chat/Chat';
import HttpService from '@/components/Common/Services/HttpService';
import MenuService from '@/components/Common/Services/MenuService';

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
			activeIndex: -1
		}
	},
	created: function () {
		this.menu = MenuService.getMenuList();
		if (this.menu && this.menu.length > 0) {
			this.selectMenuItem(this.menu[0], 0);
		}
	},
	methods: {
		mainImageClick: function (user) {
			console.log(user);
		},
		selectMenuItem: function (item, index) {
			this.activeIndex = index;
			console.log(item.route);
			this.$router.push({ path: "home/" + item.route });
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
	padding: 14px;
	cursor: pointer;
}

.home .menu-list .menu-item:hover {
	color: #2c82ce;
}

.home .menu-list .menu-item:active,
.active {
	color: #5eb3ff;
}
</style>
