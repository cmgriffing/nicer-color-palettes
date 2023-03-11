import fs from "fs";
import path from "path";
import { ColorPalette } from "./types";
import getColors from "./get-colors";

var outDir = path.resolve(__dirname, "../json");

getColors(1000, function (err: Error, palettes: ColorPalette[]) {
  if (err) throw err;
  write(100);
  write(200);
  write(500);
  write(1000);

  console.log(new Date().toString());

  function write(count: number) {
    var file = path.resolve(outDir, count + ".json");
    fs.writeFile(
      file,
      JSON.stringify(palettes.slice(0, count)),
      function (err: Error | null) {
        if (err) console.error(err.message);
      }
    );
  }
});
