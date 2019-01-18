function Modal(title, status, time) { 

    ++Modal.baseIndex; 
    this.title = title;
    this.status =  status || "";
    this.time = time || "";
    this.index = Modal.baseIndex;
    this.elem = null; // DOM object will be refe

}

Modal.baseIndex = 900;
Modal.collection = [];

Modal.closeAll = function () {

    for (var index = Modal.collection.length -1; index >= 0; index--) {
        var modal = Modal.collection[index];
        modal.close();
    }

};

Modal.prototype.getMessage = function () {
    return this.title;
};

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

Modal.prototype._view = function (html, cb) { //_intent private method
    var currentModal = this;


    this.elem = document.createElement("div");

    this.elem.classList.add("modal-container");
    this.elem.innerHTML = html;
    document.body.appendChild(this.elem);
    this.elem.querySelector(".modal").style.zIndex = this.index;
    this.elem.querySelector(".modal-title").innerHTML = this.title;

    if (this.title.includes("lost")) {
        document.querySelector(".time-stamp").style.visibility = "hidden";
        document.querySelector(".star-status").style.visibility = "hidden";
    }
    else {
        document.querySelector(".time-stamp").style.visibility = "visible";
        document.querySelector(".star-status").style.visibility = "visible";
    }


    this.elem.addEventListener("click", function (e) {
        currentModal.clickHandler(e, cb);
    }, false);

    Modal.collection.push(this);

};

Modal.prototype.clickHandler = function (event, cb) {

    if(event.target.classList.contains("ok")) {

        cb();
    }
    this.close();

};

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
