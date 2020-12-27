const {ipcRenderer}  = require('electron');

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'fido',
		ipcRenderer
	}
});

export default app;