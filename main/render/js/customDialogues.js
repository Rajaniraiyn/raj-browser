/**
 * ################################################
 * 
 * My Brain is not getting how to implement this. As we have to pause the js execution and wait for the response
 * 
 * Anyone please help me out
 * 
 * ################################################
 */


/**
 * 
 * @param {String} message 
 * @param {String} _default 
 * @returns {String}
 */
const promptT = (message, _default) => {

    return `<div class="popup">
    <div class="popup-header">
        <b>${this.location.hostname} says</b>
    </div>
    <div class="popup-contents">
        <span>${message}</span>
        <br/>
        <input type="text" value="${_default}" autofocus>
    </div>
    <div class="popup-buttons">
        <button id="popup-left">OK</button>
        <button id="right-right">Cancel</button>
    </div>
</div>`

};

/**
 * 
 * @param {String} message 
 * @returns {String}
 */
const alertT = message => {

    return `<div class="popup">
    <div class="popup-header">
        <b>${this.location.hostname} says</b>
    </div>
    <div class="popup-contents">
        <span>${message}</span>
    </div>
    <div class="popup-buttons">
        <button id="popup-left">OK</button>
    </div>
</div>`

};;

/**
 * 
 * @param {String} message 
 * @returns {String}
 */
const confirmT = message => {

    return `<div class="popup">
    <div class="popup-header">
        <b>${this.location.hostname} says</b>
    </div>
    <div class="popup-contents">
        <span>${message}</span>
    </div>
    <div class="popup-buttons">
        <button id="popup-left">OK</button>
        <button id="right-right">Cancel</button>
    </div>
</div>`

};;


// back up of default system dialogues
const sysAlert = window.alert;
const sysConfirm = window.confirm;


/**
 * 
 * @param {String} message 
 * @param {String} _default 
 * @returns {String}
 */
function prompt(message, _default) {

    var template = promptT(message, _default);

    return _default;

}


/**
 * 
 * @param {String} message 
 * @param {Boolean} system 
 * @returns {void}
 */
function alert(message, system) {

    var template = alertT(message);

    if (system) return sysAlert(message);

}


/**
 * 
 * @param {String} message 
 * @param {Boolean} system 
 * @returns {Boolean}
 */
function confirm(message, system) {

    var template = confirmT(message);

    if (system) return sysConfirm(message);

    return false;

}


export { prompt, alert, confirm }


const dialogueStyles = 
`.popup{display:grid;overflow:hidden}
.popup{width:300px;height:auto;backdrop-filter:blur(5px);background-color:rgba(225,225,225,.1);grid-template-rows:auto 1fr auto;text-align:center;padding-bottom:10px;border-radius:10px;box-shadow:0 10px 39px 10px rgba(62,66,66,.22)}
.popup-header,button{user-select:none;user-drag:none}
.popup-header{padding:3px;background:rgba(225,225,225,.1)}
button{width:5rem;padding:.5rem;background-color:rgba(225,225,225,.2);margin-block:0;margin-inline:.5rem;box-shadow:0 10px 39px 10px rgba(62,66,66,.22)}
.popup-contents{padding:5px}
.popup-contents input,button:hover{background-color:rgba(225,225,225,.5)}
button:active{transform:scale(.9)}
.popup-contents input,button{border-radius:5px;outline:0;border:0}
.popup-contents input{font-size:1rem;padding:5px;width:200px;margin:5px}`