function showText() {
    var req = new XMLHttpRequest();
    req.open('GET', '../../Data');
    req.onload = function () {
        if (this.status == 200) {
            document.getElementById("MAINSHOW").textContent = this.responseText;
        } else {
            document.getElementById("MAINSHOW").textContent = 'ERROR';
        }
    }
    req.onerror = function () {
        document.getElementById("MAINSHOW").textContent = 'ERROR';
    }
    req.send();
}

function showAdd() {
    document.getElementById("addForm").style.visibility = "visible";
}

function sendAdd() {
    var req = new XMLHttpRequest();
    var title = document.getElementById("titleTF").value;
    var value = document.getElementById("valueTF").value;
    var color = document.getElementById("colorTF").value;
    if (title !== "" && value !== "" && color !== "") {
        req.open('GET', "../../add?title=" + title + "&value=" + value + "&color=" + color);
        req.send();
    }
}

function showRemove() {
    document.getElementById("removeForm").style.visibility = "visible";
}

function sendRem() {
    var req = new XMLHttpRequest();
    var index = new Number(document.getElementById("indexTF").value);
    if (index !== "") {
        req.open('GET', "../../remove?index=" + index);
        req.send();
    }
}

function clearData() {
    var req = new XMLHttpRequest();
    req.open('GET', "../../clear");
    req.send();
}

function restoreData() {
    var req = new XMLHttpRequest();
    req.open('GET', "../../restore");
    req.send();
}

function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

function showPieChart() {
    var div = document.getElementById("pieDiv");
    div.innerHTML = ""
    var req = new XMLHttpRequest();
    req.open('GET', '../../PieCh');
    req.onload = function () {
        div.innerHTML = this.responseText;
    }
    req.onerror = function () {
        div.innerHTML = 'ERROR';
    }
    req.send();
}

function showLocalPieChart() {
    /* use the relative URL /Data to get the JSON, then create the SVG directly into the local browser and then insert it into the HTML to display it. */
    var req = new XMLHttpRequest();
    req.open('GET', '../../Data');
    req.onload = function () {
        text_slices = this.responseText;
        var slices = JSON.parse(text_slices)
        var pie_div = document.getElementById("pieDiv");
        if (pie_div.childElementCount != 0) {
            pie_div.innerHTML = "";
        }
        var SVGPie = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        SVGPie.setAttribute("id", "pieChart");
        SVGPie.setAttribute('viewBox', "-1 -1 2 2");
        SVGPie.setAttribute("height", 500);
        SVGPie.setAttribute("width", 500);

        var value_tot = 0;
        for (var slice of slices) {
            value_tot += new Number(slice.value);
        }
        var cum = 0;
        for (var slice of slices) {
            var percent = slice.value / value_tot;
            var [x_start, y_start] = getCoordinatesForPercent(cum);
            cum += percent;
            var [x_end, y_end] = getCoordinatesForPercent(cum);

            var largeArcFlag = percent > .5 ? 1 : 0;

            var pathData = [
                `M ${x_start} ${y_start}`,
                `A 1 1 0 ${largeArcFlag} 1 ${x_end} ${y_end}`,
                `L 0 0`,
            ].join(' ');

            var pathPie = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathPie.setAttribute('d', pathData);
            pathPie.setAttribute('fill', slice.color);
            SVGPie.appendChild(pathPie);
        }
        pie_div.appendChild(SVGPie)

    }
    req.send();
}