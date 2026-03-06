class comentarios {
    constructor(descripcion) {
        this.descripcion = descripcion;
        this.completado=false 
     }
    togglecompletado() {
        this.completado = !this.completado;
    }

}
class listaComentarios{
        constructor() {
        this.comentario = [];
        }
    agregarComentario(descripcion) {
        const nuevoComentario= new comentarios(descripcion)
        this.comentario.push(nuevoComentario);
        this.mostrarComentarios();
    }
    
    eliminarComentario(index) {
        this.comentario.splice(index,1);
        this.mostrarComentarios();
    }
    mostrarComentarios() {
        const commentList=document.getElementById("commentList");
        commentList.innerHTML="";
        this.comentario.forEach((comentario,index) => {
        const li = document.createElement("li");
   
        li.textContent = comentario.descripcion;
        if(comentario.completado) {
        li.style.textDecoration = "line-through";
        }
        const deletebutton = document.createElement("button");
        deletebutton.textContent = "Eliminar";
        deletebutton.addEventListener('click', () => this.eliminarComentario(index));
        
        li.appendChild(deletebutton);
        commentList.appendChild(li);
  });
 }
}
const listacomentarios=new listaComentarios();

document.getElementById("commentForm").addEventListener("submit",(event)=>{
    event.preventDefault();
    const commentinput=document.getElementById("commentInput");
    const descripcion=commentinput.value.trim();

    if(descripcion){
        listacomentarios.agregarComentario(descripcion);
        commentinput.value='';
    }
});