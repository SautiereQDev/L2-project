#!/bin/bash

# Script pour tester l'upload d'images d'athlètes
# Utilisation: ./test-athlete-upload.sh

API_BASE_URL="http://localhost:8000/api/v1"
ENDPOINT="$API_BASE_URL/athletes"

echo "=== Test du système d'upload d'images pour athlètes ==="
echo ""

# Test 1: Création d'athlète sans image (JSON)
echo "1. Test de création d'athlète sans image (JSON):"
echo "curl -X POST $ENDPOINT \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "    \"firstname\": \"Jane\","
echo "    \"lastname\": \"Smith\","
echo "    \"country\": \"FR\","
echo "    \"birthdate\": \"1992-05-15\","
echo "    \"heigth\": 165,"
echo "    \"weigth\": 60,"
echo "    \"coach\": \"Paul Martin\","
echo "    \"gender\": \"WOMEN\""
echo "  }'"
echo ""

# Test 2: Création d'athlète avec image (multipart/form-data)
echo "2. Test de création d'athlète avec image (multipart/form-data):"
echo "curl -X POST $ENDPOINT \\"
echo "  -H 'Content-Type: multipart/form-data' \\"
echo "  -F 'firstname=John' \\"
echo "  -F 'lastname=Doe' \\"
echo "  -F 'country=US' \\"
echo "  -F 'birthdate=1990-01-01' \\"
echo "  -F 'heigth=180' \\"
echo "  -F 'weigth=75' \\"
echo "  -F 'coach=Mike Smith' \\"
echo "  -F 'gender=MEN' \\"
echo "  -F 'profileImageFile=@/path/to/your/image.jpg'"
echo ""

# Test 3: Récupération d'athlète avec URL de l'image
echo "3. Test de récupération d'athlète:"
echo "curl -X GET $ENDPOINT/1 \\"
echo "  -H 'Accept: application/json'"
echo ""

echo "Notes:"
echo "- Remplacez '/path/to/your/image.jpg' par le chemin réel vers une image"
echo "- L'image doit être un fichier JPEG, PNG, GIF ou WebP de maximum 5MB"
echo "- L'URL de l'image sera disponible dans le champ 'profileImageUrl' de la réponse"
echo "- Les images sont stockées dans public/uploads/athlete/profile/"
