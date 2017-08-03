<template>
	<div class="chat-list fancy-scrollbar" ref="scrollList" v-inifinite-scroll="{scrollHandler: scrollHandler, update: update, itemCount: currentConversationDialogues.length, direction: 'top'}">
		<div class="load-more" @click="loadMore">加载更多</div>
		<div v-for="item in currentConversationDialogues" :key="item.topicId" class="chat-item" v-bind:class="{ 'self': item.self }">
			<UserImage class="image" width="40" height="40" radius="50%" v-bind:user="item.userVo" v-on:clickimage="userImageClick"></UserImage>
			<div class="detail" v-bind:class="{ 'self': item.self }">
				<div class="name" v-if="topicType != 1 && topicType != 0 && !item.self">{{item.userName}}</div>
				<div class="text">{{item.dialogueInfo}}</div>
			</div>
		</div>
	</div>
</template>

<script>

import moment from '@/components/Common/Filters/MomentFilter';
import UserImage from '@/components/Common/UserImage';
import scrollList from '@/components/Common/Mixins/TempScrollList';

export default {
	name: 'ChatList',
	components: {
		UserImage
	},
	mixins: [scrollList],
	data: function () {
		return {
			initList: false,
			scrollHeight: 0,
			topicType: 0,
			topicId: ""
		}
	},
	created: function () {
		this.$bus.on('chta-list-scroll', function (data) {
			this.scrollTo(data.position);
		});
	},
	computed: {
		currentConversationDialogues: function () {
			let temp = this.$store.getters.getConversationList;
			let currentUserId = this.$store.getters.getCurrentUser.userId;
			this.topicId = temp.topicId;
			if (temp && temp.converVo && temp.converVo.topicType) {
				// 1双人，2临时群，3正式群
				this.topicType = temp.converVo.topicType;
			}
			if (temp && temp.dialogues && temp.dialogues.length > 0) {
				temp.dialogues.map(item => {
					item.userVo = {
						userPicId: item.userPicId,
						userName: item.userName,
						userId: item.userId
					}
					if (currentUserId == item.userId) {
						item.self = true;
					}
				})
				return temp.dialogues;
			}
			return [];
		}
	},
	watch: {
		currentConversationDialogues: function (newValue, oldValue) {
			let self = this;
			let changTopic = false;
			self.initList = false;
			if (!newValue || !oldValue) {
				changTopic = true;
			}
			if (newValue && newValue.length > 0 && oldValue && oldValue.length > 0 && newValue[0].topicId != oldValue[0].topicId) {
				changTopic = true;
			}
			self.$nextTick(function () {
				if (changTopic && self.$refs.scrollList.scrollHeight != self.$refs.scrollList.clientHeight) {
					self.$refs.scrollList.scrollTop = self.$refs.scrollList.scrollHeight - self.$refs.scrollList.clientHeight;
				}
				setTimeout(function () {
					self.initList = true;
				}, 100);
			})
		}
	},
	methods: {
		loadMore: function () {
			let timeStamp = this.currentConversationDialogues[0].createDate;
			this.$store.dispatch('addConversationList', {
				pageSize: 20,
				topicId: this.topicId,
				timeStamp: timeStamp
			})
		},
		update: function () {
			this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight - this.scrollHeight;
		},
		scrollHandler: function () {
			this.scrollHeight = this.$refs.scrollList.scrollHeight;
			if (this.initList) {
				this.loadMore();
			}
		},
		userImageClick: function (userVo) {
			console.log(userVo)
		},
		scrollTo: function (position) {
			if (typeof position === "number") {
				this.$refs.scrollList.scrollTop = position;
			} else if (position === "end") {
				this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight;
			} else if (position === "start") {
				this.$refs.scrollList.scrollTop = 0;
			}
		}
	}
}
</script>

<style scoped>
.chat-list {
	height: 100%;
	width: 100%;
	overflow-x: hidden;
	overflow-y: auto;
}

.chat-list .load-more {
	text-align: center;
	padding: 10px;
	cursor: pointer;
}

.chat-list .chat-item {
	display: flex;
	padding: 10px;
}

.chat-item .image {
	cursor: pointer;
}

.chat-item .detail {
	max-width: 75%;
}

.chat-item.self {
	justify-content: flex-end;
}

.detail.self {
	order: -1;
}

.chat-item .detail .name {
	margin-left: 10px;
	margin-right: 10px;
}

.chat-item .detail .text {
	background-color: #fff;
	margin: 6px 10px 0 10px;
	padding: 4px 14px;
	border-radius: 4px;
	user-select: initial;
	word-wrap: break-word;
	word-break: break-word;
}
</style>