"use strict";

var slides;

/* loads the slides.json file with AJAX and renders the object described in the file */
function load() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "slides.json");
    xhr.onload = function () {
        slides = JSON.parse(this.responseText);
    }
    xhr.send();
}

/* plays the slideshow: at the time indicated by time, empty the div with id="container" and add in this div an iframe pointing to the given URL. The id of the play button shall be start. */
function play_slide(url) {
    var div = document.getElementById("container");
    if (div.firstChild) div.removeChild(div.firstChild);
    var frame = document.createElement("iframe");
    frame.src = url;
    frame.style.height = "100%";
    frame.style.width = "100%";
    div.appendChild(frame);
}

function play() {
    for (var i in slides.slides) {
        setTimeout(play_slide, 1000 * slides.slides[i].time, slides.slides[i].url);
    }
}

load();