<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../services/MailerService.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);

    exit;
}


$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');


if (
    $name === '' ||
    $email === '' ||
    $subject === '' ||
    $message === ''
) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Tous les champs sont obligatoires.'
    ]);

    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Adresse e-mail invalide.'
    ]);

    exit;
}

try {

    MailerService::send(
        'loannmarcel@outlook.fr',
        'Vite & Gourmand',
        'Contact - ' . $subject,
        '<h1>Nouveau message de contact</h1>
        <p><strong>Nom :</strong> '
            . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') .
        '</p>
        <p><strong>Adresse e-mail :</strong> '
            . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') .
        '</p>
        <p><strong>Sujet :</strong> '
            . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') .
        '</p>
        <p><strong>Message :</strong></p>
        <p>'
            . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) .
        '</p>'
    );


    echo json_encode([
        'success' => true,
        'message' => 'Votre message a bien été envoyé.'
    ]);


} catch (Throwable $error) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Impossible d’envoyer votre message. Veuillez réessayer.'
    ]);
}