# Système d'Upload d'Images de Profil pour les Athlètes

## Vue d'ensemble

Ce système permet l'upload d'images de profil lors de la création d'athlètes via l'API REST en utilisant VichUploaderBundle et API Platform 4.1.

## Architecture

### Composants implémentés

1. **VichUploaderBundle** - Gestion des uploads de fichiers
2. **DTOs spécialisés** - AthleteInput (JSON) et AthleteMultipartInput (multipart)
3. **State Processor** - AthleteProcessor pour gérer les uploads
4. **State Provider** - AthleteOutputProvider pour inclure les URLs d'images

### Configuration VichUploader

```yaml
# config/packages/vich_uploader.yaml
vich_uploader:
    db_driver: orm
    
    mappings:
        athlete_profile_image:
            uri_prefix: /uploads/athlete/profile
            upload_destination: '%kernel.project_dir%/public/uploads/athlete/profile'
            namer: Vich\UploaderBundle\Naming\SmartUniqueNamer
            inject_on_load: false
            delete_on_update: true
            delete_on_remove: true
```

## Utilisation

### 1. Création d'athlète avec image (multipart/form-data)

```bash
curl -X POST http://localhost:8000/api/v1/athletes \
  -H "Content-Type: multipart/form-data" \
  -F "firstname=John" \
  -F "lastname=Doe" \
  -F "country=US" \
  -F "birthdate=1990-01-01" \
  -F "heigth=180" \
  -F "weigth=75" \
  -F "coach=Mike Smith" \
  -F "gender=MEN" \
  -F "profileImageFile=@/path/to/image.jpg"
```

### 2. Création d'athlète sans image (JSON)

```bash
curl -X POST http://localhost:8000/api/v1/athletes \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Jane",
    "lastname": "Smith",
    "country": "FR",
    "birthdate": "1992-05-15",
    "heigth": 165,
    "weigth": 60,
    "coach": "Paul Martin",
    "gender": "WOMEN"
  }'
```

### 3. Réponse avec URL de l'image

```json
{
  "id": 1,
  "firstname": "John",
  "lastname": "Doe",
  "country": "US",
  "birthdate": "1990-01-01T00:00:00+00:00",
  "heigth": 180,
  "weigth": 75,
  "coach": "Mike Smith",
  "gender": "MEN",
  "createdAt": "2025-05-30T12:00:00+00:00",
  "updatedAt": "2025-05-30T12:00:00+00:00",
  "profileImageUrl": "/uploads/athlete/profile/unique-filename.jpg"
}
```

## Validation des images

- **Taille maximum** : 5MB
- **Types MIME acceptés** : 
  - image/jpeg
  - image/png
  - image/gif
  - image/webp

## Structure des fichiers

```
src/
├── Entity/Athlete.php              # Entité avec champs VichUploader
├── Dto/
│   ├── AthleteInput.php            # DTO pour JSON
│   ├── AthleteMultipartInput.php   # DTO pour multipart
│   └── AthleteOutput.php           # DTO de sortie avec URL image
└── State/
    ├── AthleteProcessor.php        # Processor pour uploads
    └── AthleteOutputProvider.php   # Provider avec URL image

public/uploads/athlete/profile/     # Répertoire de stockage des images
```

## Tests

Pour tester l'upload d'images, vous pouvez utiliser :

1. **Postman** ou **Insomnia** avec une requête multipart/form-data
2. **cURL** comme dans les exemples ci-dessus
3. **Interface Swagger UI** d'API Platform (si configurée)

## Notes techniques

- VichUploaderBundle génère automatiquement des noms de fichiers uniques
- Les images sont stockées dans `public/uploads/athlete/profile/`
- L'URL complète est générée par VichUploaderBundle via `UploaderHelper`
- Le processor détecte automatiquement le type de contenu (JSON vs multipart)