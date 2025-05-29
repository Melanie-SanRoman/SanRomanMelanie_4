class Obstaculo extends Personaje {

    constructor() {
        super();
        this.obstaculo = document.createElement("div");
        this.obstaculo.classList.add("obstaculo");
        document.getElementById("contenedor").appendChild(this.obstaculo);

        setTimeout(() => {
            if (this.obstaculo.classList.contains('paused')){
                this.obstaculo.remove();
            };
        }, 7000);
    }
}