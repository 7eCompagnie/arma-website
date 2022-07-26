export const getPlayedOperationsCount = (operations) => {
    return operations.filter(operation => operation.played).length;
}

export const getNextOperationsCount = (operations) => {
    return operations.filter(operation => !operation.played).length;
}

export const getRatedOperationsCount = (operations) => {
    return operations.filter(operation => operation.rating !== null).length;
}