var xmlHttp;
const URI_PUBLICAR = "http://10.1.2.10:8081/cfticionic/comentario";


class Comentario{
    constructor(nombre, texto, token, idfoto) {
        this.nombre = nombre;
        this.texto = texto;
        this.token = token;
        this.idfoto = idfoto;
    }
}
function publicarComentario(){
    var token = localStorage.getItem("usuario");
    var texto = document.getElementById("texto").value;
    var idfoto = parseInt(localStorage.getItem("id_foto"));
    var nombre = localStorage.getItem("nombre");
    var comentario = new Comentario (nombre, texto , token, idfoto);
    console.log("Usuario "+ comentario.nombre + " Texto " + comentario.texto + " Token "+ comentario.token + " Foto " + comentario.idfoto);
    var json = JSON.stringify(comentario);
    cargarPublicacion(json);
}
function cargarPublicacion(json) {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = procesarPublicacion;
    xmlHttp.open("POST", URI_PUBLICAR, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(json);

}
function procesarPublicacion() {
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 201) {
            var cuerpo = xmlHttp.responseText;
            objeto_js = JSON.parse(cuerpo);
            console.log("Comentario  " + objeto_js.nombre + " " + objeto_js.texto);

        } else {
            console.log("error " + xmlHttp.status);
        }
    }
}