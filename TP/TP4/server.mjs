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

const names = []

// request processing
function webserver(req, res) {
    console.log(req.method + ' ' + req.url);

    let url_parse = url.parse(req.url);
    let pathname = url_parse.pathname;
    console.log(url_parse)

    try {
        if (pathname === "/") {
            // sending the header that says content will be in HTML
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('Working !', 'utf8');
            res.end();
            return;
        }

        // /kill” will stop the server.
        else if (pathname === "/kill") {
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('The Server will stop now.', 'utf8', process.exit, 0);
            res.end();
            return;
        }

        else if (pathname.startsWith("/www/")) {

            console.log('pathname = ' + pathname);

            // fs did'nt read /www/exercise1c.html
            pathname = pathname.slice(5);
            
            if (pathname.startsWith("..")) {
                throw new Error('403');
            }

            console.log("Accessing to " + pathname);
            
            // checks if the folders and the file exist (using the fs module)
            if (!fs.existsSync(pathname)) {
                res.writeHeader(404, { 'Content-Type': 'text/html' })
                res.write("The file does not exist");
                res.end();
                return;
            } else {
                var data = fs.readFileSync(pathname);
                var ext = pathname.slice(pathname.lastIndexOf('.'));
                res.writeHeader(200, { 'Content-Type': mimeType[ext] });
                res.write(data);
                res.end();
                return;
            }
        }

        else if (pathname.startsWith("/hallo")) {
            // type hallo?visitor=xxxx (split using req.url.query)
            var queried = "visiteur="
            var visitor = req.url.slice(req.url.lastIndexOf(queried) + queried.length);
            visitor = visitor.replace( /(<([^>]+)>)/ig, '');
            visitor = querystring.unescape(visitor)
            //log
            console.log('visitor = ' + visitor);
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('hallo ' + visitor, 'utf8');
            res.end();
            return;
        }

        else if (pathname.startsWith("/coucou")) {
            // type coucou?nom=xxxx
            var queried = "nom="
            var name = req.url.slice(req.url.lastIndexOf(queried) + queried.length);
            name = name.replace( /(<([^>]+)>)/ig, '');
            name = querystring.unescape(name)
            // filter tags like bold and replace by nothing
            name = name.replace(/<b>/g, '');

            //filter scripts and replace by just the content
            name = name.replace(/<script>(.*?)<\/script>/g, '$1');

            //log
            console.log('name = ' + name);
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            // coucou xxxx, the following users have already visited this page: yyyy, zzzz, yyyy, bbbb
            res.write('coucou ' + name + ', the following users have already visited this page: ' + names.join(', '), 'utf8');
            names.push(querystring.unescape(name))
            res.end();
            return;
        }

        else if (pathname.startsWith("/clear")) {
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('The list of users has been cleared.', 'utf8');
            names.length = 0;
            res.end();
            return;
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
        else if (err.message) {
            res.writeHeader(403, { 'Content-Type': 'text/html' });
            res.write('Forbidden', 'utf8');
            res.end();
            return;
        }
    }
}

// server instanciation
const server = createServer(webserver);

// modify the server to listen to a port number given on the command line instead of 8000.
server.listen(port, (err) => { });