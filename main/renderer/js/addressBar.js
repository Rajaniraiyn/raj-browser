import { urlParser } from "./url.js";

/**
 * makes user able to edit the URL of the active page
 * 
 * @param {Number} id
 */
function addressBar(id) {
    var aTabURL = document.querySelector(`#tab${id}>div>input[type=url]`);

    aTabURL.onkeydown = (e) => {
        var url = aTabURL.value;
        if ("Enter" === e.key && "" !== url) {
            if (urlParser(url)) {
                url = urlParser(url);
                document.getElementsByClassName("active-page")[0].src = aTabURL.value = url.href;
                document.getElementsByClassName("active-tab")[0]
                    .getElementsByClassName("url")[0].textContent = url.hostname;
            } else {
                url = "https://www.google.com/search?q=" + encodeURIComponent(url);
                if (urlParser(url)) {
                    url = urlParser(url);
                    document.getElementsByClassName("active-page")[0].src = aTabURL.value = url.href;
                    document.getElementsByClassName("active-tab")[0]
                        .getElementsByClassName("url")[0].textContent = url.hostname;
                }
            }
        }
    };
}

export { addressBar };
