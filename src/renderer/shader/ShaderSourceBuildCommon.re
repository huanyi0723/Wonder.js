open StateDataType;

open ShaderType;

open ShaderChunkType;

open ShaderChunkSystem;

open RenderConfigType;

let webgl1_main_begin: string = "void main(void){\n";

let webgl1_main_end: string = "}\n";

let _generateAttributeSource = (shaderLibDataArr: shader_libs) =>
  shaderLibDataArr
  |> Js.Array.reduce(
       (result: string, {variables}) =>
         switch variables {
         | None => result
         | Some(variables) =>
           switch variables.attributes {
           | None => result
           | Some(attributes) =>
             result
             ++ (
               attributes
               |> Js.Array.reduce(
                    (result: string, {name, type_}: attribute) =>
                      switch (name, type_) {
                      | (Some(name), Some(type_)) => result ++ {j|attribute $type_ $name;
  |j}
                      | (_, _) => result
                      },
                    ""
                  )
             )
           }
         },
       ""
     );

let _isInSource = (key: string, source: string) => Js.String.indexOf(key, source) > (-1);

let _generateUniformSourceType = (type_: string) =>
  switch type_ {
  /* | "float3" => "vec3" */
  | _ => type_
  };

let _generateUniformSource =
    (
      shaderLibDataArr: shader_libs,
      sourceVarDeclare: string,
      sourceFuncDefine: string,
      sourceBody: string
    ) =>
  shaderLibDataArr
  |> Js.Array.reduce(
       (result: string, {variables}) =>
         switch variables {
         | None => result
         | Some(variables) =>
           switch variables.uniforms {
           | None => result
           | Some(uniforms) =>
             result
             ++ (
               uniforms
               |> Js.Array.filter(
                    ({name}: uniform) =>
                      _isInSource(name, sourceVarDeclare)
                      || _isInSource(name, sourceFuncDefine)
                      || _isInSource(name, sourceBody)
                  )
               |> Js.Array.reduce(
                    (result: string, {name, type_}: uniform) => {
                      let type_ = _generateUniformSourceType(type_);
                      result ++ {j|uniform $type_ $name;
|j}
                    },
                    ""
                  )
             )
           }
         },
       ""
     );

let getPrecisionSource = (state: StateDataType.state) => {
  open GPUDetectType;
  let {precision} = GPUStateUtils.getGpuDetectData(state);
  switch (precision |> Js.Option.getExn) {
  | HIGHP => getChunk("highp_fragment", state).top
  | MEDIUMP => getChunk("mediump_fragment", state).top
  | LOWP => getChunk("lowp_fragment", state).top
  | _ => getChunk("highp_fragment", state).top
  }
};

let _setSource =
    (
      {
        top: sourceTop,
        define: sourceDefine,
        varDeclare: sourceVarDeclare,
        funcDeclare: sourceFuncDeclare,
        funcDefine: sourceFuncDefine,
        body: sourceBody
      } as sourceChunk,
      {top, define, varDeclare, funcDeclare, funcDefine, body}
    ) => {
  sourceChunk.top = sourceTop ++ top;
  sourceChunk.define = sourceDefine ++ define;
  sourceChunk.varDeclare = sourceVarDeclare ++ varDeclare;
  sourceChunk.funcDeclare = sourceFuncDeclare ++ funcDeclare;
  sourceChunk.funcDefine = sourceFuncDefine ++ funcDefine;
  sourceChunk.body = sourceBody ++ body
};

let _buildBody = ({body}, webgl1_main_end) => body ++ webgl1_main_end;

let _buildTop = ({top, varDeclare, funcDefine, body}, shaderLibDataArr) =>
  top ++ _generateUniformSource(shaderLibDataArr, varDeclare, funcDefine, body);

let _addAlllParts = ({top, define, varDeclare, funcDeclare, funcDefine, body}) =>
  top ++ define ++ varDeclare ++ funcDeclare ++ funcDefine ++ body;

let buildGLSLSource =
  [@bs]
  (
    (materialIndex: int, shaderLibDataArr: shader_libs, state: StateDataType.state) => {
      let {precision} = ShaderStateCommon.getGLSLData(state);
      let vs: glslChunk = {
        top: "",
        define: "",
        varDeclare: "",
        funcDeclare: "",
        funcDefine: "",
        body: ""
      };
      let fs: glslChunk = {
        top: "",
        define: "",
        varDeclare: "",
        funcDeclare: "",
        funcDefine: "",
        body: ""
      };
      vs.body = vs.body ++ webgl1_main_begin;
      fs.body = fs.body ++ webgl1_main_begin;
      fs.top = (precision |> Js.Option.getExn) ++ fs.top;
      shaderLibDataArr
      |> Js.Array.forEach(
           ({glsls}) =>
             switch glsls {
             | None => ()
             | Some(glsls) =>
               glsls
               |> Js.Array.forEach(
                    ({type_, name}: glsl) =>
                      switch type_ {
                      | "vs" => _setSource(vs, getChunk(name, state))
                      | "fs" => _setSource(fs, getChunk(name, state))
                      | _ => ExceptionHandleSystem.throwMessage({j|unknow glsl type:$type_|j})
                      }
                  )
             }
         );
      vs.body = _buildBody(vs, webgl1_main_end);
      fs.body = _buildBody(fs, webgl1_main_end);
      vs.top = vs.top ++ _generateAttributeSource(shaderLibDataArr);
      vs.top = _buildTop(vs, shaderLibDataArr);
      fs.top = _buildTop(fs, shaderLibDataArr);
      (_addAlllParts(vs), _addAlllParts(fs))
    }
  );