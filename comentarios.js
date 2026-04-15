class listaComentarios {
    constructor() {
        this.comentario = [];
        this.apiUrl = 'comentarios.php';
        this.errorElement = document.getElementById('commentError');
    }

    setError(mensaje) {
        if (this.errorElement) {
            this.errorElement.textContent = mensaje;
        } else {
            console.error(mensaje);
        }
    }

    clearError() {
        if (this.errorElement) {
            this.errorElement.textContent = '';
        }
    }

    async parseResponse(response) {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { error: text || response.statusText };
        }
    }

    isRunningFromFile() {
        return window.location.protocol === 'file:';
    }

    async cargarComentarios() {
        if (this.isRunningFromFile()) {
            this.setError('Abre esta página desde XAMPP. Usa http://localhost/video-juegos-/index.html');
            return;
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            const data = await this.parseResponse(response);
            if (!response.ok || data.error) {
                throw new Error(data.error || 'Error al cargar comentarios');
            }

            this.comentario = data;
            this.mostrarComentarios();
        } catch (error) {
            console.error(error);
            this.setError('No se pudieron cargar los comentarios. Abre la página desde XAMPP.');
        }
    }

    async agregarComentario(descripcion) {
        if (this.isRunningFromFile()) {
            this.setError('Abre esta página desde XAMPP. Usa http://localhost/video-juegos-/index.html');
            return;
        }

        try {
            this.clearError();
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descripcion }),
            });

            const data = await this.parseResponse(response);
            if (!response.ok || data.error) {
                throw new Error(data.error || 'Error al guardar el comentario');
            }

            this.comentario = data.comments || [];
            this.mostrarComentarios();
        } catch (error) {
            console.error(error);
            this.setError(error.message || 'No se pudo guardar el comentario. Intenta de nuevo.');
        }
    }

    async eliminarComentario(id) {
        try {
            this.clearError();
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id }),
            });

            const data = await this.parseResponse(response);
            if (!response.ok || data.error) {
                throw new Error(data.error || 'Error al eliminar el comentario');
            }

            this.comentario = data.comments || [];
            this.mostrarComentarios();
        } catch (error) {
            console.error(error);
            this.setError(error.message || 'No se pudo eliminar el comentario. Intenta de nuevo.');
        }
    }

    mostrarComentarios() {
        const commentList = document.getElementById('commentList');
        commentList.innerHTML = '';

        if (!this.comentario.length) {
            commentList.innerHTML = '<li>No hay comentarios aún.</li>';
            return;
        }

        this.comentario.forEach((comentario) => {
            const li = document.createElement('li');
            const texto = document.createElement('span');
            texto.textContent = comentario.descripcion;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.type = 'button';
            deleteButton.addEventListener('click', () => this.eliminarComentario(comentario.id));

            li.appendChild(texto);
            li.appendChild(deleteButton);
            commentList.appendChild(li);
        });
    }
}

const listacomentarios = new listaComentarios();

window.addEventListener('DOMContentLoaded', () => {
    listacomentarios.cargarComentarios();

    document.getElementById('commentForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const commentInput = document.getElementById('commentInput');
        const descripcion = commentInput.value.trim();

        if (descripcion) {
            await listacomentarios.agregarComentario(descripcion);
            commentInput.value = '';
        }
    });
});