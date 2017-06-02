<template>
	<div ref="contain" class="chat">
		<div ref="list" class="list">
			<div class="search">
				<Input v-model="searchText" icon="search" size="small" placeholder="请输入..."></Input>
			</div>
			<div class="items fancy-scrollbar" v-inifinite-scroll="{scrollHandler: scrollHandler, update: update, itemCount: converContacts.length}">
				<div v-for="item in converContacts" :key="item.topicId" @click="selectItem(item)" v-bind:class="{ 'chat-list-active': currentSelectItem.topicId == item.topicId }">
					<ContactItem :item="item"></ContactItem>
				</div>
			</div>
		</div>
		<!--<div ref="line" class="line"></div>-->
		<div class="topic">
			<div class="title">
				<div class="chat-image">
					<UserImage width="40" height="40" radius="50%" v-bind:user="topicImageVo"></UserImage>
				</div>
				<div class="chat-name"></div>
				<div class="chat-buttons"></div>
			</div>
			<div class="chat"></div>
			<div class="editor"></div>
		</div>
	</div>
</template>

<script>

import ContactItem from '@/components/Chat/ContactItem';
import UserImage from '@/components/Common/UserImage';
import inifiniteScroll from '@/components/Common/Directives/inifiniteScroll';

export default {
	name: 'Chat',
	components: {
		ContactItem,
		UserImage
	},
	data() {
		return {
			loading: false,
			lineStart: 0,
			searchText: "",
			currentPageNo: 1,
			currentPageSize: 20,
			currentSelectItem: null,
		}
	},
	computed: {
		converContacts: function () {
			let temp = this.$store.getters.getConverContacts
			if (this.currentSelectItem == null && temp && temp.length > 0) {
				this.selectItem(temp[0]);
			}
			return temp;
		},
		topicImageVo: function () {
			let temp = this.$store.getters.getConversationList;
			let topicImageVo = {};
			if (temp && temp.converVo) {
				topicImageVo = {
					userPicId: temp.converVo.topicPicId ? temp.converVo.topicPicId : null,
					topicType: temp.converVo.topicType
				}
			}
			console.log(topicImageVo);
			return topicImageVo;
		}
	},
	mounted: function () {
		this.fetchConverContacts();
	},
	methods: {
		scrollHandler: function (cb) {
			this.fetchConverContacts();
			if (this.loading == false) {
				this.$Loading.start();
				this.loading = true;
			}
		},
		update: function () {
			console.log("update");
			if (this.loading) {
				this.$Loading.finish();
				this.loading = false;
			}
		},
		fetchConverContacts: function () {
			this.$store.dispatch('queryConverContacts', {
				pageNo: this.currentPageNo,
				pageSize: this.currentPageSize,
				replyNeed: 1
			})
			this.currentPageNo++;
		},
		selectItem: function (item) {
			this.currentSelectItem = item;
			this.$store.dispatch('queryConversationList', {
				pageSize: 5,
				topicId: item.topicId
			})
			this.currentPageNo++;
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat {
	display: flex;
	height: 100%;
}

.chat-list-active {
	background-color: #373E46;
}

.chat .list {
	flex: none;
	background-color: #272E36;
	width: 300px;
	min-width: 80px;
	max-width: 300px;
	display: flex;
	flex-direction: column;
}

.list .search {
	flex: none;
	padding: 15px;
}

.list .items {
	flex: auto;
	background-color: #272E36;
	overflow-y: auto;
	overflow-x: hidden;
}

.items .loading {
	height: 50px;
}

.chat .line {
	flex: none;
	background-color: #272E36;
	width: 4px;
	cursor: ew-resize;
}

.chat .topic {
	flex: auto;
	background-color: #F1F3F5;
	display: flex;
	flex-direction: column;
	user-select: none;
}

.topic .title {
	flex: none;
	height: 54px;
	background-color: #FFFFFF;
	-webkit-app-region: drag;
	display: flex;
}

.topic .chat {
	flex: auto;
	background-color: #F1F3F5;
}

.topic .editor {
	flex: none;
	height: 50px;
	background-color: #FFFFFF;
}

.title .chat-image {
	flex: none;
	width: 60px;
}

.title .chat-name {
	flex: auto;
}

.title .chat-buttons {
	flex: auto;
}
</style>
