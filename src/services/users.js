import {deleteFetch, getFetch, patchFetch, postFetch} from "../lib/fetch";

export const getUserByToken = (token) => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/token/${token}`);
}

export const getUserToken = (code) => {
    const body = {
        code: code
    };

    return postFetch(`${process.env.REACT_APP_ENDPOINT_URL}/login`, body);
}

export const getMaxPages = () => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/maxPages`);
}

export const getUsers = (page = 1) => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/users?page=${page}`);
}

export const deleteUser = (identifier) => {
    return deleteFetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${identifier}`);
}

export const getUser = (identifier) => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${identifier}`);
}

export const updateUser = (identifier, body) => {
    return patchFetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${identifier}`, body);
}

export const getTrainers = () => {
    return getFetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/trainers`);
}