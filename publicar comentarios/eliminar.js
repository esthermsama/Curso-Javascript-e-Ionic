var xmlHttp;
const URI_ELIMINAR = "http://10.1.2.10:8081/cfticionic/comentario?key=";

var idcomentarioeliminado;

function eliminarComentario() {
    console.log("boton id tocado = " + this.id);

    var token = localStorage.getItem("usuario");
    var nombre = localStorage.getItem("nombre");
    var uri = URI_ELIMINAR + token + "&idcomentario=" + this.id + "&nombre=" + nombre;
    idcomentarioeliminado = this.id;
    console.log("uri " + uri);
    cargarEliminar(uri);
}
function cargarEliminar(uri) {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = procesarELiminar;
    xmlHttp.open('DELETE', uri, true);
    xmlHttp.send(null);

}
function procesarELiminar() {
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
            console.log("Eliminar  ");

            var div_comentario = document.getElementById(idcomentarioeliminado);
            while (div_comentario.hasChildNodes()) {
                div_comentario.removeChild(div_comentario.firstChild);
            }


        } else if (xmlHttp.status == 403) {

            alert("Solo puedes eliminar comentarios propios.")

        } else {
            console.log("error " + xmlHttp.status);
        }
    }
}

