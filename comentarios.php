<?php
header('Content-Type: application/json; charset=utf-8');
$filename = __DIR__ . '/comentarios.json';
if (!file_exists($filename)) {
    file_put_contents($filename, json_encode([]));
}

$comments = json_decode(file_get_contents($filename), true);
if (!is_array($comments)) {
    $comments = [];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode($comments, JSON_UNESCAPED_UNICODE);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = [];
}

if ($method === 'POST') {
    if (isset($input['action']) && $input['action'] === 'delete' && isset($input['id'])) {
        $comments = array_values(array_filter($comments, function ($comment) use ($input) {
            return !isset($comment['id']) || $comment['id'] !== $input['id'];
        }));
        file_put_contents($filename, json_encode($comments, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'comments' => $comments]);
        exit;
    }

    $descripcion = trim($input['descripcion'] ?? '');
    if ($descripcion === '') {
        http_response_code(400);
        echo json_encode(['error' => 'El comentario no puede estar vacío.']);
        exit;
    }

    $newComment = [
        'id' => uniqid('c', true),
        'descripcion' => $descripcion,
        'fecha' => date('c'),
    ];
    $comments[] = $newComment;
    file_put_contents($filename, json_encode($comments, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

    echo json_encode(['success' => true, 'comments' => $comments]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
exit;
