<template>
  <div class="edit-icon" @click="$emit('click')">
    <img src="../../assets/icons/update-icon.svg" :title="iconTitle" />
  </div>
</template>

<script>
export default {
	props: {
		iconTitle: {type: String, default: 'Пересоздать'},
	},
};
</script>

<style lang="scss" scoped>
.edit-icon {
  display: inline-block;
  cursor: pointer;
  margin-right: 10px;
  width: 24px;
  min-width: 24px;
  height: 24px;
  img {
    border-radius: 5px;
    padding: 3px;
    width: 100%;
    height: 100%;
  }
}
</style>
