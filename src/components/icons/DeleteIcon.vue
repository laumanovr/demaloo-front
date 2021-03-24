<template>
	<div class="delete-icon" @click="$emit('click')">
		<img src="../../assets/icons/trash.svg" title="Удалить" />
	</div>
</template>

<style lang="scss" scoped>
	.delete-icon {
		display: inline-block;
		cursor: pointer;
		margin-right: 10px;
		width: 26px;
		min-width: 26px;
		height: 26px;
		img {
			border-radius: 5px;
			padding: 3px;
			width: 100%;
			height: 100%;
		}
	}
</style>
