// script.js - Lógica para los ejercicios de Autómatas y Compiladores

// =============================================
// Funciones generales
// =============================================

// Función para mostrar/ocultar ejercicios
function toggleExercise(id) {
    const exercise = document.getElementById(id);
    const header = exercise.previousElementSibling;
    const icon = header.querySelector('span');
    
    if (exercise.classList.contains('hidden')) {
        exercise.classList.remove('hidden');
        icon.textContent = '-';
    } else {
        exercise.classList.add('hidden');
        icon.textContent = '+';
    }
}

// =============================================
// Ejercicio 1: Analizador Léxico
// =============================================

function esLetra(char) {
    return /^[a-zA-Z_]$/.test(char);
}

function esDigito(char) {
    return /^\d$/.test(char);
}

function runLexer() {
    const input = document.getElementById('lexer-input').value;
    const output = document.getElementById('lexer-output');
    output.innerHTML = '';
    
    let i = 0;
    while (i < input.length) {
        const char = input[i];
        
        // Ignorar espacios
        if (/\s/.test(char)) {
            i++;
            continue;
        }
        
        // Número: uno o más dígitos
        if (esDigito(char)) {
            let num = char;
            i++;
            while (i < input.length && esDigito(input[i])) {
                num += input[i];
                i++;
            }
            output.innerHTML += `<div class="token"><span class="token-type">NUMERO</span>: ${num}</div>`;
            continue;
        }
        
        // Identificador: letra o _ seguida de letras/dígitos/_
        else if (esLetra(char)) {
            let iden = char;
            i++;
            while (i < input.length && (esLetra(input[i]) || esDigito(input[i]))) {
                iden += input[i];
                i++;
            }
            output.innerHTML += `<div class="token"><span class="token-type">IDENTIFICADOR</span>: ${iden}</div>`;
            continue;
        }
        
        // Operadores y paréntesis
        else if ('+-*/()='.includes(char)) {
            const tipo = '()'.includes(char) ? 'PARENTESIS' : 'OPERADOR';
            output.innerHTML += `<div class="token"><span class="token-type">${tipo}</span>: ${char}</div>`;
            i++;
            continue;
        }
        
        else {
            // Carácter no reconocido
            output.innerHTML += `<div class="token" style="background-color:#ffebee;"><span class="token-type">ERROR</span>: ${char}</div>`;
            i++;
        }
    }
    
    if (output.innerHTML === '') {
        output.innerHTML = '<p>No se encontraron tokens en la entrada.</p>';
    }
}

// =============================================
// Ejercicio 2: Autómata para Lenguajes Regulares
// =============================================

class DFA {
    constructor() {
        this.initial_state = [true, false];
        this.current_state = [...this.initial_state];
        this.accepting_states = [[true, true]];
        this.history = [];
    }
    
    reset() {
        this.current_state = [...this.initial_state];
        this.history = [];
        this.history.push(`Estado inicial: (${this.current_state[0]}, ${this.current_state[1]})`);
    }
    
    transition(char) {
        let [par_a, impar_b] = this.current_state;
        
        if (char === 'a') {
            par_a = !par_a;
        } else if (char === 'b') {
            impar_b = !impar_b;
        } else {
            return false;
        }
        
        this.current_state = [par_a, impar_b];
        this.history.push(`Después de '${char}': Estado = (${par_a}, ${impar_b})`);
        return true;
    }
    
    is_accepted() {
        return this.accepting_states.some(
            state => state[0] === this.current_state[0] && state[1] === this.current_state[1]
        );
    }
    
    validate_string(input_string) {
        this.reset();
        
        for (let i = 0; i < input_string.length; i++) {
            const char = input_string[i];
            if (!this.transition(char)) {
                this.history.push(`Carácter no válido '${char}' en posición ${i+1}. Autómata rechazado.`);
                return false;
            }
        }
        
        const accepted = this.is_accepted();
        this.history.push(`Estado final: (${this.current_state[0]}, ${this.current_state[1]})`);
        this.history.push(`Resultado: ${accepted ? 'Aceptada' : 'Rechazada'}`);
        return accepted;
    }
}

function runDFA() {
    const input = document.getElementById('dfa-input').value.trim();
    const output = document.getElementById('dfa-output');
    const states = document.getElementById('dfa-states');
    
    if (!/^[ab]*$/.test(input)) {
        output.innerHTML = '<p style="color: var(--error-color);">Error: La cadena solo puede contener "a" y "b".</p>';
        return;
    }
    
    const dfa = new DFA();
    const accepted = dfa.validate_string(input);
    
    output.innerHTML = accepted 
        ? '<p style="color: var(--success-color);">✅ Cadena ACEPTADA</p>'
        : '<p style="color: var(--error-color);">❌ Cadena RECHAZADA</p>';
    
    states.innerHTML = dfa.history.map(step => `<p>${step}</p>`).join('');
}

// =============================================
// Ejercicio 3: Balance de Paréntesis
// =============================================

function checkParentheses() {
    const input = document.getElementById('paren-input').value;
    const output = document.getElementById('paren-output');
    
    let balance = 0;
    let valid = true;
    
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char === '(') {
            balance++;
        } else if (char === ')') {
            balance--;
            if (balance < 0) {
                valid = false;
                break;
            }
        }
    }
    
    if (balance !== 0) {
        valid = false;
    }
    
    output.innerHTML = valid
        ? '<p style="color: var(--success-color);">✅ Paréntesis BALANCEADOS</p>'
        : '<p style="color: var(--error-color);">❌ Paréntesis NO BALANCEADOS</p>';
}

// =============================================
// Ejercicio 4: Máquina de Turing
// =============================================

class TuringMachine {
    constructor() {
        this.initial_state = "q0";
        this.current_state = this.initial_state;
        this.accept_state = "q_accept";
        this.reject_state = "q_reject";
        this.head_position = 0;
        this.tape = [];
        this.history = [];
    }
    
    reset(input_string) {
        this.current_state = this.initial_state;
        this.head_position = 0;
        this.tape = [...input_string];
        this.tape.push(' ');  // Espacio en blanco al final
        this.history = [];
        this.history.push(`Estado inicial: ${this.current_state}`);
        this.history.push(`Cinta: ${this.tape.join('')}`);
    }
    
    step() {
        if ([this.accept_state, this.reject_state].includes(this.current_state)) {
            return false;
        }
        
        const current_symbol = this.tape[this.head_position];
        let next_state = this.current_state;
        let write_symbol = current_symbol;
        let move_direction = 0;
        
        // Reglas de transición
        if (this.current_state === "q0") {
            if (current_symbol === '0' || current_symbol === '1') {
                next_state = "q0";
                move_direction = 1;  // Mover derecha
            } else if (current_symbol === ' ') {
                next_state = this.accept_state;
            } else {
                next_state = this.reject_state;
            }
        }
        
        // Actualizar estado
        this.current_state = next_state;
        
        // Registrar paso
        let step_info = `Estado: ${this.current_state}, Símbolo: '${current_symbol}'`;
        step_info += `, Posición: ${this.head_position}, Cinta: [${this.tape.join('')}]`;
        this.history.push(step_info);
        
        // Mover cabeza
        if (move_direction === 1) {
            this.head_position++;
        }
        
        return true;
    }
    
    run(input_string) {
        this.reset(input_string);
        
        let steps = 0;
        while (this.step() && steps < 100) {
            steps++;
        }
        
        return this.current_state === this.accept_state;
    }
}

function runTuringMachine() {
    const input = document.getElementById('turing-input').value.trim();
    const output = document.getElementById('turing-output');
    
    if (!/^[01]*$/.test(input)) {
        output.innerHTML = '<p style="color: var(--error-color);">Error: La cadena solo puede contener "0" y "1".</p>';
        return;
    }
    
    const tm = new TuringMachine();
    const accepted = tm.run(input);
    
    output.innerHTML = accepted 
        ? '<p style="color: var(--success-color);">✅ Cadena ACEPTADA</p>'
        : '<p style="color: var(--error-color);">❌ Cadena RECHAZADA</p>';
    
    output.innerHTML += tm.history.map(step => `<p>${step}</p>`).join('');
}

// =============================================
// Ejercicio 6: Autómata de Pila
// =============================================

class PDA {
    constructor() {
        this.initial_state = "q0";
        this.current_state = this.initial_state;
        this.accept_state = "q_accept";
        this.reject_state = "q_reject";
        this.stack = [];
        this.history = [];
    }
    
    reset(input_string) {
        this.current_state = this.initial_state;
        this.stack = [];
        this.input_string = input_string;
        this.head_position = 0;
        this.history = [];
        this.history.push(`Estado inicial: ${this.current_state}, Pila: []`);
    }
    
    step() {
        if ([this.accept_state, this.reject_state].includes(this.current_state)) {
            return false;
        }
        
        const current_symbol = this.input_string[this.head_position] || null;
        
        // Transiciones
        if (this.current_state === "q0") {
            if (current_symbol === 'a' || current_symbol === 'b') {
                this.stack.push(current_symbol);
                this.head_position++;
                this.history.push(`Push '${current_symbol}' a la pila. Estado: ${this.current_state}, Pila: [${this.stack.join('')}]`);
            } else if (current_symbol === null) {
                if (this.stack.length === 0) {
                    this.current_state = this.accept_state;
                } else {
                    this.current_state = this.reject_state;
                }
            } else {
                this.current_state = this.reject_state;
            }
        }
        else if (this.current_state === "q1") {
            if (current_symbol === 'a' || current_symbol === 'b') {
                if (this.stack.length === 0) {
                    this.current_state = this.reject_state;
                } else {
                    const expected = this.stack.pop();
                    if (current_symbol === expected) {
                        this.head_position++;
                        this.history.push(`Pop '${expected}' de la pila. Estado: ${this.current_state}, Pila: [${this.stack.join('')}]`);
                    } else {
                        this.current_state = this.reject_state;
                    }
                }
            } else if (current_symbol === null) {
                if (this.stack.length === 0) {
                    this.current_state = this.accept_state;
                } else {
                    this.current_state = this.reject_state;
                }
            } else {
                this.current_state = this.reject_state;
            }
        }
        
        // Cambiar de q0 a q1 cuando se encuentra el centro del palíndromo
        if (this.current_state === "q0" && 
            this.head_position >= this.input_string.length / 2 && 
            this.input_string.length > 0) {
            this.current_state = "q1";
            this.history.push(`Cambio a estado q1 (segunda mitad de la cadena)`);
        }
        
        return true;
    }
    
    run(input_string) {
        this.reset(input_string);
        
        let steps = 0;
        while (this.step() && steps < 100) {
            steps++;
        }
        
        return this.current_state === this.accept_state;
    }
}

function runPDA() {
    const input = document.getElementById('pda-input').value.trim();
    const output = document.getElementById('pda-output');
    const states = document.getElementById('pda-states');
    
    if (!/^[ab]*$/.test(input)) {
        output.innerHTML = '<p style="color: var(--error-color);">Error: La cadena solo puede contener "a" y "b".</p>';
        return;
    }
    
    const pda = new PDA();
    const accepted = pda.run(input);
    
    output.innerHTML = accepted 
        ? '<p style="color: var(--success-color);">✅ Cadena ACEPTADA (es un palíndromo par)</p>'
        : '<p style="color: var(--error-color);">❌ Cadena RECHAZADA (no es un palíndromo par)</p>';
    
    states.innerHTML = pda.history.map(step => `<p>${step}</p>`).join('');
}

// =============================================
// Ejercicio 7-8: Navegación en Laberinto
// =============================================

class RobotDFA {
    constructor(maze) {
        this.maze = maze;
        this.start_pos = this.findPosition(2);
        this.goal_pos = this.findPosition(3);
        this.current_pos = [...this.start_pos];
        this.visited = new Set();
        this.path = [];
        this.state = "Explorando";
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];  // derecha, abajo, izquierda, arriba
        this.found_goal = false;
        this.steps = [];
    }
    
    findPosition(value) {
        for (let i = 0; i < this.maze.length; i++) {
            for (let j = 0; j < this.maze[i].length; j++) {
                if (this.maze[i][j] === value) {
                    return [i, j];
                }
            }
        }
        return [0, 0];
    }
    
    is_valid_move(pos) {
        const [x, y] = pos;
        return (
            x >= 0 && x < this.maze.length &&
            y >= 0 && y < this.maze[0].length &&
            this.maze[x][y] !== 1
        );
    }
    
    transition() {
        const [x, y] = this.current_pos;
        this.visited.add(`${x},${y}`);
        
        if (x === this.goal_pos[0] && y === this.goal_pos[1]) {
            this.state = "Objetivo Alcanzado";
            this.found_goal = true;
            this.steps.push({ pos: [x, y], state: this.state });
            return false;
        }
        
        if (this.state === "Explorando") {
            // Busca una dirección no explorada
            for (const [dx, dy] of this.directions) {
                const new_pos = [x + dx, y + dy];
                const new_pos_str = `${new_pos[0]},${new_pos[1]}`;
                
                if (this.is_valid_move(new_pos) && !this.visited.has(new_pos_str)) {
                    this.path.push([x, y]);
                    this.current_pos = new_pos;
                    this.state = "Avanzando";
                    this.steps.push({ pos: [...new_pos], state: this.state });
                    return true;
                }
            }
            
            // Retrocede si no hay movimientos válidos
            if (this.path.length > 0) {
                this.current_pos = this.path.pop();
                this.state = "Retrocediendo";
                this.steps.push({ pos: [...this.current_pos], state: this.state });
                return true;
            }
            
            return false;  // No hay solución
        }
        else if (this.state === "Avanzando") {
            // Intenta continuar en la misma dirección
            if (this.path.length > 0) {
                const [last_x, last_y] = this.path[this.path.length - 1];
                const dx = x - last_x;
                const dy = y - last_y;
                const new_pos = [x + dx, y + dy];
                const new_pos_str = `${new_pos[0]},${new_pos[1]}`;
                
                if (this.is_valid_move(new_pos) && !this.visited.has(new_pos_str)) {
                    this.path.push([x, y]);
                    this.current_pos = new_pos;
                    this.steps.push({ pos: [...new_pos], state: this.state });
                    return true;
                }
            }
            
            this.state = "Explorando";
            return this.transition();
        }
        else if (this.state === "Retrocediendo") {
            if (this.path.length > 0) {
                this.current_pos = this.path.pop();
                this.state = "Explorando";
                this.steps.push({ pos: [...this.current_pos], state: this.state });
                return true;
            }
            return false;
        }
    }
    
    run() {
        while (this.transition() && this.steps.length < 1000) {
            // Limitar el número de pasos para evitar bucles infinitos
        }
        return this.found_goal;
    }
}

let currentMaze = null;
let robot = null;
let currentStep = 0;
let animationInterval = null;

function initMaze() {
    const mazeContainer = document.getElementById('maze-grid');
    mazeContainer.innerHTML = '';
    
    // Crear un laberinto de 10x10
    const size = 10;
    currentMaze = Array(size).fill().map(() => Array(size).fill(0));
    
    // Añadir obstáculos (20%)
    const numObstacles = Math.floor(size * size * 0.2);
    for (let i = 0; i < numObstacles; i++) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        currentMaze[x][y] = 1;
    }
    
    // Posición inicial (2)
    const startX = Math.floor(Math.random() * size);
    const startY = Math.floor(Math.random() * size);
    currentMaze[startX][startY] = 2;
    
    // Posición objetivo (3), asegurando que no sea la misma que la inicial
    let goalX, goalY;
    do {
        goalX = Math.floor(Math.random() * size);
        goalY = Math.floor(Math.random() * size);
    } while (goalX === startX && goalY === startY);
    currentMaze[goalX][goalY] = 3;
    
    // Dibujar el laberinto
    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            cell.className = 'maze-cell';
            
            if (currentMaze[i][j] === 1) {
                cell.classList.add('cell-obstacle');
            } else if (currentMaze[i][j] === 2) {
                cell.classList.add('cell-start');
                cell.textContent = 'S';
            } else if (currentMaze[i][j] === 3) {
                cell.classList.add('cell-goal');
                cell.textContent = 'G';
            } else {
                cell.classList.add('cell-empty');
            }
            
            row.appendChild(cell);
        }
        mazeContainer.appendChild(row);
    }
    
    document.getElementById('run-robot-btn').disabled = false;
    document.getElementById('robot-output').innerHTML = '<p>Laberinto generado. Haz clic en "Ejecutar Robot" para comenzar.</p>';
}

function runRobot() {
    if (!currentMaze) return;
    
    // Detener cualquier animación en curso
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    
    robot = new RobotDFA(currentMaze);
    robot.run();
    
    currentStep = 0;
    animateRobot();
}

function animateRobot() {
    const mazeCells = document.querySelectorAll('.maze-cell');
    const size = currentMaze.length;
    const output = document.getElementById('robot-output');
    const states = document.getElementById('robot-states');
    
    // Limpiar celdas de robot y camino
    mazeCells.forEach(cell => {
        cell.classList.remove('cell-robot', 'cell-path');
    });
    
    if (currentStep >= robot.steps.length) {
        // Animación completada
        const [x, y] = robot.current_pos;
        const cellIndex = x * size + y;
        mazeCells[cellIndex].classList.add('cell-robot');
        
        output.innerHTML = robot.found_goal
            ? '<p style="color: var(--success-color);">✅ ¡El robot ha alcanzado el objetivo!</p>'
            : '<p style="color: var(--error-color);">❌ El robot no pudo encontrar el objetivo</p>';
        
        states.innerHTML = `<p>Estado final: ${robot.state}</p>`;
        return;
    }
    
    const step = robot.steps[currentStep];
    const [x, y] = step.pos;
    const cellIndex = x * size + y;
    
    // Resaltar la posición actual del robot
    mazeCells[cellIndex].classList.add('cell-robot');
    
    // Resaltar el camino
    for (let i = 0; i < robot.path.length; i++) {
        const [px, py] = robot.path[i];
        const pathIndex = px * size + py;
        mazeCells[pathIndex].classList.add('cell-path');
    }
    
    // Actualizar información de estado
    states.innerHTML = `
        <p>Paso: ${currentStep + 1}</p>
        <p>Estado: ${step.state}</p>
        <p>Posición: (${x}, ${y})</p>
    `;
    
    currentStep++;
    animationInterval = setTimeout(animateRobot, 300);
}

// =============================================
// Ejercicio 9: Generador de Lenguajes Regulares
// =============================================

function generateRegex() {
    const pattern = document.getElementById('regex-pattern').value;
    const output = document.getElementById('regex-output');
    
    try {
        // Validar que el patrón sea una expresión regular válida
        new RegExp(`^${pattern}$`);
        
        // Generar 5 ejemplos que coincidan con el patrón
        output.innerHTML = '<p>Generando ejemplos válidos:</p>';
        
        for (let i = 0; i < 5; i++) {
            let example;
            let valid = false;
            let attempts = 0;
            
            // Intentar generar un ejemplo válido (con un límite de intentos)
            while (!valid && attempts < 100) {
                example = generateFromPattern(pattern);
                valid = new RegExp(`^${pattern}$`).test(example);
                attempts++;
            }
            
            if (valid) {
                output.innerHTML += `<p>- ${example} <span style="color: var(--success-color);">✓ válido</span></p>`;
            } else {
                output.innerHTML += `<p>No se pudo generar un ejemplo válido después de 100 intentos</p>`;
            }
        }
    } catch (e) {
        output.innerHTML = `<p style="color: var(--error-color);">Error: La expresión regular no es válida</p>`;
    }
}

function generateFromPattern(pattern) {
    let result = '';
    let i = 0;
    
    while (i < pattern.length) {
        if (pattern[i] === '\\') {
            // Carácter de escape
            result += pattern[i+1];
            i += 2;
        } else if (pattern[i] === '(' && pattern.indexOf(')', i) > -1) {
            // Grupo de opciones
            const end = pattern.indexOf(')', i);
            const options = pattern.slice(i+1, end).split('|');
            result += options[Math.floor(Math.random() * options.length)];
            i = end + 1;
        } else if (pattern[i] === '[' && pattern.indexOf(']', i) > -1) {
            // Clase de caracteres
            const end = pattern.indexOf(']', i);
            let chars = pattern.slice(i+1, end);
            let expanded = '';
            let j = 0;
            
            while (j < chars.length) {
                if (j+2 < chars.length && chars[j+1] === '-') {
                    // Rango de caracteres (ej: a-z)
                    const start = chars[j].charCodeAt(0);
                    const end = chars[j+2].charCodeAt(0);
                    for (let c = start; c <= end; c++) {
                        expanded += String.fromCharCode(c);
                    }
                    j += 3;
                } else {
                    expanded += chars[j];
                    j++;
                }
            }
            
            result += expanded[Math.floor(Math.random() * expanded.length)];
            i = end + 1;
        } else if (pattern[i] === '{' && pattern.indexOf('}', i) > -1) {
            // Cuantificador
            const end = pattern.indexOf('}', i);
            const quant = pattern.slice(i+1, end);
            let quantity;
            
            if (quant.includes(',')) {
                const [min, max] = quant.split(',').map(Number);
                quantity = Math.floor(Math.random() * (max - min + 1)) + min;
            } else {
                quantity = Number(quant);
            }
            
            if (result.length > 0) {
                result += result[result.length-1].repeat(quantity - 1);
            }
            
            i = end + 1;
        } else if (pattern[i] === '?') {
            // Opcional (0 o 1)
            if (Math.random() > 0.5 && result.length > 0) {
                // Mantener el último carácter
            } else if (result.length > 0) {
                result = result.slice(0, -1);
            }
            i++;
        } else if (pattern[i] === '+') {
            // 1 o más
            if (result.length > 0) {
                const reps = Math.floor(Math.random() * 4) + 1;
                result += result[result.length-1].repeat(reps);
            }
            i++;
        } else if (pattern[i] === '*') {
            // 0 o más
            if (result.length > 0 && Math.random() > 0.5) {
                const reps = Math.floor(Math.random() * 5);
                result += result[result.length-1].repeat(reps);
            }
            i++;
        } else if (pattern[i] === 'd') {
            // Dígito
            result += Math.floor(Math.random() * 10);
            i++;
        } else if (pattern[i] === 'w') {
            // Carácter de palabra (a-z, A-Z, 0-9, _)
            const options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
            result += options[Math.floor(Math.random() * options.length)];
            i++;
        } else {
            // Carácter literal
            result += pattern[i];
            i++;
        }
    }
    
    return result;
}

// =============================================
// Inicialización
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Asignar eventos a los botones
    document.getElementById('lexer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') runLexer();
    });
    
    document.getElementById('dfa-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') runDFA();
    });
    
    document.getElementById('paren-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkParentheses();
    });
    
    document.getElementById('turing-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') runTuringMachine();
    });
    
    document.getElementById('pda-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') runPDA();
    });
    
    document.getElementById('regex-pattern').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') generateRegex();
    });
    
    // Generar un laberinto inicial
    initMaze();
});
