import {deleteFetch, getFetch, patchFetch, postFormDataFetch} from "../lib/fetch";

export const createTraining = (body) => {
    return postFormDataFetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings`, body);
}

export const getTraining = (id) => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings/${id}`);
}

export const updateTraining = (id, body) => {
    return patchFetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings/${id}`, body);
}

export const getTrainings = (page = 1) => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings?page=${page}`);
}

export const getMaxPages = () => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings/maxPages`);
}

export const deleteTraining = (id) => {
    return deleteFetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings/${id}`);
}