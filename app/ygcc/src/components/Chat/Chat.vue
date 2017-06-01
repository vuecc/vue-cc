<template>
	<div ref="contain" class="chat">
		<div ref="list" class="list">
			<div class="search">
				<Input v-model="searchText" icon="search" size="small" placeholder="请输入..."></Input>
			</div>
			<div class="items">
				
			</div>
		</div>
		<div ref="line" class="line"></div>
		<div class="topic"></div>
	</div>
</template>

<script>
export default {
	name: 'Chat',
	data() {
		return {
			lineStart: 0,
			searchText: ""
		}
	},
	mounted: function () {
		let line = this.$refs.line;
		let list = this.$refs.list;
		let contain = this.$refs.contain;
		let self = this;
		function drapMove(e) {
			console.log('drapMove');
			let offset = e.screenX - self.lineStart;
			if (offset) {
				let width = list.clientWidth + offset;
				list.style.width = width + "px";
				self.lineStart = e.screenX;
			}
		}
		line.addEventListener('mousedown', function (e) {
			self.lineStart = e.screenX;
			contain.addEventListener('mousemove', drapMove);
		});
		contain.addEventListener('mouseup', function (e) {
			if (self.lineStart) {
				contain.removeEventListener('mousemove', drapMove);
				self.lineStart = 0;
			}
		});
	},
	methods: {

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat {
	display: flex;
	height: 100%;
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
	background-color: #444444
}

.chat .line {
	flex: none;
	background-color: #272E36;
	width: 4px;
	cursor: ew-resize;
}

.chat .topic {
	flex: auto;
	background-color: #F1F3F5;
}
</style>
