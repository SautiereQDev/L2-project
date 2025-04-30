// Service de génération de données simulées pour le développement
import type { RecordEntity, Discipline, Athlete, Location } from '../types';
import { DisciplineType, GenderType, CategorieType } from '../types';

// Fonction pour générer un nombre aléatoire dans une plage
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fonction pour générer une date aléatoire dans une plage
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

// Fonction pour générer un nom aléatoire
function randomName(): string {
  const firstNames = ['Jean', 'Pierre', 'Marie', 'Sophie', 'Thomas', 'Laura', 'Émilie', 'Antoine', 'Camille', 'Lucas'];
  const lastNames = ['Dupont', 'Martin', 'Bernard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre'];
  return `${firstNames[randomInt(0, firstNames.length - 1)]} ${lastNames[randomInt(0, lastNames.length - 1)]}`;
}

// Fonction pour générer une discipline aléatoire
function generateDiscipline(id: number): Discipline {
  const types = [DisciplineType.RUN, DisciplineType.JUMP, DisciplineType.THROW];
  const type = types[randomInt(0, types.length - 1)];
  
  let name = '';
  switch (type) {
    case DisciplineType.RUN:
      name = `${randomInt(100, 10000)}m`;
      break;
    case DisciplineType.JUMP:
      name = ['Saut en hauteur', 'Saut en longueur', 'Triple saut', 'Saut à la perche'][randomInt(0, 3)];
      break;
    case DisciplineType.THROW:
      name = ['Lancer de poids', 'Lancer de disque', 'Lancer de javelot', 'Lancer de marteau'][randomInt(0, 3)];
      break;
  }
  
  return {
    id,
    name,
    type,
    createdAt: randomDate(new Date(2020, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2020, 0, 1), new Date())
  };
}

// Fonction pour générer un athlète aléatoire
function generateAthlete(id: number): Athlete {
  const genders = [GenderType.MEN, GenderType.WOMEN];
  const gender = genders[randomInt(0, 1)];
  const firstName = gender === GenderType.MEN ? 
    ['Jean', 'Pierre', 'Thomas', 'Antoine', 'Lucas'][randomInt(0, 4)] :
    ['Marie', 'Sophie', 'Laura', 'Émilie', 'Camille'][randomInt(0, 4)];
  const lastName = ['Dupont', 'Martin', 'Bernard', 'Petit', 'Durand'][randomInt(0, 4)];
  const countries = ['France', 'USA', 'UK', 'Germany', 'Italy', 'Spain', 'Japan', 'China', 'Brazil', 'Australia'];
  
  return {
    id,
    firstname: firstName,
    lastname: lastName,
    country: countries[randomInt(0, countries.length - 1)],
    birthdate: randomDate(new Date(1985, 0, 1), new Date(2005, 0, 1)),
    gender,
    heigth: randomInt(160, 210),
    weigth: randomInt(50, 120),
    coach: `Coach ${randomName()}`,
    createdAt: randomDate(new Date(2020, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2020, 0, 1), new Date())
  };
}

// Fonction pour générer un lieu aléatoire
function generateLocation(id: number): Location {
  const cities = ['Paris', 'London', 'Berlin', 'Rome', 'Madrid', 'Tokyo', 'Beijing', 'New York', 'Los Angeles', 'Sydney'];
  const countries = ['France', 'UK', 'Germany', 'Italy', 'Spain', 'Japan', 'China', 'USA', 'USA', 'Australia'];
  const stadiums = ['Stade Olympique', 'National Stadium', 'Central Arena', 'Olympic Stadium', 'Main Stadium'];
  
  const index = randomInt(0, cities.length - 1);
  
  return {
    id,
    name: `${stadiums[randomInt(0, stadiums.length - 1)]} de ${cities[index]}`,
    city: cities[index],
    country: countries[index],
    type: 'stadium',
    createdAt: randomDate(new Date(2020, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2020, 0, 1), new Date())
  };
}

// Fonction principale pour générer des records simulés
export function generateMockRecords(count: number = 10): RecordEntity[] {
  const records: RecordEntity[] = [];
  
  const categories = [CategorieType.U18, CategorieType.U20, CategorieType.U23, CategorieType.SENIOR, CategorieType.MASTER];
  
  for (let i = 0; i < count; i++) {
    const discipline = generateDiscipline(i + 1);
    const athlete = generateAthlete(i + 1);
    const location = generateLocation(i + 1);
    
    // Générer une performance en fonction du type de discipline
    let performance = 0;
    switch (discipline.type) {
      case DisciplineType.RUN:
        // Pour les courses, une performance entre 10 et 600 secondes
        performance = parseFloat((Math.random() * 590 + 10).toFixed(2));
        break;
      case DisciplineType.JUMP:
        // Pour les sauts, une performance entre 1 et 8 mètres
        performance = parseFloat((Math.random() * 7 + 1).toFixed(2));
        break;
      case DisciplineType.THROW:
        // Pour les lancers, une performance entre 10 et 90 mètres
        performance = parseFloat((Math.random() * 80 + 10).toFixed(2));
        break;
    }
    
    // Créer le record
    records.push({
      id: i + 1,
      discipline,
      athlete,
      performance,
      genre: athlete.gender,
      categorie: categories[randomInt(0, categories.length - 1)],
      isCurrentRecord: Math.random() > 0.3, // 70% de chances d'être un record en cours
      lastRecord: randomDate(new Date(2010, 0, 1), new Date()),
      location,
      createdAt: randomDate(new Date(2020, 0, 1), new Date()),
      updatedAt: randomDate(new Date(2020, 0, 1), new Date()),
      previousRecord: null,
      nextRecords: []
    });
  }
  
  return records;
}

export default {
  generateMockRecords
};
