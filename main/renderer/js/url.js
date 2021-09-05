"use strict";

/**
 * checks wether the parameter string is in url structure using RegExp
 *
 * @param {String} str
 * @returns {Boolean}
 */
function url_is(str) {
  return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(str);
}

/**
 * adds secure https incase of protocol is not specified in url string
 *
 * also enforces secure https
 */
/**
 *
 * @param {String} url
 * @returns {Sting}
 */
function addHTTPS(url) {
  return (
    0 == url.startsWith("https://") &&
    (url.startsWith("http://")
      ? url.replace("http://", "https://")
      : (url = "https://" + url)),
    url
  );
}

/**
 * A wrapper function for `addHTTPS()` and `url_is()` functions
 *
 * returns a URL Object for a given url parameter else returns `false`
 *
 * @param {String} url
 * @returns {URL} URL Object or Boolean
 */
function urlParser(url) {
  // adds protocols if not
  url = addHTTPS(url);

  // condition wether the given is a URL
  // if yes then the url String is converted into URL Object
  if (url_is(url)) {
    return new URL(url);
  }

  // returns false if the parameter is not a URL
  return false;
}

export { urlParser };
