// followed this tutorial: https://www.youtube.com/watch?v=8jP4xpga6yY&ab_channel=TraversyMedia, so alot of initialization stuff is similar
// + the threejs.org tutorials
// tree is from https://free3d.com/3d-model/low_poly_tree-816203.html

//imports
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/MTLLoader.js';

// set up
let scene, camera, renderer, cube, sphere, cone;
function init() {
    // scene setup
    scene = new THREE.Scene();
    // make canvas reachable
    const canvas = document.querySelector('#c');
    // lights
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(7, 6, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
    // camera
    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    // action
    renderer = new THREE.WebGLRenderer( {
        canvas,
        antialias: true
    } );
    // set size
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // object setup
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    // orbit controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    // STUFF
    // floor
    const planeSize = 40;
    
    const loader = new THREE.TextureLoader();
    const floorTexture = loader.load('example-textures/checker.png');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.magFilter = THREE.NearestFilter;
    floorTexture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    floorTexture.repeat.set(repeats, repeats);
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial( {
        map: floorTexture,
        side: THREE.DoubleSide,
    } );
    const floorMesh = new THREE.Mesh(planeGeo, planeMat);
    floorMesh.rotation.x = Math.PI * -.5;
    scene.add(floorMesh);
    // cube
    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    //const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const cubeTexture = new THREE.TextureLoader().load('example-textures/crate.gif');
    const material = new THREE.MeshBasicMaterial( {map:cubeTexture} );
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 2, 0);
    scene.add( cube );
    // sphere
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: 0x1E1BAA});
    sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add( sphere );
    // pyramid
    const coneRadius = 5;
    const coneHeight = 7;
    const coneRadialSegments = 3;
    const coneGeometry = new THREE.ConeGeometry(coneRadius, coneHeight, coneRadialSegments)
    const coneMaterial = new THREE.MeshBasicMaterial( {color: 0x1BB6E5} );
    cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.set(5, 6, -8);
    scene.add( cone );
    // uhh object time
    // materials first
    mtlLoader.load( 'example-textures/low_poly_tree/Lowpoly_tree_sample.mtl', ( mtl ) => {
        mtl.preload();
		const objLoader = new OBJLoader();
		objLoader.setMaterials( mtl );
		objLoader.load('example-textures/low_poly_tree/Lowpoly_tree_sample.obj', ( tree ) => {
            tree.position.set(-15, 0, -15);
		    scene.add( tree );
		} );
    } );
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