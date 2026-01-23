/*
 * programa que mostra com es pot treballar amb l'API canvas
 * @author sergi.grau@fje.edu
 * @version 2.0
 * date 19.01.2017
 * format del document UTF-8
 *
 * CHANGELOG
 * 26.10.2017
 * - programa que mostra com es pot treballar amb l'API canvas
 * 23.01.2026 actualització codi bones pràctiques
 * NOTES
 * ORIGEN
 * Desenvolupament en entorn client. Escola del clot
 */

 window.onload = function(){

    const gespa = new Image();
    gespa.src = "../imatges/imgres.jpeg";
    gespa.onload = function() {
        dibuixar();
    }
    try {
        document.createElement("canvas").getContext("2d");
        //window.addEventListener("load", dibuixar, true);
    } catch (e) {
        document.getElementById("suport").innerHTML = "HTML5 Canvas no suportat.";
    }
    
    function dibuixarArbre(context) {
    
        context.beginPath();
        context.moveTo(-25, -50);
        context.lineTo(-10, -80);
        context.lineTo(-20, -80);
        context.lineTo(-5, -110);
        context.lineTo(-15, -110);
    
        context.lineTo(0, -140);
        context.lineTo(15, -110);
        context.lineTo(5, -110);
        context.lineTo(20, -80);
        context.lineTo(10, -80);
        context.lineTo(25, -50);
    
        context.closePath();
    }
    
    function dibuixarTronc(context) {
        const gradientTronc = context.createLinearGradient(-5, -50, 5, -50);
        gradientTronc.addColorStop(0, '#663300');
        gradientTronc.addColorStop(0.4, '#996600');
        gradientTronc.addColorStop(1, '#552200');
        context.fillStyle = gradientTronc;
        context.fillRect(-5, -50, 10, 50);
    }
    
    function dibuixarCami(context) {
    
        context.beginPath();
        context.moveTo(0, 0);
        context.quadraticCurveTo(170, -50, 260, -190);
        context.quadraticCurveTo(310, -250, 410, -250);
        context.strokeStyle = '#663300';
        context.lineWidth = 20;
    }
    
    function dibuixarOmbra(context) {
        const ombra = context.createLinearGradient(0, -50, 0, 0);
        ombra.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
        ombra.addColorStop(0.2, 'rgba(0, 0, 0, 0.0)');
        context.fillStyle = ombra;
        context.fillRect(-5, -50, 10, 50);
    }
    
    function dibuixar() {
        const canvas = document.getElementById('area');
        if(canvas.getContext) {
            const context = canvas.getContext('2d');
    
            //context.drawImage(gespa, 0, 0, 300, 300);
            context.fillStyle = context.createPattern(gespa, 'repeat');
            context.rect(0,0,300,300);
            context.fill();
    
            context.lineWidth = 4;
            context.lineJoin = 'round';
            context.strokeStyle = '#663300';
    
            context.save();
            context.translate(130, 250);
            dibuixarArbre(context);
    
            context.fillStyle = '#339900';
            context.fill();
    
            context.stroke();
    
            //tronc
            context.fillStyle = '#663300';
            dibuixarTronc(context);
            dibuixarOmbra(context);
    
            context.restore();
    
            context.save();
            context.translate(-10, 350);
            dibuixarCami(context);
            context.stroke();
            context.restore();
        }
    
    }
 }
