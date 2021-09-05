"use strict";

/**
 * captures the active page
 *
 * @param {String} id Id of page element
 * @param {Boolean} forColor used only for dynamic color
 * @returns {Promise}
 */
async function snapPage(id, forColor = false) {
  // get currently active page
  var wv = document.getElementById(id);

  // check wether wv element exists
  if (wv == null && document.getElementsByTagName("webview").length > 0) {
    wv = document.getElementsByClassName("active-page")[0];
  }

  var rect = [
    0, //x
    0, //y
    wv.clientWidth || wv.offsetWidth, //width
    wv.clientHeight || wv.offsetHeight, //height
  ];

  if (forColor) rect[3] = 50; //for dynamic color

  /**
   * default API in electron to capture the page returns a Promise
   * https://www.electronjs.org/docs/latest/api/webview-tag/#webviewcapturepagerect
   */
  let promise = new Promise((resolve, reject) => {
    wv.capturePage(rect).then((imgProm) => {
      // resolves captured image as data url

      resolve(imgProm.toDataURL());
    });
  });
  return promise;
}

export { snapPage };
