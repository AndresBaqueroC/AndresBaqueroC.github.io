// ===== Sección 1: Carrito de compras =====

function runCart() {
    const output = document.getElementById("cart-output");
    output.innerHTML = `
        <div class="interactive-cart">
            <h3>Carrito de Compras</h3>
            <div class="product-list">
                <div class="product" data-product="manzana">Manzana <button onclick="addToCart('manzana')">+</button> <span>0</span> <button onclick="removeFromCart('manzana')">-</button></div>
                <div class="product" data-product="pan">Pan <button onclick="addToCart('pan')">+</button> <span>0</span> <button onclick="removeFromCart('pan')">-</button></div>
                <div class="product" data-product="leche">Leche <button onclick="addToCart('leche')">+</button> <span>0</span> <button onclick="removeFromCart('leche')">-</button></div>
            </div>
            <button onclick="viewCart()">Ver Carrito</button>
            <div id="cart-display"></div>
        </div>
    `;
}

let cart = {};

function addToCart(product) {
    cart[product] = (cart[product] || 0) + 1;
    updateProductCount(product);
}

function removeFromCart(product) {
    if (cart[product] && cart[product] > 0) {
        cart[product]--;
        updateProductCount(product);
    }
}

function updateProductCount(product) {
    const element = document.querySelector(`.product[data-product="${product}"] span`);
    if (element) {
        element.textContent = cart[product] || 0;
    }
}

function viewCart() {
    const display = document.getElementById("cart-display");
    display.innerHTML = "<h4>Productos en el carrito:</h4><ul>";
    
    for (const [product, count] of Object.entries(cart)) {
        if (count > 0) {
            display.innerHTML += `<li>${product}: ${count}</li>`;
        }
    }
    
    display.innerHTML += "</ul>";
}

// ===== Sección 2: Correos únicos =====
const emailSet = new Set(["a@b.com", "x@y.com", "a@b.com", "nuevo@mail.com"]);

function runEmails() {
    const output = document.getElementById("emails-output");
    
    output.innerHTML = `
        <h3>Correos registrados (${emailSet.size})</h3>
        <ul id="email-list"></ul>
        <p>¿Contiene "x@y.com"? ${emailSet.has("x@y.com") ? "Sí" : "No"}</p>
    `;
    
    const emailList = document.getElementById("email-list");
    emailSet.forEach(email => {
        const li = document.createElement("li");
        li.textContent = email;
        li.style.margin = "5px 0";
        emailList.appendChild(li);
    });
}

function addEmail() {
    const emailInput = document.getElementById("new-email");
    const email = emailInput.value.trim();
    
    if (!email) {
        alert("Por favor ingrese un correo electrónico");
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Por favor ingrese un correo electrónico válido");
        return;
    }
    
    if (emailSet.has(email)) {
        alert("Este correo ya está registrado");
    } else {
        emailSet.add(email);
        emailInput.value = "";
        runEmails(); // Actualiza la lista automáticamente
    }
}

// ===== Sección 3: Agenda de contactos (Actualizada) =====
let agenda = {
    "Juan Perez": "3101234567",
    "Maria Garcia": "3209876543",
    "Carlos Ruiz": "3001122334"
};

function runContacts() {
    const output = document.getElementById("contacts-output");
    output.innerHTML = `
        <h3>Agenda de Contactos</h3>
        <div>
            <input type="text" id="contact-name" placeholder="Nombre">
            <input type="text" id="contact-phone" placeholder="Teléfono">
            <button onclick="addContact()">Agregar Contacto</button>
        </div>
        <div style="margin-top: 10px;">
            <input type="text" id="search-contact" placeholder="Buscar por nombre">
            <button onclick="searchContact()">Buscar</button>
        </div>
        <div id="contact-list" style="margin-top: 20px;">
            <p>Contactos:</p>
            <ul id="contacts-ul"></ul>
        </div>
    `;
    updateContactList();
}

function addContact() {
    const nameInput = document.getElementById("contact-name");
    const phoneInput = document.getElementById("contact-phone");
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (name && phone) {
        agenda[name] = phone;
        nameInput.value = "";
        phoneInput.value = "";
        updateContactList();
    } else {
        alert("Por favor, ingrese un nombre y un teléfono válidos.");
    }
}

function deleteContact(name) {
    if (agenda[name]) {
        delete agenda[name];
        updateContactList();
    }
}

function searchContact() {
    const searchInput = document.getElementById("search-contact").value.trim().toLowerCase();
    const filteredAgenda = Object.entries(agenda).filter(([name]) =>
        name.toLowerCase().includes(searchInput)
    );
    
    const ul = document.getElementById("contacts-ul");
    ul.innerHTML = "";
    if (filteredAgenda.length === 0) {
        ul.innerHTML = "<li>No se encontraron contactos.</li>";
    } else {
        filteredAgenda.forEach(([name, phone]) => {
            const li = document.createElement("li");
            li.innerHTML = `${name}: ${phone} <button onclick="deleteContact('${name}')">Eliminar</button>`;
            ul.appendChild(li);
        });
    }
}

function updateContactList() {
    const ul = document.getElementById("contacts-ul");
    ul.innerHTML = "";
    for (const [name, phone] of Object.entries(agenda)) {
        const li = document.createElement("li");
        li.innerHTML = `${name}: ${phone} <button onclick="deleteContact('${name}')">Eliminar</button>`;
        ul.appendChild(li);
    }
}

// ===== Sección 4: BFS y DFS =====
const TAM = 20;
let grid = Array(TAM).fill().map(() => Array(TAM).fill(0));
let start = { x: 0, y: 0 };
let goal = { x: 0, y: 0 };
const MOVS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function initGrid() {
    const container = document.getElementById("grid-container");
    container.innerHTML = "";
    grid = Array(TAM).fill().map(() => Array(TAM).fill(0));
    
    for (let i = 0; i < TAM * TAM * 0.2; i++) {
        const x = Math.floor(Math.random() * TAM);
        const y = Math.floor(Math.random() * TAM);
        grid[x][y] = 1;
    }
    
    function getRandomFreeCell() {
        while (true) {
            const x = Math.floor(Math.random() * TAM);
            const y = Math.floor(Math.random() * TAM);
            if (grid[x][y] === 0) return { x, y };
        }
    }
    
    start = getRandomFreeCell();
    goal = getRandomFreeCell();
    grid[start.x][start.y] = 2;
    grid[goal.x][goal.y] = 3;
    
    for (let x = 0; x < TAM; x++) {
        for (let y = 0; y < TAM; y++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `cell-${x}-${y}`;
            
            if (grid[x][y] === 1) cell.classList.add("obstacle");
            else if (grid[x][y] === 2) {
                cell.classList.add("start");
                cell.textContent = "S";
            } else if (grid[x][y] === 3) {
                cell.classList.add("goal");
                cell.textContent = "G";
            }
            
            container.appendChild(cell);
        }
    }
}

async function runBFS() {
    const queue = [{ x: start.x, y: start.y }];
    const visited = Array(TAM).fill().map(() => Array(TAM).fill(false));
    const parent = Array(TAM).fill().map(() => Array(TAM).fill(null));
    visited[start.x][start.y] = true;
    
    while (queue.length > 0) {
        const { x, y } = queue.shift();
        const cell = document.getElementById(`cell-${x}-${y}`);
        
        if (!(x === start.x && y === start.y) && !(x === goal.x && y === goal.y)) {
            cell.classList.add("visited");
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        
        if (x === goal.x && y === goal.y) {
            let path = [];
            let current = { x, y };
            while (parent[current.x][current.y]) {
                path.push(current);
                current = parent[current.x][current.y];
            }
            path.reverse();
            for (const { x, y } of path) {
                const pathCell = document.getElementById(`cell-${x}-${y}`);
                pathCell.classList.add("path");
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            return;
        }
        
        for (const [dx, dy] of MOVS) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < TAM && ny >= 0 && ny < TAM && !visited[nx][ny] && grid[nx][ny] !== 1) {
                visited[nx][ny] = true;
                parent[nx][ny] = { x, y };
                queue.push({ x: nx, y: ny });
            }
        }
    }
    alert("No se encontró camino.");
}

async function runDFS() {
    const stack = [{ x: start.x, y: start.y }];
    const visited = Array(TAM).fill().map(() => Array(TAM).fill(false));
    const parent = Array(TAM).fill().map(() => Array(TAM).fill(null));
    visited[start.x][start.y] = true;
    
    while (stack.length > 0) {
        const { x, y } = stack.pop();
        const cell = document.getElementById(`cell-${x}-${y}`);
        
        if (!(x === start.x && y === start.y) && !(x === goal.x && y === goal.y)) {
            cell.classList.add("visited");
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        
        if (x === goal.x && y === goal.y) {
            let path = [];
            let current = { x, y };
            while (parent[current.x][current.y]) {
                path.push(current);
                current = parent[current.x][current.y];
            }
            path.reverse();
            for (const { x, y } of path) {
                const pathCell = document.getElementById(`cell-${x}-${y}`);
                pathCell.classList.add("path");
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            return;
        }
        
        for (const [dx, dy] of MOVS) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < TAM && ny >= 0 && ny < TAM && !visited[nx][ny] && grid[nx][ny] !== 1) {
                visited[nx][ny] = true;
                parent[nx][ny] = { x, y };
                stack.push({ x: nx, y: ny });
            }
        }
    }
    alert("No se encontró camino.");
}

// ===== Sección 5: Función de deshacer (Stack) =====
function runUndo() {
    const output = document.getElementById("undo-output");
    const historial = [
        "escribir 'hola'",
        "formato negrita",
        "insertar imagen",
        "cambiar color a azul"
    ];
    
    output.innerHTML = "<p>Historial de acciones:</p><ul>";
    historial.forEach(accion => output.innerHTML += `<li>${accion}</li>`);
    output.innerHTML += "</ul>";
    
    const ultima = historial.pop();
    output.innerHTML += `<p>Deshaciendo: <strong>${ultima}</strong></p>`;
    output.innerHTML += "<p>Historial actualizado:</p><ul>";
    historial.forEach(accion => output.innerHTML += `<li>${accion}</li>`);
    output.innerHTML += "</ul>";
}

// ===== Sección 6: Atención por turnos (Queue) =====
async function runTurns() {
    const output = document.getElementById("turns-output");
    const nombres = ["Juan", "Maria", "Carlos", "Ana", "Luis", "Laura", "Pedro", "Sofia", "Diego", "Valeria"];
    const cola = [];
    
    output.innerHTML = "<p>Clientes en cola:</p><ul>";
    for (let i = 0; i < 5; i++) {
        const cliente = `${nombres[Math.floor(Math.random() * nombres.length)]}-${i+1}`;
        cola.push(cliente);
        output.innerHTML += `<li>${cliente}</li>`;
    }
    output.innerHTML += "</ul>";
    
    output.innerHTML += "<p>Atendiendo:</p><ul>";
    while (cola.length > 0) {
        const cliente = cola.shift();
        output.innerHTML += `<li>Atendiendo a: ${cliente}</li>`;
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    output.innerHTML += "</ul>";
}

// ===== Sección 7: Árbol binario de búsqueda =====
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        this.root = this._insertRec(this.root, value);
    }

    _insertRec(node, value) {
        if (node === null) return new TreeNode(value);
        if (value < node.value) node.left = this._insertRec(node.left, value);
        else if (value > node.value) node.right = this._insertRec(node.right, value);
        return node;
    }

    search(value) {
        return this._searchRec(this.root, value);
    }

    _searchRec(node, value) {
        if (node === null) return false;
        if (node.value === value) return true;
        return value < node.value ? this._searchRec(node.left, value) : this._searchRec(node.right, value);
    }

    drawTree(containerId) {
        const nodes = [];
        const edges = [];
        this._collectNodesAndEdges(this.root, nodes, edges);
        
        const data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
        };
        
        const options = {
            layout: {
                hierarchical: {
                    direction: "UD",
                    sortMethod: "directed"
                }
            },
            nodes: {
                shape: "box",
                color: "#D2E5FF",
                borderWidth: 2
            },
            edges: {
                arrows: "to",
                smooth: true
            }
        };
        
        new vis.Network(document.getElementById(containerId), data, options);
    }

    _collectNodesAndEdges(node, nodes, edges, parentId = null) {
        if (node === null) return;
        
        const nodeId = node.value;
        nodes.push({ id: nodeId, label: String(nodeId) });
        
        if (parentId !== null) {
            edges.push({ from: parentId, to: nodeId });
        }
        
        this._collectNodesAndEdges(node.left, nodes, edges, nodeId);
        this._collectNodesAndEdges(node.right, nodes, edges, nodeId);
    }
}

function runBinaryTree() {
    const output = document.getElementById("tree-output");
    const bst = new BinarySearchTree();
    [50, 30, 70, 20, 40, 60, 80].forEach(v => bst.insert(v));
    
    output.innerHTML = `
        <p>¿40 existe? ${bst.search(40) ? "Sí" : "No"}</p>
        <p>¿90 existe? ${bst.search(90) ? "Sí" : "No"}</p>
    `;
    
    bst.drawTree("tree-container");
}

// ===== Sección 8: Profundidad de árbol =====
function calculateDepth(node) {
    if (node === null) return 0;
    return Math.max(calculateDepth(node.left), calculateDepth(node.right)) + 1;
}

function buildBalancedTree(arr, start, end) {
    if (start > end) return null;
    
    const mid = Math.floor((start + end) / 2);
    const node = new TreeNode(arr[mid]);
    
    node.left = buildBalancedTree(arr, start, mid - 1);
    node.right = buildBalancedTree(arr, mid + 1, end);
    
    return node;
}

function runTreeDepth() {
    const output = document.getElementById("depth-output");
    const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const root = buildBalancedTree(values, 0, values.length - 1);
    const depth = calculateDepth(root);
    
    output.innerHTML = `<p>Profundidad del árbol: ${depth}</p>`;
    
    // Dibujar el árbol balanceado
    const bst = new BinarySearchTree();
    bst.root = root;
    bst.drawTree("balanced-tree-container");
}

// ===== Sección 15: Tareas con prioridad =====
class PriorityTasks {
    constructor() {
        this.tasks = [];
    }

    add(task, priority) {
        this.tasks.push({ task, priority });
        this.tasks.sort((a, b) => a.priority - b.priority);
    }

    show() {
        return this.tasks.map(t => `${t.task} (Prioridad: ${t.priority})`).join('<br>');
    }
}

function runPriorityTasks() {
    const output = document.getElementById("tasks-output");
    const manager = new PriorityTasks();
    manager.add("Hacer informe", 2);
    manager.add("Revisar correos", 1);
    manager.add("Preparar presentación", 3);
    output.innerHTML = `<p>Tareas ordenadas:</p>${manager.show()}`;
}

// ===== Sección 16: Inversión de jerarquía =====
function invertTree(node) {
    if (!node) return null;
    [node.left, node.right] = [invertTree(node.right), invertTree(node.left)];
    return node;
}

function runTreeInversion() {
    const output = document.getElementById("tree-inversion-output");
    const bst = new BinarySearchTree();
    [50, 30, 70, 20, 40, 60, 80].forEach(v => bst.insert(v));
    
    output.innerHTML = "<p>Árbol original y luego invertido:</p>";
    bst.drawTree("tree-inversion-container");
    
    setTimeout(() => {
        bst.root = invertTree(bst.root);
        bst.drawTree("tree-inversion-container");
    }, 2000);
}

// ===== Sección 18: Dijkstra =====
function runDijkstra() {
    const output = document.getElementById("dijkstra-output");
    const graph = {
        A: { B: 1, C: 4 },
        B: { A: 1, C: 2, D: 5 },
        C: { A: 4, B: 2, D: 1 },
        D: { B: 5, C: 1 }
    };

    // Calcular ruta
    const { path, distance } = dijkstra(graph, "A", "D");
    output.innerHTML = `Camino más corto: ${path.join(" → ")} (Distancia: ${distance})`;

    // Dibujar grafo
    const nodes = Object.keys(graph).map(id => ({ id, label: id }));
    const edges = [];
    for (const [from, neighbors] of Object.entries(graph)) {
        for (const [to, weight] of Object.entries(neighbors)) {
            edges.push({ from, to, label: String(weight) });
        }
    }
    new vis.Network(
        document.getElementById("dijkstra-container"),
        { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) },
        { edges: { arrows: "to" } }
    );
}

function dijkstra(graph, start, end) {
    const distances = {};
    const prev = {};
    const pq = new PriorityQueue();
    
    for (const node in graph) {
        distances[node] = node === start ? 0 : Infinity;
        pq.enqueue(node, distances[node]);
    }

    while (!pq.isEmpty()) {
        const { element: current } = pq.dequeue();
        if (current === end) break;

        for (const [neighbor, weight] of Object.entries(graph[current])) {
            const alt = distances[current] + weight;
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                prev[neighbor] = current;
                pq.enqueue(neighbor, alt);
            }
        }
    }

    // Reconstruir camino
    const path = [];
    let node = end;
    while (node) {
        path.unshift(node);
        node = prev[node];
    }
    return { path, distance: distances[end] };
}

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

// ===== Sección 19: Floyd-Warshall =====
function runFloydWarshall() {
    const INF = Infinity;
    const graph = [
        [0, 3, INF, 7, INF],
        [8, 0, 2, INF, INF],
        [5, INF, 0, 1, INF],
        [2, INF, INF, 0, 1],
        [INF, INF, 3, INF, 0]
    ];

    const dist = floydWarshall(graph);
    const table = document.getElementById("floyd-table");
    table.innerHTML = "<tr><th>Nodo</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr>";

    ["A", "B", "C", "D", "E"].forEach((node, i) => {
        const row = table.insertRow();
        row.insertCell(0).textContent = node;
        dist[i].forEach(d => {
            row.insertCell().textContent = d === INF ? "∞" : d;
        });
    });
}

function floydWarshall(graph) {
    const dist = graph.map(row => [...row]);
    const n = dist.length;

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    return dist;
}

// ===== Sección 20: Visualización de Grafos =====
function drawGraph() {
    const container = document.getElementById("graph-container");
    const nodes = new vis.DataSet([
        { id: "A", label: "A" },
        { id: "B", label: "B" },
        { id: "C", label: "C" },
        { id: "D", label: "D" },
        { id: "E", label: "E" }
    ]);
    const edges = new vis.DataSet([
        { from: "A", to: "B" },
        { from: "A", to: "C" },
        { from: "B", to: "D" },
        { from: "C", to: "D" },
        { from: "D", to: "E" }
    ]);
    new vis.Network(container, { nodes, edges }, {});
}