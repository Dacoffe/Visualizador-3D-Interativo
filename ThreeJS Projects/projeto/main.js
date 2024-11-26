import { OrbitControls } from 'three/addons/controls/OrbitControls.js' 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'; 

let canvas = document.getElementById('myCanvas')

let cena = new THREE.Scene()
let objetos = [] // inicializa vetor vazio
let mesa = [] // inicializa vetor vazio
let misturador = new THREE.AnimationMixer(cena)
let misturadorOcupado = false
let isPlayingChairAnim = false
let acao = null
let acaoC1 = null;
let acaoC2 = null;

let material1 = null;
let materialPorta1 = null;
let materialPorta2 = null;
let material2 = new THREE.Color(0x26261c);
let material3 = new THREE.Color(0x30c0b6);

let carregador = new GLTFLoader()
let gltf = null;
carregador.load(
    'model/ApliqueArticuladoPecaUnica.gltf', 
    function ( gltf1 ) {
        gltf = gltf1
        cena.add( gltf.scene )

        cena.traverse( function (elemento) {
            if(elemento.isMesh){
                if(elemento.name.includes('animated')){
                    objetos.push(elemento)
                }
                objetos.push(elemento)
                if(elemento.name.includes('mesa')){
                    mesa.push(elemento)
                    if(elemento.name.includes('porta')){
                        if(elemento.name.includes('_1')){
                            materialPorta1 = elemento.material.clone()
                        }else if(elemento.name.includes('_2')){
                            materialPorta2 = elemento.material.clone()
                        }
                        elemento.material = elemento.material.clone()
                    }else{
                        material1 = elemento.material.clone()
                    }
                    elemento.material = elemento.material.clone()
                }
            }
        });
    }
)

function playAnimacao(name){
    misturadorOcupado = true
    let clipe = THREE.AnimationClip.findByName( gltf.animations, name ) 
    acao = misturador.clipAction( clipe ) 
    acao.setLoop(THREE.LoopOnce)
    acao.clampWhenFinished = true
    acao.paused = false
    acao.play()
}

function playAnimacaoCadeira(){
    misturadorOcupado = true
    isPlayingChairAnim = true
    let clipe = THREE.AnimationClip.findByName( gltf.animations, "dragChair1" ) 
    acaoC1 = misturador.clipAction( clipe ) 
    acaoC1.setLoop(THREE.LoopOnce)
    acaoC1.clampWhenFinished = true
    acaoC1.paused = false
    clipe = THREE.AnimationClip.findByName( gltf.animations, "dragChair2" ) 
    acaoC2 = misturador.clipAction( clipe ) 
    acaoC2.setLoop(THREE.LoopOnce)
    acaoC2.clampWhenFinished = true
    acaoC2.paused = false
    acaoC1.play()
    acaoC2.play()
}

misturador.addEventListener('finished', ()=>{
    if(isPlayingChairAnim){
        acaoC1.paused = true
        acaoC2.paused = true
        acaoC1.timeScale = -(acaoC1.timeScale)
        acaoC2.timeScale = -(acaoC2.timeScale)
        misturadorOcupado = false
        isPlayingChairAnim = false
    }else{
        acao.paused = true
        acao.timeScale = -(acao.timeScale)
        misturadorOcupado = false
    }
})

/* camara.. */
let camara = new THREE.PerspectiveCamera(70, 800 / 600, 0.01, 500);
camara.position.set(-1,2,2)

/* renderer... */
let renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.enabled = true; // ativa as sombras
renderer.setSize(800, 600);
renderer.setClearColor(0xffefc4)

new OrbitControls( camara, renderer.domElement ) // sem o THREE.

let relogio = new THREE.Clock();
function animar() {
    requestAnimationFrame(animar)
    renderer.render(cena, camara)
    misturador.update( relogio.getDelta() )
}
animar()

function luzes(cena) {
    const luzAmbiente = new THREE.AmbientLight("lightgreen");
    cena.add(luzAmbiente);

    // point light 
    const luzPonto = new THREE.PointLight("white");
    luzPonto.position.set(-1, 3, 1);
    luzPonto.intensity = 10;
    cena.add(luzPonto);

    // directional light
    const luz1 = new THREE.DirectionalLight("white");
    luz1.position.set(2, 2, 1);
    luz1.intensity = 5;
    cena.add(luz1);
    luz1.castShadow = true;

    // directional light
    const luz2 = new THREE.DirectionalLight("white");
    luz2.position.set(-1, 2, -3);
    luz2.intensity = 5;
    cena.add(luz2);
    luz2.castShadow = true;

    // point light 
    const luzPonto2 = new THREE.PointLight("white");
    luzPonto2.position.set(-1, -3, 1);
    luzPonto2.intensity = 10;
    cena.add(luzPonto2);
}
luzes(cena)

function onWindowResize() {
    camara.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camara.updateProjectionMatrix();

    canvas.style.width = "100%";
    canvas.style.height = "100%";

    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}
window.addEventListener("resize", onWindowResize);

let raycaster = new THREE.Raycaster()
let rato = new THREE.Vector2()
function renderRaycaster(evento) {
    const canvasRect = canvas.getBoundingClientRect();
    rato.x = ((evento.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    rato.y = -((evento.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

    if(!misturadorOcupado){
        pegarPrimeiro();
    }
}
canvas.addEventListener('click', renderRaycaster);

function pegarPrimeiro() {
    raycaster.setFromCamera(rato, camara)
    let intersetados = raycaster.intersectObjects(objetos)
    if (intersetados.length > 0) {
        let obj = intersetados[0].object
        if(obj.name.includes('portaL')){
            playAnimacao('openLeftDoor')
        }
        if(obj.name.includes('portaR')){
            playAnimacao('openRightDoor')
        }
        if(obj.name.includes('gavetaR')){
            playAnimacao('openRightDrawer')
        }
        if(obj.name.includes('gavetaL')){
            playAnimacao('openLeftDrawer')
        }
        if(obj.name.includes('chair')){
            playAnimacaoCadeira()
        }
    }
} 

function setTableMaterial(num){
    switch (num) {
        case 1:
            mesa.forEach(elem => {
                if(elem.name.includes('porta')){
                    if(elem.name.includes('_1')){
                        elem.material = materialPorta1.clone()
                    }else if(elem.name.includes('_2')){
                        elem.material = materialPorta2.clone()
                    }else{
                        elem.material = material1.clone()
                    }
                }else{
                    elem.material = material1.clone()
                } 
            });
            break;
        case 2:
            mesa.forEach(elem => {
                elem.material.color = material2.clone()
            });
            break;
        case 3:
            mesa.forEach(elem => {
                elem.material.color = material3.clone()
            });
            break;
    
        default:
            break;
    }
}

document.getElementById('mat1').addEventListener('click', function () {
    setTableMaterial(1)
})
document.getElementById('mat2').addEventListener('click', function () {
    setTableMaterial(2)
})
document.getElementById('mat3').addEventListener('click', function () {
    setTableMaterial(3)
})