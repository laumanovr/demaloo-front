<template>
	<div class="client-manage">
		<Header @onLogin="openLoginModal"/>
		<router-view/>
		<Footer/>
		<LoginModal/>
	</div>
</template>

<script>
import Header from '@/components/general/Header';
import Footer from '@/components/general/Footer';
import LoginModal from '@/components/client/LoginModal';

export default {
	components: {
		Header,
		Footer,
		LoginModal
	},
	methods: {
		openLoginModal() {
			this.$modal.show('login-modal');
		}
	}
};
</script>

<style lang="scss" scoped>
	.client-manage {
		background: #f5f5f5;
	}
</style>