var xmlHttp;
const URI_COMENTARIOS = "http://10.1.2.10:8081/cfticionic/comentarios/foto?key=";


function obtener_comentarios() {
    var token = localStorage.getItem("usuario");
    var idfoto = parseInt(localStorage.getItem("id_foto")) + 1;
    var uri = URI_COMENTARIOS + token + "&idfoto=" + id_foto;;
    cargarComentarios(uri);
}
function cargarComentarios(uri) {
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = procesarComentarios;
    xmlHttp.open('GET', uri, true);
    xmlHttp.send(null);

}
function procesarComentarios() {
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
            var cuerpo = xmlHttp.responseText;
            objeto_js = JSON.parse(cuerpo);
            mostrarComentarios(objeto_js);
        } else if (xmlHttp.status == 204) {
            alert("No hay comentarios");
        } else {
            console.log("error " + xmlHttp.status);
        }
    }
}

function mostrarComentarios(objeto_js) {

    var comentarios = document.getElementById("comentarios");
    while (comentarios.hasChildNodes()) {
        comentarios.removeChild(comentarios.firstChild);
    }

    var comentarios = document.getElementById("comentarios");

    for (var i = 0; i < objeto_js.length; i++) {
        var comentario = document.createElement("div");
        comentario.setAttribute("id", objeto_js[i].id);
        comentario.setAttribute("class", "comentario");

        var text_node = document.createTextNode(objeto_js[i].texto);
        var opinion = document.createElement("div");
        opinion.setAttribute("id", "idopinion-" + objeto_js[i].id);
        if (objeto_js[i].autor == localStorage.getItem("nombre")) {
            opinion.setAttribute("contenteditable", true);
        }
        opinion.appendChild(text_node);

        var text_node2 = document.createTextNode(new Date(objeto_js[i].momento).toDateString());
        var momento = document.createElement("div");
        momento.setAttribute("id", "idmomento");
        momento.appendChild(text_node2);

        var text_node3 = document.createTextNode(objeto_js[i].autor);
        var autor = document.createElement("div");
        autor.setAttribute("id", "idautor");
        autor.appendChild(text_node3);

        const button = document.createElement('button');
        button.type = 'button';
        button.innerText = 'Eliminar';
        button.id = objeto_js[i].id;
        button.addEventListener("click", eliminarComentario);
        button.setAttribute("class","botones");

        const button_modificar = document.createElement('button');
        button_modificar.type = 'button';
        button_modificar.innerText = 'Modificar';
        button_modificar.id = objeto_js[i].id;
        button_modificar.addEventListener("click", modificarComentario);
        button_modificar.setAttribute("class","botones");

        var br = document.createElement("br");
        comentario.appendChild(opinion);
        comentario.appendChild(momento);
        comentario.appendChild(autor);
        comentario.appendChild(button);
        comentario.appendChild(button_modificar);
        comentario.appendChild(br);
        comentarios.appendChild(comentario);
    }
}