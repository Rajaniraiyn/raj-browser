const settings = {
    enableAdblock: true,
    enableDownloadManager: true,
    defaultFont: "sansSerif",
    alwaysOnTop: false,
    backgroundColor: "#FFF",
    opacity: true,
    nodeIntegration: false,
    zoomFactor: 1.0,
    experimentalFeatures: false,
    animationsAndTimersOnBackground: false,
    autoplayPolicy: "document-user-activation-required",
    disableFullScreen: false,
    spellcheck: false,
    theme: "light",
    clearCookiesOnExit: true,
    hideCursorWhileTyping: false
}

try {
    window.settings = document.settings = settings;
}
catch (error) {
    module.exports = settings;
}