import { ShaderUtils } from 'keda/three/misc/ShaderUtils';

class NewSketchShaders extends Shaders {}

/*-----------------------------------------------------------------------------/

	Main

/-----------------------------------------------------------------------------*/

const vertexHead = /*glsl*/`

`;

const vertexBody =  /*glsl*/`
	
`;

const fragmentHead = /*glsl*/`

`;

const fragmentBody = /*glsl*/`
	
`;

NewSketchShaders.edit = ( shader ) => ShaderUtils.editBasic(
	shader, vertexHead, vertexBody, fragmentHead, fragmentBody
);

export { NewSketchShaders };
