<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=86400');
header('X-Content-Type-Options: nosniff');

function respond(array $data, int $status = 200): never
{
	http_response_code($status);
	echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	exit;
}

function cityRow(array $row): array
{
	return [
		'id'          => (int) $row['id'],
		'name'        => (string) $row['name'],
		'admin'       => (string) $row['admin_name'],
		'country'     => (string) $row['country_name'],
		'countryCode' => (string) $row['country_code'],
		'latitude'    => (float) $row['latitude'],
		'longitude'   => (float) $row['longitude'],
		'timezone'    => (string) $row['timezone'],
	];
}

try {
	$db = new PDO('sqlite:' . dirname(__DIR__) . '/db/world_cities.db', null, null, [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	]);

	if (($_GET['action'] ?? '') === 'countries') {
		$rows = $db->query('SELECT code, name FROM country ORDER BY name COLLATE NOCASE')->fetchAll();
		respond($rows);
	}

	if (isset($_GET['lat'], $_GET['lon'])) {
		$latitude = filter_var($_GET['lat'], FILTER_VALIDATE_FLOAT);
		$longitude = filter_var($_GET['lon'], FILTER_VALIDATE_FLOAT);

		if ($latitude === false || $longitude === false || $latitude < -90 || $latitude > 90 || $longitude < -180 || $longitude > 180) {
			respond(['error' => 'Invalid coordinates.'], 400);
		}

		$longitudeFactor = max(0.15, cos(deg2rad((float) $latitude)));
		$sql = 'SELECT id, name, admin_name, country_name, country_code, latitude, longitude, timezone
			FROM city
			ORDER BY ((latitude - :lat) * (latitude - :lat))
				+ (((longitude - :lon) * :lon_factor) * ((longitude - :lon) * :lon_factor))
			LIMIT 1';
		$stmt = $db->prepare($sql);
		$stmt->execute([':lat' => $latitude, ':lon' => $longitude, ':lon_factor' => $longitudeFactor]);
		$row = $stmt->fetch();
		respond($row ? cityRow($row) : []);
	}

	$query = trim((string) ($_GET['q'] ?? ''));
	if (mb_strlen($query) < 2 || mb_strlen($query) > 80) {
		respond([]);
	}

	preg_match_all('/[\p{L}\p{N}]+/u', $query, $matches);
	$tokens = array_slice($matches[0], 0, 5);
	if ($tokens === []) {
		respond([]);
	}

	$ftsQuery = implode(' AND ', array_map(
		static fn(string $token): string => '"' . str_replace('"', '""', $token) . '"*',
		$tokens,
	));
	$countryCode = strtoupper(substr(trim((string) ($_GET['country'] ?? '')), 0, 2));
	$limit = min(10, max(1, (int) ($_GET['limit'] ?? 8)));
	$prefix = mb_strtolower($query) . '%';

	$sql = 'SELECT c.id, c.name, c.admin_name, c.country_name, c.country_code,
			c.latitude, c.longitude, c.timezone
		FROM city_search s
		JOIN city c ON c.id = s.rowid
		WHERE city_search MATCH :query';
	if ($countryCode !== '') {
		$sql .= ' AND c.country_code = :country';
	}
	$sql .= ' ORDER BY
			CASE
				WHEN LOWER(c.name) LIKE :prefix THEN 0
				WHEN LOWER(c.ascii_name) LIKE :prefix THEN 1
				ELSE 2
			END,
			c.population DESC, c.name COLLATE NOCASE
		LIMIT :limit';

	$stmt = $db->prepare($sql);
	$stmt->bindValue(':query', $ftsQuery, PDO::PARAM_STR);
	$stmt->bindValue(':prefix', $prefix, PDO::PARAM_STR);
	if ($countryCode !== '') {
		$stmt->bindValue(':country', $countryCode, PDO::PARAM_STR);
	}
	$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
	$stmt->execute();

	respond(array_map('cityRow', $stmt->fetchAll()));
} catch (Throwable $error) {
	respond(['error' => 'City search is temporarily unavailable.'], 500);
}
