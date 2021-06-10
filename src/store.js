import { writable } from "svelte/store";

export const focusedGitHubPath = writable(null);
export const focusedPathisLeaf = writable(false);

export const toasts = writable([
	// {
	// 	id: 0,
	// 	type: "success",
	// 	message: "download complete",
	// },
	// {
	// 	id: 1,
	// 	type: "error",
	// 	message: "uh oh",
	// },
]);
let toastCounter = 0; //used to generate unique toast.id
export const addToast = toast => {
	toasts.update(toasts => {
		toastCounter += 1;
		toast.id = toastCounter;
		return [toast, ...toasts];
	});
};
export const removeToastById = id => {
	toasts.update(toasts => toasts.filter(e => e.id != id));
};

// export const fileTree = writable({
// 	path: "AtelierNum",
// 	expanded: true,
// 	children: [
// 		{
// 			path: "AtelierNum/templates",
// 			expanded: false,
// 			children: null,
// 			depthLimit: "3",
// 		},
// 		{
// 			path: "AtelierNum/unity_toolkit",
// 			expanded: false,
// 			children: null,
// 			depthLimit: "3",
// 		},
// 	],
// });

//children null means "unfetched"
//children {} means "fetched but nothing came back"
export const repoTree = writable({
	path: "AtelierNum",
	expanded: true,
	children: {
		templates: {
			path: "AtelierNum/templates",
			expanded: false,
			depthLimit: "3",
			children: {
				NodeJS: {
					path: "AtelierNum/templates/NodeJS",
					expanded: false,
					children: null,
				},
			},
		},
		unity_toolkit: {
			path: "AtelierNum/unity_toolkit",
			expanded: false,
			children: {},
			depthLimit: "3",
		},
	},
});
