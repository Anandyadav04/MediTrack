// // GSAP Animations
// // GSAP Animation for Navbar
// gsap.from(".navbar", {
//     opacity: 0,
//     y: -50,
//     duration: 1,
//     ease: "power2.out",
// });
// gsap.from(".hero-section h1", { opacity: 0, x: -50, duration: 1, delay: 0.5 });
// gsap.from(".hero-section p", { opacity: 0, x: -50, duration: 1, delay: 1 });
// gsap.from(".cta-buttons", { opacity: 0, y: 50, duration: 1, delay: 1.5 });

// // Three.js 3D Animation (Placeholder)
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.getElementById('3d-animation').appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.z = 5;

// function animate() {
//   requestAnimationFrame(animate);
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//   renderer.render(scene, camera);
// }

// animate();