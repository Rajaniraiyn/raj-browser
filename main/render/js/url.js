"use strict";

/**
 * checks wether the parameter string is in url structure using RegExp
 *
 * @param {String} str
 * @returns {Boolean}
 */
function url_is(str) {
  return /^(?:(?:ht{2}ps?|ftp|file):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|2{2}[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u0{2}1-\uf{4}0-9]-*)*[a-z\u0{2}1-\uf{4}0-9]+)(?:\.(?:[a-z\u0{2}1-\uf{4}0-9]-*)*[a-z\u0{2}1-\uf{4}0-9]+)*(?:\.(?:[a-z\u0{2}1-\uf{4}]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(
    str
  );
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
