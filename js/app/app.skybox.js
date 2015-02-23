APP.SkyBox = (function () {

	var $body,
		$doq,
		$space,
		$rotate,

		sensitivity = 0.2,
		startRotation = 0,
		rotationX = 0,
		rotationY = 0,
		transformProperty,
		fps = 24,
		back,
		left,
		front,
		right,
		top,
		bottom,

		canvasSize = 900,

		imageWidth = 2000,
		imageHeight = 1500 / 3,
		imageSliceWidth = imageWidth / 4;

	function init() {
		console.log('css3d init');

		transformProperty = getSupportedPropertyName();
		initDomElements();
		initBindings();
//		addHotSpots();
//		addPanorama('{{ASSET_PREFIX}}i/content/skybox_02');

	}

	function initDomElements() {
		$body = $('body');
		$doq = $(document);
		$space = $('#space');
		back = document.getElementById('side-back').getContext('2d');
		left = document.getElementById('side-left').getContext('2d');
		front = document.getElementById('side-front').getContext('2d');
		right = document.getElementById('side-right').getContext('2d');
		top = document.getElementById('side-top').getContext('2d');
		bottom = document.getElementById('side-bottom').getContext('2d');
		$rotate = $space.find('[data-rotate]')[0];

		setCanvasSize();
	}

	function initBindings() {

		$body.on({
			'click': function () {
				console.log($(this).attr('data-url'));
				var $this = $(this);

				if ($this.attr('data-url')) {
					window.open('http://www.possible.com', '_blank');

				} else if ($this.attr('data-action')) {
					APP.View.addYtVideo();

				} else {
					$('#loader').show();
					addPanorama('{{ASSET_PREFIX}}i/content/panorama');
					removeHotspots();
				}
			}
		}, '.hs');

	}

	function addHotSpots() {
		console.log('skybox: addHotSpots');

		$('.side.side-front').append('<span class="hs" data-url="www.hsbc.co.uk" style="left:20%;top:33%"></span>');
		$('.side.side-right').append('<span class="hs" data-action="youtube" style="left:50%;top:60%"></span>');
		$('.side.side-back').append('<span class="hs" style="left:50%;top:60%"></span>');
	}

	function removeHotspots() {
		$('.side .hs').remove();
	}

	function setCanvasSize() {

		canvasSize = 500;

		$('.side').css({
			width: canvasSize + 1,
			height: canvasSize,
			margin: -canvasSize / 2 + 'px'
		});

		$('.side canvas').css({
			width: canvasSize + 1,
			height: canvasSize
		});

		$('.side canvas').attr('width', canvasSize + 1);
		$('.side canvas').attr('height', canvasSize);

		$('.side-front')[0].style[transformProperty] = 'rotateY(0deg) translateZ(-' + (canvasSize / 2 - 1) + 'px)';
		$('.side-left')[0].style[transformProperty] = 'rotateY(90deg) translateZ(-' + (canvasSize / 2 - 1) + 'px)';
		$('.side-right')[0].style[transformProperty] = 'rotateY(-90deg) translateZ(-' + (canvasSize / 2 - 1) + 'px)';
		$('.side-back')[0].style[transformProperty] = 'rotateY(-180deg) translateZ(-' + (canvasSize / 2 - 1) + 'px)';
		$('.side-top')[0].style[transformProperty] = 'rotateY(90deg) rotateX(-90deg) translateZ(-' + (canvasSize / 2 - 1) + 'px)';
		$('.side-bottom')[0].style[transformProperty] = 'rotateY(90deg) rotateX(90deg) translateZ(-' + (canvasSize / 2 - 1) + 'px)';

	}

	function render() {

	}

	function onTap(event) {


	}

	function onPanStart(event) {
		isUserInteracting = true;
		$body.addClass('c-drag');
		startRotation = {x: rotationX, y: rotationY};
	}

	function onPanMove(event) {

		if (isUserInteracting === true) {
			rotationX = startRotation.x - (event.deltaX * sensitivity);
			rotationY = startRotation.y + (event.deltaY * sensitivity);
			$rotate.style[transformProperty] = 'rotate3d(1, 0, 0, ' + rotationY + 'deg) rotate3d(0, 1, 0, ' + rotationX + 'deg)';
		}

	}

	function onPanEnd() {
		isUserInteracting = false;
		$body.removeClass('c-drag');
	}

	function addPanorama(url) {

		$('#space').show();

		console.log('skybox addPanorama: ', url);

		var img = document.createElement('img');
		img.onload = function () {
			back.drawImage(img, 0, imageSliceWidth, imageSliceWidth, imageHeight, 0, 0, canvasSize, canvasSize);
			left.drawImage(img, imageSliceWidth, imageSliceWidth, imageSliceWidth, imageHeight, 0, 0, canvasSize, canvasSize);
			front.drawImage(img, imageSliceWidth * 2, imageSliceWidth, imageSliceWidth, imageHeight, 0, 0, canvasSize, canvasSize);
			right.drawImage(img, imageSliceWidth * 3, imageSliceWidth, imageSliceWidth, imageHeight, 0, 0, canvasSize, canvasSize);
			top.drawImage(img, imageSliceWidth, 0, imageSliceWidth, imageHeight, 0, 0, canvasSize, canvasSize);
			bottom.drawImage(img, imageSliceWidth, imageSliceWidth * 2, imageSliceWidth, imageHeight, 0, 0, canvasSize, canvasSize);

			$('#loader').hide();
		};

		img.src = url + '.jpg';
	}

	function getSupportedPropertyName() {
		var properties = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];
		for (var i = 0; i < properties.length; i++) {
			if (typeof document.body.style[properties[i]] != "undefined") {
				return properties[i];
			}
		}
		return null;
	}


	function onResize() {
		console.log('onResize');
	}

	return {
		init: init,
		render: render,
		onTap: onTap,
		onPanStart: onPanStart,
		onPanMove: onPanMove,
		onPanEnd: onPanEnd,
		onResize: onResize,
		addHotSpots: addHotSpots,
		addPanorama: addPanorama
	}

})();