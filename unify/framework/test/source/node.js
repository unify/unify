#!/usr/bin/env node

eval(require("fs").readFileSync("script/kernel.js", "utf-8"));
core.io.Script.load("script/test-" + jasy.Env.CHECKSUM + ".js");
