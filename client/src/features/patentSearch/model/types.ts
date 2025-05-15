export interface SearchSliceState {
  patentTypeFilters: number[];
  technologyFieldFilters: number[];
  instituteFilters: number[];
  patentSort?: string;
  searchQuery?: string;
  page: number
  totalPages?: number
}
