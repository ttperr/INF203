"use strict";

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("texta").textContent =
                this.responseText;
        }
    };
    xhttp.open("GET", "text.txt", true);
    xhttp.send();
}

/* inserts the text no longer in a textarea, but with each line in a p element with a style attribute that assigns different colors to each line of inserted text. */

function generateColor() {
    var color = "#";
    var letters = "0123456789ABCDEF";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function loadDoc2() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Split the response text into an array of lines
            let lines = this.responseText.split("\n");
            for (let i = 0; i < lines.length; i++) {
                let p = document.createElement("p");
                p.style.color = generateColor();
                p.innerHTML = lines[i];
                document.getElementById("texta2").appendChild(p);
            }
        };
    }
    xhttp.open("GET", "text.txt", true);
    xhttp.send();
}

document.getElementById("b1").addEventListener("click", loadDoc);
document.getElementById("b2").addEventListener("click", loadDoc2);