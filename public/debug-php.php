<?php
$startTime = microtime(true);

echo "<h2>PHP Debug Info</h2>";
echo "<strong>PHP Version:</strong> " . PHP_VERSION . "<br>";
echo "<strong>Memory Limit:</strong> " . ini_get('memory_limit') . "<br>";
echo "<strong>Max Execution Time:</strong> " . ini_get('max_execution_time') . "<br>";
echo "<strong>Opcache Enabled:</strong> " . (ini_get('opcache.enable') ? 'Yes' : 'No') . "<br>";

// Test simple operations
$testStart = microtime(true);
$arr = [];
for ($i = 0; $i < 1000; $i++) {
    $arr[] = "Test string $i";
}
$loopTime = (microtime(true) - $testStart) * 1000;

$jsonStart = microtime(true);
$json = json_encode($arr);
$jsonTime = (microtime(true) - $jsonStart) * 1000;

$totalTime = (microtime(true) - $startTime) * 1000;

echo "<br><strong>Performance Test:</strong><br>";
echo "Loop 1000 items: {$loopTime}ms<br>";
echo "JSON encode: {$jsonTime}ms<br>";
echo "Total time: {$totalTime}ms<br>";

// Memory usage
echo "<br><strong>Memory:</strong><br>";
echo "Current: " . round(memory_get_usage(true) / 1024 / 1024, 2) . "MB<br>";
echo "Peak: " . round(memory_get_peak_usage(true) / 1024 / 1024, 2) . "MB<br>";
?>
