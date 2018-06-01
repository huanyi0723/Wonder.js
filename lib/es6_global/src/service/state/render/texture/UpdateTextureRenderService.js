// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

import * as IndexSourceTextureService$Wonderjs                       from "../../../record/all/texture/IndexSourceTextureService.js";
import * as UpdateBasicSourceTextureRenderService$Wonderjs           from "./basic_source/UpdateBasicSourceTextureRenderService.js";
import * as UpdateArrayBufferViewSourceTextureRenderService$Wonderjs from "./arrayBufferView_source/UpdateArrayBufferViewSourceTextureRenderService.js";

function _handleUpdateBasicSourceTexture(basicSourceTextureInTypeArray, param) {
  var state = param[1];
  var browserDetectRecord = state[/* browserDetectRecord */22];
  var basicSourceTextureRecord = state[/* basicSourceTextureRecord */9];
  var match = UpdateBasicSourceTextureRenderService$Wonderjs.isNeedUpdate(basicSourceTextureInTypeArray, basicSourceTextureRecord);
  if (match !== 0) {
    UpdateBasicSourceTextureRenderService$Wonderjs.update(param[0], basicSourceTextureInTypeArray, /* tuple */[
          basicSourceTextureRecord,
          browserDetectRecord
        ]);
  } else {
    /* tuple */[
      basicSourceTextureRecord,
      browserDetectRecord
    ];
  }
  return state;
}

function _handleUpdateArrayBufferViewSourceTexture(arrayBufferViewTextureInTypeArray, param) {
  var state = param[1];
  var browserDetectRecord = state[/* browserDetectRecord */22];
  var arrayBufferViewSourceTextureRecord = state[/* arrayBufferViewSourceTextureRecord */10];
  var match = UpdateArrayBufferViewSourceTextureRenderService$Wonderjs.isNeedUpdate(arrayBufferViewTextureInTypeArray, arrayBufferViewSourceTextureRecord);
  if (match !== 0) {
    UpdateArrayBufferViewSourceTextureRenderService$Wonderjs.update(param[0], arrayBufferViewTextureInTypeArray, /* tuple */[
          arrayBufferViewSourceTextureRecord,
          browserDetectRecord
        ]);
  } else {
    /* tuple */[
      arrayBufferViewSourceTextureRecord,
      browserDetectRecord
    ];
  }
  return state;
}

function handleUpdate(gl, texture, state) {
  return IndexSourceTextureService$Wonderjs.handleByJudgeSourceTextureIndex(texture, state[/* arrayBufferViewSourceTextureRecord */10][/* textureIndexOffset */13], /* tuple */[
              gl,
              state
            ], /* tuple */[
              _handleUpdateBasicSourceTexture,
              _handleUpdateArrayBufferViewSourceTexture
            ]);
}

export {
  _handleUpdateBasicSourceTexture           ,
  _handleUpdateArrayBufferViewSourceTexture ,
  handleUpdate                              ,
  
}
/* IndexSourceTextureService-Wonderjs Not a pure module */