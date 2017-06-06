<template>
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
</template>

<script>

import httpService from '@/components/Common/Services/HttpService';
import UserImage from '@/components/Common/UserImage';


export default {
	name: 'Editor',
	props: [],
	data: function () {
		return {
			isSending: false
		}
	},
	computed: {
		topicId: function () {
			let temp = this.$store.getters.getConversationList;
			return temp.topicId;
		}
	},
	methods: {
		toSend: function () {
			let ele = document.querySelector("#editArea");
			let self = this;
			self.isSending = true;
			httpService.saveConversation({
				topicId: self.topicId,
				dialogueInfo: ele.innerHTML,
				dialogueType: 0
			}).then(resp => {
				self.isSending = false;
				let dialogueVo = resp.data;
				ele.innerHTML = "";
				self.$store.commit('updateConversationLists', {
					pushDialogueVo: dialogueVo
				});
			}).catch(error => {
				self.isSending = false;
			})
		}
	}
}
</script>

<style scoped>
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
</style>