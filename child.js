"use strict";

const HTTP_PORT = 8039;
main().catch(() => 1);

async function main() {
    try {
        let res = await fetch("http://localhost:3000/");
        if (res && res.ok) {
            const msg = res.text();
            console.log({ msg });
            if (msg) {
                process.exitCode = 0;
                return;
            }
        }
    } catch (err) {}
    process.exitCode = 1;
}
