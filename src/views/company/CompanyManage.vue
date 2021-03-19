<template>
  <div class="company-manage-container">
    <Sidebar :role="'company'"/>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/company/Sidebar';
import {mapState} from 'vuex';

export default {
	components: {
		Sidebar,
	},
	computed: {
		...mapState('notification', ['notifications']),
	},
	watch: {
		notifications() {
			this.$toast.info('У вас новые уведомления!', {duration: 3500});
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
