"use strict";

onmessage = (e) => {
  // catching messages from renderer process as `e.data`
};

// for debugging purposes
function log(msg) {
  return postMessage({ debug: { msg: msg } });
}
