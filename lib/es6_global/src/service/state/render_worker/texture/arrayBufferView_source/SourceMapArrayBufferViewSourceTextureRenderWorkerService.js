// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

import * as OptionService$Wonderjs                                         from "../../../../atom/OptionService.js";
import * as ArrayService$WonderCommonlib                                   from "../../../../../../../../node_modules/wonder-commonlib/lib/es6_global/src/ArrayService.js";
import * as TextureSourceMapService$Wonderjs                               from "../../../../primitive/texture/TextureSourceMapService.js";
import * as RecordArrayBufferViewSourceTextureRenderWorkerService$Wonderjs from "./RecordArrayBufferViewSourceTextureRenderWorkerService.js";

function setSourceMap(sourceMap, state) {
  var record = RecordArrayBufferViewSourceTextureRenderWorkerService$Wonderjs.getRecord(state);
  var newrecord = state.slice();
  var newrecord$1 = record.slice();
  newrecord[/* arrayBufferViewSourceTextureRecord */14] = /* Some */[(newrecord$1[/* sourceMap */9] = /* Some */[sourceMap], newrecord$1)];
  return newrecord;
}

function addSourceArray(sourceArray, state) {
  var record = RecordArrayBufferViewSourceTextureRenderWorkerService$Wonderjs.getRecord(state);
  var sourceMap = OptionService$Wonderjs.unsafeGet(record[/* sourceMap */9]);
  ArrayService$WonderCommonlib.reduceOneParam((function (sourceMap, param) {
          return TextureSourceMapService$Wonderjs.addSource(param[0], param[1], sourceMap);
        }), sourceMap, sourceArray);
  var newrecord = state.slice();
  var newrecord$1 = record.slice();
  newrecord[/* arrayBufferViewSourceTextureRecord */14] = /* Some */[(newrecord$1[/* sourceMap */9] = /* Some */[sourceMap], newrecord$1)];
  return newrecord;
}

export {
  setSourceMap   ,
  addSourceArray ,
  
}
/* OptionService-Wonderjs Not a pure module */