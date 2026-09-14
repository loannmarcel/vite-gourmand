<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/database.php";

if (
    !isset($_SESSION["user_id"]) ||
    !isset($_SESSION["user_role"])
) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Vous devez être connecté."
    ]);

    exit;
}

if (
    $_SESSION["user_role"] !== "employee" &&
    $_SESSION["user_role"] !== "admin"
) {
    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Accès refusé."
    ]);

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Méthode non autorisée."
    ]);

    exit;
}

$menuId =
    (int) ($_POST["menu_id"] ?? 0);

if ($menuId <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Menu invalide."
    ]);

    exit;
}

if (!isset($_FILES["image"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Aucun fichier image reçu."
    ]);

    exit;
}

if ($_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);

    $uploadErrorMessages = [
        UPLOAD_ERR_INI_SIZE =>
            "L'image est trop volumineuse.",
        UPLOAD_ERR_FORM_SIZE =>
            "L'image est trop volumineuse.",
        UPLOAD_ERR_PARTIAL =>
            "L'image n'a été que partiellement envoyée.",
        UPLOAD_ERR_NO_FILE =>
            "Aucune image n'a été envoyée."
    ];

    $message =
        $uploadErrorMessages[$_FILES["image"]["error"]]
        ?? "Une erreur est survenue lors de l'envoi de l'image.";

    echo json_encode([
        "success" => false,
        "message" => $message
    ]);

    exit;
}

$image =
    $_FILES["image"];

$allowedMimeTypes = [
    "image/jpeg" => "jpg",
    "image/png" => "png",
    "image/webp" => "webp"
];

$finfo =
    new finfo(FILEINFO_MIME_TYPE);

$mimeType =
    $finfo->file($image["tmp_name"]);

if (!isset($allowedMimeTypes[$mimeType])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Format d'image non autorisé."
    ]);

    exit;
}

$extension =
    $allowedMimeTypes[$mimeType];

$fileName =
    "menu-" .
    $menuId .
    "-" .
    bin2hex(random_bytes(8)) .
    "." .
    $extension;

$uploadDirectory =
    __DIR__ . "/../uploads/menus/";

$filePath =
    $uploadDirectory . $fileName;

if (
    !move_uploaded_file(
        $image["tmp_name"],
        $filePath
    )
) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Impossible d'enregistrer l'image."
    ]);

    exit;
}

$databasePath =
    "backend/uploads/menus/" .
    $fileName;

try {

    $existingStatement = $pdo->prepare(
        "SELECT id, image_path
         FROM menu_images
         WHERE menu_id = :menu_id
         ORDER BY position_order ASC, id ASC
         LIMIT 1"
    );

    $existingStatement->execute([
        "menu_id" => $menuId
    ]);

    $existingImage =
        $existingStatement->fetch(PDO::FETCH_ASSOC);


    if ($existingImage) {

        $statement = $pdo->prepare(
            "UPDATE menu_images
             SET image_path = :image_path,
                 alt_text = :alt_text,
                 position_order = 1
             WHERE id = :image_id"
        );

        $statement->execute([
            "image_path" => $databasePath,
            "alt_text" => "Image du menu",
            "image_id" => $existingImage["id"]
        ]);

    } else {

        $statement = $pdo->prepare(
            "INSERT INTO menu_images (
                menu_id,
                image_path,
                alt_text,
                position_order
            )
            VALUES (
                :menu_id,
                :image_path,
                :alt_text,
                1
            )"
        );

        $statement->execute([
            "menu_id" => $menuId,
            "image_path" => $databasePath,
            "alt_text" => "Image du menu"
        ]);
    }


    echo json_encode([
        "success" => true,
        "message" => "Image enregistrée avec succès.",
        "image_path" => $databasePath
    ]);

} catch (PDOException $error) {

    if (file_exists($filePath)) {
        unlink($filePath);
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue."
    ]);
}