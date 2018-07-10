// @flow
const electron = require("electron");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const shell = electron.shell;

/**
 * [Messages description]
 * @type {Object}
 */
const Translations = require("./main-messages");

class MenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(locale) {

    // currently default is en-US
    if (locale !== "zh-CN") {
      locale = "en-US"
    }

    const messages = Translations[locale]

    if (
      process.env.NODE_ENV === "development" ||
      process.env.DEBUG_PROD === "true"
    ) {
      this.setupDevelopmentEnvironment();
    }

    let template;

    if (process.platform === "darwin") {
      template = this.buildDarwinTemplate(messages);
    } else {
      template = this.buildDefaultTemplate(messages);
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on("context-menu", (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: "Inspect element",
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate(messages) {
    const subMenuAbout = {
      label: messages.name,
      submenu: [
        {
          label: messages["about-hydrogen"],
          selector: "orderFrontStandardAboutPanel:"
        },
        {
          label: messages["hide-hygrogen"],
          accelerator: "Command+H",
          selector: "hide:"
        },
        {
          label: messages["hide-others"],
          accelerator: "Command+Shift+H",
          selector: "hideOtherApplications:"
        },
        { label: messages["show-all"], selector: "unhideAllApplications:" },
        { type: "separator" },
        {
          label: messages["quit"],
          accelerator: "Command+Q",
          click: () => {
            app.exit(0);
          }
        }
      ]
    };
    const subMenuEdit = {
      label: messages["edit"],
      submenu: [
        { label: messages["undo"], accelerator: "Command+Z", selector: "undo:" },
        { label: messages["redo"], accelerator: "Shift+Command+Z", selector: "redo:" },
        { type: "separator" },
        { label: messages["cut"], accelerator: "Command+X", selector: "cut:" },
        { label: messages["copy"], accelerator: "Command+C", selector: "copy:" },
        { label: messages["paste"], accelerator: "Command+V", selector: "paste:" },
        {
          label: messages["select-all"],
          accelerator: "Command+A",
          selector: "selectAll:"
        }
      ]
    };
    
    const subMenuViewDev = {
      label: messages["view"],
      submenu: [
        {
          label: messages["view-reload"],
          accelerator: "Command+R",
          click: () => {
            this.mainWindow.webContents.reload();
          }
        },
        {
          label: messages["view-fullscreen"],
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "Alt+Command+I",
          click: () => {
            this.mainWindow.toggleDevTools();
          }
        }
      ]
    };

    const subMenuViewProd = {
      label: messages["view"],
      submenu: [
        // {
        //   label: messages["view-reload"],
        //   accelerator: "Command+R",
        //   click: () => {
        //     this.mainWindow.webContents.reload();
        //   }
        // },
        {
          label: messages["view-fullscreen"],
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        }
      ]
    };
    const subMenuWindow = {
      label: messages["window"],
      submenu: [
        {
          label: messages["window-minimize"],
          accelerator: "Command+M",
          selector: "performMiniaturize:"
        },
        { label: messages["window-bring-all-to-front"], selector: "arrangeInFront:" }
      ]
    };

    const subMenuHelp = {
      label: messages["help"],
      submenu: [
        {
          label: messages["document"],
          click() {
            shell.openExternal(
              "https://github.com/Xmader/hydrogen"
            );
          }
        },
        {
          label: messages["community"],
          click() {
            shell.openExternal("https://github.com/Xmader/hydrogen/issues");
          }
        },
        {
          label: messages["search-issues"],
          click() {
            shell.openExternal("https://github.com/Xmader/hydrogen/issues");
          }
        }
      ]
    };

    const subMenuView = process.env.NODE_ENV === "development"
      ? subMenuViewDev
      : subMenuViewProd;

   return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];

  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: "&File",
        submenu: [
          {
            label: "&Close",
            accelerator: "Ctrl+W",
            click: () => {
              this.mainWindow.close();
            }
          }
        ]
      },
      {
        label: "&View",
        submenu: [
          {
            label: "Toggle &Full Screen",
            accelerator: "F11",
            click: () => {
              this.mainWindow.setFullScreen(
                !this.mainWindow.isFullScreen()
              );
            }
          }
        ]
      },
      {
        label: messages["help"],
        submenu: [
          {
            label: messages["document"],
            click() {
              shell.openExternal("http://origingroup.tech/");
            }
          },
          {
            label: messages["community"],
            click() {
              shell.openExternal(
                "https://github.com/origingroup/hydrogen/issues"
              );
            }
          },
          {
            label: messages["search-issues"],
            click() {
              shell.openExternal(
                "https://github.com/origingroup/hydrogen/issues"
              );
            }
          }
        ]
      }
    ];

    return templateDefault;
  }
}

module.exports = MenuBuilder;
