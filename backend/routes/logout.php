<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

$_SESSION = [];

session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Déconnexion réussie.'
]);