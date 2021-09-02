module.exports = {
    packagerConfig: {
        icon: "./appIcons/icon",
        prune: true,
        asar: true,
        appCopyright: "Copyright © 2021 Rajaniraiyn",
        junk: true,
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "RajBrowser",
            },
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin"],
        },
        {
            name: "@electron-forge/maker-deb",
            config: { },
        },
        {
            name: "@electron-forge/maker-rpm",
            config: { },
        },
    ],
};
