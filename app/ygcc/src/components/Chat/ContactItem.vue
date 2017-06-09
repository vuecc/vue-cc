<template>
	<div class="contactItem">
		<Badge :count="converVo.noReadNum" overflow-count="99" class-name="chat-list-badge" class="userImage">
			<UserImage width="40" height="40" radius="50%" v-bind:user="image"></UserImage>
		</Badge>
		<div class="title">
			<div class="ellipsis" v-if="converVo.contactsName">{{converVo.contactsName}}</div>
			<div class="ellipsis" v-if="converVo.dialogueInfo">{{converVo.dialogueInfo}}</div>
		</div>
		<div class="time">
			<div v-if="converVo.createDate">{{ converVo.createDate | moment(false, true) }}</div>
		</div>
	</div>
</template>

<script>

import nativeService from '@/components/Common/Services/NativeService';
import moment from '@/components/Common/Filters/MomentFilter';
import UserImage from '@/components/Common/UserImage';

export default {
	name: 'ContactItem',
	props: ['item'],
	components: {
		UserImage
	},
	data: function () {
		return {
			image: {},
			converVo: {},
			isMain: false
		}
	},
	watch: {
		item: function () {
			this.init();
			console.log(arguments);
		}
	},
	created: function () {
		this.init();
	},
	methods: {
		init: function () {
			this.image = {
				userPicId: this.item.converVo.topicPicId || null,
				topicType: this.item.converVo.topicType
			}
			this.converVo = {
				dialogueInfo: this.item.dialogueVo ? this.item.dialogueVo.dialogueInfo : "",
				createDate: this.item.dialogueVo ? this.item.dialogueVo.createDate : "",
				contactsName: this.item.converVo ? this.item.converVo.contactsName : "",
				noReadNum: this.item.noReadNum
			}
		}
	}
}
</script>
<style>
.chat-list-badge {
	box-shadow: none !important;
	transform: translateX(-25%) !important;
	top: -6px !important;
	position: absolute !important;
}
</style>
<style scoped>
.contactItem {
	height: 60px;
	position: relative;
	display: flex;
	border-bottom: 1px;
	cursor: pointer;
	border-bottom: 1px solid #333;
	user-select: none;
}

.contactItem:hover {
	background-color: #373E46;
}

.contactItem .userImage {
	flex: none;
	width: 70px;
	align-self: center;
}

.contactItem .title {
	flex: auto;
	padding-top: 5px;
}

.contactItem .title .ellipsis {
	width: 150px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-top: 5px;
}

.contactItem .time {
	flex: none;
	padding-top: 10px;
	width: 60px;
	text-align: right;
	padding-right: 10px;
}
</style>