<script>
	import Node from "./Node.svelte";
	import { fileTree } from "../../store";

	export let expanded = false;
	export let files = [];
	export let depthLimit;
	export let path;

	function appendNode() {}
</script>

<Node onToggle={appendNode} {expanded} {files} {depthLimit} {path} />
