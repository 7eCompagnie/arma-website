export const getFetch = (url, params = {}) => {
    const queryString = Object.entries(params).map((param) => {
        return `${param[0]}=${param[1]}`;
    }).join('&');

    return fetch(`${url}?${queryString}`, {
        method: 'GET',
        headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }}).then(res => res.json())
};

export const postFetch = (url, body) => {
    return fetch(`${url}`, {
        method: 'POST',
        headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
}

export const deleteFetch = (url) => {
    return fetch(`${url}`, {
        method: 'DELETE',
        headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());
}

export const patchFetch = (url, body) => {
    return fetch(`${url}`, {
        method: 'PATCH',
        headers: {
            'x-access-token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
}

export const postFormDataFetch = (url, body) => {
    return fetch(`${url}`, {
        method: 'POST',
        headers: {
            'x-access-token': localStorage.getItem('token')
        },
        body: body
    }).then(res => res.json())
}