// Generated by BUCKLESCRIPT VERSION 3.1.4, PLEASE EDIT WITH CARE

import * as MostUtils$Wonderjs from "../../../../asset/utils/MostUtils.js";
import * as StateDataMainService$Wonderjs from "../../../../service/state/main/state/StateDataMainService.js";
import * as InitArcballCameraControllerMainService$Wonderjs from "../../../../service/state/main/camera_controller/arcball/InitArcballCameraControllerMainService.js";
import * as InitPerspectiveCameraProjectionMainService$Wonderjs from "../../../../service/state/main/perspective_camera_projection/InitPerspectiveCameraProjectionMainService.js";

function execJob(_, stateData) {
  return MostUtils$Wonderjs.callFunc((function () {
                var state = StateDataMainService$Wonderjs.unsafeGetState(stateData);
                var state$1 = InitArcballCameraControllerMainService$Wonderjs.init(InitPerspectiveCameraProjectionMainService$Wonderjs.init(state));
                StateDataMainService$Wonderjs.setState(stateData, state$1);
                return /* None */0;
              }));
}

export {
  execJob ,
  
}
/* MostUtils-Wonderjs Not a pure module */