"use strict";

import {Std, FrStd} from "./exercise3.mjs";
import * as fs from "fs"

export class Promo {
    constructor() {
        this.students = [];
    }

    add(student) {
        this.students.push(student);
    }

    size() {
        return this.students.length;
    }

    get(i) {
        return this.students[i];
    }

    print() {
        let s = ""
        for (let student of this.students) {
            s += student.toString() + "\n";
        }
        s = s.slice(0, s.length - 1);
        console.log(s)
        return s;
    }

    write() { // serializes the promotion to JSON, in other words transforms a promotion object in a string of characters,
        return JSON.stringify(this.students)
    }

    read(str) { // reads a JSON object and rebuilds a promotion, WARNING: going through JSON.stringify then JSON.parse looses the fact that the object was a new Std…
        let prom = JSON.parse(str);
        for (let student of prom) {
            if (student.nationality != undefined) {
                student = Object.assign(new FrStd(), student)
            } else {
                student = Object.assign(new Std(), student)
            }
            this.students.push(student);
        }
    }

    saveF(fileName) {
        fs.writeFileSync(fileName, this.write());
    }

    readFrom(fileName) {
        this.read(fs.readFileSync(fileName))
    }

}