<template>
	<div class="user-image" @click="imageClick()" >
		<img class="pic" v-if="imageSrc" :src="imageSrc" v-bind:style="styleObject">
		<div class="word" v-if="userName">贊</div>
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
			styleObject: {}
		}
	},
	created: function () {
		this.styleObject = {
			width: this.width + "px",
			height: this.height + "px",
			borderRadius: this.radius
		}
		if (this.user && this.user.userPicId) {
			this.imageSrc = HttpService.getBaseUrl + '/fileUploadController/showPic/' + this.user.userPicId;
		} else if (this.user && this.user.userName) {
			let regexp = new RegExp('[^\u4e00-\u9fa5]', 'g');
			let value = this.userName;
			value = value.replace(regexp, '');
			let len = value.length;
            this.userName = value.substr(len - 1, len);
		}
	},
	methods: {
		imageClick: function () {
			console.log("clickimage")
			this.$emit('clickimage', this.user);
		}
	}
}
</script>

<style scoped>
.user-image {}

.user-image .pic {
	display: block;
	margin: auto;
}

.user-image .word {}
</style>