"use strict";

import { setDynamicColor } from "./dynamicColor.js";
import { newTab, closeTab } from "./tab.js";
import { urlParser } from "./url.js";

/**
 * set tab and page elements from id;
 *
 *  @param {Number} id
 * @returns
 */
let webview = (id) => {
  return document.getElementById("page" + id);
};

/**
 * @param {Number} id
 * @returns
 */
let tab = (id) => {
  return document.getElementById("tab" + id);
};

// custom scrollbar to match browser UI
let scrollbarStyle = `::-webkit-scrollbar{width:.5rem}
::-webkit-scrollbar-track{border:none;background:none}
::-webkit-scrollbar-thumb{border-radius:10px;background:rgba(0,0,0,.2);min-height:50px;}
::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.4)}
::-webkit-scrollbar-thumb:active{background:rgba(0,0,0,.7)}`;

/**
 *
 * Useful for creating custom events
 *
 * @param {HTMLElement} el
 * @param {String} eventType
 * @param {String} detail
 * @returns
 */
const triggerEvent = (el, eventType, detail) => {
  return el.dispatchEvent(new CustomEvent(eventType, { detail }));
};

/**
 * sets all necessary events for webview in electron
 *
 * utilizes id generated during the tab and page creation by `newTab()` in tab.js
 *
 * @param {Number} id only from `newTab()`
 */
function addEvents(id) {
  // get tab and page elements from id
  var wv = webview(id),
    tb = tab(id),
    img = tb.getElementsByTagName("img")[0],
    url = tb.getElementsByClassName("url")[0];

  // triggered when the page stats loading
  wv.addEventListener("did-start-loading", (e) => {
    // check for false positive
    if (wv.isLoadingMainFrame()) img.src = "assets/loading.svg";

    if (e.url !== undefined) {
      url.textContent = e.url === "New tab" ? e.url : urlParser(e.url).hostname;
      document.querySelector(".active-tab> div > input[type=url]").value = urlParser(e.url).href;
    }
  });

  // triggered when the page stops loading
  // i.e. triggered even when the page is not fully loaded but stopped by user or other factors
  wv.addEventListener("did-stop-loading", (e) => {
    // to fix the issues with input cursor
    // https://github.com/electron/electron/issues/14474
    wv.blur();
    wv.focus();

    // sets dynamic color behind the top bar of the browser
    setDynamicColor("page" + id);

    // removes the splash screen after the new tab finished loading
    if (document.getElementById('splash-screen') !== null) {
      document.getElementById('splash-screen').remove()
    }
  });

  // triggered when error occurs
  wv.addEventListener("did-fail-load", e => {
    console.log(e);
  })

  // triggered when the page tries to open a link in new tab
  wv.addEventListener("new-window", (e) => {
    newTab(e.url);
  });

  // triggered when the page opens a url within itself as navigation
  wv.addEventListener("will-navigate", (e) => {
    console.log("will navigate event", e);

    if (e.url !== undefined)
      url.textContent = e.url === "New tab" ? e.url : urlParser(e.url).hostname;
    document.querySelector(".active-tab> div > input[type=url]").value = urlParser(e.url).href;
  });

  // triggered when media in page started playing
  wv.addEventListener("media-started-playing", (e) => {
    console.log(e);
  });

  // triggered when playing media in page paused or stopped playing
  wv.addEventListener("media-paused", (e) => {
    console.log(e);
  });

  // triggered when the page finished loading
  // i.e. all resources are finished loading
  wv.addEventListener("did-finish-load", (e) => {
    // condition for no favicons
    if (img.src.includes("src/loading.svg")) {
      img.src = "assets/icons/file.svg";
    }

    // condition for New Tab
    else if (wv.src.includes(settings.newTabPage)) {
      img.src = "assets/icons/window.svg";
    }

    // triggered when the page logs in dev console
    wv.addEventListener("console-message", (e) => {
      return e.message;
    });
  });

  // triggered when the page title changed
  wv.addEventListener("page-title-updated", (e) => {
    tb.getElementsByClassName("title")[0].textContent = e.title.trim();
    // used a silly way to reduce unwanted spaces
  });

  // triggered when the favicon of the page got updated
  // returns an event with available favicon url as array
  wv.addEventListener("page-favicon-updated", (e) => {
    // injects custom scrollbar style
    wv.insertCSS(scrollbarStyle);

    img.src = e.favicons[0];

    wv.addEventListener("did-start-loading", (_) => {
      if (wv.isLoading() != true) img.src = e.favicons[0];
    });
  });

  // triggered when the user hovers over any kind of link within the page
  wv.addEventListener("update-target-url", (e) => {
    console.log(e.url);
  });

  // this is for when the user directly inputs url into the tab
  wv.onchange = (_) => {
    url.textContent = urlParser(wv.src).hostname;
    document.querySelector(".active-tab> div > input[type=url]").value = urlParser(e.url).href;
  };

  // double click to close the tab
  tb.ondblclick = (e) => {
    if (e.target.tagName === "INPUT") return;
    closeTab("tab" + id);

    // sets dynamic color behind the top bar of the browser
    setDynamicColor("page" + id);
  };

  // click to switch between tabs
  tb.onclick = (_) => {
    if (tb.classList.contains("active-tab")) return false;

    document
      .getElementsByClassName("active-tab")[0]
      .classList.toggle("active-tab");
    tb.classList.add("active-tab");

    document
      .getElementsByClassName("active-page")[0]
      .classList.toggle("active-page");
    wv.classList.add("active-page");

    // sets dynamic color behind the top bar of the browser
    setDynamicColor("page" + id);
  };

  // mouse hover effects in tabs
  tb.onmousemove = (e) => {
    var rect = tb.getBoundingClientRect();
    tb.style.setProperty("--x", e.clientX - rect.left + "px");
    tb.style.setProperty("--y", e.clientY - rect.top + "px");
  };
}

export { addEvents, triggerEvent };
