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
				<div class="edit-button">
					<Icon class="button-item" size="16" type="happy-outline" title="emoji"></Icon>
					<Icon class="button-item" size="16" type="image" title="image"></Icon>
					<Icon class="button-item" size="16" type="ios-folder" title="file"></Icon>
					<Icon class="button-item" size="16" type="scissors" title="screenshot"></Icon>
				</div>
				<pre id="editArea" class="edit-area fancy-scrollbar" contenteditable="true"></pre>
				<div class="edit-send">
					<span class="text">ctrl+enter发送</span>
					<Button class="send-button" type="ghost" :loading="isSending" @click="toSend()" icon="ios-paperplane-outline">
						<span v-if="!isSending">发送</span>
					</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import ContactItem from '@/components/Chat/ContactItem';
import ChatList from '@/components/Chat/ChatList';
import UserImage from '@/components/Common/UserImage';
import inifiniteScroll from '@/components/Common/Directives/inifiniteScroll';

export default {
	name: 'Chat',
	components: {
		ContactItem,
		UserImage,
		ChatList
	},
	data() {
		return {
			loading: false,
			lineStart: 0,
			searchText: "",
			currentPageNo: 1,
			currentPageSize: 20,
			currentSelectItem: null,
			isSending: false
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
	watch: {
		isSending: function () {
			console.log(arguments);
		}
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
		},
		toSend: function () {
			let self = this;
			self.isSending = true;
			setTimeout(function () {
				self.isSending = false;
			}, 2000);
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

.editor .edit-button {
	flex: none;
	height: 30px;
	padding-top: 8px;
}

.edit-button .button-item {
	margin-left: 16px;
	cursor: pointer;
}

.edit-button .button-item:hover {
	color: #2c82ce;
}

.editor .edit-area {
	flex: none;
	height: 90px;
	margin: 0;
	outline: none;
	padding-left: 10px;
	white-space: pre-wrap;
	word-break: normal;
	overflow-x: hidden;
	overflow-y: auto;
	font-size: 15px;
}

.editor .edit-send {
	flex: none;
	height: 40px;
	display: flex;
}

.edit-send .text {
	flex: auto;
	align-self: center;
	text-align: right;
	margin-right: 10px;
}

.edit-send .send-button {
	flex: none;
	width: 75px;
	align-self: flex-start;
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
