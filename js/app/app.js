/**
 * Global main namespace for the application
 *
 * Entry point of the application
 * @namespace APP
 */

var APP = APP || function () {
};

/**
 * Main application class
 *
 * @namespace APP
 * @name APP.Main
 */
APP.Main = (/** @lends APP.Main */function () {

	var instance,
		view;

	/**
	 * Initialize application and needed subclasses
	 * @public
	 */
	function init() {

		console.log('useragent: ', navigator.userAgent);

		//test IE
		APP.ie = navigator.userAgent.match(/trident/i);

		//test iphone
		APP.isiphone = !!navigator.userAgent.match(/iPhone/i);

		//test webgl support
		APP.isWebgAvailable = webglAvailable();
//		APP.isWebgAvailable = false;

		//test css3d transform support
		APP.isCssTransform3dAvailable = !!$('html').hasClass('csstransforms3d');

		console.log('isiphone: ', APP.isiphone);
		console.log('isWebglcompatible: ', APP.isWebgAvailable);
		console.log('isCssTransform3dAvailable: ', APP.isCssTransform3dAvailable);

		$('#startbutton .panorama__button__device').text('webgl: ' + APP.isWebgAvailable + ', css3d: ' + APP.isCssTransform3dAvailable);

		APP.View.init();
	}

	function webglAvailable() {
		try {
			var canvas = document.createElement("canvas");
			return !!window.WebGLRenderingContext && !!(canvas.getContext("webgl") || !!canvas.getContext("experimental-webgl"));
		} catch (e) {
			return false;
		}
	}

	return {

		/**
		 * Get singleton APP.Main instance
		 *
		 * @public
		 * @memberof APP.Main
		 * @returns {APP.Main}
		 */
		getInstance: function () {

			if (!instance) {
				instance = init();
			}

			return instance;
		}

	};

}());