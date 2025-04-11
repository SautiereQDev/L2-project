# L2 Web Project

-----

### Author

[Quentin Sautière](https://github.com/SautiereQDev) - [contact@quentinsautiere.com](mailto:contact@quentinsautiere.com)

-----

## Description

This is an Symfony + Vue website that display the athletisme records and give you the possibility to modify, delete or
add a record. The backend api is made with API Platform.



----- 

## Dev instructions

1. Clone the repository

```bash
git clone https://github.com/SautiereQDev/L2-project.git
```

2. Install the dependencies

```bash
cd L2-project
composer install
```

L'url vers la bdd doit etre bind en 3307 au lieu du port 3306 par defaut

## Documentation

After initializing the project, you can access the API documentation at: https://project.localhost:8443/api


---------------

## External libraries

- [API Platform](https://api-platform.com/)
- Symfony Validator
- Symfony Profiler
- [Faker](https://fakerphp.org/)

## License

This project is under GPL-v3.0 License - see the [LICENSE](LICENSE) file for details.

---------

## Routes implemented at the end of the project

### Athletes

GET /api/v1/athletes # Liste de tous les athlètes
POST /api/v1/athletes # Créer un athlète
GET /api/v1/athletes/{id} # Détails d'un athlète
PUT /api/v1/athletes/{id} # Modifier un athlète
DELETE /api/v1/athletes/{id} # Supprimer un athlète
GET /api/v1/athletes/{id}/records # Records d'un athlète
GET /api/v1/athletes/country/{pays} # Athlètes par pays

### Records

GET /api/v1/records # Liste de tous les records  
POST /api/v1/records # Créer un record    
GET /api/v1/records/{id} # Détails d'un record   
PUT /api/v1/records/{id} # Modifier un record   
DELETE /api/v1/records/{id} # Supprimer un record  
GET /api/v1/records/discipline/{discipline} # Records par discipline

### Disciplines

GET /api/v1/disciplines # Liste de toutes les disciplines  
POST /api/v1/disciplines # Créer une discipline   
GET /api/v1/disciplines/{id} # Détails d'une discipline  
PUT /api/v1/disciplines/{id} # Modifier une discipline   
DELETE /api/v1/disciplines/{id} # Supprimer une discipline   
GET /api/v1/disciplines/{id}/records # Records d'une discipline   
GET /api/v1/disciplines/type/{type} # Disciplines par type

### Locations

GET /api/v1/locations # Liste de tous les lieux   
POST /api/v1/locations # Créer un lieu   
GET /api/v1/locations/{id} # Détails d'un lieu  
PUT /api/v1/locations/{id} # Modifier un lieu   
DELETE /api/v1/locations/{id} # Supprimer un lieu   
GET /api/v1/locations/{id}/records # Records établis à un lieu   
GET /api/v1/locations/country/{pays}# Lieux par pays   