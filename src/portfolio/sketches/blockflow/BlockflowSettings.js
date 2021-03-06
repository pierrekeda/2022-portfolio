const tileSize = 0.3;
const tileMargin = 0.05;

const BlockflowSettings = {

	name: 'Blockflow',

	// Scene

	tile: {
		countX: 40,
		countZ: 40,

		width: tileSize,
		height: 0.1,
		depth: tileSize,

		margin: {
			x: tileMargin,
			y: 0,
			z: tileMargin
		},
	},

	border: 2.5 * ( tileSize + tileMargin ),

	background: {
		color1: 0x0095b3,
		color2: 0x009966,
	},
	colorLow: 	0x00c8d6,
	colorHigh: 	0xcbe600,

	bloom: {
		strength: 0.2,
		radius: 0.7,
		threshold: 0.5,
	},

	// Controls

	camera: {
		start: { x: 10, y: 5, z: 10 },
	},
	cameraRig: {
		bounds: { x: 8, y: 25, z: 0 },
		speed: 0.00075,
	},

	cursorProjector: {
		horizontal: true,
		cursorSize: 0.5,
		lerp: 0.007,
		multiplier: 1.5,
	},

	lerpSpeed: 0.0007,
	speed: 		{ min: 2.5, max: 3.5, value: 3 },
	amplitude: 	{ min: 150, max: 250, value: 200 },
	scale: 		{ min: 0.2, max: 0.8, value: 0.5 },
	thickness: 	{ min: 0.5, max: 1.5, value: 1 },
	turbulence: { min: 0.2, max: 1.5, value: 1 },
	opacity: 	{ min: 0.4, max: 0.6, value: 0.5 },

};

export { BlockflowSettings };
