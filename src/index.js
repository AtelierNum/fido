//TODO : contemplate if we can open the freshly downloaded folder into vscode instead of openning it in the file browser (maybe leave it up to the user between none or these two)
const { app, BrowserWindow, ipcMain, dialog, shell, nativeTheme } = require("electron");
const isDev = require("electron-is-dev");
const Store = require("electron-store");
const path = require("path");
const degit = require("degit");
const fs = require("fs").promises;

require("update-electron-app")();

const electronStore = new Store({
	schema: {
		theme: {
			type: "string",
			default: "system",
		},
		targetDir: {
			type: "string",
			default: path.join(app.getPath("documents"), "fido"),
		},
		alwaysAskTargetDir: {
			type: "boolean",
			default: false,
		},
		cacheDownloads: {
			type: "boolean",
			default: true,
		},
		openInExplorerAfterDownload: {
			type: "boolean",
			default: true,
		},
	},
});

nativeTheme.themeSource = electronStore.get("theme");

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
		width: 1024,
		height: 576,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			devTools: isDev,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "../public/index.html"));

	if (isDev) {
		// Open the DevTools.
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.setMenuBarVisibility(false);
	}
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

ipcMain.handle("download", async (event, { path }) => {
	try {
		const emitter = degit(path + "#main", {
			cache: electronStore.get("cacheDownloads") ?? false,
			force: true, //TODO set it to false and handle rejection
			verbose: true,
		});

		emitter.on("info", info => {
			event.sender.send("update", { info });
		});

		let targetPath = electronStore.get("alwaysAskTargetDir")
			? (
					await dialog.showOpenDialog({
						properties: [
							"openDirectory",
							"createDirectory",
							"promptToCreate",
							"dontAddToRecent",
						],
					})
			  ).filePaths[0]
			: electronStore.get("targetDir");
		targetPath += "/" + path.split("/").pop();
		await fs.mkdir(targetPath, { recursive: true });
		await emitter.clone(targetPath);
		//TODO : maybe don't open in file explorer right away
		//maybe show a toast containing a button to allow the opening in file expolrer
		if (electronStore.get("openInExplorerAfterDownload")) {
			shell.openPath(targetPath);
		}

		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
});

ipcMain.handle("select_target_dir", async (event, args) => {
	const selectedDir = (
		await dialog.showOpenDialog({
			properties: ["openDirectory", "createDirectory", "promptToCreate", "dontAddToRecent"],
		})
	).filePaths[0];
	electronStore.set("targetDir", selectedDir);
	return selectedDir;
});

ipcMain.handle("get_target_dir", () => {
	return electronStore.get("targetDir");
});

ipcMain.handle("select_dir", async () => {
	const selectedDir = (
		await dialog.showOpenDialog({
			properties: ["openDirectory", "createDirectory", "promptToCreate", "dontAddToRecent"],
		})
	).filePaths[0];
	return selectedDir;
});

ipcMain.handle("get_settings", () => {
	return electronStore.get();
});

ipcMain.handle("update_settings", (event, args) => {
	electronStore.set(args.settings);
	nativeTheme.themeSource = args.settings.theme;
});
