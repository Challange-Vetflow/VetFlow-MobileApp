"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StyleObj = require("./StyleObj");

Object.keys(_StyleObj).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _StyleObj[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _StyleObj[key];
    }
  });
});

var _FormatType = require("./FormatType");

Object.keys(_FormatType).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _FormatType[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _FormatType[key];
    }
  });
});

var _TextDecorationOptions = require("./TextDecorationOptions");

Object.keys(_TextDecorationOptions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _TextDecorationOptions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _TextDecorationOptions[key];
    }
  });
});

var _MaskOptions = require("./MaskOptions");

Object.keys(_MaskOptions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _MaskOptions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _MaskOptions[key];
    }
  });
});
//# sourceMappingURL=index.js.map