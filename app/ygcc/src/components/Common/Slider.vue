<template>
	<div ref="slider" class="slider">
		<div ref="box" class="box"></div>
	</div>
</template>

<script>


export default {
	name: 'Slider',
	props: [],
	data: function () {
		return {
			position: 0,
			height: 0,
			start: 0,
			boxHeight: 40,
		}
	},
	mounted: function () {
		let box = this.$refs.box;
		box.addEventListener("mousedown", this.mouseDownHandler);
	},
	methods: {
		mouseDownHandler: function (event) {
			this.start = event.clientY;
			this.height = this.$refs.slider.clientHeight;
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
				box.style.marginTop = (this.height - this.boxHeight)  + "px";
			} else if (this.position <= 0) {
				box.style.marginTop = "0px";
			}
			event.stopPropagation();
			event.preventDefault();
		},
		mouseUpHandler: function (event) {
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
	width: 12px;
	height: 100%;
	background-color: #ffcc00;
	position: absolute;
	top: 0;
	right: 2px;
}

.slider .box {
	width: 12px;
	height: 40px;
	background-color: #00ccff;
}
</style>