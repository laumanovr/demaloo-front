<template>
	<div class="client-profile-manage">
		<ClientSidebar :role="'client'"/>
		<div class="client-profile-manage__content">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import ClientSidebar from '@/components/client/ClientSidebar';
export default {
	components: {
		ClientSidebar
	}
};
</script>

<style lang="scss">
.client-profile-manage {
	display: flex;
	width: 100%;
	max-width: 1366px;
	margin: 0 auto;
	min-height: 70vh;
	&__content {
		padding: 30px 20px 70px 40px;
	}
}
</style>