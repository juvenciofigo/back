import { ResponsePaginate } from "../interface.js";

export function convertResponse<T>(response: ResponsePaginate<T>): ResponsePaginate<T> {
    return {
        docs: response.docs,
        totalDocs: response.totalDocs,
        limit: response.limit,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        page: response.page,
        totalPages: response.totalPages,
        offset: response.offset,
        prevPage: response.prevPage,
        nextPage: response.nextPage,
        pagingCounter: response.pagingCounter,
    };
}