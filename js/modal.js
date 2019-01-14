
function Modal(message) { 

    ++Modal.baseIndex; 
    this.message = message;
    this.index = Modal.baseIndex;
    this.elem = null // DOM object will be refe

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
    return this.message;
};

Modal.prototype.open = function () {
    if (this.elem !== null){
        return; // the modal is already open
    }
    var xhr = new XMLHttpRequest();
    var that = this;
    xhr.open("GET", "/tpls/modal.html", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

            that._view(xhr.responseText);
            

        }
    };
    xhr.send();
};

Modal.prototype._view = function (html) { //_intent private method

    this.elem = document.createElement("div");

    this.elem.classList.add("modal-container");
    this.elem.innerHTML = html;
    document.body.appendChild(this.elem);

    this.elem.querySelector(".modal").style.zIndex = this.index;
    this.elem.querySelector(".modal-title").innerHTML = this.message; 

    Modal.collection.push(this);

};

Modal.prototype.clickHandler = function () {
    
}

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

}