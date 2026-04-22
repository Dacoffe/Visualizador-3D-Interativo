# Candeeiro Articulado - ThreeJS Project

Este projeto é uma aplicação web interativa desenvolvida com Three.js que apresenta um candeeiro articulado em 3D. Permite visualizar o modelo, controlar animações das partes móveis, ajustar a iluminação e trocar entre diferentes texturas/materials.

## Sobre o Projeto

Este projeto foi desenvolvido no âmbito da cadeira **Sistemas Gráficos e Interação** do **IPL ESTG Leiria**, em parceria com a **La Redoute**. Representa a implementação prática de conceitos de computação gráfica 3D, interação homem-máquina e desenvolvimento web interativo.

## Funcionalidades

### Visualização 3D
- Modelo 3D do candeeiro articulado carregado em formato GLTF
- Controles orbitais para navegar em torno do objeto
- Renderização com sombras ativadas

### Animações
- **SupportJoint**: Animação da junta de suporte
- **LongArm**: Animação do braço longo
- **ShortArm**: Animação do braço curto
- **ArmToAbajur**: Animação do braço para o abajur
- **Abajur**: Animação do abajur

Controles de animação:
- Play: Inicia a animação selecionada
- Pause: Pausa/retoma todas as animações
- Stop: Para todas as animações
- Reverse: Inverte a direção das animações
- Loop Mode: Escolhe entre Once, Repeat ou Ping Pong

### Controles de Iluminação
- **Intensidade**: Slider para ajustar a intensidade da luz (0-200)
- **Cor**: Seletor de cor para alterar a cor da luz

### Modelos Disponíveis
- Modelo padrão (A.glb)
- Modelo castanho (Acastanho.glb)
- Modelo dourado (Adourado.glb)

## Tecnologias Utilizadas

- **Three.js**: Biblioteca principal para gráficos 3D
- **GLTFLoader**: Para carregamento de modelos 3D
- **OrbitControls**: Para controles de câmera
- **HTML5 Canvas**: Para renderização
- **CSS**: Para estilização da interface

## Estrutura do Projeto

```
projeto/
├── candeeiro.html      # Página principal
├── main.js            # Lógica Three.js
├── main.css           # Estilos da interface
├── menu.html          # Menu adicional (scraped)
├── A.glb              # Modelo 3D padrão
├── Acastanho.glb      # Modelo castanho
├── Adourado.glb       # Modelo dourado
└── candeeiro articulado _ La Redoute_ficheiros/  # Assets externos
```

## Como Executar

1. Clone ou baixe o repositório
2. Abra o arquivo `projeto/candeeiro.html` com a extensão **Live Server** no VS Code
   - Clique com o botão direito no arquivo `candeeiro.html`
   - Selecione "Open with Live Server"
   
   Ou alternativamente, execute um servidor HTTP local:
   ```bash
   cd projeto
   python3 -m http.server 8000
   ```
3. O projeto será aberto automaticamente no navegador

## Controles da Interface

- **Botões de Animação**: Clique para reproduzir animações específicas
- **Controles de Luz**: Ajuste intensidade e cor da iluminação
- **Seleção de Modelo**: Escolha entre diferentes materiais
- **Modo de Loop**: Configure como as animações se repetem
- **Mouse**: Arraste para orbitar em torno do candeeiro

## Desenvolvimento

O projeto foi desenvolvido como parte de um trabalho académico, implementando conceitos de:
- Computação gráfica 3D
- Interação homem-máquina
- Animações em tempo real
- Carregamento de modelos 3D

## Estado do Projeto

✅ Implementado:
- Visualização 3D do candeeiro
- Sistema de animações
- Controles de iluminação
- Troca de modelos
- Interface responsiva

🔄 Pendente:
- Avaliação SUS (System Usability Scale)

## Licença

Este projeto foi desenvolvido para fins educacionais.
