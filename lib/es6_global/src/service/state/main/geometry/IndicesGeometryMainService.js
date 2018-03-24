// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

import * as IndicesService$Wonderjs            from "../../../primitiive/geometry/IndicesService.js";
import * as TypeArrayService$Wonderjs          from "../../../primitiive/TypeArrayService.js";
import * as TypeArrayPoolService$Wonderjs      from "../../../record/typeArrayPool/TypeArrayPoolService.js";
import * as PointsGeometryMainService$Wonderjs from "./PointsGeometryMainService.js";

function getIndices(index, param) {
  return IndicesService$Wonderjs.getIndices(index, param[/* boxGeometryRecord */20][/* indicesMap */3]);
}

function unsafeGetIndices(index, param) {
  return IndicesService$Wonderjs.unsafeGetIndices(index, param[/* boxGeometryRecord */20][/* indicesMap */3]);
}

function setIndicesWithArray(index, record, state) {
  var boxGeometryRecord = state[/* boxGeometryRecord */20];
  var match = PointsGeometryMainService$Wonderjs.setPointsWithArray(/* tuple */[
        index,
        getIndices(index, state),
        record
      ], /* tuple */[
        TypeArrayPoolService$Wonderjs.getUint16TypeArrayFromPool,
        TypeArrayService$Wonderjs.fillUint16Array,
        TypeArrayService$Wonderjs.makeUint16Array
      ], /* tuple */[
        state[/* typeArrayPoolRecord */32],
        boxGeometryRecord[/* indicesMap */3]
      ]);
  var newrecord = state.slice();
  var newrecord$1 = boxGeometryRecord.slice();
  newrecord$1[/* indicesMap */3] = match[1];
  newrecord[/* boxGeometryRecord */20] = newrecord$1;
  newrecord[/* typeArrayPoolRecord */32] = match[0];
  return newrecord;
}

export {
  getIndices          ,
  unsafeGetIndices    ,
  setIndicesWithArray ,
  
}
/* IndicesService-Wonderjs Not a pure module */