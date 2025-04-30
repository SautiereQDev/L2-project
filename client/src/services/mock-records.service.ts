// Mock API pour les tests
import type { RecordEntity, RecordFilters } from '@/types';
import { 
  DisciplineType, 
  GenderType, 
  CategorieType, 
  RunningType 
} from '@/types';

// Helper function to determine running type
function getRunningType(disciplineType: string, disciplineName: string): RunningType | undefined {
  if (disciplineType !== 'run') return undefined;
  if (disciplineName.includes('Hurdles')) return RunningType.HURDLES;
  if (disciplineName.includes('100m') || disciplineName.includes('200m') || disciplineName.includes('400m')) return RunningType.SHORT;
  if (disciplineName.includes('800m') || disciplineName.includes('1500m')) return RunningType.MIDDLE;
  return RunningType.LONG;
}

// Générer des records factices pour les tests
function generateMockRecords(count: number): RecordEntity[] {
  const records: RecordEntity[] = [];
  
  const disciplineTypes = ['run', 'jump', 'throw'];
  const genders = ['MEN', 'WOMEN'];
  const categories = ['U18', 'U20', 'U23', 'SENIOR', 'MASTER'];
  const countries = ['France', 'USA', 'Jamaica', 'Kenya', 'Ethiopia', 'Germany', 'Japan', 'UK'];
  
  const runningDisciplines = ['100m', '200m', '400m', '800m', '1500m', '5000m', '10000m', 'Marathon', '110m Hurdles', '400m Hurdles'];
  const jumpingDisciplines = ['Long Jump', 'Triple Jump', 'High Jump', 'Pole Vault'];
  const throwingDisciplines = ['Shot Put', 'Discus', 'Javelin', 'Hammer'];
  
  for (let i = 1; i <= count; i++) {
    const disciplineType = disciplineTypes[Math.floor(Math.random() * disciplineTypes.length)];
    let disciplineName;
    let performance;
    
    switch (disciplineType) {
      case 'run':
        disciplineName = runningDisciplines[Math.floor(Math.random() * runningDisciplines.length)];
        // Temps en secondes pour les courses
        if (disciplineName.includes('Marathon')) {
          performance = 7200 + Math.random() * 3600; // 2h-3h pour un marathon
        } else if (disciplineName.includes('10000m')) {
          performance = 1500 + Math.random() * 600; // 25-35 min
        } else if (disciplineName.includes('5000m')) {
          performance = 720 + Math.random() * 300; // 12-17 min
        } else if (disciplineName.includes('1500m')) {
          performance = 200 + Math.random() * 60; // 3m20s-4m20s
        } else if (disciplineName.includes('800m')) {
          performance = 100 + Math.random() * 20; // 1m40s-2m
        } else {
          performance = 10 + Math.random() * (disciplineName.includes('100m') ? 2 : disciplineName.includes('200m') ? 10 : 20);
        }
        break;
      case 'jump':
        disciplineName = jumpingDisciplines[Math.floor(Math.random() * jumpingDisciplines.length)];
        // Distance en mètres pour les sauts
        if (disciplineName.includes('Pole')) {
          performance = 4 + Math.random() * 2.5; // 4-6.5m
        } else if (disciplineName.includes('High')) {
          performance = 1.8 + Math.random() * 0.6; // 1.8-2.4m
        } else {
          performance = 7 + Math.random() * 3; // 7-10m
        }
        break;
      case 'throw':
        disciplineName = throwingDisciplines[Math.floor(Math.random() * throwingDisciplines.length)];
        // Distance en mètres pour les lancers
        if (disciplineName.includes('Shot')) {
          performance = 15 + Math.random() * 8; // 15-23m
        } else if (disciplineName.includes('Discus')) {
          performance = 50 + Math.random() * 20; // 50-70m
        } else if (disciplineName.includes('Javelin')) {
          performance = 70 + Math.random() * 30; // 70-100m
        } else {
          performance = 65 + Math.random() * 25; // 65-90m
        }
        break;
      default:
        disciplineName = 'Unknown';
        performance = 0;
    }
    
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    const firstname = gender === 'MEN' 
      ? ['John', 'Michael', 'David', 'James', 'Robert', 'Usain', 'Eliud', 'Mohamed', 'Kenenisa'][Math.floor(Math.random() * 9)]
      : ['Mary', 'Sarah', 'Jennifer', 'Elizabeth', 'Allyson', 'Shelly-Ann', 'Elaine', 'Brigid', 'Genzebe'][Math.floor(Math.random() * 9)];
    
    const lastname = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Bolt', 'Kipchoge', 'Farah', 'Bekele', 'Felix', 'Fraser-Pryce', 'Thompson', 'Kosgei', 'Dibaba'][Math.floor(Math.random() * 14)];
    
    // Date de record dans les 20 dernières années
    const recordDate = new Date();
    recordDate.setFullYear(recordDate.getFullYear() - Math.floor(Math.random() * 20));
    recordDate.setDate(Math.floor(Math.random() * 28) + 1); // Jour entre 1-28
    recordDate.setMonth(Math.floor(Math.random() * 12)); // Mois entre 0-11
    
    const record: RecordEntity = {
      id: i,
      discipline: {
        id: i * 10,
        name: disciplineName,
        type: disciplineType as DisciplineType,
        categories: category,
        runningType: getRunningType(disciplineType, disciplineName),
        createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      athlete: {
        id: i * 100,
        firstname,
        lastname,
        country,
        birthdate: new Date(Date.now() - (20 + Math.random() * 15) * 31536000000).toISOString(),
        heigth: 150 + Math.floor(Math.random() * 50),
        weigth: 50 + Math.floor(Math.random() * 50),
        coach: Math.random() > 0.5 ? 'Coach ' + Math.floor(Math.random() * 10) : undefined,
        gender: gender as GenderType,
        createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      lastRecord: recordDate.toISOString().split('T')[0],
      performance,
      genre: gender as GenderType,
      categorie: category as CategorieType,
      isCurrentRecord: true,
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      updatedAt: new Date().toISOString(),
      location: {
        id: i * 1000,
        name: ['Olympic Stadium', 'World Championship Stadium', 'National Stadium', 'Diamond League'][Math.floor(Math.random() * 4)],
        city: ['Paris', 'London', 'Tokyo', 'Berlin', 'New York', 'Eugene'][Math.floor(Math.random() * 6)],
        country: ['France', 'UK', 'Japan', 'Germany', 'USA', 'USA'][Math.floor(Math.random() * 6)],
        type: 'STADIUM',
        createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    records.push(record);
  }
  
  return records;
}

// Mock data
const mockRecords = generateMockRecords(100);

// Helpers pour chaque filtre
function matchesDisciplineType(record: RecordEntity, filters: RecordFilters): boolean {
  return !filters.disciplineType || record.discipline.type === filters.disciplineType;
}

function matchesGender(record: RecordEntity, filters: RecordFilters): boolean {
  return !filters.gender || record.genre === filters.gender;
}

function matchesCategory(record: RecordEntity, filters: RecordFilters): boolean {
  return !filters.category || record.categorie === filters.category;
}

function matchesAthleteName(record: RecordEntity, filters: RecordFilters): boolean {
  if (!filters.athleteName) return true;
  const fullName = `${record.athlete.firstname} ${record.athlete.lastname}`.toLowerCase();
  return fullName.includes(filters.athleteName.toLowerCase());
}

function matchesCountry(record: RecordEntity, filters: RecordFilters): boolean {
  return !filters.country || record.athlete.country.toLowerCase().includes(filters.country.toLowerCase());
}

function matchesYearFrom(record: RecordEntity, filters: RecordFilters): boolean {
  if (!filters.yearFrom) return true;
  const recordYear = new Date(record.lastRecord).getFullYear();
  return recordYear >= filters.yearFrom;
}

function matchesYearTo(record: RecordEntity, filters: RecordFilters): boolean {
  if (!filters.yearTo) return true;
  const recordYear = new Date(record.lastRecord).getFullYear();
  return recordYear <= filters.yearTo;
}

// Filtrer les records selon les critères
function filterRecords(records: RecordEntity[], filters: RecordFilters): RecordEntity[] {
  return records.filter(record =>
    matchesDisciplineType(record, filters) &&
    matchesGender(record, filters) &&
    matchesCategory(record, filters) &&
    matchesAthleteName(record, filters) &&
    matchesCountry(record, filters) &&
    matchesYearFrom(record, filters) &&
    matchesYearTo(record, filters)
  );
}

// Service Mock API
export class MockRecordsService {
  // Récupérer tous les records avec filtres optionnels
  async getRecords(filters: RecordFilters = {}): Promise<RecordEntity[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filterRecords(mockRecords, filters);
  }

  // Récupérer un record spécifique par ID
  async getRecord(id: number): Promise<RecordEntity> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const record = mockRecords.find(r => r.id === id);
    
    if (!record) {
      throw new Error(`Record with ID ${id} not found`);
    }
    
    return record;
  }

  // Récupérer les records par catégorie
  async getRecordsByCategory(category: string): Promise<RecordEntity[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filterRecords(mockRecords, { category });
  }

  // Récupérer les records par discipline
  async getRecordsByDiscipline(disciplineType: string): Promise<RecordEntity[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filterRecords(mockRecords, { disciplineType });
  }

  // Récupérer les records par genre
  async getRecordsByGenre(gender: string): Promise<RecordEntity[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filterRecords(mockRecords, { gender });
  }
}

// Exporter une instance par défaut du service
export const mockRecordsService = new MockRecordsService();
export default mockRecordsService;
