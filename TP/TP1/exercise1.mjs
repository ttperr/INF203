"use strict";

// no recursion
export function fiboIt(n) {
    let a = 0;
    let b = 1;
    let c = 0;
    for (let i = 0; i < n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return a;
}

// programmed recursively
export function fibo_rec(n) {
    if (n < 2) {
        return n;
    }
    return fibo_rec(n - 1) + fibo_rec(n - 2);
}

// process array, no map
export function fibArr(t) {
    let n = t.length;
    let a = [];
    for (let i = 0; i < n; i++) {
        a[i] = fibo_rec(t[i]);
    }
    return a;
}

// with map
export function fibMap(t) {
    return t.map((x) => fibo_rec(x))
}