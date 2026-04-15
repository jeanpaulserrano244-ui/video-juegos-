class listaComentarios {
    constructor() {
        this.comentario = [];
        this.storageKey = 'videojuegosComentarios';
    }

    cargarComentarios() {
        const saved = localStorage.getItem(this.storageKey);
        this.comentario = saved ? JSON.parse(saved) : [];
        this.mostrarComentarios();
    }

    guardarComentarios() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.comentario));
    }

    agregarComentario(descripcion) {
        const nuevoComentario = {
            id: Date.now().toString(),
            descripcion,
        };
        this.comentario.push(nuevoComentario);
        this.guardarComentarios();
        this.mostrarComentarios();
    }

    eliminarComentario(id) {
        this.comentario = this.comentario.filter((comentario) => comentario.id !== id);
        this.guardarComentarios();
        this.mostrarComentarios();
    }

    mostrarComentarios() {
        const commentList = document.getElementById('commentList');
        commentList.innerHTML = '';
        this.comentario.forEach((comentario) => {
            const li = document.createElement('li');
            li.textContent = comentario.descripcion;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => this.eliminarComentario(comentario.id));

            li.appendChild(deleteButton);
            commentList.appendChild(li);
        });
    }
}

const listacomentarios = new listaComentarios();

window.addEventListener('DOMContentLoaded', () => {
    listacomentarios.cargarComentarios();

    document.getElementById('commentForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const commentInput = document.getElementById('commentInput');
        const descripcion = commentInput.value.trim();

        if (descripcion) {
            listacomentarios.agregarComentario(descripcion);
            commentInput.value = '';
        }
    });
});