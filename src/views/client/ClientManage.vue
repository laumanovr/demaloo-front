<template>
	<div class="client-manage">
		<Header @onLogin="toggleLoginModal"/>
		<router-view/>
		<Footer/>
		<!--LOGIN MODAL-->
		<modal
			transition="vm-transition--overlay-enter-active"
			name="login-modal"
			class="bor-radius"
			:width="isMobileWindow ? '100%' : '1020px'"
			:height="isMobileWindow ? '100%' : '508px'"
		>
			<CloseIcon @click="toggleLoginModal" class="mob"/>
			<ClientLogin/>
		</modal>
	</div>
</template>

<script>
import Header from '@/components/general/Header';
import Footer from '@/components/general/Footer';
import ClientLogin from '@/views/login/ClientLogin';
import CloseIcon from '@/components/icons/CloseIcon';

export default {
	components: {
		Header,
		Footer,
		ClientLogin,
		CloseIcon
	},
	computed: {
		isMobileWindow() {
			return window.innerWidth < 1024;
		}
	},
	methods: {
		toggleLoginModal() {
			this.$modal.toggle('login-modal');
		}
	}
};
</script>

<style lang="scss" scoped>
	.client-manage {
		background: #f5f5f5;
		.close-icon {
			position: absolute;
			right: 10px;
			top: 10px;
		}
	}
</style>