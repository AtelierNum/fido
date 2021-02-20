<script>
	import Fa from "svelte-fa";
	import { faTimes } from "@fortawesome/free-solid-svg-icons";
	import { fly } from "svelte/transition";
	import { tweened } from "svelte/motion";
	import { linear } from "svelte/easing";
	import { onMount } from "svelte";

	import { removeToastById } from "../../store";

	export let id;
	export let head = "";
	export let type = "";
	export let message = "";

	const timeToLive = 5000;

	const timerProgress = tweened(100, {
		duration: timeToLive,
		easing: linear,
	});

	onMount(() => {
		timerProgress.set(0);
		setTimeout(close, timeToLive);
	});

	function close() {
		removeToastById(id);
	}
</script>

<style>
	span {
		flex: 1;
		min-width: var(--size-4);
	}

	.success {
		background-color: var(--color-success);
		color: var(--color-success-text);
	}

	.error {
		background-color: var(--color-danger);
		color: var(--color-success-danger);
	}

	#container {
		border-radius: 0.25rem;
	}

	#head {
		display: flex;
		font-weight: bold;
		margin-bottom: var(--size-3);
	}

	#toast {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		min-height: 50px;
		padding: var(--size-3);
		user-select: none;
	}

	#timer {
		backdrop-filter: saturate(50%);
		height: var(--size-2);
	}
</style>

<div id="container" class={type} transition:fly={{ x: 100, duration: 300 }}>
	<div id="timer" style={`width:${$timerProgress}%;`} />
	<div id="toast">
		<div id="head">
			<div id="title">{head}</div>
			<span />
			<div on:click={close}>
				<Fa icon={faTimes} />
			</div>
		</div>
		<div id="body">
			{message}
		</div>
	</div>
</div>
