// followed this tutorial: https://www.youtube.com/watch?v=8jP4xpga6yY&ab_channel=TraversyMedia, so alot of initialization stuff is similar
// + the threejs.org tutorials
// tree is from https://free3d.com/3d-model/low_poly_tree-816203.html
// pig is from https://free3d.com/3d-model/pig-v2--998676.html

//imports
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/MTLLoader.js';

// set up
let scene, camera, renderer, cube, c2cube, pig;
function init() {
    // scene setup
    scene = new THREE.Scene();
    // make canvas reachable
    const canvas = document.querySelector('#c');
    // lights
    // directional light
    const dcolor = 0xFFFFFF;
    const dintensity = 0.2;
    const dlight = new THREE.DirectionalLight(dcolor, dintensity);
    dlight.position.set(0, 25, 0);
    dlight.target.position.set(-5, 0, 0);
    
    const dhelper = new THREE.DirectionalLightHelper(dlight);
    scene.add(dhelper);
    scene.add(dlight.target);
    scene.add(dlight);
    
    // ambient light
    const acolor = 0xFFFFFF;
    const aintensity = 0.1;
    const alight = new THREE.AmbientLight(acolor, aintensity);
    scene.add(alight);

    // spot light
    const scolor = 0xFFFFFF;
    const sintensity = 0.2;
    const slight = new THREE.SpotLight(scolor, sintensity);
    slight.position.set( 0, 5, 0 );
    scene.add(slight);

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
    // control keys
    controls.keys = {
        LEFT: 'KeyA',
        UP: 'KeyW',
        RIGHT: 'KeyD',
        BOTTOM: 'KeyS'
    };

    controls.listenToKeyEvents(window);
    
    controls.update();


    // STUFF
    //Skybox 
    const skyloader = new THREE.TextureLoader();
    const skytexture = skyloader.load("example-textures/water.jpg", () => {
        const rt = new THREE.WebGLCubeRenderTarget(skytexture.image.height);
        rt.fromEquirectangularTexture(renderer, skytexture);
        scene.background = rt.texture;
    });

    // floor
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const floorTexture = loader.load('example-textures/grass.jpg');
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
    // cube1
    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    //const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const cubeTexture = new THREE.TextureLoader().load('example-textures/weird.webp');
    const material = new THREE.MeshPhongMaterial( {map:cubeTexture} );
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 2, 0);
    scene.add( cube );
    // cube2
    const c2geometry = new THREE.BoxGeometry( 2, 2, 2 );
    //const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const c2cubeTexture = new THREE.TextureLoader().load('example-textures/weird.webp');
    const c2material = new THREE.MeshPhongMaterial( {map:c2cubeTexture} );
    c2cube = new THREE.Mesh( c2geometry, c2material );
    c2cube.position.set(0, 2, 0);
    scene.add( c2cube );
    
    // UFO
    // ufo body
    const ufoBodyg = new THREE.SphereGeometry(10, 32, 32);
    const ufoBodym = new THREE.MeshPhongMaterial({color: 0xB5B5B5});
    const ufoBody = new THREE.Mesh(ufoBodyg, ufoBodym);
    ufoBody.position.set(0, 21, 0);
    ufoBody.scale.set(1, 0.2, 1);
    scene.add(ufoBody);
    // ufo top
    const ufoTopg = new THREE.SphereGeometry(5, 32, 32);
    const ufoTopm = new THREE.MeshPhongMaterial({color: 0x22E614});
    const ufoTop = new THREE.Mesh(ufoTopg, ufoTopm);
    ufoTop.position.set(0, 22, 0);
    ufoTop.scale.set(1, 0.7, 1);
    scene.add(ufoTop);
    // ufo bottom
    const ufoBottomg = new THREE.SphereGeometry(5, 32, 32);
    const ufoBottomm = new THREE.MeshPhongMaterial({color: 0x1199E8});
    const ufoBottom = new THREE.Mesh(ufoBottomg, ufoBottomm);
    ufoBottom.position.set(0, 21, 0);
    ufoBottom.scale.set(1, 0.7, 1);
    scene.add(ufoBottom);

    // trees

    // TREE 1
    // tt1
    const tt1g = new THREE.CylinderGeometry( 2, 2, 10, 16 ); 
    const tt1m = new THREE.MeshPhongMaterial( {color: 0x4D3529} ); 
    const tt1 = new THREE.Mesh( tt1g, tt1m );
    tt1.position.set(-10, 5, 0);
    scene.add(tt1);
    // tl1
    const tl1r = 5;
    const tl1h = 14;
    const tl1rs = 16;
    const tl1g = new THREE.ConeGeometry(tl1r, tl1h, tl1rs);
    const tl1m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl1 = new THREE.Mesh(tl1g, tl1m);
    tl1.position.set(tt1.position.x, tt1.position.y + 6, tt1.position.z);
    scene.add( tl1 );
    // TREE 2
    // tt2
    const tt2g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt2m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt2 = new THREE.Mesh( tt2g, tt2m );
    tt2.position.set(10, 5, -10);
    scene.add(tt2);
    // tl2
    const tl2r = 5;
    const tl2h = 14;
    const tl2rs = 16;
    const tl2g = new THREE.ConeGeometry(tl2r, tl2h, tl2rs);
    const tl2m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl2 = new THREE.Mesh(tl2g, tl2m);
    tl2.position.set(tt2.position.x, tt2.position.y + 6, tt2.position.z);
    scene.add( tl2 );
    // TREE 3
    // tt3
    const tt3g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt3m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt3 = new THREE.Mesh( tt3g, tt3m );
    tt3.position.set(-10, 5, 10);
    scene.add(tt3);
    // tl3
    const tl3r = 5;
    const tl3h = 14;
    const tl3rs = 16;
    const tl3g = new THREE.ConeGeometry(tl3r, tl3h, tl3rs);
    const tl3m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl3 = new THREE.Mesh(tl3g, tl3m);
    tl3.position.set(tt3.position.x, tt3.position.y + 6, tt3.position.z);
    scene.add( tl3 );
    // TREE 4
    // tt4
    const tt4g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt4m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt4 = new THREE.Mesh( tt4g, tt4m );
    tt4.position.set(13, 5, 13);
    scene.add(tt4);
    // tl4
    const tl4r = 5.5;
    const tl4h = 14;
    const tl4rs = 16;
    const tl4g = new THREE.ConeGeometry(tl4r, tl4h, tl4rs);
    const tl4m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl4 = new THREE.Mesh(tl4g, tl4m);
    tl4.position.set(tt4.position.x, tt4.position.y + 6, tt4.position.z);
    scene.add( tl4 );
    // TREE 5
    // tt5
    const tt5g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt5m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt5 = new THREE.Mesh( tt5g, tt5m );
    tt5.position.set(-1, 5, -12);
    scene.add(tt5);
    // tl5
    const tl5r = 5;
    const tl5h = 14;
    const tl5rs = 16;
    const tl5g = new THREE.ConeGeometry(tl5r, tl5h, tl5rs);
    const tl5m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl5 = new THREE.Mesh(tl5g, tl5m);
    tl5.position.set(tt5.position.x, tt5.position.y + 6, tt5.position.z);
    scene.add( tl5 );
    // TREE 6
    // tt6
    const tt6g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt6m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt6 = new THREE.Mesh( tt6g, tt6m );
    tt6.position.set(-13, 5, -10);
    scene.add(tt6);
    // tl6
    const tl6r = 5;
    const tl6h = 14;
    const tl6rs = 16;
    const tl6g = new THREE.ConeGeometry(tl6r, tl6h, tl6rs);
    const tl6m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl6 = new THREE.Mesh(tl6g, tl6m);
    tl6.position.set(tt6.position.x, tt6.position.y + 6, tt6.position.z);
    scene.add( tl6 );
    // TREE 7
    // tt7
    const tt7g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt7m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt7 = new THREE.Mesh( tt7g, tt7m );
    tt7.position.set(15, 5, -5);
    scene.add(tt7);
    // tl7
    const tl7r = 5.5;
    const tl7h = 14;
    const tl7rs = 16;
    const tl7g = new THREE.ConeGeometry(tl7r, tl7h, tl7rs);
    const tl7m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl7 = new THREE.Mesh(tl7g, tl7m);
    tl7.position.set(tt7.position.x, tt7.position.y + 6, tt7.position.z);
    scene.add( tl7 );
    // TREE 8
    // tt8
    const tt8g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt8m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt8 = new THREE.Mesh( tt8g, tt8m );
    tt8.position.set(5, 5, 15);
    scene.add(tt8);
    // tl8
    const tl8r = 5;
    const tl8h = 14;
    const tl8rs = 16;
    const tl8g = new THREE.ConeGeometry(tl8r, tl8h, tl8rs);
    const tl8m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl8 = new THREE.Mesh(tl8g, tl8m);
    tl8.position.set(tt8.position.x, tt8.position.y + 6, tt8.position.z);
    scene.add( tl8 );
    // TREE 9
    // tt9
    const tt9g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt9m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt9 = new THREE.Mesh( tt9g, tt9m );
    tt9.position.set(-5, 5, 16);
    scene.add(tt9);
    // tl9
    const tl9r = 5;
    const tl9h = 14;
    const tl9rs = 16;
    const tl9g = new THREE.ConeGeometry(tl9r, tl9h, tl9rs);
    const tl9m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl9 = new THREE.Mesh(tl9g, tl9m);
    tl9.position.set(tt9.position.x, tt9.position.y + 6, tt9.position.z);
    scene.add( tl9 );
    // TREE 10
    // tt10
    const tt10g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt10m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt10 = new THREE.Mesh( tt10g, tt10m );
    tt10.position.set(-15, 5, 16);
    scene.add(tt10);
    // tl10
    const tl10r = 5;
    const tl10h = 14;
    const tl10rs = 16;
    const tl10g = new THREE.ConeGeometry(tl10r, tl10h, tl10rs);
    const tl10m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl10 = new THREE.Mesh(tl10g, tl10m);
    tl10.position.set(tt10.position.x, tt10.position.y + 6, tt10.position.z);
    scene.add( tl10 );
    // TREE 11
    // tt11
    const tt11g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt11m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt11 = new THREE.Mesh( tt11g, tt11m );
    tt11.position.set(-15, 5, -3);
    scene.add(tt11);
    // tl11
    const tl11r = 5;
    const tl11h = 14;
    const tl11rs = 16;
    const tl11g = new THREE.ConeGeometry(tl11r, tl11h, tl11rs);
    const tl11m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl11 = new THREE.Mesh(tl11g, tl11m);
    tl11.position.set(tt11.position.x, tt11.position.y + 6, tt11.position.z);
    scene.add( tl11 );
    // TREE 12
    // tt12
    const tt12g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt12m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt12 = new THREE.Mesh( tt12g, tt12m );
    tt12.position.set(15, 6, 4);
    scene.add(tt12);
    // tl12
    const tl12r = 5;
    const tl12h = 14;
    const tl12rs = 16;
    const tl12g = new THREE.ConeGeometry(tl12r, tl12h, tl12rs);
    const tl12m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl12 = new THREE.Mesh(tl12g, tl12m);
    tl12.position.set(tt12.position.x, tt12.position.y + 9, tt12.position.z);
    scene.add( tl12 );
    // TREE 13
    // tt13
    const tt13g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt13m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt13 = new THREE.Mesh( tt13g, tt13m );
    tt13.position.set(15, 5, -15);
    scene.add(tt13);
    // tl13
    const tl13r = 5;
    const tl13h = 14;
    const tl13rs = 16;
    const tl13g = new THREE.ConeGeometry(tl13r, tl13h, tl13rs);
    const tl13m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl13 = new THREE.Mesh(tl13g, tl13m);
    tl13.position.set(tt13.position.x, tt13.position.y + 6, tt13.position.z);
    scene.add( tl13 );
    // TREE 14
    // tt14
    const tt14g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt14m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt14 = new THREE.Mesh( tt14g, tt14m );
    tt14.position.set(-6, 5, -14);
    scene.add(tt14);
    // tl14
    const tl14r = 5;
    const tl14h = 14;
    const tl14rs = 16;
    const tl14g = new THREE.ConeGeometry(tl14r, tl14h, tl14rs);
    const tl14m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl14 = new THREE.Mesh(tl14g, tl14m);
    tl14.position.set(tt14.position.x, tt14.position.y + 6, tt14.position.z);
    scene.add( tl14 );
    // TREE 15
    // tt15
    const tt15g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt15m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt15 = new THREE.Mesh( tt15g, tt15m );
    tt15.position.set(5.5, 5, -14);
    scene.add(tt15);
    // tl15
    const tl15r = 5;
    const tl15h = 14;
    const tl15rs = 16;
    const tl15g = new THREE.ConeGeometry(tl15r, tl15h, tl15rs);
    const tl15m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl15 = new THREE.Mesh(tl15g, tl15m);
    tl15.position.set(tt15.position.x, tt15.position.y + 6, tt15.position.z);
    scene.add( tl15 );
    // TREE 16
    // tt16
    const tt16g = new THREE.CylinderGeometry( 2, 2, 10, 16 );
    const tt16m = new THREE.MeshPhongMaterial( {color: 0x4D3529} );
    const tt16 = new THREE.Mesh( tt16g, tt16m );
    tt16.position.set(9, 6, 1);
    scene.add(tt16);
    // tl16
    const tl16r = 5;
    const tl16h = 15;
    const tl16rs = 16;
    const tl16g = new THREE.ConeGeometry(tl16r, tl16h, tl16rs);
    const tl16m = new THREE.MeshPhongMaterial({color: 0x197F1C});
    const tl16 = new THREE.Mesh(tl16g, tl16m);
    tl16.position.set(tt16.position.x, tt16.position.y + 8, tt16.position.z);
    scene.add( tl16 );
    // hill
    const hillg = new THREE.SphereGeometry(8, 32, 32);
    const hillm = new THREE.TextureLoader().load('example-textures/grass.jpg');
    const hillmaterial = new THREE.MeshPhongMaterial( {map:hillm} );
    const hill = new THREE.Mesh(hillg, hillmaterial);
    hill.position.set(12, -4, 4);
    scene.add(hill);


    // uhh object time
    // materials first
    mtlLoader.load( 'example-textures/pig/Blank.mtl', ( mtl ) => {
        mtl.preload();
		const objLoader = new OBJLoader();
		objLoader.setMaterials( mtl );
		objLoader.load('example-textures/pig/16433_Pig.obj', ( pig ) => {
            pig.scale.set(2,2,2);
            pig.position.set(10.5, 0, -10);
            pig.rotation.x = 4.75;
            pig.rotation.z = 7
		    scene.add( pig );
		} );
    } );
}

// make stuff happen
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.06;
    cube.rotation.y += 0.04;
    c2cube.rotation.x -= 0.04;
    c2cube.rotation.y -= 0.06;
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