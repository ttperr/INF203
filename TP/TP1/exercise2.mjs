"use strict";

// for each word within a string, counts the number of occurrences of this word in this string
export function wcount(s) {
    let m = new Map();
    let a = s.split(" ");
    for (let i = 0; i < a.length; i++) {
        if (m.has(a[i])) {
            m.set(a[i], m.get(a[i]) + 1);
        } else {
            m.set(a[i], 1);
        }
    }
    return m;
}

// Create a class WordL with a constructor which takes as input a string

export class WordL {
    constructor(s) {
        this.m = wcount(s)
    }

    getWords() { // returns an array
        return [...new Set(Array.from(this.m.keys()))].sort();
    }

    maxCountWord () {
        let max = 0;
        let maxWord = "";
        for (let [key, value] of this.m) {
            if (value > max) {
                max = value;
                maxWord = key;
            }
        }
        return maxWord;
    }

    minCountWord () {
        let min = Number.MAX_VALUE;
        let minWord = "";
        for (let [key, value] of this.m) {
            if (value < min) {
                min = value;
                minWord = key;
            }
        }
        return minWord;
    }

    getCount(word) {
        return this.m.get(word);
    }

    applyWordFunc(f) { // apply any function to each word in lexicographic order and to return an array of results
        let a = this.getWords();
        let b = [];
        for (let i = 0; i < a.length; i++) {
            b.push(f(a[i]));
        }
        return b;
    }
}