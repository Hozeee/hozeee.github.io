APP.THREE = (function () {

	var scene,
		camera,
		renderer,
		geometry,
		material,
		videoMesh,
		videoExt,
		objects = [],
		raycaster,
		isUserInteracting,
		diffX = 0,
		diffY = 0,
		video,
		audioCtx,
		audioSource,
		listener,
		videoTexture,
		panner,
		videoAdded = false,
		$panorama;

	var onPointerDownPointerX = 0,
		onPointerDownPointerY = 0,
		onPointerDownLon = 0,
		onPointerDownLat = 0,
		lon = -180,
		lat = -14,
		phi = 0,
		theta = 0;

	function init() {
		$panorama = $('#panorama');
		$('#space').hide();

		var videoTest = document.createElement('video');
		if (videoTest.canPlayType('video/mp4')) {
			videoExt = '.mp4';
		} else if (videoTest.canPlayType('video/webm')) {
			videoExt = '.webm';
		} else {
			alert('cant play video');
		}

		/*$('body').keypress(function(e) {
		 var num = e.which - 48;
		 if(num > 0 && num < 8) {
		 $('#loader').show();
		 addPanorama('{{ASSET_PREFIX}}i/content/lift' + num);
		 }

		 });*/

		//audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		//panner = audioCtx.createPanner();


		initThreejs();
		render();

		window.requestAnimationFrame(checkMouseMovement);

	}

	function initBindings() {
		console.log('initBindings threejs');

		$('.panorama__inner').mousemove(function (e) {

			var offX = e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX,
				offY = e.offsetY === undefined ? e.originalEvent.layerY : e.offsetY,
				panW = parseInt($(this).width(), 10),
				panH = parseInt($(this).height(), 10),
				relax = 0.003;

			diffX = (panW / 2 - offX) * relax;
			diffY = (panH / 2 - offY) * relax;
		});

		$('body').on({
			'mouseout': function () {
				diffX = 0;
				diffY = 0;
			}
		}, '.panorama__inner');

		if (window.DeviceOrientationEvent) {
			console.log('window.DeviceOrientationEvent');

			window.ondeviceorientation = function (event) {
				var alpha = (event.alpha),
					beta = (event.beta),
					gamma = (event.gamma);

				diffX = 0;
				diffY = 0;

				if (window.orientation == 0) {
					lon = gamma;
					lat = beta - 90;
				} else if (window.orientation == 90) {
					lon = -alpha;
					lat = -gamma - 90;
				} else if (window.orientation == -90) {
					lon = -alpha;
					lat = gamma - 90;
				}
			}

		}
	}

	function checkMouseMovement() {

		window.requestAnimationFrame(checkMouseMovement);

		if (isUserInteracting) {
			return;
		}

		lon -= diffX;
		lat += diffY;
	}

	function onTap(event) {
		var vector = new THREE.Vector3();
		vector.set(( event.center.x / window.innerWidth ) * 2 - 1, -( event.center.y / window.innerHeight ) * 2 + 1, 0.5);
		vector.unproject(camera);

		raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

		var intersects = raycaster.intersectObjects(objects);

		if (intersects.length > 0) {
			intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

			if (intersects[0].object.name == 'test1') {
				//$('#loader').show();
				//addPanorama('{{ASSET_PREFIX}}i/content/360_2');
				removeHotspots();
			} else if (intersects[0].object.name == 'youtube') {
				APP.View.addYtVideo();
			} else {
				window.open('http://www.possible.com', '_blank');
			}

		}

	}

	function onPanStart(event) {

		if (video && video.paused) {
			video.play();
		}

		isUserInteracting = true;

		onPointerDownPointerX = event.center.x;
		onPointerDownPointerY = event.center.y;

		onPointerDownLon = lon;
		onPointerDownLat = lat;

	}

	function onPanMove(event) {

		if (isUserInteracting === true) {

			lon = event.deltaX * -0.1 + onPointerDownLon;
			lat = event.deltaY * 0.1 + onPointerDownLat;
		}

	}

	function onPanEnd() {
		isUserInteracting = false;
	}

	function initThreejs() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1100);
		camera.target = new THREE.Vector3(0, 0, 0);

		raycaster = new THREE.Raycaster();

		addLight();

		renderer = new THREE.WebGLRenderer();
		renderer.setSize($panorama.width(), $panorama.height());
		renderer.domElement.cssClass = 'canvas-elem';
		renderer.domElement.id = 'webglcanvas';
		$panorama.append(renderer.domElement);

		camera.position.z = 5;
	}

	function addPanorama(url) {
		$('#webglcanvas').show();

		geometry = new THREE.SphereGeometry(500, 60, 40);
		geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

		if (!!APP.ie) {
			videoTexture = new THREE.ImageUtils.loadTexture(url + '_sphere.jpg', undefined, onTextureLoaded);
		} else {

			if (videoTexture && video) {
				video.pause();
			}

			video = document.createElement('video');
			video.width = 320;
			video.height = 240;
			video.autoplay = false;
			video.loop = true;
			video.src = url + videoExt;

			console.log(url + videoExt);

			$('#loader h1').html('Load: ' + url);

			video.setAttribute('crossorigin', 'anonymous');

			$(video).on({

				'waiting': function () {
					console.log('waiting');
				},

				'canplaythrough': function () {
					$('#loader').hide();
					video.play();
				},

				'load': function () {
					$('#loader').hide();
					video.play();
				}

			});


			video.load();
			videoTexture = new THREE.Texture(video);

			/*audioSource = audioCtx.createMediaElementSource(video);

			 panner = audioCtx.createPanner();
			 listener = audioCtx.listener;
			 listener.dopplerFactor = 1;
			 listener.speedOfSound = 343.3;
			 listener.setOrientation(0, 0, -1, 0, 1, 0);
			 listener.setPosition(0, 0, 0);
			 audioSource.connect(panner);

			 panner.connect(audioCtx.destination);*/
		}

		material = new THREE.MeshBasicMaterial({
			map: videoTexture
		});

		videoMesh = new THREE.Mesh(geometry, material);
		scene.add(videoMesh);

		initBindings();
	}

	function onTextureLoaded() {
		console.log('texture loaded');
		$('#loader').hide();
	}

	function addLight() {
		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 1, 1).normalize();
		scene.add(directionalLight);

		var ambientLight = new THREE.AmbientLight(0xbbbbbb);
		scene.add(ambientLight);
	}

	function addHotSpots() {

		addHotSpot({
			color: 0xFF0000,
			position: {
				x: 0,
				z: -2
			},
			name: 'test1'
		});


		addHotSpot({
			color: 0x00FF00,
			position: {
				x: 2
			},
			name: 'test2'
		});

		addHotSpot({
			color: 0x00FF00,
			position: {
				x: -5,
				y: 2,
				z: 0
			},
			texture: 'i/carp.jpg',
			name: 'youtube'
		});


	}

	function addHotSpot(data) {
		var material = new THREE.MeshLambertMaterial({color: 0xFF0000}),
			geometry = new THREE.CubeGeometry(2, 2, 0.01),
		//geometry = new THREE.Mesh(1, 1, 1),
			texture,
			hotSpot;

		geometry.overdraw = true;

		if (data.texture) {
			texture = THREE.ImageUtils.loadTexture(data.texture);
			material = new THREE.MeshLambertMaterial({
				map: texture
			});
		}

		hotSpot = new THREE.Mesh(geometry, material);
		hotSpot.name = data.name;
		hotSpot.position.x = data.position.x;
		hotSpot.position.y = data.position.y || 0;
		hotSpot.position.z = data.position.z || 0;

		scene.add(hotSpot);
		objects.push(hotSpot);
	}

	function removeHotspots() {
		for (var i = 0; i < objects.length; i++) {
			scene.remove(objects[i]);
		}
	}

	function render() {
		lat = Math.max(-85, Math.min(85, lat));
		phi = THREE.Math.degToRad(90 - lat);
		theta = THREE.Math.degToRad(lon);

		camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
		camera.target.y = 500 * Math.cos(phi);
		camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

		camera.lookAt(camera.target);

		if (listener) {
			listener.setPosition(Math.cos(theta), Math.cos(phi), Math.sin(theta));
		}

		if (videoTexture && !APP.ie) {

			if (video.readyState !== video.HAVE_ENOUGH_DATA) {
				return;
			}
			videoTexture.needsUpdate = true;
		}

		for (var i = 0; i < objects.length; i++) {
			objects[i].rotation.y += 0.01;
		}

		renderer.render(scene, camera);
	}

	function onResize() {
		renderer.setSize($panorama.width(), $panorama.height());
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
	};

})
();