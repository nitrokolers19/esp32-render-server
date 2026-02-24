//Variables de controles
var jtbAngulo;
var jtbAngulo2;
var jtbAngulo3;
var jtbAngulo4;
var jtbAngulo5;
var jtbAngulo6;
var jtbAngulo7;
var jlbSeno;

//Funciones
function _init(){
	//Iniciar variables
	jtbAngulo  = document.getElementById("jtbAngulo");
	jtbAngulo2 = document.getElementById("jtbAngulo2");
	jtbAngulo3 = document.getElementById("jtbAngulo3");
    jtbAngulo4 = document.getElementById("jtbAngulo4");
    jtbAngulo5 = document.getElementById("jtbAngulo5");
    jtbAngulo6 = document.getElementById("jtbAngulo6");
    jtbAngulo7 = document.getElementById("jtbAngulo7");
	jlbSeno = document.getElementById("jlbSeno");

	
	//Asignar Eventos
	jtbAngulo.addEventListener("change", enviarAngulos);
	jtbAngulo2.addEventListener("change", enviarAngulos);
	jtbAngulo3.addEventListener("change", enviarAngulos);
    jtbAngulo4.addEventListener("change", enviarAngulos);
    jtbAngulo5.addEventListener("change", enviarAngulos);
    jtbAngulo6.addEventListener("change", enviarAngulos);
    jtbAngulo7.addEventListener("change", enviarAngulos);
}

//Enviar solicitud
function enviarAngulos(){
	let a1 = Number(jtbAngulo.value);
	let a2 = Number(jtbAngulo2.value);
	let a3 = Number(jtbAngulo3.value);
    let a4 = Number(jtbAngulo4.value);
    let a5 = Number(jtbAngulo5.value);
    let a6 = Number(jtbAngulo6.value);
    let a7 = Number(jtbAngulo7.value);

	let url = window.location.origin + "/WebService1/HTTPMethod_1?"
	        + "a1=" + a1 + "&a2=" + a2 + "&a3=" + a3 + "&a4=" + a4 + "&a5=" + a5 + "&a6=" + a6 + "&a7=" + a7;

	let solicitud = new XMLHttpRequest();
	
	solicitud.addEventListener("load", mostrarAngulos);
	solicitud.open("GET", url, true);
	solicitud.send(null);
}

// Mostrar valores recibidos 
function mostrarAngulos(evento){
    let datos = evento.target;

    if(datos.status == 200){
        console.log("Respuesta recibida =", datos.responseText);

        let obj = JSON.parse(datos.responseText);

        jlbSeno.innerHTML =
            "Angulo 1 = " + obj.Angulo1 + "<br>" +
            "Angulo 2 = " + obj.Angulo2 + "<br>" +
            "Angulo 3 = " + obj.Angulo3 + "<br>" +
            "Angulo 4 = " + obj.Angulo4 + "<br>" +
            "Angulo 5 = " + obj.Angulo5 + "<br>" +
            "Angulo 6 = " + obj.Angulo6 + "<br>" +
            "Angulo 7 = " + obj.Angulo7;

        // ===== Enviar a la ESP32 =====
        enviarAESP32(obj.Angulo1, obj.Angulo2, obj.Angulo3, obj.Angulo4, obj.Angulo5, obj.Angulo6, obj.Angulo7);
    }
}

function enviarAESP32(a1,a2,a3,a4,a5,a6,a7){

fetch("https://esp32-server-m0a6.onrender.com/setAngles", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    a1,a2,a3,a4,a5,a6,a7
  })
});
}


//Eventos
window.addEventListener("load", _init);
