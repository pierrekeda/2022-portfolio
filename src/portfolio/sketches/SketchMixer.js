import {
	Mesh,
	OrthographicCamera,
	PlaneGeometry,
	Scene,
	ShaderMaterial
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { RadialBlurPass } from '../../keda/three/postprocessing/RadialBlurPass';
import { SketchMixerShaders } from './SketchMixerShaders';

class SketchMixer {

	constructor( renderer, sketches ) {

		this.scene = new Scene();

		const right = 1;
		const left = - 1;
		const top = 1;
		const bottom = - 1;
		const near = - 1;
		const far = 1;
		this.camera = new OrthographicCamera(
			left, right, top, bottom, near, far
		);

		this.geometry = new PlaneGeometry( 2, 2 );

		this.material = new ShaderMaterial( SketchMixerShaders );

		this.quad = new Mesh( this.geometry, this.material );
		this.scene.add( this.quad );

		this.sketches = sketches;

		this.composer = new EffectComposer( renderer );
		this.composer.addPass( new RenderPass( this.scene, this.camera ) );

		this.radialBlur = new RadialBlurPass( { strength: 0 } );
		this.composer.addPass( this.radialBlur );

		//this.renderer = renderer;

	}

	init() {

		this.sketches.forEach( sketch => sketch.init() );
		this.set( this.sketches[ 0 ], this.sketches[ 1 ] );

	}

	set( sketchA, sketchB ) {

		this.mixA = sketchA;
		this.mixB = sketchB;
		this.material.uniforms.tMixA.value = this.mixA.output;
		this.material.uniforms.tMixB.value = this.mixB.output;

	}

	resize( width, height, pixelRatio ) {

		this.sketches.forEach( sketch => sketch.resize( width, height, pixelRatio ) );

		const aspect = width / height;

		const cellsX = Math.ceil( 18 * aspect );
		this.material.uniforms.uCellsX.value = cellsX;

		const displacement = 0.2 / aspect;
		this.material.uniforms.uDisplace.value = displacement;

		this.material.uniforms.uAspect.value = aspect;

		this.composer.setSize( width, height );

	}

	tick( delta ) {

		const { mixA, mixB, mix } = this;

		const alternate = ( mix > 0 && mix < 1 );
		if ( alternate ) {

			delta *= 2;
			this.lastTicked = ( this.lastTicked === mixA ) ? mixB : mixA;

		} else this.lastTicked = ( mix === 0 ) ? mixA : mixB;

		this.lastTicked.tick( delta );

		//this.renderer.render( this.scene, this.camera );
		this.composer.render();

	}

	/*-------------------------------------------------------------------------/

		Getters & Setters

	/-------------------------------------------------------------------------*/

	get mix() {

		return this.material.uniforms.uMix.value;

	}

	set mix( mix ) {

		this.material.uniforms.uMix.value = mix;

	}

	get blur() {

		return this.radialBlur.strength;

	}

	set blur( value ) {

		this.radialBlur.strength = value;

	}

}

export { SketchMixer };
