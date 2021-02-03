<script>
	//https://www.youtube.com/watch?v=C2Yx90pytqs&ab_channel=Orpheus
	import Fa from "svelte-fa";
	import { faTimes } from "@fortawesome/free-solid-svg-icons";
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
	span {
		flex: 1;
		min-width: var(--size-4);
	}

	#container {
		position: absolute;
		display: flex;
		flex-direction: column;
		top: 4em;
		right: 20px;
		box-sizing: border-box;
		min-height: 50px;
		background-color: var(--color-success);
		color: var(--color-success-text);
		padding: var(--size-4);
		border-radius: 0.25rem;
		user-select: none;
	}

	#head {
		display: flex;
		font-weight: bold;
		margin-bottom: var(--size-3);
	}
</style>

{#if open}
	<div id="container" transition:fly={{ x: 100 }}>
		<div id="head">
			<div id="title">Success</div>
			<span />
			<div
				id="closeButton"
				on:click={() => {
					open = false;
				}}
			>
				<Fa icon={faTimes} />
			</div>
		</div>
		<div id="body">
			{msg}
		</div>
	</div>
{/if}
