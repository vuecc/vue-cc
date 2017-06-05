<template>
	<div class="chat-list">
		<div v-for="item in currentConversationDialogues" class="chat-item" v-bind:class="{ 'self': item.self }">
			<UserImage class="image" width="40" height="40" radius="50%" v-bind:user="item.userVo" v-on:clickimage="userImageClick"></UserImage>
			<div class="detail" v-bind:class="{ 'self': item.self }" @click="test(item.self)">
				<div class="name" v-if="topicType != 1 && topicType != 0 && !item.self">{{item.userName}}</div>
				<div class="text">{{item.dialogueInfo}}</div>
			</div>
		</div>
	</div>
</template>

<script>

import nativeService from '@/components/Common/Services/NativeService';
import moment from '@/components/Common/Filters/MomentFilter';
import UserImage from '@/components/Common/UserImage';

export default {
	name: 'ChatList',
	components: {
		UserImage
	},
	data: function () {
		return {
			topicType: 0
		}
	},
	computed: {
		currentConversationDialogues: function () {
			let temp = this.$store.getters.getConversationList;
			let currentUserId = this.$store.getters.getCurrentUser.userId;
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
	methods: {
		test: function (event) {
			console.log(arguments)
			console.log(this.$store.getters.getConversationList)
		},
		userImageClick: function (userVo) {
			console.log(userVo)
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

.chat-list .chat-item {
	display: flex;
	padding: 10px;
}

.chat-item .detail {}

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