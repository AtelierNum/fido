<script>
	//https://www.youtube.com/watch?v=C2Yx90pytqs&ab_channel=Orpheus
	import { toasts } from "../../store";

	import Toast from "./Toast.svelte";
</script>

<style>
	#container {
		position: absolute;
		display: flex;
		flex-direction: column;
		top: 4em;
		right: 20px;
	}

	#container > :global(*) {
		margin-bottom: var(--size-3);
	}
</style>

<div id="container">
	{#each $toasts as toast (toast.id)}
		<Toast head={toast.type} type={toast.type} message={toast.message} id={toast.id} />
	{/each}
</div>
