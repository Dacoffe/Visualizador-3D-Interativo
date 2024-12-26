import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'



import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let cena = new THREE.Scene() 

//METER HORIZONTAL 180 GRAUS
function resetarControles() {
  // Resetando os valores dos botões de animação
  document.getElementById('btn_playSupportJoint').disabled = false;
  document.getElementById('btn_playLongArm').disabled = false;
  document.getElementById('btn_playShortArm').disabled = false;
  document.getElementById('btn_playArmToAbajur').disabled = false;
  document.getElementById('btn_playAbajur').disabled = false;

  // Resetando o menu suspenso para o valor padrão
  document.getElementById('btn_changeModel').selectedIndex = 0; // Reseta para o valor padrão (opção 2)

  // Resetando os controles deslizantes (se houver)
  document.getElementById('intensidadeLuz').value = 0;  // Intensity slider reset to default
  document.getElementById('corLuz').value = "#ffff00";  // Color picker reset to default

  // Resetando o menu de loop para a opção padrão (Repetir)
  document.getElementById('menu_loop').selectedIndex = 1;  // Reseta para a opção "Repetir"
}

// Chame essa função sempre que a página for carregada ou após o refresh
resetarControles();
let camara = new THREE.PerspectiveCamera( 70, 800 / 600, 0.1, 500 ) 
camara.position.set( 8, 0, 7)

camara.lookAt( 0, 0, 0 )

let meuCanvas = document.getElementById( 'meuCanvas')
let renderer = new THREE.WebGLRenderer( { canvas: meuCanvas } )
renderer.setSize( 800, 600 )
renderer.setPixelRatio(window.devicePixelRatio * 2)
renderer.shadowMap.enabled = true

let controlos = new OrbitControls( camara, renderer.domElement )


controlos.minPolarAngle = Math.PI / 2; // Ângulo mínimo (horizontal)
controlos.maxPolarAngle = Math.PI / 2; // Ângulo máximo (horizontal)

controlos.enableDamping = true; // Efeito suave
controlos.dampingFactor = 0.1;
controlos.enablePan = false;

renderer.render( cena, camara )

//let grelha = new THREE.GridHelper() 

//cena.add( grelha )

let delta = 0; // tempo desde a última atualização
let relogio = new THREE.Clock()
let latencia_minima = 1 / 60; // tempo mínimo entre cada atualização

let misturador = new THREE.AnimationMixer(cena)

function animar() 
{ 
  requestAnimationFrame( animar ) 

  delta += relogio.getDelta() 
  
  if (delta < latencia_minima) 
    return; 
  
  misturador.update(Math.floor(delta / latencia_minima)* latencia_minima)
    
  renderer.render( cena, camara ) 

  

  delta = delta % latencia_minima
}

animar()

let bulbLight, spotLight;

let carregador = new GLTFLoader() ;
let modeloAtual; // Variável para armazenar o modelo atual

function carregarModelo(caminhoModelo) {
  // Remove o modelo atual da cena, se existir
  if (modeloAtual) {
    cena.remove(modeloAtual);

    misturador.stopAllAction();
  }

carregador.load( 
  
  caminhoModelo,
  function ( gltf ) 
  { 
    modeloAtual = gltf.scene;


        
    cena.add(modeloAtual);


    // Remover animações anteriores
    misturador = new THREE.AnimationMixer(modeloAtual); 

    const lightBulb = modeloAtual.getObjectByName('S_LightBulb');
    if (lightBulb) {
        bulbLight = new THREE.PointLight('yellow', 0, 1); // Luz amarela, intensidade 10, alcance 10
        bulbLight.position.set(0, 0.8, 0); // Altere a posição, se necessário
        lightBulb.add(bulbLight);

       

       spotLight = new THREE.SpotLight('yellow', 0, 100, Math.PI / 6); // Cor branca, intensidade 5, alcance 20, ângulo de 30° (PI/6)
    
    // Posicionando a luz no centro do objeto
    spotLight.position.set(0, -0.6, 0); // Posição no centro local do lightBulb

    // Direcionando a luz na direção do eixo Y positivo
    spotLight.target.position.set(0, 10, 0); // Alvo em direção ao eixo Y positivo (ajuste conforme necessário)
    
    // Adicionando o alvo da luz como filho do lightBulb
    lightBulb.add(spotLight.target);

    // Adicionando a luz ao objeto lightBulb
    lightBulb.add(spotLight);

    

    console.log('SpotLight adicionada ao objeto "S_LightBulb".');

        
    } else {
        console.warn('Objeto "S_LightBulb" não encontrado no modelo.');
    }

    // Configuração das animações do novo modelo
    const animacoes = {
      SupportJoint: THREE.AnimationClip.findByName(gltf.animations, 'Su'),
      LongArm: THREE.AnimationClip.findByName(gltf.animations, 'L'),
      ShortArm: THREE.AnimationClip.findByName(gltf.animations, 'Sh'),
      ArmToAbajur: THREE.AnimationClip.findByName(gltf.animations, 'Ata'),
      Abajur: THREE.AnimationClip.findByName(gltf.animations, 'A')
    };

    const acoes = {};
    Object.keys(animacoes).forEach(nome => {
      if (animacoes[nome]) {
        acoes[nome] = misturador.clipAction(animacoes[nome]);
      }
    });

    // Atualizar os botões para o novo modelo
    document.getElementById('btn_playSupportJoint').onclick = () => acoes.SupportJoint?.reset().play();
    document.getElementById('btn_playLongArm').onclick = () => acoes.LongArm?.reset().play();
    document.getElementById('btn_playShortArm').onclick = () => acoes.ShortArm?.reset().play();
    document.getElementById('btn_playArmToAbajur').onclick = () => acoes.ArmToAbajur?.reset().play();
    document.getElementById('btn_playAbajur').onclick = () => acoes.Abajur?.reset().play();

    // Pausar, parar e inverter animações para o novo modelo
    document.getElementById('btn_pause').onclick = () => {
      Object.values(acoes).forEach(acao => {
        if (acao) acao.paused = !acao.paused;
      });
    };

    document.getElementById('btn_stop').onclick = () => {
      Object.values(acoes).forEach(acao => {
        if (acao) acao.stop();
      });
    };

    document.getElementById('btn_reverse').onclick = () => {
      Object.values(acoes).forEach(acao => {
        if (acao) acao.timeScale *= -1;
      });
    };

    // Configuração do loop
    document.getElementById('menu_loop').onchange = (event) => {
      const valor = parseInt(event.target.value);
      const loopModes = [THREE.LoopOnce, THREE.LoopRepeat, THREE.LoopPingPong];
      const selectedLoopMode = loopModes[valor - 1];
      Object.values(acoes).forEach(acao => {
        if (acao) acao.setLoop(selectedLoopMode);
      });
    };

    // Ativar sombras para o novo modelo
    modeloAtual.traverse((element) => {
      if (element.isMesh) {
        element.castShadow = true;
        element.receiveShadow = true;
      }
    });
  
 // Certifique-se de fechar adequadamente
console.log('Modelo carregado:', caminhoModelo);

}, undefined, function (error) {
  console.error(error);
});

}

document.getElementById('btn_changeModel').addEventListener('change', () => {
  const valor = parseInt(event.target.value);
  switch (valor) {
    case 1:
      carregarModelo('A.glb');
      document.getElementById('corLuz').value = "#ffff00";
      document.getElementById('intensidadeLuz').value = 0;
      
      break;
    case 2:
      
      carregarModelo('Acastanho.glb');
      document.getElementById('corLuz').value = "#ffff00";
      document.getElementById('intensidadeLuz').value = 0;
      break;
    case 3:
      carregarModelo('Adourado.glb');
      document.getElementById('corLuz').value = "#ffff00";
      document.getElementById('intensidadeLuz').value = 0;
      
      break;
    default:
      carregarModelo('A.glb');
      document.getElementById('corLuz').value = "#ffff00";
      document.getElementById('intensidadeLuz').value = 0;
  }
});




carregarModelo('A.glb');


// Atualizar a intensidade da luz
document.getElementById('intensidadeLuz').addEventListener('input', (event) => {
  const intensidade = event.target.value;
  if (bulbLight) {
    bulbLight.intensity = intensidade / 10; // Ajusta a intensidade da luz (ajustando o valor)
  }
  if (spotLight) {
    spotLight.intensity = intensidade / 10; // Ajusta a intensidade da luz spot
  }
});

// Atualizar a cor da luz
document.getElementById('corLuz').addEventListener('input', (event) => {
  const cor = event.target.value;
  if (bulbLight) {
    bulbLight.color.set(cor); // Atualiza a cor da luz de ponto
  }
  if (spotLight) {
    spotLight.color.set(cor); // Atualiza a cor da luz spot
  }
});

// Define o fundo da cena como branco
cena.background = new THREE.Color('blue');

// Adiciona uma luz ambiente para iluminar uniformemente
const luzAmbiente = new THREE.AmbientLight('white', 0.1); // Intensidade de 0.5
cena.add(luzAmbiente);



// Ajusta a luz pontual
 // Reduz a intensidade da luz pontual

const luzPonto = new THREE.PointLight( "white" ) 
luzPonto.position.set( 10, 10, 0) 
luzPonto.intensity= 1
luzPonto.castShadow = true

luzPonto.shadow.mapSize.width = 2048;
luzPonto.shadow.mapSize.height = 2048;

luzPonto.shadow.camera.near = 0.5;
luzPonto.shadow.camera.far = 500;


cena.add( luzPonto ) 


const luzDirecional = new THREE.DirectionalLight( "white" );
luzDirecional.position.set( 3, 2, 0 ); //aponta na direção de (0, 0, 0)
luzDirecional.intensity= 1
cena.add( luzDirecional );



//Function to change texture




console.log(cena);






