<?php
$startTime = microtime(true);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Simulate 192 items like your Laravel endpoint
$data = [];
for ($i = 1; $i <= 192; $i++) {
    $data[] = [
        'id' => $i,
        'question' => "Pertanyaan $i tentang fisika nuklir",
        'answer' => "Jawaban lengkap untuk pertanyaan $i",
        'category' => 'komputasi_nuklir',
        'created_at' => date('Y-m-d H:i:s')
    ];
}

$response = [
    'status' => 'success',
    'data' => $data,
    'count' => count($data),
    'execution_time' => round((microtime(true) - $startTime) * 1000, 2) . 'ms'
];

echo json_encode($response);
?>
