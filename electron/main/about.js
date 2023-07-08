import { join } from 'node:path'
import { app, BrowserWindow, nativeTheme } from 'electron'
import { win } from "./index"

let aboutWindow = null;

export function openAboutWindow() {
    if (!aboutWindow) {
        aboutWindow = new BrowserWindow({
            parent: win,
            width: 400,
            height: 300,
            resizable: false,
            minimizable: false,
            maximizable: false,
            fullscreen: false,
            fullscreenable: false,
            //backgroundColor: nativeTheme.shouldUseDarkColors ? '#262B37' : '#FFFFFF',
            title: "About Heynote",
            show: false,
            webPreferences: {
                preload: join(__dirname, '../preload/about-preload.js'),
                nodeIntegration: true,
            }
        })

        if (process.env.VITE_DEV_SERVER_URL) {
            aboutWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}about.html`)
        } else {
            aboutWindow.loadFile(join(process.env.DIST, 'about.html'))
        }

        // don't show until content is loaded
        aboutWindow.webContents.on("did-finish-load", () => {
            aboutWindow.webContents.send("init", {
                "version": app.getVersion(),
            });
            aboutWindow.show()
        })
        aboutWindow.on("close", () => {
            // this avoids a flash of white when the window is closed
            aboutWindow.hide()
            aboutWindow = null;
        })
    } else {
        aboutWindow.show()
        aboutWindow.focus()
    }
}
