<template>
	<div>
		<img src="../../assets/images/welcome.png" class="welcome" style="display: none">
		<modal
			name="login-modal" class="bor-radius"
			:width="isMobileWindow ? '100%' : '1020px'"
			:height="isMobileWindow ? '100%' : '508px'"
		>
			<CloseIcon @click="$modal.hide('login-modal')" class="mob mob-window"/>
			<ClientLogin/>
		</modal>
	</div>
</template>

<script>
import ClientLogin from '@/views/login/ClientLogin';
import CloseIcon from '@/components/icons/CloseIcon';

export default {
	components: {
		ClientLogin,
		CloseIcon
	},
	computed: {
		isMobileWindow() {
			return window.innerWidth < 1024;
		}
	}
};
</script>

<style lang="scss" scoped>
	.close-icon.mob-window {
		position: absolute;
		right: 10px;
		top: 10px;
	}
</style>