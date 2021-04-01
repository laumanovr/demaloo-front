<template>
	<div class="client-manage">
		<Header/>
		<router-view/>
		<Footer/>
	</div>
</template>

<script>
import Header from '@/components/general/Header';
import Footer from '@/components/general/Footer';

export default {
	components: {
		Header,
		Footer
	}
};
</script>

<style lang="scss">
	.client-manage {
		min-width: 1010px;
		background: #e5e5e578;
	}
</style>