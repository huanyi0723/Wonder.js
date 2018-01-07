// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

import * as Contract$Wonderjs                from "../../../../definition/Contract.js";
import * as Matrix4System$Wonderjs           from "../../../../structure/Matrix4System.js";
import * as Vector3System$Wonderjs           from "../../../../structure/Vector3System.js";
import * as GlobalTempSystem$Wonderjs        from "../../../../definition/global_temp/GlobalTempSystem.js";
import * as TransformDirtyCommon$Wonderjs    from "./TransformDirtyCommon.js";
import * as TransformStateCommon$Wonderjs    from "./TransformStateCommon.js";
import * as SparseMapSystem$WonderCommonlib  from "../../../../../../../node_modules/wonder-commonlib/lib/es6_global/src/SparseMapSystem.js";
import * as TransformHierachyCommon$Wonderjs from "./TransformHierachyCommon.js";

function getLocalToWorldMatrixTypeArray(transform, localToWorlMatrixMap) {
  return Contract$Wonderjs.ensureCheck((function () {
                return Contract$Wonderjs.test("localToWorldMatrix should exist", (function () {
                              return Contract$Wonderjs.assertExist(SparseMapSystem$WonderCommonlib.get(transform, localToWorlMatrixMap));
                            }));
              }), SparseMapSystem$WonderCommonlib.unsafeGet(transform, localToWorlMatrixMap));
}

function getLocalPositionTypeArray(transform, localPositionMap) {
  return Contract$Wonderjs.ensureCheck((function () {
                return Contract$Wonderjs.test("localPositionshould exist", (function () {
                              return Contract$Wonderjs.assertExist(SparseMapSystem$WonderCommonlib.get(transform, localPositionMap));
                            }));
              }), SparseMapSystem$WonderCommonlib.unsafeGet(transform, localPositionMap));
}

function getLocalPositionTuple(transform, localPositionMap) {
  var typeArr = getLocalPositionTypeArray(transform, localPositionMap);
  return /* tuple */[
          typeArr[0],
          typeArr[1],
          typeArr[2]
        ];
}

function setLocalPositionByTypeArray(transform, positionTypeArr, data) {
  SparseMapSystem$WonderCommonlib.set(transform, positionTypeArr, data[/* localPositionMap */5]);
  return data;
}

function setLocalPositionByTuple(transform, param, data) {
  var typeArr = getLocalPositionTypeArray(transform, data[/* localPositionMap */5]);
  typeArr[0] = param[0];
  typeArr[1] = param[1];
  typeArr[2] = param[2];
  return data;
}

function _getLocalToWorldMatrixFloat32Array(transform, localToWorldMatrixFloat32ArrayMap) {
  return Contract$Wonderjs.ensureCheck((function () {
                return Contract$Wonderjs.test("localToWorldMatrixFloat32Array should exist", (function () {
                              return Contract$Wonderjs.assertExist(SparseMapSystem$WonderCommonlib.get(transform, localToWorldMatrixFloat32ArrayMap));
                            }));
              }), SparseMapSystem$WonderCommonlib.unsafeGet(transform, localToWorldMatrixFloat32ArrayMap));
}

function update(transform, state) {
  var data = TransformStateCommon$Wonderjs.getTransformData(state);
  var localPositionMap = data[/* localPositionMap */5];
  var localToWorldMatrixMap = data[/* localToWorldMatrixMap */4];
  var match = TransformDirtyCommon$Wonderjs.isDirty(transform, data);
  if (match !== 0) {
    TransformDirtyCommon$Wonderjs.mark(transform, /* false */0, data);
    var match$1 = TransformHierachyCommon$Wonderjs.getParent(transform, data);
    if (match$1) {
      var parent = match$1[0];
      var state$1 = update(parent, state);
      Matrix4System$Wonderjs.multiply(getLocalToWorldMatrixTypeArray(parent, localToWorldMatrixMap), Matrix4System$Wonderjs.fromTranslation(getLocalPositionTypeArray(transform, localPositionMap), GlobalTempSystem$Wonderjs.getFloat32Array1(state$1)), getLocalToWorldMatrixTypeArray(transform, localToWorldMatrixMap));
      return state$1;
    } else {
      Matrix4System$Wonderjs.fromTranslation(getLocalPositionTypeArray(transform, localPositionMap), getLocalToWorldMatrixTypeArray(transform, localToWorldMatrixMap));
      return state;
    }
  } else {
    return state;
  }
}

function getPositionTypeArray(transform, state) {
  var match = TransformStateCommon$Wonderjs.getTransformData(update(transform, state));
  return Matrix4System$Wonderjs.getTranslationTypeArray(getLocalToWorldMatrixTypeArray(transform, match[/* localToWorldMatrixMap */4]));
}

function getPositionTuple(transform, state) {
  var match = TransformStateCommon$Wonderjs.getTransformData(update(transform, state));
  return Matrix4System$Wonderjs.getTranslationTuple(getLocalToWorldMatrixTypeArray(transform, match[/* localToWorldMatrixMap */4]));
}

function setPositionByTypeArray(transform, position, data, state) {
  var match = TransformHierachyCommon$Wonderjs.getParent(transform, data);
  if (match) {
    var parent = match[0];
    var data$1 = TransformStateCommon$Wonderjs.getTransformData(update(parent, state));
    Vector3System$Wonderjs.transformMat4TypeArray(position, Matrix4System$Wonderjs.invert(getLocalToWorldMatrixTypeArray(parent, data$1[/* localToWorldMatrixMap */4]), GlobalTempSystem$Wonderjs.getFloat32Array1(state)), getLocalPositionTypeArray(transform, data$1[/* localPositionMap */5]));
    return data$1;
  } else {
    setLocalPositionByTypeArray(transform, position, data);
    return data;
  }
}

function setPositionByTuple(transform, position, data, state) {
  var match = TransformHierachyCommon$Wonderjs.getParent(transform, data);
  if (match) {
    var parent = match[0];
    var data$1 = TransformStateCommon$Wonderjs.getTransformData(update(parent, state));
    setLocalPositionByTuple(transform, Vector3System$Wonderjs.transformMat4Tuple(position, Matrix4System$Wonderjs.invert(getLocalToWorldMatrixTypeArray(parent, data$1[/* localToWorldMatrixMap */4]), GlobalTempSystem$Wonderjs.getFloat32Array1(state))), data$1);
    return data$1;
  } else {
    setLocalPositionByTuple(transform, position, data);
    return data;
  }
}

export {
  getLocalToWorldMatrixTypeArray     ,
  getLocalPositionTypeArray          ,
  getLocalPositionTuple              ,
  setLocalPositionByTypeArray        ,
  setLocalPositionByTuple            ,
  _getLocalToWorldMatrixFloat32Array ,
  update                             ,
  getPositionTypeArray               ,
  getPositionTuple                   ,
  setPositionByTypeArray             ,
  setPositionByTuple                 ,
  
}
/* TransformDirtyCommon-Wonderjs Not a pure module */