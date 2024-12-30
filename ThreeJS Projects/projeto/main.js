import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
//MUDAR VARIAVEIS E COMENTARIOS

//MUDAR VARIAVEIS E COMENTARIOS
let cena = new THREE.Scene() 

//Reset nas opcoes de animação, no modelo default e nas opções de luz para que não fiquem as mesmas opções quando há refresh da página
function resetarOpcoes() {
  
  document.getElementById('btn_playSupportJoint').disabled = false;
  document.getElementById('btn_playLongArm').disabled = false;
  document.getElementById('btn_playShortArm').disabled = false;
  document.getElementById('btn_playArmToAbajur').disabled = false;
  document.getElementById('btn_playAbajur').disabled = false;

  document.getElementById('btn_changeModel').selectedIndex = 0; 

  resetarLuzes();

   
}
function resetarLuzes(){
  document.getElementById('intensidadeLuz').value = 0;  
  document.getElementById('corLuz').value = "#ffff00"; 
  document.getElementById('menu_loop').selectedIndex = 1; 
}
//Função utilizada quando a página tem refresh
resetarOpcoes();
//Criação da câmara
let camara = new THREE.PerspectiveCamera( 70, 800 / 600, 0.1, 500 ) 
//posição inicial da câmara
camara.position.set( 8, 0, 7)
//posição onde a câmara foca
camara.lookAt( 0, 0, 0 )

let meuCanvas = document.getElementById( 'meuCanvas')
let renderer = new THREE.WebGLRenderer( { canvas: meuCanvas } )
//aplica tamanho da janela
renderer.setSize( 800, 600 )
//aumentar número de pixeis
renderer.setPixelRatio(window.devicePixelRatio * 2)
// luzes podem causar sombras
renderer.shadowMap.enabled = true
//criar controlos de movimento
let controlos = new OrbitControls( camara, renderer.domElement )

//bloqueia o moviento vertical para que só se mova horizontal
controlos.minPolarAngle = Math.PI / 2;
controlos.maxPolarAngle = Math.PI / 2; 

controlos.enableDamping = true; 
controlos.dampingFactor = 0.1;
controlos.enablePan = false;



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
//cria variaveis de luz
let PontoLuz, ProjetorLuz;

let carregador = new GLTFLoader() ;
//cria variavel a identificar modelo
let modeloAtual; 


function carregarModelo(caminhoModelo) {
  // Remove o modelo atual 
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
    misturador = new THREE.AnimationMixer(modeloAtual); 

    const lampada = modeloAtual.getObjectByName('S_LightBulb');
    if (lampada) {
        //Adiciona luz de Ponto com cor, intensidade e alcance
        PontoLuz = new THREE.PointLight('yellow', 0, 1); 
        //posição que a luz está centrada
        PontoLuz.position.set(0, 0.8, 0); 
        lampada.add(PontoLuz);
       
        //adiciona luz de projeção com cor, intensidade, alcance e ângulo de abertura(30 graus)
        ProjetorLuz = new THREE.SpotLight('yellow', 0, 100, Math.PI / 6); 
        //posição da luz
        ProjetorLuz.position.set(0, -0.6, 0); 
        // Direção que a luz aponta
        ProjetorLuz.target.position.set(0, 10, 0);
        lampada.add(ProjetorLuz.target);
        lampada.add(ProjetorLuz);

        console.log('Luzes adicionadas ao objeto "S_LightBulb".');
    } else {
        console.warn('Objeto "S_LightBulb" não encontrado.');
    }

    // Configuração das animações 
    const animacoesArray = {
      SupportJoint: THREE.AnimationClip.findByName(gltf.animations, 'Su'),
      LongArm: THREE.AnimationClip.findByName(gltf.animations, 'L'),
      ShortArm: THREE.AnimationClip.findByName(gltf.animations, 'Sh'),
      ArmToAbajur: THREE.AnimationClip.findByName(gltf.animations, 'Ata'),
      Abajur: THREE.AnimationClip.findByName(gltf.animations, 'A')
    };
    //acoesRegistos garante animaçoes em conjunto ao registá-las
    const acoesRegistos = {};
    Object.keys(animacoesArray).forEach(nome => {
      if (animacoesArray[nome]) {
        acoesRegistos[nome] = misturador.clipAction(animacoesArray[nome]);
      }
    });

    //Opções de animação
    document.getElementById('btn_playSupportJoint').onclick = () => {
      if (acoesRegistos.SupportJoint) {
        acoesRegistos.SupportJoint.reset().play();
      }
    };
    
    document.getElementById('btn_playLongArm').onclick = () => {
      if (acoesRegistos.LongArm) {
        acoesRegistos.LongArm.reset().play();
      }
    };
    
    document.getElementById('btn_playShortArm').onclick = () => {
      if (acoesRegistos.ShortArm) {
        acoesRegistos.ShortArm.reset().play();
      }
    };
    
    document.getElementById('btn_playArmToAbajur').onclick = () => {
      if (acoesRegistos.ArmToAbajur) {
        acoesRegistos.ArmToAbajur.reset().play();
      }
    };
    
    document.getElementById('btn_playAbajur').onclick = () => {
      if (acoesRegistos.Abajur) {
        acoesRegistos.Abajur.reset().play();
      }
    };
    
      // Pausa animação
      //acao é um dos registos unicos de acoesRegistos
    document.getElementById('btn_pause').onclick = () => {
      Object.values(acoesRegistos).forEach(acao => {
        if (acao) {
          acao.paused = !acao.paused;
        }
      });
    };
    //Para animação
    document.getElementById('btn_stop').onclick = () => {
      Object.values(acoesRegistos).forEach(acao => {
        if (acao) {
          acao.stop();
        }
      });
    };
    //Reversa animação
    document.getElementById('btn_reverse').onclick = () => {
      Object.values(acoesRegistos).forEach(acao => {
        if (acao) {
          acao.timeScale *= -1;
        }
      });
    };


    // Selecionar loop da animação
    document.getElementById('menu_loop').onchange = (event) => {
      let selectedLoopMode;
    
      switch (parseInt(event.target.value)) {
        case 1:
          selectedLoopMode = THREE.LoopOnce;
          break;
        case 2:
          selectedLoopMode = THREE.LoopRepeat;
          break;
        case 3:
          selectedLoopMode = THREE.LoopPingPong;
          break;
        default:
          console.warn('Modo de loop selecionado inválido');
          return; 
      }
    
      Object.values(acoesRegistos).forEach(acao => {
        if (acao){
           acao.setLoop(selectedLoopMode);
        }
      });
    };
    
    // Ativa sombras
    modeloAtual.traverse((element) => {
      if (element.isMesh) {
        element.castShadow = true;
        element.receiveShadow = true;
      }
    });
  
console.log('Modelo carregado:', caminhoModelo);

}, undefined, function (error) {
  console.error(error);
});
}

//muda o modelo com abajures diferentes
document.getElementById('btn_changeModel').addEventListener('change', () => {
  const valorModelo = parseInt(event.target.value);
  switch (valorModelo) {
    case 1:
      //carrega modelo com as animações
      //Abajur preto
      carregarModelo('A.glb');
      resetarLuzes();
      break;
    case 2:
      //Abajur castanho
      carregarModelo('Acastanho.glb');
      resetarLuzes();
      break;
    case 3:
      //Abajur dourado
      carregarModelo('Adourado.glb');
      resetarLuzes();
      break;
    default:
      carregarModelo('A.glb');
      resetarLuzes();
  }
});
//carrega modelo inicialmente
carregarModelo('A.glb');

//Ajusta a intensidade da luz
document.getElementById('intensidadeLuz').addEventListener('input', (event) => {
  const intensidade = event.target.value;
  if (PontoLuz) {
    PontoLuz.intensity = intensidade; 
  }
  if (ProjetorLuz) {
    ProjetorLuz.intensity = intensidade;
  }
});

// Ajusta a cor das luzes
document.getElementById('corLuz').addEventListener('input', (event) => {
  const cor = event.target.value;
  if (PontoLuz) {
    PontoLuz.color.set(cor); 
  }
  if (ProjetorLuz) {
    ProjetorLuz.color.set(cor); 
  }
});

// Define a cor do fundo
cena.background = new THREE.Color('lightgray');

// luz ambiente
const luzAmbiente = new THREE.AmbientLight('white', 0.5); 
cena.add(luzAmbiente);

//Outra luz ponto que ilumina em todas as direções
const luzPontoAmbiente = new THREE.PointLight( "white" ) 
luzPontoAmbiente.position.set( 0, 9, 3) 
luzPontoAmbiente.intensity= 50
luzPontoAmbiente.castShadow = true

//resolução das sombras
luzPontoAmbiente.shadow.mapSize.width = 2048;
luzPontoAmbiente.shadow.mapSize.height = 2048;
//limite de distância de renderização de sombras
luzPontoAmbiente.shadow.camera.near = 0.5;
luzPontoAmbiente.shadow.camera.far = 500;
cena.add( luzPontoAmbiente ) 

//cria uma luz direcional
const luzDirecional = new THREE.DirectionalLight( "white" );
luzDirecional.position.set( 0, 8, 0 ); //aponta na direção de (0, 0, 0)
luzDirecional.intensity= 3
cena.add( luzDirecional );

//cria outra spot luz
const luzSpotAmbiente = new THREE.SpotLight("white", 250, 1000, Math.PI /4);
luzSpotAmbiente.position.set(0, 8, 3); 
luzSpotAmbiente.target.position.set(0, -8, 3);
luzSpotAmbiente.castShadow = true;
luzSpotAmbiente.shadow.mapSize.width = 2048;
luzSpotAmbiente.shadow.mapSize.height = 2048;
luzSpotAmbiente.shadow.camera.near = 0.5; 
luzSpotAmbiente.shadow.camera.far = 200; 
cena.add( luzSpotAmbiente.target);
cena.add( luzSpotAmbiente);

console.log(cena);






