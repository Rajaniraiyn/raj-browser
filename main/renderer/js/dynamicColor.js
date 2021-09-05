"use strict";

import { snapPage } from "./snapPage.js";
import FastAverageColor from "./fastAverageColor.js";

/**
 * wrapper function for the FastAverage library
 * the second parameter sets the algorithm which is optional
 * by default it calculates the average color (uses fastest algorithm)
 * but for this browser we need dominant over average (not the fastest one)
 *
 * @param {Image} img
 * @param {Object} options
 * @returns {Object}
 */
var getAverageColor = (img, options) =>
  new FastAverageColor().getColorAsync(img, options);

/**
 * captures the active page and parses it for calculating the dominant color
 *
 * @param {String} id Id of page element
 */
async function setDynamicColor(id) {
  var img = await snapPage(id, true);
  getAverageColor(img, {
    algorithm: "dominant",
    mode: "speed",
  }).then((color) => {
    return (document.body.style.backgroundColor = color.rgb);
  });
}

export { setDynamicColor };
