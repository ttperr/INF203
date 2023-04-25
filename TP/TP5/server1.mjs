"use strict";

import { createServer } from "http";
import *  as url from "url";
import * as fs from "fs";
import * as querystring from "querystring";


const port = process.argv[2] || 8000;
console.log('PORT = ', port);

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.mjs': 'application/javascript'

};

function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

// request processing
function webserver(req, res) {
    console.log(req.method + ' ' + req.url);

    let url_parse = url.parse(req.url);
    let pathname = url_parse.pathname;

    try {
        if (pathname === "/") {
            // sending the header that says content will be in HTML
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('Working !', 'utf8');
            res.end();
            return;
        }

        // /kill” will stop the server.
        else if (pathname === "/end") {
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('The Server will stop now.', 'utf8', process.exit, 0);
            res.end();
            return;
        }

        else if (pathname.startsWith("/WWW/")) {

            console.log('pathname = ' + pathname);

            // fs did'nt read /www/exercise1c.html
            pathname = pathname.slice(5);

            if (pathname.startsWith("..")) {
                throw new Error('403');
            }

            console.log("Accessing to " + pathname);

            // checks if the folders and the file exist (using the fs module)
            if (!fs.existsSync(pathname)) {
                throw new Error('404');
            } else {
                var data = fs.readFileSync(pathname);
                var ext = pathname.slice(pathname.lastIndexOf('.'));
                res.writeHeader(200, { 'Content-Type': mimeType[ext] });
                res.write(data);
                res.end();
                return;
            }
        }

        else if (pathname.startsWith("/Data")) {
            if (!fs.existsSync("storage.json")) {
                throw new Error('404');
            } else {
                var data = fs.readFileSync("storage.json")
                res.writeHeader(200, { 'Content-Type': 'application/json' })
                res.write(data);
                res.end();
                return;
            }
        }

        else if (pathname.startsWith("/add")) {
            let query = querystring.parse(url_parse.query);
            console.log(query);
            var value = query.value;
            var title = query.title;
            var color = query.color;

            if (value == undefined || title == undefined || color == undefined) {
                throw new Error('400');
            }

            var data = fs.readFileSync("storage.json");
            var json = JSON.parse(data);
            var new_data = { "title": title, "value": value, "color": color };
            json.push(new_data);
            fs.writeFileSync("storage.json", JSON.stringify(json));
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('Data added', 'utf8');
            res.end();
            return;
        }

        else if (pathname.startsWith("/remove")) {
            let query = querystring.parse(url_parse.query);
            console.log(query);
            var data = JSON.parse(fs.readFileSync("storage.json"));
            data.splice(query.index, 1);
            fs.writeFileSync("storage.json", JSON.stringify(data));
            res.writeHeader(200);
            res.end();
            return;
        }

        else if (pathname.startsWith("/clear")) {
            fs.writeFileSync("storage.json", JSON.stringify([{ "title": "empty", "color": "red", "value": 1 }]));
            res.writeHeader(200);

            res.end();
            return;
        }

        else if (pathname.startsWith("/restore")) {
            fs.writeFileSync("storage.json", JSON.stringify([
                {
                    "title": "foo",
                    "color": "red",
                    "value": 20
                },
                {
                    "title": "bar",
                    "color": "ivory",
                    "value": 50
                },
                {
                    "title": "baz",
                    "color": "blue",
                    "value": 30
                }
            ]));
            res.writeHeader(200);
            res.end();
            return;
        }

        else if (pathname.startsWith("/PieCh")) {
            var slices = JSON.parse(fs.readFileSync("storage.json"));
            var rep = '<svg id="pieChart" viewBox="-1 -1 2 2" height=500 width=500>';
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

                rep += '<path d="' + pathData + '" fill="' + slice.color + '"></path>';
            }
            rep += '</svg>'
            res.writeHeader(200, { "Content-Type": "image/svg+xml" });
            res.write(rep);
            res.end();
        }

        // /404 Error
        else {
            // throw new error
            throw new Error('404');
        }
    } catch (err) {
        console.log(err);
        if (err.message === '404') {
            res.writeHeader(404, { 'Content-Type': 'text/html' });
            res.write('404 Not Found', 'utf8');
            res.end();
            return;
        }
        else if (err.message == '403') {
            res.writeHeader(403, { 'Content-Type': 'text/html' });
            res.write('Forbidden', 'utf8');
            res.end();
            return;
        }
        else if (err.message === '400') {
            res.writeHeader(400, { 'Content-Type': 'text/html' });
            res.write('Bad Request', 'utf8');
            res.end();
            return;
        }
    }
}

// server instanciation
const server = createServer(webserver);

// modify the server to listen to a port number given on the command line instead of 8000.
server.listen(port, (err) => { });