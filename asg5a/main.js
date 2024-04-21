// followed this tutorial: https://www.youtube.com/watch?v=8jP4xpga6yY&ab_channel=TraversyMedia, so alot of initialization stuff is similar
import * as THREE from 'three';
// set up
let scene, camera, renderer, cube;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // renderer'er
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    // set size
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // cube
    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    //const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const texture = new THREE.TextureLoader().load('example-textures/crate.gif');
    const material = new THREE.MeshBasicMaterial( {map:texture} );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    // fix camera pos
    camera.position.z = 5;
}

// make stuff happen
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// event listener
window.addEventListener('resize', onWindowResize, false);

// init
init();
animate();