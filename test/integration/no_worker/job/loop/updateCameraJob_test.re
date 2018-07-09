open Wonder_jest;

open BasicCameraViewAPI;

open PerspectiveCameraProjectionAPI;

open ArcballCameraControllerAPI;

let _ =
  describe("test update camera job", () => {
    open Expect;
    open Expect.Operators;
    open Sinon;
    let sandbox = getSandboxDefaultVal();
    let state = ref(MainStateTool.createState());

    beforeEach(() => sandbox := createSandbox());
    afterEach(() => restoreSandbox(refJsObjToSandbox(sandbox^)));

    describe("update perspectiveCameraProjection", () => {
      let _buildNoWorkerJobConfig = () =>
        NoWorkerJobConfigTool.buildNoWorkerJobConfig(
          ~loopPipelines=
            {|
        [
    {
      "name": "default",
      "jobs": [
        {
          "name": "update_camera"
        }
      ]
    }
  ]
        |},
          ~loopJobs=
            {|
[
        {
          "name": "update_camera"
        }
]
        |},
          (),
        );

      beforeEach(() =>
        state :=
          TestTool.initWithJobConfig(
            ~sandbox,
            ~noWorkerJobRecord=_buildNoWorkerJobConfig(),
            (),
          )
      );

      CameraTool.testBuildPMatrix(
        () => state^,
        state => DirectorTool.run(state, ()),
      );
      test("test dirty during multi updates", () => {
        open PerspectiveCameraProjectionAPI;
        let (state, basicCameraView, perspectiveCameraProjection) =
          CameraTool.createBasicCameraViewPerspectiveCamera(state^);
        let state = state |> DirectorTool.runWithDefaultTime;
        let state =
          state |> setPerspectiveCameraProjectionNear(basicCameraView, 0.2);
        let state = state |> DirectorTool.runWithDefaultTime;
        state
        |> unsafeGetPerspectiveCameraProjectionPMatrix(basicCameraView)
        |>
        expect == Js.Typed_array.Float32Array.make([|
                    1.7320508075688776,
                    0.,
                    0.,
                    0.,
                    0.,
                    1.7320508075688776,
                    0.,
                    0.,
                    0.,
                    0.,
                    (-1.0004000800160033),
                    (-1.),
                    0.,
                    0.,
                    (-0.40008001600320064),
                    0.,
                  |]);
      });
    });

    describe("update arcballCameraController", () => {
      let _prepare =
          (~distance=2.5, ~phi=1., ~theta=0.5, ~target=(1., 2., 3.), ()) => {
        let state =
          TestTool.initWithJobConfigWithoutBuildFakeDom(
            ~sandbox,
            ~noWorkerJobRecord=
              NoWorkerJobConfigTool.buildNoWorkerJobConfig(
                ~loopPipelines=
                  {|
        [
    {
      "name": "default",
      "jobs": [
        {
          "name": "update_camera"
        }
      ]
    }
  ]
        |},
                ~loopJobs=
                  {j|
[
        {
          "name": "update_camera"
        }
]
        |j},
                (),
              ),
            (),
          );

        let (
          state,
          gameObject,
          transform,
          (cameraController, basicCameraView, perspectiveCameraProjection),
        ) =
          ArcballCameraControllerTool.createGameObject(state);

        let distance = 2.5;
        let phi = 1.;
        let theta = 0.5;
        let target = (1., 2., 3.);

        let state =
          state
          |> setArcballCameraControllerDistance(cameraController, distance)
          |> setArcballCameraControllerPhi(cameraController, phi)
          |> setArcballCameraControllerTheta(cameraController, theta)
          |> setArcballCameraControllerTarget(cameraController, target);

        (state, transform);
      };

      describe("update one arcballCameraController", () =>
        describe("update transform", () => {
          test("set localPosition", () => {
            let (state, transform) =
              _prepare(
                ~distance=2.5,
                ~phi=1.,
                ~theta=0.5,
                ~target=(1., 2., 3.),
                (),
              );

            let state = state |> NoWorkerJobTool.execLoopJobs;

            TransformAPI.getTransformLocalPosition(transform, state)
            |>
            expect == (
                        1.6475868225097656,
                        4.008556842803955,
                        4.19395637512207,
                      );
          });

          test("lookAt target", () => {
            let (state, transform) =
              _prepare(
                ~distance=2.5,
                ~phi=1.,
                ~theta=0.5,
                ~target=(1., 2., 3.),
                (),
              );

            let state = state |> NoWorkerJobTool.execLoopJobs;

            TransformAPI.getTransformRotation(transform, state)
            |>
            expect == (
                        (-0.454542090087156),
                        0.21722128187783157,
                        0.11533277009085662,
                        0.8560985572221845,
                      );
          });
        })
      );

      describe("update two arcballCameraController", () =>
        test("set localPosition", () => {
          let (state, transform1) =
            _prepare(
              ~distance=2.5,
              ~phi=1.,
              ~theta=0.5,
              ~target=(1., 2., 3.),
              (),
            );
          let (state, _, transform2, _) =
            ArcballCameraControllerTool.createGameObject(state);

          let state = state |> NoWorkerJobTool.execLoopJobs;

          (
            TransformAPI.getTransformLocalPosition(transform1, state),
            TransformAPI.getTransformLocalPosition(transform2, state),
          )
          |>
          expect == (
                      (
                        1.6475868225097656,
                        4.008556842803955,
                        4.19395637512207,
                      ),
                      (6.123233998228043e-16, 10., 6.123233998228043e-16),
                    );
        })
      );
    });
  });