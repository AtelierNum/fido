<script>
	import marked from "marked";
	import { focusedGitHubPath } from "../store";
	import TreeView from "../components/TreeView/TreeView.svelte";

	export let ipcRenderer;

	let readmes = { AtelierNum: "<span/>" };
	let readmeContent = Object.values(readmes)[0];

	const noReadmeMessage = `
	<div style="height:100%;width:100%;display:flex;align-items:center;justify-content:center">
		<p style="font-size:2rem">There is no document for this section</p>
	</div>
	`;

	const markdownImageSrc = /!\[\]\(.+\)/gi; //will also match image links
	const markdownImageLink = /!\[\]\(http.+\)/gi;
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
							console.log(value.split("/").slice("2"));
							console.log(match.slice(4, -1));
							return `<img src="https://raw.githubusercontent.com/${value
								.split("/")
								.slice(0, 2)
								.join("/")}/main/${value.split("/").slice("2").join("/")}/${match.slice(
								4,
								-1
							)}">`;
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
</script>

<style>
	section {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template: 100% / auto 1fr;
	}

	#treeview {
		background-color: var(--paper-2);
		padding: 0.5em;
		overflow-y: auto;
	}

	#readme {
		height: 100%;
		width: calc(100% - var(--size-6) * 2);
		justify-self: center;
		overflow-y: auto;
		padding: 0 var(--size-6);
		color: var(--color-text-bold);
	}

	:global(#readme img) {
		max-width: 100%;
	}
</style>

<section>
	<div id="treeview">
		<!-- TODO replace these hardecoded top level folder with an array generated from a (enum||whitelist).json -->
		<TreeView
			path="AtelierNum"
			files={[
				{ path: "AtelierNum/templates", depthLimit: "3" },
				{ path: "AtelierNum/unity_toolkit", depthLimit: "3" },
			]}
		/>
	</div>
	<div id="readme" on:click|preventDefault={redirectLinkInBrowser}>
		{@html readmeContent ? readmeContent : noReadmeMessage}
	</div>
</section>
