let _getInitPipelineJobs = () => [
  (StartTimeCPJobEntity.create(), StartTimeCPJobEntity.exec),
  (InitWebGPUCPJobEntity.create(), InitWebGPUCPJobEntity.exec),
  (InitCameraCPJobEntity.create(), InitCameraCPJobEntity.exec),
  (InitPassCPJobEntity.create(), InitPassCPJobEntity.exec),
  (InitPathTracingCPJobEntity.create(), InitPathTracingCPJobEntity.exec),
  (InitAccumulationCPJobEntity.create(), InitAccumulationCPJobEntity.exec),
];

let _getUpdatePipelineJobs = () => [
  (UpdateTransformCPJobEntity.create(), UpdateTransformCPJobEntity.exec),
  (UpdateCameraCPJobEntity.create(), UpdateCameraCPJobEntity.exec),
  (UpdatePathTracingCPJobEntity.create(), UpdatePathTracingCPJobEntity.exec),
  (
    UpdateAccumulationCPJobEntity.create(),
    UpdateAccumulationCPJobEntity.exec,
  ),
  (UpdatePassCPJobEntity.create(), UpdatePassCPJobEntity.exec),
];

let _getRenderPipelineJobs = () => [
  (RenderPathTracingCPJobEntity.create(), RenderPathTracingCPJobEntity.exec),
  (
    RenderAccumulationCPJobEntity.create(),
    RenderAccumulationCPJobEntity.exec,
  ),
  (EndRenderCPJobEntity.create(), EndRenderCPJobEntity.exec),
];

let _register = (pipeline, jobs) => {
  jobs->ListSt.forEach(((job, execFunc)) => {
    PipelineRunAPI.registerJob(pipeline, job, execFunc)
  });
};

let registerAllJobs = () => {
  _register(PipelineCPRepo.getInitPipeline(), _getInitPipelineJobs());
  _register(PipelineCPRepo.getUpdatePipeline(), _getUpdatePipelineJobs());
  _register(PipelineCPRepo.getRenderPipeline(), _getRenderPipelineJobs());
};
