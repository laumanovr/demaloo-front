<template>
  <div class="company-manage-container">
    <Sidebar :role="'company'" :hasNewNotify="hasNewNotify"/>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <LogoutModal/>
  </div>
</template>

<script>
import Sidebar from '@/components/company/Sidebar';
import LogoutModal from '@/components/general/LogoutModal';
import {mapState} from 'vuex';

export default {
	components: {
		Sidebar,
		LogoutModal
	},
	data() {
		return {
			hasNewNotify: false
		};
	},
	computed: {
		...mapState('notification', ['onNewNotifies', 'onEmpty', 'onError']),
	},
	created() {
		this.$store.dispatch('notification/checkCompanyNotifies');
        this.$root.$i18n.locale = 'ru';
	},
	watch: {
		onNewNotifies(newNotify) {
			if (newNotify) {
				this.$toast.info('У вас новые уведомления!', {duration: 2500});
				this.hasNewNotify = true;
			}
		},
		onEmpty() {
			this.hasNewNotify = false;
		},
		onError(msg) {
			this.$toast.error(msg);
		}
	}
};
</script>

<style lang="scss">
.company-manage-container {
  display: flex;
  position: relative;
  .sidebar-container {
    position: fixed;
    top: 0;
    height: 100vh;
  }
  .main-content {
    background: #f6f6f6cf;
    width: calc(100% - 250px);
    margin-left: 250px;
    min-height: 100vh;
    min-width: 770px;
    padding: 30px 20px 70px;
  }
}
</style>
