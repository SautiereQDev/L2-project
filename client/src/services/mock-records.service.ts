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
const disciplineTypes = ['run', 'jump', 'throw'];
const genders = ['MEN', 'WOMEN'];
const categories = ['U18', 'U20', 'U23', 'SENIOR', 'MASTER'];
const countries = ['France', 'USA', 'Jamaica', 'Kenya', 'Ethiopia', 'Germany', 'Japan', 'UK'];

const runningDisciplines = ['100m', '200m', '400m', '800m', '1500m', '5000m', '10000m', 'Marathon', '110m Hurdles', '400m Hurdles'];
const jumpingDisciplines = ['Long Jump', 'Triple Jump', 'High Jump', 'Pole Vault'];
const throwingDisciplines = ['Shot Put', 'Discus', 'Javelin', 'Hammer'];

function getRunPerformance(name: string): number {
  if (name.includes('Marathon')) {
    return 7200 + Math.random() * 3600;
  }
  if (name.includes('10000m')) {
    return 1500 + Math.random() * 600;
  }
  if (name.includes('5000m')) {
    return 720 + Math.random() * 300;
  }
  if (name.includes('1500m')) {
    return 200 + Math.random() * 60;
  }
  if (name.includes('800m')) {
    return 100 + Math.random() * 20;
  }
  if (name.includes('100m')) {
    return 10 + Math.random() * 2;
  }
  if (name.includes('200m')) {
    return 10 + Math.random() * 10;
  }
  if (name.includes('400m')) {
    return 10 + Math.random() * 20;
  }
  return 10 + Math.random() * 20;
}

function getJumpPerformance(name: string): number {
  if (name.includes('Pole')) {
    return 4 + Math.random() * 2.5;
  }
  if (name.includes('High')) {
    return 1.8 + Math.random() * 0.6;
  }
  return 7 + Math.random() * 3;
}

function getThrowPerformance(name: string): number {
  if (name.includes('Shot')) {
    return 15 + Math.random() * 8;
  }
  if (name.includes('Discus')) {
    return 50 + Math.random() * 20;
  }
  if (name.includes('Javelin')) {
    return 70 + Math.random() * 30;
  }
  return 65 + Math.random() * 25;
}

function getDisciplineNameAndPerformance(disciplineType: string): { name: string, performance: number } {
  let name = '';
  let performance = 0;
  if (disciplineType === 'run') {
    name = runningDisciplines[Math.floor(Math.random() * runningDisciplines.length)];
    performance = getRunPerformance(name);
  } else if (disciplineType === 'jump') {
    name = jumpingDisciplines[Math.floor(Math.random() * jumpingDisciplines.length)];
    performance = getJumpPerformance(name);
  } else if (disciplineType === 'throw') {
    name = throwingDisciplines[Math.floor(Math.random() * throwingDisciplines.length)];
    performance = getThrowPerformance(name);
  } else {
    name = 'Unknown';
  }
  return { name, performance };
}

function getRandomFirstname(gender: string): string {
  return gender === 'MEN'
    ? ['John', 'Michael', 'David', 'James', 'Robert', 'Usain', 'Eliud', 'Mohamed', 'Kenenisa'][Math.floor(Math.random() * 9)]
    : ['Mary', 'Sarah', 'Jennifer', 'Elizabeth', 'Allyson', 'Shelly-Ann', 'Elaine', 'Brigid', 'Genzebe'][Math.floor(Math.random() * 9)];
}

function getRandomLastname(): string {
  return ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Bolt', 'Kipchoge', 'Farah', 'Bekele', 'Felix', 'Fraser-Pryce', 'Thompson', 'Kosgei', 'Dibaba'][Math.floor(Math.random() * 14)];
}

function getRandomRecordDate(): Date {
  const recordDate = new Date();
  recordDate.setFullYear(recordDate.getFullYear() - Math.floor(Math.random() * 20));
  recordDate.setDate(Math.floor(Math.random() * 28) + 1);
  recordDate.setMonth(Math.floor(Math.random() * 12));
  return recordDate;
}

function generateMockRecords(count: number): RecordEntity[] {
  const records: RecordEntity[] = [];
  for (let i = 1; i <= count; i++) {
    const disciplineType = disciplineTypes[Math.floor(Math.random() * disciplineTypes.length)];
    const { name: disciplineName, performance } = getDisciplineNameAndPerformance(disciplineType);
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const firstname = getRandomFirstname(gender);
    const lastname = getRandomLastname();
    const recordDate = getRandomRecordDate();

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
  async getRecordsByCategory(category: CategorieType): Promise<RecordEntity[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filterRecords(mockRecords, { category });
  }

  // Récupérer les records par discipline
  async getRecordsByDiscipline(disciplineType: DisciplineType): Promise<RecordEntity[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filterRecords(mockRecords, { disciplineType });
  }

  // Récupérer les records par genre
  async getRecordsByGenre(gender: GenderType): Promise<RecordEntity[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filterRecords(mockRecords, { gender });
  }
}

// Exporter une instance par défaut du service
export const mockRecordsService = new MockRecordsService();
export default mockRecordsService;
