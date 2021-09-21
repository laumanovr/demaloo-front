<template>
	<div class="client-chat-container">
		<Chat :currentProfile="clientProfile"/>
	</div>
</template>

<script>
import Chat from '@/components/general/Chat';

export default {
	components: {
		Chat
	},
	computed: {
		clientProfile() {
			return this.$store.state.account.customer;
		}
	}
};
</script>