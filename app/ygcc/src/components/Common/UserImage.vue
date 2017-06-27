<template>
	<div class="user-image" @click="imageClick()">
		<img class="pic" v-if="imageSrc" :src="imageSrc" v-bind:style="styleObject" draggable="false">
		<div class="word" v-if="userName" v-bind:style="styleObject">{{userName}}</div>
		<div class="group" v-if="!imageSrc && groupDefault" v-bind:style="styleObject"></div>
	</div>
</template>

<script>

import HttpService from '@/components/Common/Services/HttpService';

export default {
	name: 'UserImage',
	props: ['width', 'height', 'radius', 'user'],
	data: function () {
		return {
			imageSrc: '',
			userName: '',
			groupDefault: false,
			styleObject: {}
		}
	},
	created: function () {
		this.styleObject = {
			width: this.width + "px",
			height: this.height + "px",
			borderRadius: this.radius
		}
		this.updateImageInfo();
	},
	watch: {
		user: function () {
			this.updateImageInfo();
		}
	},
	methods: {
		updateImageInfo: function () {
			this.imageSrc = null;
			this.userName = null;
			this.imageSrc = null;

			if (this.user && this.user.userPicId) {
				this.imageSrc = HttpService.getBaseUrl + '/fileUploadController/showPic/' + this.user.userPicId;
			} else if (this.user && this.user.userName) {
				let regexp = new RegExp('[^\u4e00-\u9fa5]', 'g');
				let value = this.user.userName;
				value = value.replace(regexp, '');
				let len = value.length;
				this.userName = value.substr(len - 1, len);
			} else if (this.user && this.user.topicType) {
				this.groupDefault = true;
				this.imageSrc = null;
			}
		},
		imageClick: function () {
			this.$emit('clickimage', this.user);
		}
	}
}
</script>

<style scoped>
.user-image {
	user-select: none;
}

.user-image .pic {
	display: block;
	margin: auto;
}

.user-image .word {
    background-color: #5eb3ff;
    color: rgb(255, 255, 255);
	line-height: 40px;
	font-size: 22px;
	text-indent: 9px;
}

.user-image .group {
	margin: auto;
	background-image: url(./images/user_group.png);
	background-repeat: no-repeat;
	background-size: 40px 40px;
	border-radius: 50%;
}
</style>