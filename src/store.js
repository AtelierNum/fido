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
	// 	message: "download complete",
	// },
]);
let toastCounter = 0; //used to generate unique toast.id
export const addToast = toast => {
	toasts.update(toasts => {
		toastCounter += 1;
		toast.id = toastCounter;
		console.dir(toasts);
		return [toast, ...toasts];
	});
};
export const removeToastById = id => {
	console.log("removing id ", id);
	toasts.update(toasts => {
		return toasts.filter(e => e.id != id);
	});
};
