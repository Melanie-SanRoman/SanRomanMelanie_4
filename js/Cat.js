class Cat extends Personaje {

    static ESTADOS = Object.freeze({
        IDLE: "idle",
        WALK: "walk",
        RUN: "run",
        JUMP: "jump",
        FALL: "fall",
        ATTACK: "attack",
        DOUBLE_JUMP: "doubleJump"
    });

    constructor() {
        super();
        this.personaje = document.getElementById("cat");
        this.double_jump = false;
    }

    /**
     * Metodo que retorna la posicion del personaje
     * @returns 
     */
    status() {
        return this.personaje.getBoundingClientRect();
    }

    /**
     * Metodo que permite sentar el personaje
     */
    idle() {
        this.clean();
        this.personaje.classList.add("catIdle");
        this.setEstado(Cat.ESTADOS.IDLE);
    } // CAT IDLE

    /**
     * Metodo que permite que el personaje camine
     */
    walk() {
        this.clean();
        this.personaje.classList.add("catWalk");
        this.setEstado(Cat.ESTADOS.WALK);
    } // CAT WALK

    /**
     * Metodo que permite que el personaje salte
     */
    jump() {
        this.clean();
        this.personaje.classList.add("catJump");

        this.personaje.addEventListener("animationend", () => {
            this.fall();
        }, { once: true });
    } // CAT JUMP

    /**
     * Metodo que permite que el personaje haga un doble salto
     */
    doubleJump() {
        this.clean();
        this.personaje.classList.add("catDoubleJump");
        this.double_jump = true;

        this.personaje.addEventListener("animationend", () => {
            this.fall();
        }, { once: true }); 
    } // CAT DOUBLE JUMP

    /**
     * Metodo que permite que el personaje caiga
     */
    fall() {
        if (this.double_jump) {
            this.personaje.classList.add("doubleFall");
        }
        else {
            this.personaje.classList.add("fall");
        }

        this.personaje.addEventListener("animationend", () => {

            if (this.getEstado() === Cat.ESTADOS.RUN) {
                this.run();
            }
            else {
                this.walk();
            }
        }, { once: true });
    } // CAT FALL

    /**
     * Metodo que permite que el personaje corra
     */
    run() {
        this.clean()
        this.personaje.classList.add("catRun");
        this.setEstado(Cat.ESTADOS.RUN);
    } // CAT RUN

    /**
     * Metodo que permite que el personaje ataque
     */
    attack() {
        this.clean()
        this.personaje.classList.add("catAttack");
        this.setEstado(Cat.ESTADOS.ATTACK);
    } // CAT ATTACK

    /**
     * Metodo que limpia las clases
     */
    clean() {
        const clases = ["catWalk", "catJump", "catDoubleJump", "fall", "doubleFall", "catRun"];
        this.personaje.classList.remove(...clases);
        this.personaje.style.transform = "none";
        this.double_jump = false;
    } // CLEAN CLASS

    /**
     * Metodo que setea el estado del personaje
     */
    setEstado(nuevoEstado) {
        if (!Object.values(Cat.ESTADOS).includes(nuevoEstado)) {
            console.warn(`Estado inválido: ${nuevoEstado}`);
            return;
        }
        this.personaje.dataset.estado = nuevoEstado;
    }

    /**
     * Metodo que retorna el estado del personaje
     * @returns 
     */
    getEstado() {
        return this.personaje.dataset.estado;
    }
}