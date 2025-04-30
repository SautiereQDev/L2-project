// Types et enums pour les records
// Ce fichier évite les dépendances circulaires entre services

// Enums
export enum DisciplineType {
  RUN = "run",
  JUMP = "jump", 
  THROW = "throw"
}

export enum RunningType {
  SHORT = "short",
  MIDDLE = "middle",
  LONG = "long",
  HURDLES = "hurdles"
}

export enum GenderType {
  MEN = "MEN",
  WOMEN = "WOMEN"
}

export enum CategorieType {
  U18 = "U18",
  U20 = "U20", 
  U23 = "U23",
  SENIOR = "SENIOR",
  MASTER = "MASTER"
}

// Types
export interface Discipline {
  id: number;
  name: string;
  type: DisciplineType;
  categories?: string;
  runningType?: RunningType;
  createdAt: string;
  updatedAt: string;
}

export interface Athlete {
  id: number;
  firstname: string;
  lastname: string;
  country: string;
  birthdate: string;
  heigth?: number;
  weigth?: number;
  coach?: string;
  gender: GenderType;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: number;
  name: string;
  city: string;
  country: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordEntity {
  id: number;
  discipline: Discipline;
  athlete: Athlete;
  lastRecord: string;
  performance: number;
  genre: GenderType;
  categorie: CategorieType;
  isCurrentRecord: boolean;
  previousRecord?: RecordEntity | null;
  nextRecords?: RecordEntity[];
  createdAt: string;
  updatedAt: string;
  location: Location;
}

export interface RecordFilters {
  discipline?: string;
  disciplineType?: string;
  runningType?: string;
  athleteName?: string;
  country?: string;
  gender?: string;
  category?: string;
  yearFrom?: number;
  yearTo?: number;
  page?: number;
  itemsPerPage?: number;
  order?: Record<string, 'asc' | 'desc'>;
}
