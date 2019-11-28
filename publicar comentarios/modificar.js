var xmlHttp;
const URI_MODIFICAR = "http://10.1.2.10:8081/cfticionic/comentario";

class ComentarioModificar{
    constructor(nombre, texto, token, idfoto, idcomentario) {
        this.nombre = nombre;
        this.texto = texto;
        this.token = token;
        this.idfoto = idfoto;
        this.idcomentario = idcomentario;
    }
}
var texto;
var id;
function modificarComentario(){

    id = this.id;
    var nombre = localStorage.getItem("nombre");
    var token = localStorage.getItem("usuario");
    texto = document.getElementById("idopinion-"+this.id).innerHTML;
    var idfoto = localStorage.getItem("id_foto");
    var comentario = new ComentarioModificar (nombre, texto, token, idfoto, this.id);
    var json = JSON.stringify(comentario);
    cargarModificar (json);
}


function cargarModificar(json) {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = procesarModificar;
    xmlHttp.open("PUT", URI_MODIFICAR, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(json);

}
function procesarModificar() {
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 201) {
            console.log("ha ido bien "+xmlHttp.status);
            var cuerpo = xmlHttp.responseText;
            objeto_js = JSON.parse(cuerpo);
            texto = document.getElementById("idopinion-"+id).innerHTML;
            console.log("texto"+texto);
            texto.innerHTML = texto;
        } else {
            console.log("error " + xmlHttp.status);
        }
    }
}

