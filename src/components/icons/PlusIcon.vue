<template>
  <div class="plus-icon" @click="$emit('click')">
    <img
      src="../../assets/icons/plus-icon.svg"
      :alt="iconTitle"
      :title="iconTitle"
    />
  </div>
</template>

<script>
export default {
	props: {
		iconTitle: String,
	},
};
</script>

<style lang="scss" scoped>
.plus-icon {
  display: inline-block;
  cursor: pointer;
  margin-right: 10px;
  width: 26px;
  min-width: 26px;
  height: 26px;
  img {
    background: $blue-primary;
    border-radius: 5px;
    padding: 3px;
    width: 100%;
    height: 100%;
  }
}
</style>
