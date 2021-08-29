import { setDynamicColor } from "./dynamicColor.js";
import { addEvents } from "./events.js";
import { urlParser } from "./url.js";


// container Elements
const tabC = document.getElementById("tabs-container");
const pageC = document.getElementById('content');


/**
 * dynamic tab template
 * 
 * @param {Number} id 
 * @param {String} favicon 
 * @param {String} title 
 * @param {String} url 
 * @param {String} hostname 
 * @returns {String}
 */
const tabT = (id, favicon, title, url, hostname) => {

    var template =
        `<div class="active-tab tab" id=${'tab' + id}>
    <img src="${favicon}">
    <div class="address-bar">
        <span class="title">${title}</span>
        <span class="url">${hostname}</span>
        <input type="url" value="${url}">
        <img src=${url.includes('https://') ? 'assets/icons/secure_filled.svg' : ''}>
    </div>
    <img src="assets/icons/more-circle-filled.svg">
</div>`;

    //returns a parsed node element
    return (new DOMParser().parseFromString(template, 'text/html').body.childNodes)[0];

};

/**
 * dynamic page template
 * 
 * @param {Number} id
 * @param {String} url
 * @returns {String}
 */
const pageT = (id, url) => {

    var template = `<webview src=${url} frameborder="0" id=${'page' + id} class="active-page"></webview>`;

    // returns parsed node element
    return (new DOMParser().parseFromString(template, 'text/html').body.childNodes)[0];

};

// defining id incase if exporting needed
let id;


/**
 * ### Creates new tab
 * only the url parameter is mandatory others are optional
 * 
 * to open default new tab then simply call `newTab()` without url parameter
 * 
 * @param {String} url mandatory
 * @param {String} favicon optional
 * @param {String} title optional
 * @param {String} hostname optional
 */
function newTab(url, favicon, title, hostname) {

    // set new unique id locally
    id = Date.now();

    // conditioning parameters
    url = url == undefined ? "pages/newTab.html" : (urlParser(url) ? urlParser(url) : url);
    hostname = hostname == undefined ? url.hostname || url : hostname;
    title = title == undefined ? hostname || url : title;
    favicon = favicon == undefined ? 'assets/loading.svg' : favicon;

    // check for new tab
    hostname = hostname.includes('newTab.html') ? 'New tab' : hostname;


    // toggles existing active tab and page for new
    if (document.getElementsByClassName('active-tab').length > 0) {

        setTimeout(() => {

            document.getElementsByClassName('active-tab')[0].classList.toggle('active-tab');
            document.getElementsByClassName('active-page')[0].classList.toggle('active-page');

        }, .4e3);

    }


    // special condition for new tab only
    if (url == undefined) {

        tabC.appendChild(tabT(id, favicon, 'New tab', '', 'New tab'));
        pageC.appendChild(pageT(id, "pages/newTab.html"));

    }

    else {

        // sets url value instead of URL Object
        url = typeof url == "object" ? url.href : url;

        tabC.appendChild(tabT(id, favicon, title, url, hostname));
        pageC.appendChild(pageT(id, url));

    };

    // attach all events for a page
    addEvents(id);

};

/**
 * for a given id this removes the tab and page from the DOM after 0.4s of animation
 * 
 * @param {String} id id of tab
 */
function closeTab(id) {

    var tb = document.getElementById(id),
        wv = document.getElementById(id.replace('tab', 'page')),
        tabs = [...document.getElementsByClassName('tab')],
        tbIndex = tabs.indexOf(tb);

    tb.classList.add('close-tab');
    wv.classList.add('close-page');

    setTimeout(_ => {

        tb.remove();
        wv.remove();

        
        // exits app when all tabs are closed
        if (tabs.length == 1) {

            return document.querySelector("#title-bar-buttons > img:nth-child(3)").click();

        }


        // switch to next tab when there is no previous tab
        if (tbIndex == 0) {

            var nextTab = tabs[1];

            nextTab.classList.add('active-tab');
            document.getElementById(nextTab.id.replace('tab', 'page')).classList.add('active-page');

        }


        // switch to previous tab
        else if (tbIndex > 0) {

            var nextTab = tabs[tbIndex-1];

            nextTab.classList.add('active-tab');
            document.getElementById(nextTab.id.replace('tab', 'page')).classList.add('active-page');

        }


        setDynamicColor();

    }, .4e3);

}


export { newTab, closeTab };