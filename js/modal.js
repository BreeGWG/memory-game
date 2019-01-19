
/**
 * @description Modal overlay constructor class
 * @param {string} type of prompt. default is confirm.
 * @param {string} title /header 
 * @param {string} status /message 
 * @param {string} time /game time
 */
function Modal(type,title, status, time) { 

    ++Modal.baseIndex;// number of modal
    this.type =  type || "confirm"; //default modal type.
    this.title = title || ""; 
    this.status =  (status || "").split('\n').join('<br>');// formats message text string
    this.time = time || "";
    this.index = Modal.baseIndex; 
    this.elem = null; // DOM object will be refe
}

Modal.baseIndex = 900; //modal id number
Modal.collection = []; //collection of open modals

/**
 * @description Closes all open modals.
 */
Modal.closeAll = function () {

    for (var index = Modal.collection.length -1; index >= 0; index--) {
        var modal = Modal.collection[index];
        modal.close();
    }

};

/**
 * @description Gets the title property of a modal.
 * @returns {string} title
 */
Modal.prototype.getTitle = function () {
    return this.title;
};


/**
 * @description uses AJAX to get modal template.
 * And then displays a modal on the DOM
 * This method takes a callback function as its parameter.
 */
Modal.prototype.open = function (cb) {
    if (this.elem !== null){
        return; // the modal is already open
    }
    var xhr = new XMLHttpRequest();
    var that = this;
    xhr.open("GET", "/tpls/modal.html", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

            that._view(xhr.responseText, cb);

        }
    };
    xhr.send();
};

/**
 * @description Handles the structure and style of the modal.
 * Also, adds open modals to an collection array.
 * This method takes an html snippet (html) as its first parameter
 * This method takes and a callback function as the second parameter
 */
Modal.prototype._view = function (html, cb) { //_intent private method
    var currentModal = this;


    this.elem = document.createElement("div");

    this.elem.classList.add("modal-container");
    this.elem.innerHTML = html;
    document.body.appendChild(this.elem);
    this.elem.querySelector(".modal").style.zIndex = this.index;
    this.elem.querySelector(".modal-title").innerHTML = this.title;


    if (this.time) {

        document.querySelector(".time-stamp").innerHTML = this.time;
    }

    if (this.status) {
        document.querySelector(".star-status").innerHTML = this.status;
    }


    //hids cancel button for alert modal
    if (this.type === "alert") {
        document.querySelector(".cancel").classList.add("hide");
        document.querySelector(".try-again").classList.add("hide");
    }
    else {
        document.querySelector(".cancel").classList.remove("hide");
        document.querySelector(".try-again").classList.remove("hide");
    }
    
    this.elem.addEventListener("click", function (e) {
        currentModal.clickHandler(e, cb);
    }, false);

    Modal.collection.push(this);

};

/**
 * @description Adds an click event hander to each modal instance.
 * This method takes a DOM (event) as its first parameter.
 * This method takes an optional callback function as the second parameter.
 */
Modal.prototype.clickHandler = function (event, cb) {

    if(event.target.classList.contains("ok")) {
        if(cb) {
            cb();
        }
        this.close();
    }
    if (event.target.classList.contains("cancel")) {
        this.close();
    }

};

/**
 * @description This modal removed the display of an given instance of a modal.
 */
Modal.prototype.close = function () {

    if (this.elem === null){
        return; // the modal was not open
    }

    this.elem.parentNode.removeChild(this.elem);
    this.elem = null;

    // remove modal for collection of opened modals
    for (var index = 0; index < Modal.collection.length; index++) {
        var modal = Modal.collection[index];
        if (modal === this) {
            Modal.collection.splice(index,1);
            break;
        }
    }
};
