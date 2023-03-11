const mapLimit = require("map-limit");
import { ColorPalette } from "./types";

function request(url: string, cb: Function) {
  try {
    fetch(url, { method: "POST", body: JSON.stringify({ json: true }) })
      .then((response) => response.json())
      .then((body) => {
        cb(null, body);
      })
      .catch((err) => cb(err));
  } catch (err) {
    cb(err);
  }
}

export default function (totalCount: number, cb: Function) {
  if (typeof totalCount !== "number") {
    throw new TypeError("must specify count as first parameter");
  }

  var totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / 100);

  function next(page: number, cb: Function) {
    console.error("Page %d / %d", page + 1, totalPages);
    var api =
      "http://www.colourlovers.com/api/palettes/top?format=json&numResults=100&resultOffset=" +
      page * 100;
    request(api, function (err: Error, data: any) {
      cb(err, data);
    });
  }

  var pages = new Array(totalPages).fill(0).map(function (_, i) {
    return i;
  });

  mapLimit(pages, 1, next, function (err: Error, allPages: ColorPalette[]) {
    if (err) {
      return cb(err);
    }
    const reducedPages = allPages.reduce(function (a, b) {
      return a.concat(b);
    }, [] as ColorPalette[]);
    const slicedPages = reducedPages.slice(0, totalCount);
    var palettes = slicedPages.map(function (x) {
      return x.colors.slice(0, 5).map(function (color) {
        return "#" + color.toLowerCase();
      });
    });
    palettes = palettes.filter((f) => f.length === 5);
    var newPalettes = [];
    for (let i = 0; i < palettes.length; i++) {
      const palette = palettes[i];

      // search existing palettes to see if we've already added it
      let hasDuplicate = false;
      for (let j = 0; j < newPalettes.length; j++) {
        const other = newPalettes[j];
        if (JSON.stringify(palette) === JSON.stringify(other)) {
          hasDuplicate = true;
          break;
        }
      }
      if (!hasDuplicate) {
        newPalettes.push(palette);
      }
    }
    palettes = newPalettes;
    console.error("Total palettes:", palettes.length);
    cb(null, palettes);
  });
}
