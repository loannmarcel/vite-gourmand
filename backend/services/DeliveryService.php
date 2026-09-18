<?php

class DeliveryService
{
    private const BASE_DELIVERY_PRICE = 5.00;
    private const PRICE_PER_KM = 0.59;
    private const START_LATITUDE = 44.8378;
    private const START_LONGITUDE = -0.5792;

    private array $config;

    public function __construct()
    {
        $apiKey = $_ENV['ORS_API_KEY'] ?? '';

        if ($apiKey === '') {
            throw new RuntimeException(
                'La clé OpenRouteService est manquante.'
            );
        }

        $this->config = [
            'api_key' => $apiKey
        ];
    }

    public function calculateDeliveryPrice(
        string $address,
        string $postalCode,
        string $city
    ): float {
        $normalizedCity = mb_strtolower(trim($city));

        if ($normalizedCity === 'bordeaux') {
            return self::BASE_DELIVERY_PRICE;
        }

        $coordinates = $this->geocodeAddress(
            $address,
            $postalCode,
            $city
        );

        $distanceKm = $this->getDrivingDistance(
            $coordinates['longitude'],
            $coordinates['latitude']
        );

        return round(
            self::BASE_DELIVERY_PRICE
            + ($distanceKm * self::PRICE_PER_KM),
            2
        );
    }

    private function geocodeAddress(
        string $address,
        string $postalCode,
        string $city
    ): array {
        $fullAddress = trim(
            $address . ', ' .
            $postalCode . ' ' .
            $city . ', France'
        );

        $url = 'https://api.heigit.org/pelias/v1/search?' . http_build_query([
            'api_key' => $this->config['api_key'],
            'text' => $fullAddress,
            'size' => 1
        ]);

        $response = file_get_contents($url);

        if ($response === false) {
            throw new RuntimeException(
                'Impossible de géolocaliser l’adresse de livraison.'
            );
        }

        $data = json_decode($response, true);

        if (
            !isset($data['features'][0]['geometry']['coordinates'][0],
                $data['features'][0]['geometry']['coordinates'][1])
        ) {
            throw new RuntimeException(
                'Adresse de livraison introuvable.'
            );
        }

        return [
            'longitude' => (float) $data['features'][0]['geometry']['coordinates'][0],
            'latitude' => (float) $data['features'][0]['geometry']['coordinates'][1]
        ];
    }

    private function getDrivingDistance(
        float $destinationLongitude,
        float $destinationLatitude
    ): float {
        $url = 'https://api.heigit.org/openrouteservice/v2/directions/driving-car';

        $payload = json_encode([
            'coordinates' => [
                [
                    self::START_LONGITUDE,
                    self::START_LATITUDE
                ],
                [
                    $destinationLongitude,
                    $destinationLatitude
                ]
            ]
        ]);

        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' =>
                    "Authorization: " . $this->config['api_key'] . "\r\n" .
                    "Content-Type: application/json\r\n",
                'content' => $payload,
                'ignore_errors' => true
            ]
        ]);

        $response = file_get_contents($url, false, $context);

        if ($response === false) {
            throw new RuntimeException(
                'Impossible de calculer la distance de livraison.'
            );
        }

        $data = json_decode($response, true);

        if (!isset($data['routes'][0]['summary']['distance'])) {
            throw new RuntimeException(
                'Distance de livraison introuvable.'
            );
        }

        $distanceMeters = (float) $data['routes'][0]['summary']['distance'];

        return $distanceMeters / 1000;
    }

}