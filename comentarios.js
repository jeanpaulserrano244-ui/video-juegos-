class listaComentarios {
    constructor() {
        this.comentario = [];
    }

    async cargarComentarios() {
        try {
            const response = await fetch('comentarios.php');
            if (!response.ok) {
                throw new Error('Error al cargar comentarios');
            }
            this.comentario = await response.json();
            this.mostrarComentarios();
        } catch (error) {
            console.error(error);
        }
    }

    async agregarComentario(descripcion) {
        try {
            const response = await fetch('comentarios.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descripcion }),
            });
            if (!response.ok) {
                throw new Error('Error al guardar el comentario');
            }
            const data = await response.json();
            this.comentario = data.comments;
            this.mostrarComentarios();
        } catch (error) {
            console.error(error);
        }
    }

    async eliminarComentario(id) {
        try {
            const response = await fetch('comentarios.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id }),
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el comentario');
            }
            const data = await response.json();
            this.comentario = data.comments;
            this.mostrarComentarios();
        } catch (error) {
            console.error(error);
        }
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