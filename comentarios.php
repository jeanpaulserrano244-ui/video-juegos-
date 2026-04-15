<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$db   = 'comentarios';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit;
}

$stmt = $pdo->query("SHOW COLUMNS FROM comentarios");
$columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
$textColumns = array_intersect(['descripcion', 'comentario'], $columns);
if (empty($textColumns)) {
    http_response_code(500);
    echo json_encode(['error' => 'La tabla comentarios no tiene columnas válidas para almacenar el texto.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, descripcion, fecha FROM comentarios ORDER BY fecha ASC');
    $comments = $stmt->fetchAll();
    echo json_encode($comments, JSON_UNESCAPED_UNICODE);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = [];
}

if ($method === 'POST') {
    if (isset($input['action']) && $input['action'] === 'delete' && isset($input['id'])) {
        $stmt = $pdo->prepare('DELETE FROM comentarios WHERE id = ?');
        $stmt->execute([$input['id']]);

        $stmt = $pdo->query('SELECT id, descripcion, fecha FROM comentarios ORDER BY fecha ASC');
        $comments = $stmt->fetchAll();
        echo json_encode(['success' => true, 'comments' => $comments], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $descripcion = trim($input['descripcion'] ?? '');
    if ($descripcion === '') {
        http_response_code(400);
        echo json_encode(['error' => 'El comentario no puede estar vacío.']);
        exit;
    }

    $insertColumns = [];
    $insertValues = [];
    foreach ($textColumns as $column) {
        $insertColumns[] = $column;
        $insertValues[] = $descripcion;
    }

    $columnsSql = implode(', ', $insertColumns);
    $placeholders = implode(', ', array_fill(0, count($insertColumns), '?'));
    $stmt = $pdo->prepare("INSERT INTO comentarios ($columnsSql) VALUES ($placeholders)");
    $stmt->execute($insertValues);

    $stmt = $pdo->query('SELECT id, descripcion, comentario, fecha FROM comentarios ORDER BY fecha ASC');
    $comments = $stmt->fetchAll();
    echo json_encode(['success' => true, 'comments' => $comments], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
exit;
