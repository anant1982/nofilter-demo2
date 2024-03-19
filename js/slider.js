// Define variables
let scene, camera, renderer;
let images = [];
let currentIndex = 0;
let targetIndex = 0;
let isAnimating = false;

// Initialize function
function init() {
	// Create scene
	scene = new THREE.Scene();

	// Create camera
	camera = new THREE.PerspectiveCamera(
		80,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.z = 5;

	// Create renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Load images
	const imageUrls = [
		"../images/IMG_1636.webp",
		"../images/IMG_1637.webp",
		"../images/IMG_1638.webp",
		"../images/IMG_1639.webp",
	]; // Add your image URLs here
	const loader = new THREE.TextureLoader();
	imageUrls.forEach((url) => {
		const texture = loader.load(url);
		images.push(texture);
	});

	// Create plane
	const geometry = new THREE.PlaneGeometry(4.6, 6.5);
	const material = new THREE.MeshBasicMaterial({
		map: images[currentIndex],
		side: THREE.DoubleSide,
	});
	const plane = new THREE.Mesh(geometry, material);
	scene.add(plane);

	// Event listeners
	document.addEventListener("wheel", onMouseWheel);

	// Render the scene
	render();
}

// Render function
function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

// Handle mouse wheel event
function onMouseWheel(event) {
	if (!isAnimating) {
		targetIndex += Math.sign(event.deltaY);
		targetIndex = Math.max(0, Math.min(images.length - 1, targetIndex));
		if (targetIndex !== currentIndex) {
			isAnimating = true;
			animateSlider();
		}
	}
}

// Animate slider
function animateSlider() {
	const direction = targetIndex > currentIndex ? 1 : -1;
	const distance = Math.abs(targetIndex - currentIndex);
	const duration = 0.5 * distance;

	// Update current index
	currentIndex = targetIndex;

	// Animate transition
	new TWEEN.Tween(scene.children[0].material)
		.to({ opacity: 0 }, duration * 500)
		.onComplete(() => {
			scene.children[0].material.map = images[currentIndex];
			new TWEEN.Tween(scene.children[0].material)
				.to({ opacity: 1 }, duration * 500)
				.onComplete(() => {
					isAnimating = false;
				})
				.start();
		})
		.start();
}

// Initialize Three.js
init();

// Handle window resize
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
