<script>
	export let open;
	export let onclick;
</script>

<style>
	.container {
		margin: auto var(--size-1) auto 0;
	}

	.open {
		transform: rotate(90deg);
	}

	#arrow {
		font-size: 12px;
		padding: var(--size-1);
	}
</style>

<div class:open class="container" on:click={onclick}>
	<div id="arrow">&#x25b6</div>
</div>
