<?php
// Try to enable OPcache at runtime
if (function_exists('ini_set')) {
    ini_set('opcache.enable', '1');
    ini_set('opcache.memory_consumption', '128');
    ini_set('opcache.max_accelerated_files', '4000');
}

echo "<h2>OPcache Status Check</h2>";

if (function_exists('opcache_get_status')) {
    $status = opcache_get_status();
    if ($status !== false) {
        echo "<strong>OPcache:</strong> ENABLED ✅<br>";
        echo "<strong>Memory Used:</strong> " . round($status['memory_usage']['used_memory'] / 1024 / 1024, 2) . "MB<br>";
        echo "<strong>Cached Scripts:</strong> " . $status['opcache_statistics']['num_cached_scripts'] . "<br>";
        echo "<strong>Hit Rate:</strong> " . round($status['opcache_statistics']['opcache_hit_rate'], 2) . "%<br>";
    } else {
        echo "<strong>OPcache:</strong> Available but not active ⚠️<br>";
    }
} else {
    echo "<strong>OPcache:</strong> NOT AVAILABLE ❌<br>";
    echo "Need to enable in php.ini<br>";
}

// Test if we can compile current file
if (function_exists('opcache_compile_file')) {
    $result = opcache_compile_file(__FILE__);
    echo "<strong>File Compilation:</strong> " . ($result ? "SUCCESS ✅" : "FAILED ❌") . "<br>";
}

// Performance test
$start = microtime(true);
for ($i = 0; $i < 1000; $i++) {
    $dummy = "test $i";
}
$time = (microtime(true) - $start) * 1000;
echo "<strong>Performance Test:</strong> {$time}ms<br>";
?>
