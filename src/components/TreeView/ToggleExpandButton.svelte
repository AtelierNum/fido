<script>
	export let open;
	export let onclick;
</script>

<style>
	.open {
		transform: rotate(90deg);
	}
</style>

<div class:open on:click={onclick}>
	<div>&#x25b6</div>
</div>
