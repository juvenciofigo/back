export interface ResponsePaginate<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    page?: number | undefined;
    totalPages: number;
    offset: number;
    prevPage?: number | null | undefined;
    nextPage?: number | null | undefined;
    pagingCounter: number;
}

export interface IQueryOptions {
    page?: number;
    limit?: number;
    search?: string;
}