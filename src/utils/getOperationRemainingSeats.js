const getOperationRemainingSeats = (operation) => {
    let counter = 0;

    for (let i = 0; i < operation.roles.length; i++) {
        for (let j = 0; j < operation.roles[i].group.length; j++) {
            if (operation.roles[i].group[j].player === null)
                counter++;
        }
    }
    return counter;
}

export default getOperationRemainingSeats;