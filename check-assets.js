const fs = require("fs"); console.log(fs.statSync("public/logo.png").size, fs.statSync("public/splash.png").size, fs.statSync("public/og.png").size);
