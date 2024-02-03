#!/usr/bin/env node

"use strict";

import path from "path";
import fs from "fs";
// import util from "util";
import minimist from "minimist";
import { fileURLToPath } from "url";
import { Transform } from "stream";
import zlib from "zlib";

// Gets around ReferenceError: __dirname is not defined in ES module scope error.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

let OUTFILE = path.join(BASE_PATH, "out.txt");

const args = minimist(process.argv.slice(2), {
    boolean: ["help", "in", "out", "compress", "uncompress"],
    string: ["file"],
});

if (args.help) {
    printHelp();
} else if (args.in || args._.includes("-")) {
    processFile(process.stdin);
} else if (args.file) {
    let filepath = path.join(BASE_PATH, args.file);
    let stream = fs.createReadStream(filepath);
    processFile(stream);
} else {
    error("incorrect usage", true);
}

// ***************************

function processFile(inStream) {
    let outStream = inStream;

    if (args.uncompress) {
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream);
    }

    const upperStream = new Transform({
        transform(chunk, enc, cb) {
            this.push(chunk.toString().toUpperCase());
            cb(); // exec cb so the stream knows this chunk is processed.
        },
    });

    outStream = outStream.pipe(upperStream);

    if (args.compress) {
        let gzipStream = zlib.createGzip();
        outStream = outStream.pipe(gzipStream);
        OUTFILE = `${OUTFILE}.gz`;
    }

    let targetStream;
    if (args.out) {
        targetStream = process.stdout;
    } else {
        targetStream = fs.createWriteStream(OUTFILE);
    }

    outStream.pipe(targetStream);
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
    console.log("--out                print to stdout");
    console.log("--compress           gzip output");
    console.log("--uncompress         un-gzip the input");
    console.log("");
}
