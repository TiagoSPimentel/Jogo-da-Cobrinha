(function () {
    let FPS = 10
    const SIZE = 40
    const FRAME = 60
    let framespassados = 0;
  
    let board;
    let snake;
    let peca;
    let gameinterval;
    let pontos = 0;
    let gameStarted = false;
    let pause = false;
    let gameover = false;
  

    const pontuacao = document.getElementById('pc');
    pontuacao.innerHTML = `Pontuação: 00000`

    const fimdejogo = document.getElementById('fimdejogo');

    const gameOver = document.createElement('div');
    gameOver.setAttribute('id', 'gameover');
    gameOver.innerHTML = 'Game Over';
    document.body.appendChild(gameOver);

    //ponto de entrada para iniciar o jogo
    function IniciaJogo(){
        if (board){
            limpaBoard();
        }
        board = new Board(SIZE);
        snake = new Snake([[4, 4], [4, 5], [4, 6]])
        GeraPecas();
    }
    //evento para inciar o jogo
    window.addEventListener("keydown", (e) => {
        if (!gameStarted && e.key === "s") { // Verifica se o jogo ainda não foi iniciado e se a tecla pressionada é "s"
            if (gameover) { // Se o jogo terminou e o jogador pressionou "s", inicia um novo jogo
                reiniciaJogo();
            } else { // Se o jogo não terminou, inicia o jogo normalmente
                gameinterval = setInterval(run, 1000 / FPS)
                gameStarted = true;
            }
        }
    });




    //pausa e reinicia o jogo
    window.addEventListener("keydown", (e) => {
        if (e.key === "p"){ 
            pausajogo();   
        }
    });

    //movimentos
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            //cima
            case "ArrowUp":
                snake.changeDirection(0)
                break;
            //direita
            case "ArrowRight":
                snake.changeDirection(1)
                break;
            //baixo
            case "ArrowDown":
                snake.changeDirection(2)
                break;
            //esquerda
            case "ArrowLeft":
                snake.changeDirection(3)
                break;
            default:
            break;
        }
    })
    
    //Inicializar tabuleiro
    class Board {
        constructor(size) {
        this.element = document.createElement("table")
        this.element.setAttribute("id", "board")
        //this.element.border = "1";
        this.color = "#ccc";
        document.body.appendChild(this.element)
        for (let i = 0; i < size; i++) {
            const row = document.createElement("tr")
            this.element.appendChild(row);
            for (let j = 0; j < size; j++) {
                const field = document.createElement("td");
                row.appendChild(field)
            }
        }
      }
    }
    //classe para fazer a cobra e sua direção
    class Snake {
        constructor(body){
            this.body = body;
            this.color = "#222";
            this.direction = 1; // 0 para cima, 1 para direita, 2 para baixo, 3 para esquerda
            this.body.forEach(field => document.querySelector(`#board tr:nth-child(${field[0]}) td:nth-child(${field[1]})`).style.backgroundColor = this.color)
        }
        walk(){
            const head = this.body[this.body.length - 1];
            let newHead;
            //direção da cobra 
            switch (this.direction) {
                case 0:
                    newHead = [head[0] - 1, head[1]]//cima
                    break;
                case 1:
                    newHead = [head[0], head[1] + 1]//direita
                    break;
                case 2:
                    newHead = [head[0] + 1, head[1]]//baixo
                    break;
                case 3:
                    newHead = [head[0], head[1] - 1]//esquerda
                    break;
                default:
                break;
            }
            //verifica se a cobra colidiu com o tabuleiro
            if(newHead[0] < 1 || newHead[0] > SIZE || newHead[1] < 1 || newHead[1] > SIZE){
                fimdejogo.innerHTML = `Fim de jogo!`;
                gameOver.style.display = 'block';
                clearInterval(gameinterval);
                gameStarted = false;
                gameover = true;
                return;
               
            }
            //vrifica se a cobra colidiu consigo mesma
            for(let i = 0; i < this.body.length-1; i++){
                if(newHead[0] == this.body[i][0] && newHead[1] == this.body[i][1]){
                    fimdejogo.innerHTML = `Fim de jogo!`
                    gameOver.style.display = 'block';
                    clearInterval(gameinterval);
                    gameStarted = false;
                    gameover = true;
                    return;
                }
            }
            //verifica se a cobra pegou a peça
            if (newHead[0] === peca.novapeca[0] && newHead[1] === peca.novapeca[1]) {
                pontos += peca.valor;
                pontuacao.innerHTML = `Pontuação: ${pontos.toString().padStart(5, '0')}` 
                document.querySelector(`#board tr:nth-child(${peca.novapeca[0]}) td:nth-child(${peca.novapeca[1]})`).style.backgroundColor = this.color;
                this.body.push(newHead); // crescer a cobra
                GeraPecas(); // gerar nova peça no tabuleiro
            }
            //tira e adiciona peça na cobra para ela se mover
            else{
                this.body.push(newHead);//adiciona uma nova cabeça
                const oldTail = this.body.shift();//tira o rabo da cobra
                document.querySelector(`#board tr:nth-child(${newHead[0]}) td:nth-child(${newHead[1]})`).style.backgroundColor = this.color;//primeira peça da cobra
                document.querySelector(`#board tr:nth-child(${oldTail[0]}) td:nth-child(${oldTail[1]})`).style.backgroundColor = board.color;//ultima peça da cobra
            }
        }
        
        //direções da cobra
        changeDirection(newDirection) {
            const oppositeDirection = { 
                0: 2, // cima e baixo são opostos
                1: 3, // direita e esquerda são opostos
                2: 0, // baixo e cima são opostos
                3: 1  // esquerda e direita são opostos
            };
            if (newDirection !== oppositeDirection[this.direction]) { //veriifca direções validas
                this.direction = newDirection;
            }
        }
    }


    class Peca{
        constructor(peca, tipo){
            this.novapeca = peca;
            this.tipo = tipo;
            this.color = tipo ? "red" : "#222";//verifica qual é a cor da peça
            this.valor = tipo ? 2: 1;
            document.querySelector(`#board tr:nth-child(${peca[0]}) td:nth-child(${peca[1]})`).style.backgroundColor = this.color;
        }
    }

    //função para gerar novas peças
    function GeraPecas(){
        const x = Math.floor(Math.random() * SIZE) + 1;
        const y = Math.floor(Math.random() * SIZE) + 1;
        const tipo = Math.random() < 0.2;
        peca = new Peca([x,y], tipo)
    }
    //função para verificar se o jogo está pausado
    function pausajogo(){
        pause = !pause;
        if(pause){
            clearInterval(gameinterval);//limpa o intervalo
        }
        else{
            gameinterval = setInterval(run, 1000 / FPS);//atribui um novo intervalo
        }
    }

    function run() {
        if(!pause && gameStarted){
            snake.walk()
            framespassados++;
            //verifica se o num de peças(FRAMES) passadas é maio/igual ao num de peças(FRAMES) permitido
            if(framespassados >= FRAME){ 
                FPS += 0.5;
                clearInterval(gameinterval);
                gameinterval = setInterval(run, 1000 / FPS);
                framespassados= 0;
            }
        }
    }
    //função reinicia jogo limpa tudo que foi usado
    function reiniciaJogo(){
        clearInterval(gameinterval); 
        pontuacao.innerHTML = `Pontuação: 00000`; 
        fimdejogo.innerHTML = '';
        gameOver.style.display = 'none';
        pontos = 0; 
        FPS = 10;
        framespassados = 0; 
        gameover = false; 
        pause = false;
        IniciaJogo(); 
    }

    //função limpa tabuleiro
    function limpaBoard(){ 
        const table = document.getElementById('board');
        if (table){ //vrifica se a tabela ja existe, se sim cria outra(tabuleiro)
            table.parentNode.removeChild(table);
        }
    }
    IniciaJogo();
})()