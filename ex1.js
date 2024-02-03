#!/usr/bin/env node

"use strict";

import path from "path";
import fs from "fs";
import util from "util";
import getStdin from "get-stdin";
import minimist from "minimist";

const args = minimist(process.argv.slice(2), {
    boolean: ["help", "in"],
    string: ["file"],
});

if (args.help) {
    printHelp();
} else if (args.in || args._.includes("-")) {
    getStdin().then(processFile).catch(error);
} else if (args.file) {
    let filepath = path.resolve(args.file);

    fs.readFile(filepath, (err, contents) => {
        if (err) {
            error(err.toString());
        } else {
            contents = contents.toString();
            processFile(contents);
        }
    });
} else {
    error("incorrect usage", true);
}

// ***************************

function processFile(contents) {
    contents = contents.toUpperCase();
    process.stdout.write(contents);
}

function error(msg, includeHelp = false) {
    console.error(msg);
    if (includeHelp) {
        console.log("");
        printHelp();
    }
}

function printHelp() {
    console.log("ex1 usage:");
    console.log("   ex1.js --file={FILENAME}");
    console.log("");
    console.log("--help               print this help");
    console.log("--file={FILENAME}    process the file");
    console.log("--in, -              process stdin");
    console.log("");
}
