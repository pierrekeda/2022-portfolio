import {
	Color,
	EdgesGeometry,
	Float32BufferAttribute,
	Group,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	LineSegments,
	Mesh,
	PlaneGeometry,
	ShaderMaterial,
	Uint16BufferAttribute,
	Uniform,
} from 'three';

import { GPGPU } from 'keda/three/gpgpu/GPGPU';
import { Sketch } from 'keda/three/Sketch';

import { BackgridControls } from './BackgridControls';
import { BackgridSettings } from './BackgridSettings';
import { BackgridShaders } from './BackgridShaders';

class Backgrid extends Sketch {

	constructor( settings = {} ) {

		super( { defaults: BackgridSettings, settings } );

		this.offset = 0;

	}

	init() {

		super.init( BackgridControls );

		this.cursor.value = this.controls.cursor.position;

	}

	initScene() {

		const { settings } = this;

		const container = new Group();
		this.add( container );

		// Computations

		const rowCount = settings.dot.rows;
		const dotCount = rowCount * rowCount;

		const dotSize = settings.dot.size;
		const tileSize = dotSize + settings.dot.margin;
		const totalSize = tileSize * rowCount;
		const startX = ( tileSize - totalSize ) / 2;
		const startY = - ( tileSize - totalSize ) / 2;

		const offsetsX = new Float32Array( dotCount );
		const offsetsY = new Float32Array( dotCount );
		const targets = new Float32Array( dotCount * 2 );
		let i = 0;
		let t = 0;

		for ( let row = 0; row < rowCount; row ++ ) {

			for ( let column = 0; column < rowCount; column ++ ) {

				const x = startX + column * tileSize;
				const y = startY - row * tileSize;

				offsetsX[ i ] = x;
				offsetsY[ i ] = y;

				targets[ t ++ ] = ( i % rowCount ) / rowCount;
				targets[ t ++ ] = ~ ~ ( i / rowCount ) / rowCount;

				i ++;

			}

		}

		this.dotCount = dotCount;
		this.tileSize = tileSize;
		this.totalSize = totalSize;

		this.initUniforms( offsetsX, offsetsY );

		// Geometry preparations

		const aOffsetX = new InstancedBufferAttribute( offsetsX, 1 );
		const aOffsetY = new InstancedBufferAttribute( offsetsY, 1 );
		const GPGPU_target = new InstancedBufferAttribute( targets, 2 );

		function setInstancedAttributes( geometry ) {

			geometry.setAttribute( 'aOffsetX', aOffsetX );
			geometry.setAttribute( 'aOffsetY', aOffsetY );
			geometry.setAttribute( 'GPGPU_target', GPGPU_target );

		}

		// Cores

		const coreBase = new PlaneGeometry( dotSize, dotSize );

		const coreGeometry = new InstancedBufferGeometry();
		coreGeometry.instanceCount = dotCount;
		coreGeometry.setAttribute(
			'position',
			new Float32BufferAttribute().copy( coreBase.attributes.position )
		);
		coreGeometry.setIndex(
			new Uint16BufferAttribute().copy( coreBase.index )
		);
		setInstancedAttributes( coreGeometry );

		const coreMaterial = new ShaderMaterial( BackgridShaders.cores );

		const cores = new Mesh( coreGeometry, coreMaterial );
		container.add( cores );

		// Shells

		const shellBase = new EdgesGeometry( coreBase );

		const shellGeometry = new InstancedBufferGeometry();
		shellGeometry.instanceCount = dotCount;
		shellGeometry.setAttribute(
			'position',
			new Float32BufferAttribute().copy( shellBase.attributes.position )
		);
		setInstancedAttributes( shellGeometry );

		const shellMaterial = new ShaderMaterial( BackgridShaders.shells );

		const shells = new LineSegments( shellGeometry, shellMaterial );
		container.add( shells );

		// Wrap-up

		this.container = container;
		this.cores = cores;
		this.shells = shells;
		coreBase.dispose();
		shellBase.dispose();

	}

	initUniforms( offsetsX, offsetsY ) {

		const { settings } = this;

		// Uniforms

		this.colorActive = new Color( settings.colorActive );
		this.colorInactive = new Color( settings.colorInactive );

		this.cursor = new Uniform( null );
		this.time = new Uniform( 0 );
		this.delta = new Uniform( 0 );
		this.depth = new Uniform( settings.depth.min );
		this.noiseScale = new Uniform( settings.noiseScale.max );

		// GPGPU

		const gpgpu = new GPGPU( this.dotCount );

		gpgpu.addConstant( 'offsetX', offsetsX );
		gpgpu.addConstant( 'offsetY', offsetsY );

		gpgpu.addVariable( 'intensity', {
			shader: BackgridShaders.GPGPU_intensity,
			uniforms: {
				GPGPU_offsetX: gpgpu.offsetX,
				GPGPU_offsetY: gpgpu.offsetY,
				uCursor: this.cursor,
				uDelta: this.delta,
				uNoiseScale: this.noiseScale,
				uTime: this.time,
			}
		} );

		this.gpgpu = gpgpu;

		// Material uniforms

		const uniforms = {
			GPGPU_intensity: gpgpu.intensity,
			uColorActive: new Uniform( this.colorActive ),
			uColorInactive: new Uniform( this.colorInactive ),
			uDepth: this.depth,
		};

		BackgridShaders.cores.uniforms = uniforms;
		BackgridShaders.shells.uniforms = uniforms;

	}

	resize( width, height, pixelRatio ) {

		super.resize( width, height, pixelRatio );

		const narrowness = Math.abs( 1 - this.camera.aspect );
		this.camera.position.z = Math.max( 8 - narrowness, 1 );

	}

	tick( delta ) {

		this.delta.value = delta * this.settings.deltaScale;
		this.time.value += delta * this.settings.timeScale;

		this.gpgpu.tick();

		this.container.position.x = this.offset % this.tileSize;

		super.tick( delta );

	}

}

export { Backgrid };
