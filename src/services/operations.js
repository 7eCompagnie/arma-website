import {deleteFetch, getFetch, patchFetch, postFormDataFetch} from "../lib/fetch";

export const createOperation = (body) => {
    return postFormDataFetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations`, body);
}

export const getOperation = (id) => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/${id}`);
}

export const getOperations = (page = 1) => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations?page=${page}`);
}

export const updateOperation = (id, body) => {
    return patchFetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/${id}`, body);
}

export const getMaxPages = () => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/maxPages`);
}

export const deleteOperation = (id) => {
    return deleteFetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/${id}`);
}