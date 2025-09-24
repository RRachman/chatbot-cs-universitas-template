<?php
// Direct PHP test - bypass Laravel completely
$startTime = microtime(true);

// Generate 192 fake records
$data = [];
for ($i = 1; $i <= 192; $i++) {
    $data[] = [
        'id' => $i,
        'pertanyaan' => "Test pertanyaan $i",
        'jawaban' => "Test jawaban $i yang agak panjang untuk simulasi data real",
        'kategori' => "Kategori " . ($i % 10)
    ];
}

$response = [
    'status' => 'success',
    'data' => $data,
    'count' => count($data),
    'size_kb' => round(strlen(json_encode($data)) / 1024, 2)
];

$totalTime = (microtime(true) - $startTime) * 1000;
$response['response_time_ms'] = round($totalTime, 2);

header('Content-Type: application/json');
echo json_encode($response);
?>
