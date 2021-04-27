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
import {mapState} from 'vuex';

export default {
	components: {
		Header,
		Footer,
		LoginModal
	},
	computed: {
		...mapState('notification', ['onNewNotifies']),
		userProfile() {
			return this.$store.state.account.customer;
		},
		userLogged() {
			return Object.values(this.userProfile).length > 0;
		}
	},
	created() {
		if (this.userLogged) {
			this.$store.dispatch('notification/checkClientNotifies');
		}
	},
	methods: {
		openLoginModal() {
			this.$modal.show('login-modal');
		}
	},
	watch: {
		onNewNotifies(newNotify) {
			if (newNotify) {
				this.$toast.info('У вас новые уведомления!', {duration: 3500});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.client-manage {}
</style>