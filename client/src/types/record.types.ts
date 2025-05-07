// Types et enums pour les records
// Ce fichier évite les dépendances circulaires entre services

/**
 * Énumération des types de disciplines d'athlétisme
 */
export enum DisciplineType {
  RUN = "run",
  JUMP = "jump",
  THROW = "throw"
}

/**
 * Énumération des types de courses
 */
export enum RunningType {
  SHORT = "short",
  MIDDLE = "middle",
  LONG = "long",
  HURDLES = "hurdles"
}

/**
 * Énumération des genres
 */
export enum GenderType {
  MEN = "M",
  WOMEN = "W"
}

/**
 * Énumération des catégories d'âge
 */
export enum CategorieType {
  U18 = "U18",
  U20 = "U20",
  U23 = "U23",
  SENIOR = "SENIOR",
  MASTER = "MASTER"
}

/**
 * Identifiable est un type générique pour toutes les entités ayant un ID
 */
export interface Identifiable {
  id: number;
}

/**
 * TimestampedEntity est un type qui fournit les champs de dates de création et mise à jour
 */
export interface TimestampedEntity {
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface représentant une discipline d'athlétisme
 */
export interface Discipline extends Identifiable, TimestampedEntity {
  name: string;
  type: DisciplineType;
  categories?: string;
  runningType?: RunningType;
}

/**
 * Interface représentant un athlète
 */
export interface Athlete extends Identifiable, TimestampedEntity {
  firstname: string;
  lastname: string;
  country: string;
  birthdate: string;
  heigth?: number;
  weigth?: number;
  coach?: string;
  gender: GenderType;
}

/**
 * Interface représentant un lieu (stade, etc.)
 */
export interface Location extends Identifiable, TimestampedEntity {
  name: string;
  city: string;
  country: string;
  type: string;
}

/**
 * Types d'ordre pour le tri
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Interface représentant un record d'athlétisme
 */
export interface RecordEntity extends Identifiable, TimestampedEntity {
  discipline: Discipline;
  athlete: Athlete;
  lastRecord: string;
  performance: number;
  genre: GenderType;
  categorie: CategorieType;
  isCurrentRecord: boolean;
  previousRecord?: RecordEntity | null;
  nextRecords?: RecordEntity[];
  location: Location;
}

/**
 * Interface pour la création d'un nouveau record (sans ID ni timestamps)
 */
export type CreateRecordDto = Omit<RecordEntity, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Interface pour la mise à jour partielle d'un record
 */
export type UpdateRecordDto = Partial<Omit<RecordEntity, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Interface pour les filtres de recherche de records
 */
export interface RecordFilters {
  discipline?: string;
  disciplineType?: DisciplineType;
  runningType?: RunningType;
  athleteName?: string;
  country?: string;
  gender?: GenderType;
  category?: CategorieType;
  yearFrom?: number;
  yearTo?: number;
  page?: number;
  itemsPerPage?: number;
  order?: Partial<Record<keyof RecordEntity, SortOrder>>;
}

/**
 * Interface pour les paramètres de pagination
 */
export interface PaginationParams {
  page: number;
  itemsPerPage: number;
}
