<script>
	//https://www.youtube.com/watch?v=C2Yx90pytqs&ab_channel=Orpheus
	import { fly } from "svelte/transition";
	import { toastMsg } from "../store";

	export let open = false;

	let msg = "";

	const watcherToastMsg = toastMsg.subscribe(value => {
		msg = value;
		if (msg.trim() != "") {
			open = true;
		}
	});
</script>

<style>
	.closeButton {
		position: absolute;
		top: 3px;
		right: 5px;
	}

	#container {
		position: absolute;
		top: 4em;
		right: 20px;
		box-sizing: border-box;
		min-height: 50px;
		background-color: lightblue;
		padding: 1em;
	}
</style>

{#if open}
	<div id="container" transition:fly={{ x: 100 }}>
		<div
			class="closeButton"
			on:click={() => {
				open = false;
			}}>
			x
		</div>
		{msg}
	</div>
{/if}
