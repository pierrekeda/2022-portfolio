import anime from 'animejs';
import { Textformer } from 'textformer';
import { Screen } from './Screen';

class OtherWorkTitleScreen extends Screen {

	constructor( sketch ) {

		const ID = 'other-works';

		super( ID, sketch );

		this.title = document.getElementById( `${ID}-main` );
		this.subtitle = document.getElementById( `${ID}-sub` );

		this.titleText = this.title.innerText;
		this.subtitleText = this.subtitle.innerText;

		this.tweenX = 200;

	}

	setup( backwards ) {

		const tweenX = ( backwards ) ? - this.tweenX : this.tweenX;

		const transform = `translateX(${tweenX}px)`;

		[ this.title, this.subtitle ].forEach( element => {

			element.style.opacity = 0;
			element.style.transform = transform;

		} );

	}

	tweenIn( backwards ) {

		super.tweenIn( backwards );

		const title = new Textformer( {
			autoplay: false,
			mode: Textformer.modes.EXPAND,
			output: this.title,
			from: '',
			to: this.titleText,
		} );

		const subtitle = new Textformer( {
			autoplay: false,
			mode: Textformer.modes.EXPAND,
			output: this.subtitle,
			from: '',
			to: this.subtitleText,
		} );

		this.tweeningIn = anime.timeline( {
			complete: this.completeTweenIn,
			easing: 'easeOutCirc',
			duration: 500,
			delay: 300,
		} )
			.add( { targets: title, 		progress: 1 }, 0 )
			.add( { targets: subtitle, 		progress: 1 }, 0 )
			.add( {
				targets: this.title,
				opacity: 1,
				translateX: 0,
			}, 0 )
			.add( {
				targets: this.subtitle,
				opacity: 1,
				translateX: 0,
			}, 0 );

	}

	tweenOut( backwards ) {

		super.tweenOut( backwards );

		const tweenX = ( backwards ) ? this.tweenX : - this.tweenX;

		const title = new Textformer( {
			autoplay: false,
			mode: Textformer.modes.COLLAPSE,
			output: this.title,
			from: this.titleText,
			to: '',
		} );

		const subtitle = new Textformer( {
			autoplay: false,
			mode: Textformer.modes.COLLAPSE,
			output: this.subtitle,
			from: this.subtitleText,
			to: '',
		} );

		this.tweeningOut = anime.timeline( {
			complete: this.completeTweenOut,
			duration: 300,
			easing: 'easeInOutQuad',
		} )
			.add( { targets: title,		progress: 1 }, 0 )
			.add( { targets: subtitle,	progress: 1 }, 0 )
			.add( {
				targets: this.title,
				opacity: 0,
				translateX: tweenX,
			}, 0 )
			.add( {
				targets: this.subtitle,
				opacity: 0,
				translateX: tweenX,
			}, 0 );

	}

}

export { OtherWorkTitleScreen };
