<script>
	import marked from "marked";
	import { focusedGitHubPath } from "../store";
	import TreeView from "../components/TreeView/TreeView.svelte";

	let readmeContent = "";
	let readmes = {};

	const markdownImageSrc = /!\[\]\(.+\)/gi;//will also match image links
	const markdownImageLink = /!\[\]\(http.+\)/gi;

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
						.join("/")}/main/${value
						.split("/")
						.slice(2)
						.join("/")}/README.md`
				)
					.then(res =>
						res.ok
							? res.text()
							: 'No readme found in this folder. Is it named "README.md"?'
					)
					.then(data => {
						data = data.replaceAll(markdownImageLink, match => 
							`<img src="${match.slice(4, -1)}">`
						);

						data = data.replaceAll(markdownImageSrc, match => {
							return `<img src="https://raw.githubusercontent.com/${value
								.split("/")
								.slice(0, 2)
								.join("/")}/main/${match.slice(4, -1)}">`;
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
</script>

<style>
	section {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template: 100% / auto 1fr;
		grid-gap: 1em;
	}

	ul {
		list-style-type: none;
	}

	#readme {
		height: 100%;
		width:100%;
		justify-self: center;
		overflow-y: auto;
	}

	/* TODO maybe catch the navigation event when bubbling up then prevent_default and open the link in default browser wtih {shell} = require("electron") */
	:global(#readme a) {
		color: inherit;
		text-decoration: none;
		pointer-events: none;
	}

	:global(#readme img) {
		max-width: 100%;
	}
</style>

<section>
	<div>
		<!-- TODO replace these hardecoded top level folder with an array generated from a (enum||whitelist).json -->
		<TreeView
			path="AtelierNum"
            files={[{ path: 'AtelierNum/boilerplates', depthLimit: '3' }, { path: 'AtelierNum/unity_toolkit', depthLimit: '3' }]} /> 
	</div>
	<div id="readme" on:click|preventDefault>
		{@html readmeContent}
	</div>
</section>
