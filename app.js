// Clase para el juego del Caballo
class Caballo {
    constructor() {
        this.ANCHO = 400;
        this.ALTO = 400;
        this.TAMANO_CASILLA = this.ANCHO / 8;
        this.caballoPos = { fila: 7, columna: 4 }; // H5 inicial
    }

    setup(p) {
        let canvas = p.createCanvas(this.ANCHO, this.ALTO);
        canvas.parent('Juegocaballo');
    }

    draw(p) {
        this.dibujarTablero(p);
        this.mostrarMovimientos(p, this.caballoPos.fila, this.caballoPos.columna);
        this.dibujarCaballo(p, this.caballoPos.fila, this.caballoPos.columna);
    }

    dibujarTablero(p) {
        for (let fila = 0; fila < 8; fila++) {
            for (let columna = 0; columna < 8; columna++) {
                let color = (fila + columna) % 2 === 0 ? 'white' : 'black';
                p.fill(color);
                p.stroke(0);
                p.rect(columna * this.TAMANO_CASILLA, fila * this.TAMANO_CASILLA, this.TAMANO_CASILLA, this.TAMANO_CASILLA);
            }
        }
    }

    dibujarCaballo(p, fila, columna) {
        let x = columna * this.TAMANO_CASILLA + this.TAMANO_CASILLA / 2;
        let y = fila * this.TAMANO_CASILLA + this.TAMANO_CASILLA / 2;
        p.fill('red');
        p.noStroke();
        p.ellipse(x, y, this.TAMANO_CASILLA / 1.5);
    }

    mostrarMovimientos(p, fila, columna) {
        let movimientos = [
            { fila: fila + 2, columna: columna + 1 },
            { fila: fila + 2, columna: columna - 1 },
            { fila: fila - 2, columna: columna + 1 },
            { fila: fila - 2, columna: columna - 1 },
            { fila: fila + 1, columna: columna + 2 },
            { fila: fila + 1, columna: columna - 2 },
            { fila: fila - 1, columna: columna + 2 },
            { fila: fila - 1, columna: columna - 2 },
        ];

        for (let m of movimientos) {
            if (m.fila >= 0 && m.fila < 8 && m.columna >= 0 && m.columna < 8) {
                let x = m.columna * this.TAMANO_CASILLA + this.TAMANO_CASILLA / 2;
                let y = m.fila * this.TAMANO_CASILLA + this.TAMANO_CASILLA / 2;
                p.fill('green');
                p.noStroke();
                p.ellipse(x, y, this.TAMANO_CASILLA / 3);
            }
        }
    }

    mousePressed(p) {
        let columna = Math.floor(p.mouseX / this.TAMANO_CASILLA);
        let fila = Math.floor(p.mouseY / this.TAMANO_CASILLA);
        let movimientosValidos = [
            { fila: this.caballoPos.fila + 2, columna: this.caballoPos.columna + 1 },
            { fila: this.caballoPos.fila + 2, columna: this.caballoPos.columna - 1 },
            { fila: this.caballoPos.fila - 2, columna: this.caballoPos.columna + 1 },
            { fila: this.caballoPos.fila - 2, columna: this.caballoPos.columna - 1 },
            { fila: this.caballoPos.fila + 1, columna: this.caballoPos.columna + 2 },
            { fila: this.caballoPos.fila + 1, columna: this.caballoPos.columna - 2 },
            { fila: this.caballoPos.fila - 1, columna: this.caballoPos.columna + 2 },
            { fila: this.caballoPos.fila - 1, columna: this.caballoPos.columna - 2 },
        ];

        for (let m of movimientosValidos) {
            if (m.fila === fila && m.columna === columna) {
                this.caballoPos = { fila, columna };
                break;
            }
        }
    }
}

// Clase para el juego de las Torres de Hanoi
class TorresDeHanoi {
    constructor() {
        this.ANCHO_TORRES = 600;
        this.ALTO_TORRES = 400;
        this.NUM_DISCOS = 3;
        this.POSTE_ANCHO = 10;
        this.POSTE_ALTO = 200;
        this.DISCO_ALTURA = 20;
        this.DISCO_ANCHO_MIN = 40;
        this.DISCO_ANCHO_MAX = 120;
        this.postes = [[], [], []];
        this.discoSeleccionado = null;
        this.posteOrigen = null;
    }

    setup(p) {
        let canvas = p.createCanvas(this.ANCHO_TORRES, this.ALTO_TORRES);
        canvas.parent('juegoTorres');
        this.resetJuego();
    }

    draw(p) {
        p.background(255);
        this.dibujarPostes(p);
        this.dibujarDiscos(p);
    }

    resetJuego() {
        this.postes = [[], [], []];
        for (let i = this.NUM_DISCOS; i > 0; i--) {
            this.postes[0].push(i); // Todos los discos en el poste 1 al inicio
        }
        this.discoSeleccionado = null;
        this.posteOrigen = null;
    }

    dibujarPostes(p) {
        p.fill(0);
        for (let i = 0; i < 3; i++) {
            let x = (i + 1) * (this.ANCHO_TORRES / 4);
            p.rect(x - this.POSTE_ANCHO / 2, this.ALTO_TORRES - this.POSTE_ALTO, this.POSTE_ANCHO, this.POSTE_ALTO);
        }
    }

    dibujarDiscos(p) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < this.postes[i].length; j++) {
                let disco = this.postes[i][j];
                let x = (i + 1) * (this.ANCHO_TORRES / 4);
                let y = this.ALTO_TORRES - (j + 1) * this.DISCO_ALTURA;
                let ancho = p.map(disco, 1, this.NUM_DISCOS, this.DISCO_ANCHO_MIN, this.DISCO_ANCHO_MAX);
                p.fill(100 + disco * 50, 0, 0);
                p.rect(x - ancho / 2, y, ancho, this.DISCO_ALTURA);
            }
        }
    }

    mousePressed(p) {
        let poste = Math.floor(p.mouseX / (this.ANCHO_TORRES / 4)) - 1;
        if (poste < 0 || poste > 2) return;

        if (this.discoSeleccionado === null) {
            if (this.postes[poste].length > 0) {
                this.discoSeleccionado = this.postes[poste].pop();
                this.posteOrigen = poste;
            }
        } else {
            if (this.postes[poste].length === 0 || this.postes[poste][this.postes[poste].length - 1] > this.discoSeleccionado) {
                this.postes[poste].push(this.discoSeleccionado);
                this.discoSeleccionado = null;
                this.posteOrigen = null;
            } else {
                this.postes[this.posteOrigen].push(this.discoSeleccionado);
                this.discoSeleccionado = null;
                this.posteOrigen = null;
            }
        }
    }
}

// Clase para manejar la interfaz de usuario
class UI {
    constructor() {
        this.caballoInstance = null;
        this.torresInstance = null;
    }

    ocultarTodasLasSecciones() {
        document.getElementById('ReglasCaballo').style.display = 'none';
        document.getElementById('infocaballo').style.display = 'none';
        document.getElementById('Juegocaballo').style.display = 'none';
        document.getElementById('infotorres').style.display = 'none';
        document.getElementById('juegoTorres').style.display = 'none';
        document.getElementById('infoAha').style.display = 'none';
        document.getElementById('PseudocodigoAha').style.display = 'none';
        document.getElementById('AlgoritmosContainer').style.display = 'none';
        document.getElementById('hormigasContent').style.display = 'none';

        // Ocultar todas las imágenes
        document.getElementById('diagramaHanoi').style.display = 'none';
        document.getElementById('diagramaAha').style.display = 'none';
        document.getElementById('DiagramaHormiga').style.display = 'none';
    }

    inicializarEventos() {
        document.getElementById('caballoButton').addEventListener('click', () => {
            this.ocultarTodasLasSecciones();
            document.getElementById('ReglasCaballo').style.display = 'block';
            document.getElementById('infocaballo').style.display = 'block';
            document.getElementById('Juegocaballo').style.display = 'block';
            if (!this.caballoInstance) {
                this.caballoInstance = new p5((p) => {
                    let caballo = new Caballo();
                    p.setup = () => caballo.setup(p);
                    p.draw = () => caballo.draw(p);
                    p.mousePressed = () => caballo.mousePressed(p);
                });
            }
        });

        document.getElementById('torreButton').addEventListener('click', () => {
            this.ocultarTodasLasSecciones();
            document.getElementById('infotorres').style.display = 'block';
            document.getElementById('juegoTorres').style.display = 'block';
            document.getElementById('diagramaHanoi').style.display = 'block'; // Mostrar imagen de Hanoi
            if (!this.torresInstance) {
                this.torresInstance = new p5((p) => {
                    let torres = new TorresDeHanoi();
                    p.setup = () => torres.setup(p);
                    p.draw = () => torres.draw(p);
                    p.mousePressed = () => torres.mousePressed(p);
                });
            }
        });

        document.getElementById('AhaButton').addEventListener('click', () => {
            this.ocultarTodasLasSecciones();
            document.getElementById('infoAha').style.display = 'block';
            document.getElementById('PseudocodigoAha').style.display = 'block';
            document.getElementById('diagramaAha').style.display = 'block'; // Mostrar imagen de AHA
        });

        document.getElementById('algoritmosButton').addEventListener('click', () => {
            this.ocultarTodasLasSecciones();
            document.getElementById('AlgoritmosContainer').style.display = 'block';
        });

        document.getElementById('hormigaButton').addEventListener('click', () => {
            this.ocultarTodasLasSecciones();
            document.getElementById('hormigasContent').style.display = 'block';
            document.getElementById('DiagramaHormiga').style.display = 'block'; // Mostrar imagen de Hormiga
        });

        document.getElementById('resetButton').addEventListener('click', () => {
            if (this.torresInstance) {
                this.torresInstance.resetJuego();
            }
        });
    }
}

// Inicializar la UI
let ui = new UI();
ui.inicializarEventos();