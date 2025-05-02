<?php
// Test de normalisation des disciplines

// Importer la fonction de normalisation de DisciplineFixtures.php
function normalizeName(string $name): string
{
    return strtolower(str_replace([' ', "'", '-', 'm'], ['_', '', '_', 'm_'], $name));
}

// Liste des disciplines originales
$disciplines = [
    '100m',
    '200m',
    '400m',
    '800m',
    '1500m',
    '5000m',
    '10000m',
    'Marathon',
    '110m haies',
    '400m haies',
    'Saut en hauteur',
    'Saut en longueur',
    'Triple saut',
    'Saut à la perche',
    'Lancer du poids',
    'Lancer du disque',
    'Lancer du javelot',
    'Lancer du marteau',
];

// Liste des disciplines utilisées dans RealRecordFixtures
$realDisciplines = [
    '100 metres',
    '200 metres',
    '400 metres',
    '800 metres',
    '1500 metres',
    '5000 metres',
    '10000 metres',
    'Marathon',
    '110 metres haies',
    '400 metres haies',
    'Saut en hauteur',
    'Saut en longueur',
    'Triple saut',
    'Saut a la perche',
    'Lancer du poids',
    'Lancer du disque',
    'Lancer du javelot',
    'Lancer du marteau',
];

// Afficher comment sont normalisées les disciplines originales
echo "Disciplines originales normalisées:\n";
foreach ($disciplines as $discipline) {
    echo "$discipline => " . normalizeName($discipline) . "\n";
}

// Afficher comment sont normalisées les disciplines utilisées dans RealRecordFixtures
echo "\nDisciplines RealRecordFixtures normalisées:\n";
foreach ($realDisciplines as $discipline) {
    echo "$discipline => " . normalizeName($discipline) . "\n";
}

// Afficher le mapping correct à utiliser
echo "\nMapping correct à utiliser dans RealRecordFixtures:\n";
echo "[\n";
foreach ($realDisciplines as $key => $realDiscipline) {
    $normalizedDiscipline = normalizeName($disciplines[$key]);
    echo "    '$realDiscipline' => '$normalizedDiscipline',\n";
}
echo "];\n";
