var AssetTool = (function () {
    return {
        addChild: function (parentGameObject, childGameObject, state) {
            var parentTransform =
                wd.unsafeGetGameObjectTransformComponent(
                    parentGameObject, state
                );

            var childTransform =
                wd.unsafeGetGameObjectTransformComponent(
                    childGameObject, state
                );

            var state =
                wd.setTransformParentKeepOrder(
                    parentTransform, childTransform, state
                );

            return state;
        },
        addChildren: function (parentGameObject, childGameObjectArr, state) {
            return childGameObjectArr.reduce((state, childGameObject) => {
                return AssetTool.addChild(parentGameObject, childGameObject, state)
            }, state);
        },
        loadConfig: function (jsonPathArr, nextFunc, completeFunc) {
            return wd.loadConfig(jsonPathArr).forEach(function (state) {
                if (!!nextFunc) {
                    nextFunc(state)
                }
            }).then(function () {
                if (!!completeFunc) {
                    return completeFunc()
                }
            })
        },

        loadWholeWDB: function (wdbPath, state, testFunc) {
            return wd.loadWholeWDB(wdbPath, state).forEach(function ([state, gameObject]) {
                testFunc([state, gameObject])
            })
            // .then(function () {
            //     if (!!completeFunc) {
            //         return completeFunc()
            //     }
            // })
        },
        loadStreamWDB: function (wdbPath, state, handleBeforeStartLoopFunc, handleWhenDoneFunc, handleWhenLoadWholeWDBFunc) {
            return wd.loadStreamWDB(wdbPath, handleBeforeStartLoopFunc, handleWhenDoneFunc, handleWhenLoadWholeWDBFunc, state).drain()
        },
        loadIMGUIAsset: function (fntFilePath, bitmapFilePath, customTextureSourceDataArr, state, testFunc) {
            return wd.loadIMGUIAsset(fntFilePath, bitmapFilePath, customTextureSourceDataArr, state)
                .then((state) => {
                    return testFunc(state)
                })
        },
        loadGLB: function (glbPath) {
            return window.fetch(glbPath)
                .then((response) => response.arrayBuffer())
        },
        download: function (content, filename, mimeType) {
            var blob = null;

            var eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';

            if (!!!mimeType || mimeType.length === 0) {
                blob = new Blob([content]);
            }
            else {
                blob = new Blob([content], { type: mimeType });
            }

            eleLink.href = URL.createObjectURL(blob);

            document.body.appendChild(eleLink);
            eleLink.click();

            document.body.removeChild(eleLink);
        }
    }
})()