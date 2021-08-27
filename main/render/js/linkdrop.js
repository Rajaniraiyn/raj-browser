import { newTab } from './tab.js'

/**
 * 
 * Not fully implemented
 * 
 */
export default (_ => {var linkCapture = document.getElementById('capture-link');

linkCapture.oninput = _ => {

    url = linkCapture.value;

    if (linkCapture.validate()) {

        newTab(url);
        linkCapture.value = '';

    }

    else {

        url = 'https://www.google.com/search/?q=' + encodeURI(url);

    }

}})()