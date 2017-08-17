import curry from "wonder-lodash/curry";
import { PointLight } from "./PointLight";
import { Color } from "../../structure/Color";
import {
    create as createSpecifyLight,
    disposeComponent as disposeSpecifyLightComponent,
    initData as initSpecifyLightData,
    setColor as setSpecifyLightColor,
    createDefaultColor, getPosition as getSpecifyLightPosition, getGameObject
} from "./SpecifyLightSystem";
import { Light } from "./Light";
import { ensureFunc, it } from "../../definition/typescript/decorator/contract";
import { expect } from "wonder-expect.js";
import { getColor3Data } from "../utils/operateBufferDataUtils";
import { createSharedArrayBufferOrArrayBuffer } from "../../utils/arrayBufferUtils";
import { deleteOneItemBySwapAndReset, setSingleValue } from "../../utils/typeArrayUtils";
import {
    getConstant as getConstantUtils,
    getLinear as getLinearUtils,
    getQuadratic as getQuadraticUtils, getRange as getRangeUtils,
    createTypeArrays, getColorArr3 as getColorArr3Utils,
    getIntensity as getIntensityUtils, isColorDirty as isColorDirtyUtils, isIntensityDirty as isIntensityDirtyUtils,
    isAttenuationDirty as isAttenuationDirtyUtils, cleanColorDirty as cleanColorDirtyUtils,
    cleanIntensityDirty as cleanIntensityDirtyUtils, cleanAttenuationDirty as cleanAttenuationDirtyUtils,
    cleanPositionDirty as cleanPositionDirtyUtils, isPositionDirty as isPositionDirtyUtils
} from "../../renderer/utils/worker/render_file/light/pointLightUtils";
import { Log } from "../../utils/Log";
import { getPointLightBufferCount } from "../../renderer/utils/light/bufferUtils";
import { isInit } from "../../core/DirectorSystem";
import { DirectorData } from "../../core/DirectorData";
import {
    getConstantDataSize, getDirtyDataSize, getIntensityDataSize,
    getQuadraticDataSize, getRangeDataSize
} from "../../renderer/utils/light/pointLightUtils";
import { getColorDataSize, getLinearDataSize } from "../../renderer/utils/light/pointLightUtils";
import { getIsTranslate } from "../transform/isTransformSystem";
import { getTransform } from "../../core/entityObject/gameObject/GameObjectSystem";
import { registerEvent } from "../../event/EventManagerSystem";
import { Map } from "immutable";

export var create = ensureFunc((light: PointLight, PointLightData: any) => {
    //todo check: shouldn't create after init(direction, ambient)
    it("shouldn't create after Director->init", () => {
        expect(isInit(DirectorData)).false;
    });
}, (PointLightData: any) => {
    var light = new PointLight();

    light = createSpecifyLight(light, PointLightData);

    return light;
})

export var getPosition = (index: number, ThreeDTransformData: any, GameObjectData: any, PointLightData: any) => {
    return getSpecifyLightPosition(index, ThreeDTransformData, GameObjectData, PointLightData);
}

export var getAllPositionData = (ThreeDTransformData: any, GameObjectData: any, PointLightData: any): Array<Float32Array> => {
    var positionArr: Array<Float32Array> = [];

    for (let i = 0, count = PointLightData.count; i < count; i++) {
        positionArr.push(getPosition(i, ThreeDTransformData, GameObjectData, PointLightData).values);
    }

    return positionArr;
}

export var getColor = (index: number, PointLightData: any) => {
    return getColor3Data(index, PointLightData.colors);
}

export var getColorArr3 = getColorArr3Utils;

export var setColor = (index: number, color: Color, PointLightData: any) => {
    setSpecifyLightColor(index, color, PointLightData.colors);

    _markDirty(index, PointLightData.isColorDirtys);
}

export var getIntensity = getIntensityUtils;

export var setIntensity = (index: number, value: number, PointLightData: any) => {
    setSingleValue(PointLightData.intensities, index, value);

    _markDirty(index, PointLightData.isIntensityDirtys);
}

export var getConstant = getConstantUtils;

export var setConstant = (index: number, value: number, PointLightData: any) => {
    setSingleValue(PointLightData.constants, index, value);

    _markDirty(index, PointLightData.isAttenuationDirtys);
}

export var getLinear = getLinearUtils;

export var setLinear = (index: number, value: number, PointLightData: any) => {
    setSingleValue(PointLightData.linears, index, value);

    _markDirty(index, PointLightData.isAttenuationDirtys);
}

export var getQuadratic = getQuadraticUtils;

export var setQuadratic = (index: number, value: number, PointLightData: any) => {
    setSingleValue(PointLightData.quadratics, index, value);

    _markDirty(index, PointLightData.isAttenuationDirtys);
}

export var getRange = getRangeUtils;

export var setRange = (index: number, value: number, PointLightData: any) => {
    setSingleValue(PointLightData.ranges, index, value);
}

export var setRangeLevel = (index: number, value: number, PointLightData: any) => {
    switch (value) {
        case 0:
            setRange(index, 7, PointLightData);
            setLinear(index, 0.7, PointLightData);
            setQuadratic(index, 1.8, PointLightData);
            break;
        case 1:
            setRange(index, 13, PointLightData);
            setLinear(index, 0.35, PointLightData);
            setQuadratic(index, 0.44, PointLightData);
            break;
        case 2:
            setRange(index, 20, PointLightData);
            setLinear(index, 0.22, PointLightData);
            setQuadratic(index, 0.20, PointLightData);
            break;
        case 3:
            setRange(index, 32, PointLightData);
            setLinear(index, 0.14, PointLightData);
            setQuadratic(index, 0.07, PointLightData);
            break;
        case 4:
            setRange(index, 50, PointLightData);
            setLinear(index, 0.09, PointLightData);
            setQuadratic(index, 0.032, PointLightData);
            break;
        case 5:
            setRange(index, 65, PointLightData);
            setLinear(index, 0.07, PointLightData);
            setQuadratic(index, 0.017, PointLightData);
            break;
        case 6:
            setRange(index, 100, PointLightData);
            setLinear(index, 0.045, PointLightData);
            setQuadratic(index, 0.0075, PointLightData);
            break;
        case 7:
            setRange(index, 160, PointLightData);
            setLinear(index, 0.027, PointLightData);
            setQuadratic(index, 0.0028, PointLightData);
            break;
        case 8:
            setRange(index, 200, PointLightData);
            setLinear(index, 0.022, PointLightData);
            setQuadratic(index, 0.0019, PointLightData);
            break;
        case 9:
            setRange(index, 325, PointLightData);
            setLinear(index, 0.014, PointLightData);
            setQuadratic(index, 0.0007, PointLightData);
            break;
        case 10:
            setRange(index, 600, PointLightData);
            setLinear(index, 0.007, PointLightData);
            setQuadratic(index, 0.0002, PointLightData);
            break;
        case 11:
            setRange(index, 3250, PointLightData);
            setLinear(index, 0.0014, PointLightData);
            setQuadratic(index, 0.000007, PointLightData);
            break;
        default:
            Log.error(true, "over point light range");
            break;
    }

    _markDirty(index, PointLightData.isAttenuationDirtys);
}

var _markDirty = (index: number, isDirtys:Uint8Array) => {
    isDirtys[index] = 0;
}

export var initDataHelper = (PointLightData: any) => {
    var count = getPointLightBufferCount(),
        size = Float32Array.BYTES_PER_ELEMENT * (getColorDataSize() + getIntensityDataSize() + getConstantDataSize() + getLinearDataSize() + getQuadraticDataSize() + getRangeDataSize() + getDirtyDataSize() * 4),
        buffer: any = null;

    buffer = createSharedArrayBufferOrArrayBuffer(count * size);

    initSpecifyLightData(buffer, PointLightData);

    createTypeArrays(buffer, count, PointLightData);

    PointLightData.defaultIntensity = 1;
    PointLightData.defaultConstant = 1;
    PointLightData.defaultLinear = 0.07;
    PointLightData.defaultQuadratic = 0.017;
    PointLightData.defaultRange = 65;
    PointLightData.defaultDirty = 0;

    _setDefaultTypeArrData(count, PointLightData);
}

var _setDefaultTypeArrData = (count: number, PointLightData: any) => {
    var color = createDefaultColor(),
        intensity = PointLightData.defaultIntensity,
        constant = PointLightData.defaultConstant,
        linear = PointLightData.defaultLinear,
        quadratic = PointLightData.defaultQuadratic,
        range = PointLightData.defaultRange;

    /*!
    no need to set default dirty
     */

    for (let i = 0; i < count; i++) {
        setColor(i, color, PointLightData);
        setIntensity(i, intensity, PointLightData);
        setConstant(i, constant, PointLightData);
        setLinear(i, linear, PointLightData);
        setQuadratic(i, quadratic, PointLightData);
        setRange(i, range, PointLightData);
    }
}

export var disposeComponent = (component: Light, PointLightData:any) => {
    var intensityDataSize = getIntensityDataSize(),
        constantDataSize = getConstantDataSize(),
        linearDataSize = getLinearDataSize(),
        quadraticDataSize = getQuadraticDataSize(),
        rangeDataSize = getRangeDataSize(),
        sourceIndex = component.index,
        lastComponentIndex: number = null;

    lastComponentIndex = disposeSpecifyLightComponent(sourceIndex, PointLightData);

    deleteOneItemBySwapAndReset(sourceIndex * intensityDataSize, lastComponentIndex * intensityDataSize, PointLightData.intensities, PointLightData.defaultIntensity);
    deleteOneItemBySwapAndReset(sourceIndex * constantDataSize, lastComponentIndex * constantDataSize, PointLightData.constants, PointLightData.defaultConstant);
    deleteOneItemBySwapAndReset(sourceIndex * linearDataSize, lastComponentIndex * linearDataSize, PointLightData.linears, PointLightData.defaultLinear);
    deleteOneItemBySwapAndReset(sourceIndex * quadraticDataSize, lastComponentIndex * quadraticDataSize, PointLightData.quadratics, PointLightData.defaultQuadratic);
    deleteOneItemBySwapAndReset(sourceIndex * rangeDataSize, lastComponentIndex * rangeDataSize, PointLightData.ranges, PointLightData.defaultRange);

    //todo dispose dirty
}

export var init = (PointLightData: any, state:Map<any, any>) => {
    var eventName = "changePosition";

    for(let i = 0, count = PointLightData.count; i < count; i++){
        var _markPositionDirty = () => {
            _markDirty(i, PointLightData.isPositionDirtys);
        }

        registerEvent(eventName, _markPositionDirty);
    }

    return state;
}

export var isPositionDirty = isPositionDirtyUtils;

export var isColorDirty = isColorDirtyUtils;

//todo send position dirty data to render worker
// export var isPositionDirty = (index: number, ThreeDTransformData: any, GameObjectData:any, PointLightData: any) => {
//     return getIsTranslate(getTransform(getGameObject(index, PointLightData), GameObjectData).uid, ThreeDTransformData) === true;
// }

export var isIntensityDirty = isIntensityDirtyUtils;

export var isAttenuationDirty = isAttenuationDirtyUtils;

export var cleanPositionDirty = cleanPositionDirtyUtils;

export var cleanColorDirty = cleanColorDirtyUtils;

export var cleanIntensityDirty = cleanIntensityDirtyUtils;

export var cleanAttenuationDirty = cleanAttenuationDirtyUtils;

