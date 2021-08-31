'use strict';


import { newTab } from './tab.js'

/**
 * 
 * this script is working perfectly but the way to capture the link is still doubt
 * 
 */
export default (_ => {

    var linkCapture = document.getElementById('capture-link');

    linkCapture.oninput = _ => {

        var url = linkCapture.value;

        if (url == '') return false;

        if (linkCapture.checkValidity()) {

            newTab(url);
            linkCapture.value = '';

        }

        else {

            url = 'https://www.google.com/search/?q=' + encodeURI(url);

        }

    }


})()