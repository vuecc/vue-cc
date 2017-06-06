<template>
	<div class="chat">
		<div class="list">
			<div class="search">
				<Input v-model="searchText" icon="search" size="small" placeholder="请输入..."></Input>
			</div>
			<div ref="scrollList" class="items fancy-scrollbar" v-inifinite-scroll="{scrollHandler: scrollHandler, update: update, itemCount: converContacts.length, direction: 'bottom'}">
				<div v-for="item in converContacts" :key="item.topicId" @click="selectItem(item)" v-bind:class="{ 'chat-list-active': currentSelectItem.topicId == item.topicId }">
					<ContactItem :item="item"></ContactItem>
				</div>
			</div>
		</div>
		<!--<div ref="line" class="line"></div>-->
		<div class="topic">
			<div class="title">
				<div class="chat-image">
					<UserImage width="40" height="40" radius="50%" v-bind:user="topicInfoVo"></UserImage>
				</div>
				<div class="chat-name">
					<div class="ellipsis" style="user-select: initial">{{topicInfoVo.contactsName}}</div>
					<div class="ellipsis member" v-if="topicInfoVo.memberCount && topicInfoVo.memberCount != 2">{{topicInfoVo.memberCount}}个成员</div>
				</div>
				<div class="chat-buttons">
					<Icon class="button" type="more" title="more"></Icon>
					<Icon class="button" type="edit" title="edit"></Icon>
				</div>
			</div>
			<div class="chat">
				<ChatList></ChatList>
			</div>
			<div class="editor">
				<Editor></Editor>
			</div>
		</div>
	</div>
</template>

<script>

import ContactItem from '@/components/Chat/ContactItem';
import ChatList from '@/components/Chat/ChatList';
import Editor from '@/components/Chat/Editor';
import UserImage from '@/components/Common/UserImage';
import inifiniteScroll from '@/components/Common/Directives/inifiniteScroll';
import scrollList from '@/components/Common/Mixins/TempScrollList';

export default {
	name: 'Chat',
	components: {
		ContactItem,
		UserImage,
		ChatList,
		Editor
	},
	mixins: [scrollList],
	data() {
		return {
			loading: false,
			lineStart: 0,
			searchText: "",
			currentPageNo: 1,
			currentPageSize: 20,
			currentSelectItem: null
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
		topicInfoVo: function () {
			let temp = this.$store.getters.getConversationList;
			let topicInfoVo = {};
			if (temp && temp.converVo) {
				topicInfoVo = {
					userPicId: temp.converVo.topicPicId ? temp.converVo.topicPicId : null,
					topicType: temp.converVo.topicType,
					contactsName: temp.converVo.contactsName,
					memberCount: temp.participants.length
				}
			}
			return topicInfoVo;
		}
	},
	mounted: function () {
		this.fetchConverContacts();
	},
	methods: {
		scrollHandler: function (cb) {
			this.fetchConverContacts();
			if (!this.loading) {
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
				topicId: item.topicId,
				cache: true
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
	overflow: hidden;
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
	height: 160px;
	background-color: #FFFFFF;
	border-top: 1px solid #e2e2e2;
	display: flex;
	flex-direction: column;
	padding-right: 10px;
}

.title .chat-image {
	flex: none;
	width: 60px;
	align-self: center;
}

.title .chat-name {
	flex: none;
	margin-top: 8px;
	max-width: calc(100% - 240px);
}

.chat-name .ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.chat-name .member {
	color: #A2A2A2;
}

.title .chat-buttons {
	flex: none;
	width: 60px;
	padding-top: 8px;
}

.chat-buttons .button {
	margin-left: 10px;
	cursor: pointer;
}

.chat-buttons .button:hover {
	color: #2c82ce;
}
</style>
