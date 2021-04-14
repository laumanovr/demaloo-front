<template>
	<div class="client-manage">
		<Header @onLogin="toggleLoginModal"/>
		<router-view/>
		<Footer/>
		<!--LOGIN MODAL-->
		<modal
			name="login-modal" class="bor-radius"
			:width="isMobileWindow ? '100%' : '1020px'"
			:height="isMobileWindow ? '100%' : '508px'"
		>
			<CloseIcon @click="toggleLoginModal" class="mob"/>
			<div class="client-sign-up-in-container">
				<div class="login-image web">
					<img src="../../assets/images/welcome.png" class="welcome">
					<div class="logo-text">
						<img src="../../assets/images/big-logo.svg">
						<div class="title">
							<img src="../../assets/images/demaloo-text.png">
							<span>Отдых без забот</span>
						</div>
					</div>
				</div>
				<ClientLogin/>
			</div>
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