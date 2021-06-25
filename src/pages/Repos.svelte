<script>
	import marked from "marked";
	import { focusedGitHubPath, repoTree } from "../store";
	import { afterUpdate } from "svelte";
	import { fly } from "svelte/transition";
	import hljs from "highlight.js";

	import TreeView from "../components/TreeView/TreeView.svelte";
	import AltTree from "../components/AltTree/AltTree.svelte";

	export let ipcRenderer;

	let readmes = { AtelierNum: "<span/>" };
	let readmeElement;
	let readmeContent = Object.values(readmes)[0];
	let showTree = true;

	const noReadmeMessage = `
	<div style="height:100%;width:100%;display:flex;align-items:center;justify-content:center">
		<p style="font-size:2rem">There is no document for this section</p>
	</div>
	`;

	const markdownImageSrc = /!\[\]\(.+\)/gi; //will also match image links
	const markdownImageLink = /!\[\]\(http.+\)/gi;
	const markdownLink = /.*\[.+\]\(http.+\)/gi;
	const validUrl = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

	// TODO : make it easier on the eyes
	const watcherFocusedGitHubPath = focusedGitHubPath.subscribe(value => {
		if (value) {
			if (readmes[value]) {
				readmeContent = readmes[value];
			} else {
				fetch(
					`https://raw.githubusercontent.com/${value
						.split("/")
						.slice(0, 2)
						.join("/")}/main/${value.split("/").slice(2).join("/")}/README.md`
				)
					.then(res => (res.ok ? res.text() : ""))
					.then(data => {
						data = data.replaceAll(
							markdownImageLink,
							match => `<img src="${match.slice(4, -1)}">`
						);

						data = data.replaceAll(markdownImageSrc, match => {
							return `<img src="https://raw.githubusercontent.com/${value
								.split("/")
								.slice(0, 2)
								.join("/")}/main/${value.split("/").slice("2").join("/")}/${match.slice(
								4,
								-1
							)}">`;
						});

						data = data.replaceAll(markdownLink, link => {
							return `<a href="${link.match(/\(.+\)/i)[0].slice(1, -1)}">${link
								.match(/\[.+\]/i)[0]
								.slice(1, -1)}</a>`;
						});

						data = data.replaceAll(/\[.+\]\(.+\)/gi, mdLink => {
							return mdLink.match(/\[.+\]/i)[0].slice(1, -1);
						});

						readmes[value] = marked(data);
						readmeContent = readmes[value];
					});
			}
		}
	});

	function redirectLinkInBrowser(event) {
		if (event.path[0].nodeName == "A") {
			const link = event.target.href.match(validUrl)[0];
			if (link.trim() !== "") {
				ipcRenderer.invoke("open_link", { link: event.target.href });
			}
		}
	}

	afterUpdate(() => {
		if (readmeElement) {
			readmeElement.querySelectorAll("pre code").forEach(block => {
				hljs.highlightBlock(block);
			});
		}
	});
</script>

<style>
	section {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template:
			"treeview readme" 100%
			/ auto 1fr;
	}

	button {
		width: var(--size-6);
		height: var(--size-6);
		margin: var(--size-4);
		background-color: transparent;
		border: none;
		color: var(--color-primary-text);
		font-weight: bold;
	}

	button:focus {
		background-color: transparent;
		border: none;
	}

	#close-btn {
		position: relative;
		top: 10px;
		left: 10px;
	}

	#treeview {
		position: relative;
		background-color: var(--paper-2);
		padding: var(--size-4) var(--size-7) 10em 0.5em;
		overflow-y: auto;
	}

	#treeview-closer {
		position: absolute;
		top: var(--size-2);
		right: 0;
	}

	#treeview-opener {
		position: absolute;
		top: var(--size-5);
		left: var(--size-5);
	}

	#readme {
		height: 100%;
		width: calc(100% - var(--size-6) * 2);
		max-width: 65em; /*~15 words*/
		padding: 0 var(--size-6);
		color: var(--color-text-bold);
	}

	#readme-container {
		position: relative;
		width: 100%;
		overflow-y: auto;
		display: flex;
		justify-content: center;
		grid-area: readme;
	}

	:global(#readme img) {
		max-width: 100%;
	}
</style>

<section>
	{#if showTree}
		<div id="treeview">
			<button
				id="treeview-closer"
				on:click={() => {
					showTree = false;
				}}>&lt;&lt;</button
			>
			<!-- TODO replace these hardecoded top level folder with an array generated from a (enum||whitelist).json -->
			<AltTree tree={$repoTree} />
		</div>
	{/if}
	<div id="readme-container">
		{#if !showTree}
			<button
				id="treeview-opener"
				on:click={() => {
					showTree = true;
				}}>&gt;&gt;</button
			>
		{/if}
		<div id="readme" bind:this={readmeElement} on:click|preventDefault={redirectLinkInBrowser}>
			{@html readmeContent ? readmeContent : noReadmeMessage}
		</div>
	</div>
</section>

<button
	id="close-btn"
	on:click={() => {
		showTree = !showTree;
	}}>&rt;&rt;</button
>
