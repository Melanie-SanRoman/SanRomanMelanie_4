class Objetivo extends Personaje {

    constructor(tipo) {
        super();
        this.obj = document.createElement("div");
        this.obj.id = 'objetivo';

        if (tipo == "bird") {    
            this.obj.classList.add("birdFly");
        }
        else {
            this.obj.classList.add("bonus");
        }
        
        // Dos alturas posibles
        const heights = ['35%', '55%'];
        const heightSelec = heights[Math.floor(Math.random() * heights.length)];
        this.obj.style.bottom = heightSelec;

        document.getElementById("contenedor").appendChild(this.obj);

        setTimeout(() => {
            if (this.obj.classList.contains('paused')){
                this.obj.remove();
            };
        }, 6000);
    }

    /**
     * Metodo que permite cazar al pajaro
     */
    dead() {
        this.obj.classList.remove('birdFly');
        this.obj.classList.add('birdDead');
        setTimeout(() => {
            this.obj.remove();
        }, 1000);
    }
}