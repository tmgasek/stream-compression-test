#!/usr/bin/env nove

"use strict";

import childProc from "child_process";

const MAX_CHILDREN = 1000;

async function main() {
    while (true) {
        process.stdout.write(`sending ${MAX_CHILDREN} reqs...`);

        let children = [];

        for (let i = 0; i < MAX_CHILDREN; i++) {
            children.push(childProc.spawn("node", ["child.js"]));
        }

        let resps = children.map((child) => {
            return new Promise((resolve) => {
                child.on("exit", (code) => {
                    if (code === 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        });

        resps = await Promise.all(resps);

        if (resps.filter(Boolean).length === MAX_CHILDREN) {
            console.log("success!");
        } else {
            console.log("failures.");
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

main().catch(console.error);
