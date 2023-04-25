"use strict";

import express from "express"; 
import morgan from "morgan";
import fs from "fs";
const app = express();

// port on argv
const port = process.argv[2] || 8000;
console.log('PORT = ', port);

// middlewares
app.use(morgan('dev'));
app.use(express.json())
var db = fs.readFileSync("db.json");
var db_array = JSON.parse(db);

// list of routes
app.get('/', (req, res) => res.send('Hi'));

app.get('/kill', (req, res) => {
    res.type("text/plain")
    res.send('The Server will stop now.');
    process.exit(0);
});

app.get('/clean', (req, res) => {
    // reloads db.json in memory, and answers in plain text “db.json reloaded”
    db = fs.readFileSync("db.json");
    db_array = JSON.parse(db);
    res.type("text/plain")
    res.send('db.json reloaded');
})

app.get('/countpapers', (req, res) => {
    // returns the number of papers in db.json
    res.type("text/plain")
    res.send(db_array.length.toString());
})

app.get('/byauthor/:name', (req, res) => {
    // returns the number of publications where the name of one of the authors contains xxx, ignoring the case of letters. The answer is sent in plain text.
    let name = req.params.name;
    let count = 0;
    for (let i = 0; i < db_array.length; i++) {
        for (let j = 0; j < db_array[i].authors.length; j++) {
            if (db_array[i].authors[j].toLowerCase().includes(name.toLowerCase())) {
                count++;
                break;
            }
        }
    }
    res.type("text/plain")
    res.send(count.toString());
})

app.get('/descriptors/:name', (req,res) => {
    // returns the descriptors of publications whose names of authors contain xxx, ignoring the case of letters. This answer is sent in JSON format, so should have the media type application/json
    let name = req.params.name;
    let descriptors = [];
    for (let i = 0; i < db_array.length; i++) {
        for (let j = 0; j < db_array[i].authors.length; j++) {
            if (db_array[i].authors[j].toLowerCase().includes(name.toLowerCase())) {
                descriptors.push(db_array[i]);
                break;
            }
        }
    }
    res.type("application/json")
    res.send(JSON.stringify(descriptors));
})

app.get('/ttlist/:name', (req, res) => {
    // returns the titles of publications whose names of authors contain xxx, ignoring the case of letters. This answer is in JSON, so should have the media type application/json
    let name = req.params.name;
    let titles = [];
    for (let i = 0; i < db_array.length; i++) {
        for (let j = 0; j < db_array[i].authors.length; j++) {
            if (db_array[i].authors[j].toLowerCase().includes(name.toLowerCase())) {
                titles.push(db_array[i].title);
                break;
            }
        }
    }
    res.type("application/json")
    res.send(JSON.stringify(titles));
})

app.get('/publication/:key', (req, res) => {
    // responds the descriptor of the publication whose “key” is xxx.
    let key = req.params.key;
    let found = false;
    for (let i = 0; i < db_array.length; i++) {
        if (db_array[i].key == key) {
            res.type("application/json")
            res.send(JSON.stringify(db_array[i]));
            found = true;
            break;
        }
    }
    if (!found) {
        res.status(404).send('Not found');
    }
})

app.delete('/publication/:key', (req, res) => {
    // deletes the publication whose “key” is xxx in the database that is in memory
    let key = req.params.key;
    let found = false;
    for (let i = 0; i < db_array.length; i++) {
        if (db_array[i].key == key) {
            db_array.splice(i, 1);
            found = true;
            break;
        }
    }
    if (!found) {
        res.status(404).send('Not found');
    } else {
        res.type("text/plain")
        res.send('Publication deleted');
    }
})

app.post('/publication', (req, res) => {
    let key = "imaginary";
    let title = req.body.title;
    let journal = req.body.journal;
    let year = req.body.year;
    let authors = req.body.authors;

    let new_pub = {
        "key": key,
        "title": title,
        "journal": journal,
        "year": year,
        "authors": authors
    }

    db_array.push(new_pub);

    res.type("text/plain")
    res.send('Publication added');
})

app.put('/publication/:key', (req, res) => {
    let key = req.params.key;
    let found = false;
    for (let i = 0; i < db_array.length; i++) {
        if (db_array[i].key == key) {
            if (req.body.title) {
                db_array[i].title = req.body.title;
            }
            if (req.body.journal) {
                db_array[i].journal = req.body.journal;
            }
            if (req.body.year) {
                db_array[i].year = req.body.year;
            }
            if (req.body.authors) {
                db_array[i].authors = req.body.authors;
            }
            found = true;
            break;
        }
    }
    if (!found) {
        res.status(404).send('Not found');
    }
    else {
        res.type("text/plain")
        res.send('Publication updated');
    }
})

// start listening
app.listen(port, () => console.log('Server listening on port ' + port))