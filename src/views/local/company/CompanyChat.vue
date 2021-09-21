<template>
	<div class="company-chat-container">
		<Chat :currentProfile="companyProfile"/>
	</div>
</template>

<script>
import Chat from '@/components/general/Chat';

export default {
	components: {
		Chat
	},
	computed: {
		companyProfile() {
			return this.$store.state.account.company;
		}
	},
};
</script>