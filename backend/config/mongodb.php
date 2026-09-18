<?php

$mongoUri = $_ENV['MONGODB_URI'] ?? 'mongodb://127.0.0.1:27017';

try {
    $mongoManager = new MongoDB\Driver\Manager($mongoUri);
} catch (MongoDB\Driver\Exception\Exception $error) {
    throw new RuntimeException(
        "Impossible de se connecter à MongoDB."
    );
}