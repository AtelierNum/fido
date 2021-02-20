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
