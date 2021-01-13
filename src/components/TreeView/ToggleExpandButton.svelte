<script>
	export let open;
	export let onclick;
</script>

<style>
	.container{
		margin-right: 5px;
	}

	.open {
		transform: rotate(90deg);
	}
</style>

<div class:open class="container" on:click={onclick}>
	<div>&#x25b6</div>
</div>
