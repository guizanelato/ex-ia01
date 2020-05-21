class Vertice {

  constructor(nome) {
    this.nome = nome;
    this.adjacencias = {};
    this.peso = 0
  }
  addAdjacencia(vertice) {
    this.adjacencia.push(nome:vertice.nome, peso:vertice.peso);
  }

  setPeso(peso){
	this.peso = peso;
  }

  setNome(nome){
	this.nome = nome;  
  }
  
  retornaVertice(){
	return this  
	  
  }

}

class Grafo {
	
	constructor(){
		this.vertice_inicial = null;
		this.vertice_final = null;
		this.vertice_custo = 0;
		this.vertice_atual = null;
		this.grafo = [];
		
	}
	
	setVerticeInicial(vertice){
		this.vertice_inicial = vertice;
	}
	
	atualizaCusto(custo){
		this.vertice_custo += custo;
		
	}
	
	trocaVertice(vertice){
		this.vertice_atual = vertice;	
	}
}

