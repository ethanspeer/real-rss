export function constructError (error_message) {
    var error = document.createElement("div");
    error.setAttribute("class", "error");
    error.innerHTML = error_message;
    return error;
}

export function checkURLExists (URL) {
    console.log(URL);
    return true;
}

export function checkNameExists (name) {
    if(name == "") {
        return false;
    } else {
        return true;
    }
}