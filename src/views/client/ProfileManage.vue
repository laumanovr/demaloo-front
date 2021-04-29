<template>
	<div class="client-profile-manage">
		<ClientSidebar :role="'client'" class="web"/>
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
	max-width: 1200px;
	margin: 0 auto;
	min-height: 70vh;
	background: #fff;
	@media #{$mob-view} {
		min-height: 20vh;
	}
	&__content {
		width: 100%;
		padding: 0 0 70px 25px;
		@media #{$mob-view} {
			padding: 0;
		}
	}
}
</style>