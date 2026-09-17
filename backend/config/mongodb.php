<?php

try {
    $mongoManager = new MongoDB\Driver\Manager(
        "mongodb://127.0.0.1:27017"
    );
} catch (MongoDB\Driver\Exception\Exception $error) {
    throw new RuntimeException(
        "Impossible de se connecter à MongoDB."
    );
}