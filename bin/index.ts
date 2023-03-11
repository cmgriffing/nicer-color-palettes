#!/usr/bin/env node

import { ColorPalette } from "./types";

var argv = require("minimist")(process.argv.slice(2), {
  boolean: ["pretty"],
});

// var getColors = require("./get-colors");
import getColors from "./get-colors";

getColors(argv._[0] || 100, function (err: Error, palettes: ColorPalette[]) {
  if (err) throw err;
  var pretty = argv.pretty ? 2 : undefined;
  console.log(JSON.stringify(palettes, undefined, pretty));
});
