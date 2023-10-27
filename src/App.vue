<script>
import AppHeader from './components/AppHeader.vue';
import TheLoader from './components/TheLoader.vue';

export default {
	components: { AppHeader, TheLoader },
};
</script>

<template>
	<!-- header -->
	<AppHeader />

	<TheLoader />

	<!-- main -->
	<div>
		<RouterView></RouterView>
	</div>
</template>

<style lang="scss">
@use './assets/Scss/style.scss'
</style>
