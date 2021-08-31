const { ElectronBlocker, fullLists } = require("@cliqz/adblocker-electron");
const { readFileSync, writeFileSync } = require("fs");
const fetch = require("node-fetch");

const adBlocker = ElectronBlocker.fromLists(
  fetch,
  fullLists,
  {
    enableCompression: true,
  },
  {
    path: "./main/adblock/adblockCache.bin",
    read: async (...args) => readFileSync(...args),
    write: async (...args) => writeFileSync(...args),
  }
);

// all listeners for logging
/*
blocker.on('request-blocked', (request) => {
    console.log('blocked', request.tabId, request.url);
});

blocker.on('request-redirected', (request) => {
    console.log('redirected', request.tabId, request.url);
});

blocker.on('request-whitelisted', (request) => {
    console.log('whitelisted', request.tabId, request.url);
});

blocker.on('csp-injected', (request) => {
    console.log('csp', request.url);
});

blocker.on('script-injected', (script, url) => {
    console.log('script', script.length, url);
});

blocker.on('style-injected', (style, url) => {
    console.log('style', style.length, url);
});
*/

module.exports = adBlocker;
