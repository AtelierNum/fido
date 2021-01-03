//TODO : contemplate if we can open the freshly downloaded folder into vscode instead of openning it in the file browser (maybe leave it up to the user between none or these two)
const {
	app,
	BrowserWindow,
	ipcMain,
	dialog,
	shell,
	nativeTheme,
} = require("electron");
const Store = require("electron-store");
const path = require("path");
const degit = require("degit");

//TODO stop forcing light mode once the styling is done
nativeTheme.themeSource = "light";
/* here is a bit of CSS to support both for when I'll do the styling, but now I have to catch some Zs
@media (prefers-color-scheme: dark) {
	body { background:  #333; color: white; }
}

@media (prefers-color-scheme: light) {
	body { background:  #ddd; color: black; }
}
*/

//TODO maybe have a boolean to ask if we should use a general targetDir or let a user select a targetDir for every download
const electronStore = new Store({
	schema: {
		targetDir: {
			type: "string",
			default: path.join(app.getPath("documents"), "fido"),
		},
	},
});

// Live Reload
require("electron-reload")(__dirname, {
	electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
	awaitWriteFinish: true,
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "../public/index.html"));

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle("download", (event, { path }) => {
	const emitter = degit(path + "#main", {
		cache: true, //TODO maybe leave this up to the user as a checkbox in a preference page
		force: true, //TODO maybe leave this up to the user as a checkbox in a preference page
		verbose: true,
	});

	emitter.on("info", info => {
		event.sender.send("update", { info });

		//TODO : maybe don't open in file explorer right away
		//maybe show a toast containing a button to allow the opening in file expolrer
		if (info.code == "SUCCESS") {
			shell.openPath(info.dest);
		}
	});

	emitter
		.clone(electronStore.get("targetDir") + "/" + path.split("/").pop())
		.then(() => {
			/*no-op*/
		});
});

ipcMain.handle("select_target_dir", async (event, args) => {
	const selectedDir = (
		await dialog.showOpenDialog({
			properties: [
				"openDirectory",
				"createDirectory",
				"promptToCreate",
				"dontAddToRecent",
			],
		})
	).filePaths[0];
	electronStore.set("targetDir", selectedDir);
	return selectedDir;
});

ipcMain.handle("get_target_dir", () => {
	return electronStore.get("targetDir");
});
