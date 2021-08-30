import { newTab } from "./tab.js";
import { urlParser } from "./url.js";
import startLinkCapturing from './linkDrop.js';


/**
 * loads the given url into new tab and page
 * 
 * @param {String} url 
 * @returns {String}
 */
function load(url) {

    // simple preprocessing
    url = url.trim();

    // condition to see wether the url is URL or a string
    if (urlParser(url)) {

        // changes the source of active page
        document.querySelector('.active-page').src = urlParser(url).href;

        // changes the url domain (not full url) of the tab
        document.querySelector('.active-tab>div>.url').textContent = urlParser(url).hostname;

        return urlParser(url).href;

    }

    else {

        // recursively calls when the parameter is not a URL
        load('https://www.google.com/search?q=' + encodeURI(url))
    }

}


// used to open new tab after opening the browser
window.onload = _ => {

    newTab();

    startLinkCapturing;

}
window.newTab = newTab;

export { load }

/**
 * ############################################################################
 *
 *  remove all search to google search in render process
 *
 *  instead add needed scripts and change location within the default.html
 *
 *  Investigate on custom scrollbar
 *
 *  Investigating on incorrect hostname of new tab
 *
 *  Add tab close and drag functionalities
 *
 *  Add dark and light theme support
 *
 *  Overall performance improvements
 *
 * ##############################################################################
 */