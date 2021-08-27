import FastAverageColor from './fastAverageColor.js'

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
var getAverageColor = (img, options) => (new FastAverageColor).getColorAsync(img, options);


/**
 * captures the active page and parses it for calculating the dominant color
 * 
 * @param {String} id Id of page element
 */
async function setDynamicColor(id) {

    // defined new image for the calculation
    var img = new Image();

    // get currently active page
    var wv = document.getElementById(id);


    // check wether wv element exists
    if (wv == null) {
        if (document.getElementsByTagName('webview').length > 0) {

            wv = document.getElementsByClassName('active-page')[0];

        }
        else {

            document.getElementById('color-bar').style.backgroundColor = "white";
            return;

        }
    }


    /** 
     * default API in electron to capture the page returns a Promise
     * https://www.electronjs.org/docs/latest/api/webview-tag/#webviewcapturepagerect
     */
    wv.capturePage(
        [
            0, //x
            0, //y
            wv.clientWidth || wv.offsetWidth, //width
            100 //height (only top 100px os the page )
        ]
    )
        .then(

            imgProm => {

                // sets the image source as the captured image data url
                img.src = imgProm.toDataURL();

                // gets dominant color of the image in speed mode,
                // by default the algorithm is simple and mode is precision
                // for the dynamic color we need dominant color as fast as we can
                // experiments: https://fast-average-color.github.io/examples/canvas.html 
                getAverageColor(img, {
                    algorithm: 'dominant',
                    mode: 'speed'
                })
                    .then(
                        color => {

                            // the promise returns an array
                            return document.getElementById('color-bar').style.backgroundColor = color.rgb;

                        }
                    )
            }
        )

}


export { setDynamicColor }