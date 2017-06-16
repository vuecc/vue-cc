<template>
	<div ref="slider" class="slider" v-bind:class="{ hover: hover||mouseDown }">
		<div ref="box" class="box" v-bind:class="{ hover: hover||mouseDown }"></div>
	</div>
</template>

<script>

import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

export default {
	name: 'Slider',
	props: ['hover'],
	data: function () {
		return {
			position: 0,
			height: 0,
			start: 0,
			boxHeight: 40,
			mouseDown: false
		}
	},
	mounted: function () {
		let box = this.$refs.box;
		box.addEventListener("mousedown", this.mouseDownHandler);
		window.addEventListener('resize', throttle(this.resize, 300));
	},
	methods: {
		resize: function (event) {
			let box = this.$refs.box;
			let heightTmp = this.$refs.slider.clientHeight;
			let rate = heightTmp / this.height;
			this.start = this.start * rate;
			this.position = this.position * rate;
			this.height = this.height * rate;
			if (this.position + this.boxHeight < this.height && this.position > 0) {
				box.style.marginTop = this.position + "px";
			} else if (this.position + this.boxHeight >= this.height) {
				box.style.marginTop = (this.height - this.boxHeight) + "px";
			} else if (this.position <= 0) {
				box.style.marginTop = "0px";
			}
		},
		mouseDownHandler: function (event) {
			this.start = event.clientY;
			this.height = this.$refs.slider.clientHeight;
			this.mouseDown = true;
			document.addEventListener("mousemove", this.mouseMoveHandler);
			document.addEventListener("mouseup", this.mouseUpHandler);
			event.stopPropagation();
			event.preventDefault();
		},
		mouseMoveHandler: function (event) {
			let box = this.$refs.box;
			this.position += event.clientY - this.start;
			this.start = event.clientY;
			if (this.position + this.boxHeight < this.height && this.position > 0) {
				box.style.marginTop = this.position + "px";
			} else if (this.position + this.boxHeight >= this.height) {
				box.style.marginTop = (this.height - this.boxHeight) + "px";
			} else if (this.position <= 0) {
				box.style.marginTop = "0px";
			}
			event.stopPropagation();
			event.preventDefault();
		},
		mouseUpHandler: function (event) {
			this.mouseDown = false;
			document.removeEventListener("mousemove", this.mouseMoveHandler);
			document.removeEventListener("mouseup", this.mouseUpHandler);
			event.stopPropagation();
			event.preventDefault();
		}
	}
}
</script>

<style scoped>
.slider {
	width: 10px;
	height: 100%;
	background-color: transparent;
	position: absolute;
	top: 2px;
	bottom: 2px;
	right: 2px;
	visibility: hidden;
	transition: visibility .1s;
	border-radius: 2px;
}

.slider.hover {
	visibility: visible;
	background-color: rgba(204, 204, 204, 0.25);
	transition: visibility .1s;
}

.slider .box {
	width: 10px;
	height: 40px;
	background-color: transparent;
	transition: background-color .1s;
	border-radius: 2px;
}

.slider .box.hover {
	background-color: #fff;
	transition: background-color .1s;
}
</style>