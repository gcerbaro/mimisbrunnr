export interface IPaginatedOptions<T = unknown> {
    items: T[];
    page: number;
    limit: number;
    totalItems: number;
}

export interface IPaginatedQuery {
    page?: number;
    limit?: number;
}