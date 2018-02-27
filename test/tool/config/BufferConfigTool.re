open BufferConfigSystem;

let setBufferSize =
    (
      state: StateDataType.state,
      ~geometryPointDataBufferCount=100,
      ()
    ) => {
  getConfig(state).geometryPointDataBufferCount = geometryPointDataBufferCount;
  state
};

let buildBufferConfig = (count) => {
  "geometryPointDataBufferCount": Js.Nullable.return(count)
};