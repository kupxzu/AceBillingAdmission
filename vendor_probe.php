<?php
// vendor_probe.php
header("Content-Type: application/json");

$results = [
    "vendor_exists" => false,
    "autoload_exists" => false,
    "autoload_works" => false,
    "errors" => []
];

// 1. Check vendor folder
if (is_dir(__DIR__ . "/vendor")) {
    $results["vendor_exists"] = true;
} else {
    $results["errors"][] = "vendor/ folder missing.";
}

// 2. Check autoload.php
$autoloadPath = __DIR__ . "/vendor/autoload.php";

if (file_exists($autoloadPath)) {
    $results["autoload_exists"] = true;

    // 3. Try requiring autoload
    try {
        require $autoloadPath;
        // Try loading a common Composer class (e.g., symfony polyfill)
        if (class_exists("\\Composer\\Autoload\\ClassLoader")) {
            $results["autoload_works"] = true;
        } else {
            $results["errors"][] = "autoload.php loaded but ClassLoader missing.";
        }
    } catch (Throwable $e) {
        $results["errors"][] = "autoload.php failed: " . $e->getMessage();
    }

} else {
    $results["errors"][] = "vendor/autoload.php missing.";
}

// Output
echo json_encode($results, JSON_PRETTY_PRINT);
