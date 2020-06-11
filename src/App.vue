<template>
	<router-view/>
</template>

<script>
import myStore from '@/store/myStore'
export default {
	name: 'App',
	data(){
		return {}
	}
}
</script>

<style lang="scss">
@import "./scss/common/global.scss";
@import "./scss/common/control.scss";
</style>
