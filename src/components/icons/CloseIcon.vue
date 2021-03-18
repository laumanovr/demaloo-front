<template>
    <div class="close-icon" @click="$emit('click')">
        <img src="../../assets/icons/close.svg"/>
    </div>
</template>

<style lang="scss" scoped>
    .close-icon {
        display: inline-block;
        cursor: pointer;
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
