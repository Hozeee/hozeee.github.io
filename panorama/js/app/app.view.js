APP.View = (function () {

	var renderer,
		$startButton,
		$body,
		supported = false;

	function init() {

		$body = $('body');
		$startButton = $('#startbutton');

		if ($('#panorama').attr('data-render') == 'ie' || (APP.isiphone && APP.isWebgAvailable) ) {

			APP.ie = true;

			renderer = APP.THREE;
			supported = true;

		} else if ($('#panorama').attr('data-render') == 'skybox') {

			renderer = APP.SkyBox;
			supported = true;

		} else if (APP.isWebgAvailable) {

			renderer = APP.THREE;
			supported = true;

		} else if (!APP.isWebgAvailable && APP.isCssTransform3dAvailable) {

			renderer = APP.SkyBox;
			supported = true;

		}

		if (renderer) {
			renderer.init();
		}

		if (supported) {
			$startButton.show();
			$('#loader').hide();
		} else {
			$('#notsupportedbutton').show();
		}

		initBindings();
		initHammer();
		render();
	}

	function initBindings() {

		$(window).resize(function () {
			if (renderer) {
				renderer.onResize();
			}
		});


		$startButton.on('click ', function () {
			$startButton.off();
			$startButton.hide();
			$('#loader').show();

			renderer.addHotSpots();
			renderer.addPanorama('i/content/panorama');
		});

		$body.on({

			'click': function() {
				$(this).hide();
			}

		}, '.ytvideo');

	}

	function initHammer() {
		hammer = new Hammer(document.body);
		hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

		hammer.on('tap', function (event) {
			renderer.onTap(event);
		});

		hammer.on('panstart', function (event) {
			renderer.onPanStart(event);
		});

		hammer.on('panmove', function (event) {
			renderer.onPanMove(event);
		});

		hammer.on('panend', function () {
			renderer.onPanEnd();
		});
	}

	function render() {
		window.requestAnimationFrame(render);

		if (renderer) {
			renderer.render();
		}
	}

	function addYtVideo() {
		console.log('addYtVideo');

		var $ytvideo =  $('.ytvideo'),
			$ytvideoinner = $ytvideo.find('.ytvideo__inner'),
			$iframe = $('<iframe>'),
			id = 'UU5iAFEp6s8';

		if($ytvideoinner.find('iframe').length == 0) {
			$iframe.attr('src', 'http://www.youtube.com/embed/' + id + '?autoplay=1&border=0&enablejsapi=1');
			$ytvideoinner.append($iframe);
		}

		$ytvideo.show();
		$iframe.width($ytvideoinner.width());
		$iframe.height($ytvideoinner.height());

	}

	return {
		init: init,
		addYtVideo: addYtVideo
	}

})();