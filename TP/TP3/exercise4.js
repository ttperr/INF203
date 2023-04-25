"use strict";

var slides;
var numberOfSlides;
var counter = -1;
var pause = false;
var time;
var div

/* loads the slides.json file with AJAX and renders the object described in the file */
function load() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "slides.json");
    xhr.onload = function () {
        slides = JSON.parse(this.responseText);
        numberOfSlides = slides.slides.length;
    }
    xhr.send();
}

load();

function play() {
    counter++;
    console.log("Before : " + counter)
    div = document.getElementById("container");
    while (div.childElementCount != 0) {
        div.removeChild(div.firstChild);
    }
    var frame = document.createElement("iframe");
    frame.src = slides.slides[counter].url;
    frame.style.height = "100%";
    frame.style.width = "100%";
    div.appendChild(frame);
    console.log("After : " + counter)
    if (counter < numberOfSlides && !pause) {s
        setTimeout(play, 2000);
    }
}

function pauseBut() {
    if (pause) {
        pause = true;
    } else {
        pause = false;
        play();
    }
}

function next() {
    pause = true;
    console.log("Before : " + counter)
    if (counter < numberOfSlides) {
        counter++;
        div = document.getElementById("container");
        while (div.childElementCount != 0) {
            div.removeChild(div.firstChild);
        }
        var frame = document.createElement("iframe");
        frame.src = slides.slides[counter].url;
        frame.style.height = "100%";
        frame.style.width = "100%";
        div.appendChild(frame);
        console.log("After : " + counter)
    } else { return; }
}

function previous() {
    pause = true;
    console.log("Before : " + counter)
    if (counter > 0) {
        counter--;
        div = document.getElementById("container");
        while (div.childElementCount != 0) {
            div.removeChild(div.firstChild);
        }
        var frame = document.createElement("iframe");
        frame.src = slides.slides[counter].url;
        frame.style.height = "100%";
        frame.style.width = "100%";
        div.appendChild(frame);
        console.log("After : " + counter)
    } else { return; }
}