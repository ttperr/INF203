"use strict";

import {fiboIt,fibo_rec,fibArr,fibMap} from "./exercise1.mjs";
import {wcount, WordL} from "./exercise2.mjs";
import {Std, FrStd} from "./exercise3.mjs";
import {Promo} from "./exercise4.mjs";

console.log(fiboIt(8)); // do more that one test per function
console.log(fibo_rec(7));
console.log(fibArr([7,8]));
console.log(fibMap([7,8]));

let m = new WordL("fish bowl fish bowl fish");
// writing tests

console.log(m.getWords())

console.log(wcount("fish"));
console.log(wcount("fish bowl fish bowl fish"));

let p = new Promo();
p.add(new Std("Doe", "John", "123"));
p.add(new Std("Doe", "Jane", "456"));
p.add(new FrStd("Doe", "Jean", "789", "FR"));
p.add(new FrStd("Doe", "Jean", "7889", "AN"));
p.add(new FrStd("Doe", "Jean", "78nlj9", "FR"));
p.add(new FrStd("Doe", "Jean", "78af89", "AN"));

p.print();
console.log(p.write());
p.read(p.write());
p.print();

p.saveF("test.txt");
p.readFrom("test.txt");