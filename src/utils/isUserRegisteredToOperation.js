const isUserRegisteredToOperation = (groups, user) => {
    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups[i].group.length; j++)
            if (groups[i].group[j].player === user.identifier)
                return true;
    }
    return false;
}

export default isUserRegisteredToOperation;