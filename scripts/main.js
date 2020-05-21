

data = {
	canvas: null,
	ctx: null,
	g: null,
	colunas: null,
	rotulos:  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I','J', 'K', 'L','M', 'N', 'O','P', 'Q', 'R' ],
	vg : {},
	v_selecionado : null,
	linha: 1,
	diagonal: Math.sqrt(2)
	
	};
	

	
function setupCanvas(){
		// definindo resolucao
		let res = window.devicePixelRatio || 1;
		scale = 1 / res;
		
		//DOM
		data.canvas = document.getElementById('grafo');
		data.ctx = data.canvas.getContext('2d');
		
		//Dimensões 
		data.canvas.width = window.innerWidth * res;
		data.canvas.height = window.innerHeight * res;
		data.canvas.style.width = window.innerWidth + 'px';
		data.canvas.style.height = window.innerHeight + 'px';
		
		//escala
		data.ctx.scale(res, res);	
		
		//eventos
		
		
		data.canvas.addEventListener('mousedown', function(e){
			checaClick(e.pageX, e.pageY);
			
			
			
		});
		
	}

function desenhaGrafo(){ //vai receber parametros linhas e colunas
	
	let i = 0;
	let j = 0;
	let linhas = 3;
	let pos = {x: 100, y:100};	   
	let cont_rotulos = 0;
	
	// captura informaćão da tela 
	let e = document.getElementById("colunas");
	colunas = e.options[e.selectedIndex].value;
	data.colunas = colunas * linhas ;	
	
	
	//limpa o canvas
	data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
	
	// inicializa um objeto do tipo grafo
	data.g = new Graph();
	
	for (; i < colunas; i++){
		for(; j < linhas; j++) {
			
			// desenha os círculos (vértices)
			data.ctx.beginPath();
			data.ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
			data.ctx.fillStyle = '#777';
			data.ctx.fill();
			
			//coloca o label nos vértices
			data.ctx.font = "1em Arial";
			data.ctx.textAlign = "center";
			data.ctx.textBaseline = "middle";
			data.ctx.fillStyle = "#FFF";
			data.ctx.fillText(data.rotulos[cont_rotulos],pos.x,pos.y)
			data.ctx.fillStyle = "#777";
			
			// adiciona vértice no grafo e no registro visual
			data.g.addNode(data.rotulos[cont_rotulos]); 
			data.vg[data.rotulos[cont_rotulos]] = {posx: pos.x-26, posy: pos.y+211};
			// atualiza posicao cartesiana na página
			pos.x += 0;
			pos.y += 100; 
			cont_rotulos +=1;
		
		}
		j = 0;
		pos.x += 100;
		pos.y = 100;
	}
	data.ctx.endPath;
	// habilita opcoes de origem
	populaOrigem();

}

function hitCircle(c1,c2){
	var a = c1.r + c2.r,
		x = c1.x - c2.x,
		y = c1.y - c2.y;

	if (a > Math.sqrt( (x*x)  + (y*y) ))  return true; 
	else return false;
}

function desenhaLinha(v_destino){
	// Origem e destino da linha
	var origem_x = data.v_selecionado.posx,
		origem_y = data.v_selecionado.posy,
		destino_x = v_destino.posx,
		destino_y = v_destino.posy;
		
		
	data.ctx.beginPath();
	data.ctx.moveTo(data.v_selecionado.posx+26, data.v_selecionado.posy-211);
	data.ctx.lineTo(v_destino.posx+26, v_destino.posy-211);
	//data.ctx.moveTo(origem_x, origem_y);
	//data.ctx.lineTo(destino_x, destino_y);
	
	//Estilo da linha
	data.ctx.lineWidth=5;
	data.ctx.strokeStyle = '#777';
	data.ctx.stroke();
	// fecha o caminho
	data.ctx.closePath(); 
	
	//descobre os vertices a partir das posicoes
	//alert("" + origem_x + " " + origem_y);
	let origem = posToVertice(origem_x, origem_y);
	let destino = posToVertice(destino_x, destino_y); 
	
	//verifica o peso a ser adicionado
	let peso = posToPeso(origem_x,origem_y,destino_x, destino_y);
	// adiciona adjacencia
	data.g.addDirectedEdge(origem, destino, peso);
	data.g.addDirectedEdge(destino, origem, peso);
}
	
function checaClick(posX, posY) {
	var i=0; v_selecionado = null
	var vertice = 0;
	
	for(; i < data.colunas; i++){
		var vertice = data.vg[data.rotulos[i]],
		c1 = {x: vertice.posx, y: vertice.posy, r: 10},
		c2 = {x: posX, y: posY, r: 10};
		
		// debug: calibrar  
		//alert("" + c1.x + " " + c1.y + " " + c2.x + " " + c2.y);
		if (hitCircle(c1,c2)) v_selecionado = vertice;
	}
	if (v_selecionado != null) {
		if (data.v_selecionado != null) desenhaLinha(v_selecionado);
		data.v_selecionado = v_selecionado;
	}else data.v_selecionado = null;
}


function posToVertice(posX, posY){
	let i=0;
	for(; i < 3 * data.colunas; i++)
		if (data.vg[data.rotulos[i]].posx == posX && data.vg[data.rotulos[i]].posy == posY){
			//return data.vg[data.rotulos[i]];
			return data.rotulos[i];
		} 
}

function posToPeso(origemX, origemY, destinoX, destinoY){
	if (origemX != destinoX && origemY != destinoY){
			return data.diagonal;
	} else return data.linha;
}


function populaOrigem(){
	let i = 0;
	var select = document.getElementById("origem");
	for (; i < data.colunas; i++){
		select.options[select.options.length] = new Option(data.rotulos[i], data.rotulos[i]);
	
	}
	populaDestino()
}

function populaDestino(){
	let i = 0;
	let e = document.getElementById("origem");
	origem = e.options[e.selectedIndex].value;	
	
	var select = document.getElementById("destino");
	for (; i < data.colunas; i++){
		if (data.rotulos[i] != origem){
			select.options[select.options.length] = new Option(data.rotulos[i], data.rotulos[i]);
		}
	}
	
}

function menorDistancia(){
	 
	 //seleciona os vertices de origem e destino
	 let e = document.getElementById("origem");
	 origem = e.options[e.selectedIndex].value;
	 e = document.getElementById("destino");
	 destino = e.options[e.selectedIndex].value;
	 
	 //calcula menor distancia
	 var mdistancia = data.g.djikstraAlgorithm(origem)[destino] 
	 
	 //atualiza na pagina
	 document.getElementById("mdistancia").innerHTML = mdistancia.toFixed(2)
	 document.getElementById("talgoritmo").innerHTML = "Djikstra" 
	 
		
}



function distanciaManhattan(){
	// captura informacoes de origem e destino
	let e = document.getElementById("origem");
	origem = e.options[e.selectedIndex].value;
	e = document.getElementById("destino");
	destino = e.options[e.selectedIndex].value;
	
	origem = retornaCoordenadas(origem);
	destino = retornaCoordenadas(destino);
	
	var manhattan = Math.abs(origem.x - destino.x) + Math.abs(origem.y - destino.y)		
	
	document.getElementById("manhattan").innerHTML = manhattan
}


function retornaCoordenadas(rotulo){
	var coordenadas = {'A':{x:0, y:0}, 
					   'B':{x:0, y:1}, 
					   'C':{x:0, y:2},
					   'D':{x:1, y:0},
					   'E':{x:1, y:1},
					   'F':{x:1, y:2},
					   'G':{x:2, y:0},
					   'H':{x:2, y:1},
					   'I':{x:2, y:2},
					   'J':{x:3, y:0},
					   'K':{x:3, y:1},
					   'L':{x:3, y:2},
					   'M':{x:4, y:0},
					   'N':{x:4, y:1},
					   'O':{x:4, y:2},
					   'P':{x:5, y:0},
					   'Q':{x:5, y:1},
					   'R':{x:5, y:2},
					   }
	
	return coordenadas[rotulo]
}


// Estruturas de Dados

class Graph {
   constructor() {
      this.edges = {};
      this.nodes = [];
   }

   addNode(node) {
      this.nodes.push(node);
      this.edges[node] = [];
   }

   addEdge(node1, node2, weight = 1) {
      this.edges[node1].push({ node: node2, weight: weight });
      this.edges[node2].push({ node: node1, weight: weight });
   }

   addDirectedEdge(node1, node2, weight = 1) {
      this.edges[node1].push({ node: node2, weight: weight });
   }


   display() {
      let graph = "";
      this.nodes.forEach(node => {
         graph += node + "->" + this.edges[node].map(n => n.node).join(", ") + "\n";
      });
      console.log(graph);
   }

   BFS(node) {
      let q = new Queue(this.nodes.length);
      let explored = new Set();
      q.enqueue(node);
      explored.add(node);
      while (!q.isEmpty()) {
         let t = q.dequeue();
         console.log(t);
         this.edges[t].filter(n => !explored.has(n)).forEach(n => {
            explored.add(n);
            q.enqueue(n);
         });
      }
   }

   DFS(node) {
      // Create a Stack and add our initial node in it
      let s = new Stack(this.nodes.length);
      let explored = new Set();
      s.push(node);

      // Mark the first node as explored
      explored.add(node);

      // We'll continue till our Stack gets empty
      while (!s.isEmpty()) {
         let t = s.pop();

         // Log every element that comes out of the Stack
         console.log(t);

         // 1. In the edges object, we search for nodes this node is directly connected to.
         // 2. We filter out the nodes that have already been explored.
         // 3. Then we mark each unexplored node as explored and push it to the Stack.
         this.edges[t].filter(n => !explored.has(n)).forEach(n => {
            explored.add(n);
            s.push(n);
         });
      }
   }

   topologicalSortHelper(node, explored, s) {
      explored.add(node);
      this.edges[node].forEach(n => {
         if (!explored.has(n)) {
            this.topologicalSortHelper(n, explored, s);
         }
      });
      s.push(node);
   }

   topologicalSort() {
      // Create a Stack and add our initial node in it
      let s = new Stack(this.nodes.length);
      let explored = new Set();
      this.nodes.forEach(node => {
         if (!explored.has(node)) {
            this.topologicalSortHelper(node, explored, s);
         }
      });
      while (!s.isEmpty()) {
         console.log(s.pop());
      }
   }

   BFSShortestPath(n1, n2) {
      let q = new Queue(this.nodes.length);
      let explored = new Set();
      let distances = { n1: 0 };
      q.enqueue(n1);
      explored.add(n1);
      while (!q.isEmpty()) {
         let t = q.dequeue();
         this.edges[t].filter(n => !explored.has(n)).forEach(n => {
            explored.add(n);
            distances[n] = distances[t] == undefined ? 1 : distances[t] + 1;
            q.enqueue(n);
         });
      }
      return distances[n2];
   }

   primsMST() {
      // Initialize graph that'll contain the MST
      const MST = new Graph();
      if (this.nodes.length === 0) {
         return MST;
      }

      // Select first node as starting node
      let s = this.nodes[0];

      // Create a Priority Queue and explored set
      let edgeQueue = new PriorityQueue(this.nodes.length * this.nodes.length);
      let explored = new Set();
      explored.add(s);
      MST.addNode(s);

      // Add all edges from this starting node to the PQ taking weights as priority
      this.edges[s].forEach(edge => {
         edgeQueue.enqueue([s, edge.node], edge.weight);
      });

      // Take the smallest edge and add that to the new graph
      let currentMinEdge = edgeQueue.dequeue();
      while (!edgeQueue.isEmpty()) {
         // COntinue removing edges till we get an edge with an unexplored node
         while (!edgeQueue.isEmpty() && explored.has(currentMinEdge.data[1])) {
            currentMinEdge = edgeQueue.dequeue();
         }
         let nextNode = currentMinEdge.data[1];
         // Check again as queue might get empty without giving back unexplored element
         if (!explored.has(nextNode)) {
            MST.addNode(nextNode);
            MST.addEdge(currentMinEdge.data[0], nextNode, currentMinEdge.priority);

            // Again add all edges to the PQ
            this.edges[nextNode].forEach(edge => {
               edgeQueue.enqueue([nextNode, edge.node], edge.weight);
            });

            // Mark this node as explored
            explored.add(nextNode);
            s = nextNode;
         }
      }
      return MST;
   }

   kruskalsMST() {
      // Initialize graph that'll contain the MST
      const MST = new Graph();

      this.nodes.forEach(node => MST.addNode(node));
      if (this.nodes.length === 0) {
         return MST;
      }

      // Create a Priority Queue
      let edgeQueue = new PriorityQueue(this.nodes.length * this.nodes.length);

      // Add all edges to the Queue:
      for (let node in this.edges) {
         this.edges[node].forEach(edge => {
            edgeQueue.enqueue([node, edge.node], edge.weight);
         });
      }
      let uf = new UnionFind(this.nodes);

      // Loop until either we explore all nodes or queue is empty
      while (!edgeQueue.isEmpty()) {
         // Get the edge data using destructuring
         let nextEdge = edgeQueue.dequeue();
         let nodes = nextEdge.data;
         let weight = nextEdge.priority;

         if (!uf.connected(nodes[0], nodes[1])) {
            MST.addEdge(nodes[0], nodes[1], weight);
            uf.union(nodes[0], nodes[1]);
         }
      }
      return MST;
   }

   djikstraAlgorithm(startNode) {
      let distances = {};

      // Stores the reference to previous nodes
      let prev = {};
      let pq = new PriorityQueue(this.nodes.length * this.nodes.length);

      // Set distances to all nodes to be infinite except startNode
      distances[startNode] = 0;
      pq.enqueue(startNode, 0);

      this.nodes.forEach(node => {
         if (node !== startNode) distances[node] = Infinity;
         prev[node] = null;
      });

      while (!pq.isEmpty()) {
         let minNode = pq.dequeue();
         let currNode = minNode.data;
         let weight = minNode.priority;

         this.edges[currNode].forEach(neighbor => {
            let alt = distances[currNode] + neighbor.weight;
            if (alt < distances[neighbor.node]) {
               distances[neighbor.node] = alt;
               prev[neighbor.node] = currNode;
               pq.enqueue(neighbor.node, distances[neighbor.node]);
            }
         });
      }
      return distances;
   }

   floydWarshallAlgorithm() {
      let dist = {};
      for (let i = 0; i < this.nodes.length; i++) {
         dist[this.nodes[i]] = {};

         // For existing edges assign the dist to be same as weight
         this.edges[this.nodes[i]].forEach(e => (dist[this.nodes[i]][e.node] = e.weight));

         this.nodes.forEach(n => {
            // For all other nodes assign it to infinity
            if (dist[this.nodes[i]][n] == undefined)
               dist[this.nodes[i]][n] = Infinity;
               // For self edge assign dist to be 0
               if (this.nodes[i] === n) dist[this.nodes[i]][n] = 0;
         });
      }

      this.nodes.forEach(i => {
         this.nodes.forEach(j => {
            this.nodes.forEach(k => {
               // Check if going from i to k then from k to j is better
               // than directly going from i to j. If yes then update
               // i to j value to the new value
               if (dist[i][k] + dist[k][j] < dist[i][j])
                  dist[i][j] = dist[i][k] + dist[k][j];
            });
         });
      });
      return dist;
   }
}

class UnionFind {
   constructor(elements) {
      // Number of disconnected components
      this.count = elements.length;

      // Keep Track of connected components
      this.parent = {};
      // Initialize the data structure such that all elements have themselves as parents
      elements.forEach(e => (this.parent[e] = e));
   }

   union(a, b) {
      let rootA = this.find(a);
      let rootB = this.find(b);

      // Roots are same so these are already connected.
      if (rootA === rootB) return;

      // Always make the element with smaller root the parent.
      if (rootA < rootB) {
         if (this.parent[b] != b) this.union(this.parent[b], a);
         this.parent[b] = this.parent[a];
      } else {
         if (this.parent[a] != a) this.union(this.parent[a], b);
         this.parent[a] = this.parent[b];
      }
   }

   // Returns final parent of a node
   find(a) {
      while (this.parent[a] !== a) {
         a = this.parent[a];
      }
      return a;
   }

   // Checks connectivity of the 2 nodes
   connected(a, b) {
      return this.find(a) === this.find(b);
   }
}

class Queue {
   constructor(maxSize) {
      // Set default max size if not provided
      if (isNaN(maxSize)) {
         maxSize = 10;
       }
      this.maxSize = maxSize;
      // Init an array that'll contain the queue values.
      this.container = [];
   }
   // Helper function to display all values while developing
   display() {
      console.log(this.container);
   }
   // Checks if queue is empty
   isEmpty(){
      return this.container.length === 0;
   }
   // checks if queue is full
   isFull() {
      return this.container.length >= this.maxSize;
   }
}

class PriorityQueue {
   constructor(maxSize) {
      // Set default max size if not provided
      if (isNaN(maxSize)) {
         maxSize = 10;
       }
      this.maxSize = maxSize;
      // Init an array that'll contain the queue values.
      this.container = [];
   }
   // Helper function to display all values while developing
   display() {
      console.log(this.container);
   }
   // Checks if queue is empty
   isEmpty() {
      return this.container.length === 0;
   }
   // checks if queue is full
   isFull() {
      return this.container.length >= this.maxSize;
   }
   enqueue(data, priority) {
      // Check if Queue is full
      if (this.isFull()) {
         console.log("Queue Overflow!");
         return;
      }
      let currElem = new this.Element(data, priority);
      let addedFlag = false;
      // Since we want to add elements to end, we'll just push them.
      for (let i = 0; i < this.container.length; i++) {
         if (currElem.priority < this.container[i].priority) {
            this.container.splice(i, 0, currElem);
            addedFlag = true; break;
         }
      }
      if (!addedFlag) {
         this.container.push(currElem);
      }
   }
   dequeue() {
   // Check if empty
   if (this.isEmpty()) {
      console.log("Queue Underflow!");
      return;
   }
   return this.container.pop();
}
peek() {
   if (isEmpty()) {
      console.log("Queue Underflow!");
      return;
   }
   return this.container[this.container.length - 1];
}
clear() {
   this.container = [];
   }
}
// Create an inner class that we'll use to create new nodes in the queue
// Each element has some data and a priority
PriorityQueue.prototype.Element = class {
   constructor(data, priority) {
      this.data = data;
      this.priority = priority;
   }
};

class Stack {
   constructor(maxSize) { // Set default max size if not provided
      if (isNaN(maxSize)) {
         maxSize = 10;
      }
      this.maxSize = maxSize; // Init an array that'll contain the stack values.
      this.container = [];
   }
   display() {
      console.log(this.container);
   }
   isEmpty() {
      return this.container.length === 0;
   }
   isFull() {
      return this.container.length >= this.maxSize;
   }
   push(element) { // Check if stack is full
      if (this.isFull()) {
         console.log("Stack Overflow!");
      }
      this.container.push(element)
   }
   pop() { // Check if empty
      if (this.isEmpty()) {
         console.log("Stack Underflow!");
      }
      this.container.pop()
   }
   peek() {
      if (isEmpty()) {
         console.log("Stack Underflow!");
      }
      return this.container[this.container.length - 1];
   }
   clear() {
      this.container = [];
   }
}


setupCanvas();
