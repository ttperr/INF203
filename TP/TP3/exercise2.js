"use strict";

function send() {
    var xhr = new XMLHttpRequest();
    var req = document.getElementById("textedit").value;
    console.log("" + req + " hello");
    if (req == "") return;
    req = "chat.php?phrase=" + req;
    xhr.open("GET", req);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log("Success")
            } else {
                console.log("Error")
            }
        }
    };
    xhr.send();
    document.getElementById("textedit").value = "";
}

function reload() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "chatlog.txt");
    xhttp.onload = function () {
        var div = document.getElementById("texta");
        var lines = this.responseText.split("\n").reverse();
        let n = div.childElementCount;
        for (let i = 0; i < n; i++)
            div.removeChild(div.firstChild);
        var p;
        for (let i in lines) {
            if (lines[i] == "") continue;
            p = document.createElement("p");
            p.textContent = lines[i];
            div.appendChild(p);
            if (div.childElementCount == 10) break;
        }
    }
    xhttp.send();
}

setInterval(reload, 100)

document.getElementById("sendbut").addEventListener("click", send);