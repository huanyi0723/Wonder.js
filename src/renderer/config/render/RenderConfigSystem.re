open Contract;

open GameObjectType;

open StateDataType;

let getInitPipelines = (state: StateDataType.state) => state.renderConfig.init_pipelines;

let getInitJobs = (state: StateDataType.state) => state.renderConfig.init_jobs;

let getRenderPipelines = (state: StateDataType.state) => state.renderConfig.render_pipelines;

let getRenderJobs = (state: StateDataType.state) => state.renderConfig.render_jobs;

let getShaders = (state: StateDataType.state) => state.renderConfig.shaders;

let getShaderLibs = (state: StateDataType.state) => state.renderConfig.shader_libs;

let getRenderSetting = (state: StateDataType.state) => state.renderConfig.render_setting;

let _getJobHandleMap = (state: StateDataType.state) => state.renderConfig.jobHandleMap;

let findFirst = (arr: array('a), func) =>
  arr
  |> ArraySystem.unsafeFind(func)
  |> ensureCheck(
       (r) =>
         Contract.Operators.(
           test("should find result", () => arr |> Js.Array.find(func) |> assertExist)
         )
     );

let _filterTargetName = (name, targetName) => name == targetName;

let _getExecutableJob = (jobs: array(job), {name: jobItemName, flags}: jobItem) => {
  let {shader}: job =
    findFirst(jobs, ({name: jobName}: job) => _filterTargetName(jobName, jobItemName));
  {name: jobItemName, flags, shader}
};

let getInitPipelineExecutableJobs = ({init_pipeline}, init_pipelines, jobs: array(job)) => {
  let init_pipelineItem: pipeline =
    findFirst(init_pipelines, ({name}: pipeline) => _filterTargetName(name, init_pipeline));
  init_pipelineItem.jobs |> Js.Array.map(_getExecutableJob(jobs))
};

let getRenderPipelineExecutableJobs = ({render_pipeline}, render_pipelines, jobs: array(job)) => {
  let render_pipelineItem: pipeline =
    findFirst(render_pipelines, ({name}: pipeline) => _filterTargetName(name, render_pipeline));
  render_pipelineItem.jobs |> Js.Array.map(_getExecutableJob(jobs))
};

let execJobs = (gl, jobs: array(executableJob), state: StateDataType.state) : state => {
  let jobHandleMap = _getJobHandleMap(state);
  jobs
  |> ArraySystem.reduceState(
       [@bs]
       (
         (state, {name, flags, shader}: executableJob) =>
           switch (WonderCommonlib.HashMapSystem.get(name, jobHandleMap)) {
           | None => state
           | Some(handle) => handle((flags, shader), gl, state)
           }
       ),
       state
     )
};

let _findFirstShaderData = (shaderLibName: string, shaderLibs: shader_libs) =>
  findFirst(shaderLibs, (item: shaderLib) => _filterTargetName(item.name, shaderLibName));

let getMaterialShaderLibDataArr =
    (
      {static_branchs, groups},
      gameObject: gameObject,
      shaderLibItems,
      shaderLibs: shader_libs,
      state: StateDataType.state
    ) =>
  shaderLibItems
  |> ArraySystem.reduceOneParam(
       [@bs]
       (
         (resultDataArr, {type_, name}: shaderLibItem) =>
           switch type_ {
           | None =>
             Js.Array.push(_findFirstShaderData(name, shaderLibs), resultDataArr);
             resultDataArr
           | Some(type_) =>
             switch type_ {
             | "group" =>
               let group = findFirst(groups, (item) => _filterTargetName(item.name, name));
               let shaderLibArr =
                 group.value
                 |> Js.Array.map((name: string) => _findFirstShaderData(name, shaderLibs));
               Js.Array.concat(shaderLibArr, resultDataArr)
             | "static_branch" =>
               let {value} =
                 findFirst(static_branchs, (item) => _filterTargetName(item.name, name));
               switch name {
               | "modelMatrix_instance" =>
                 let shaderLibName =
                   if (InstanceUtils.isSourceInstance(gameObject, state)) {
                     if (InstanceUtils.isSupportInstance(state)) {
                       value[1]
                     } else {
                       value[2]
                     }
                   } else {
                     value[0]
                   };
                 resultDataArr
                 |> Js.Array.push(_findFirstShaderData(shaderLibName, shaderLibs))
                 |> ignore;
                 resultDataArr
               }
             }
           }
       ),
       WonderCommonlib.ArraySystem.createEmpty()
     );

let throwJobFlagsShouldBeDefined = () =>
  ExceptionHandleSystem.throwMessage("jobFlags should be defined");