import {getOperation} from "../services/operations";

const isRoleAvailable = (operationId, group, team, role) => {
    return getOperation(operationId).then(operation => {
        const targetRole = operation.data.roles.find(r => r.title === group).group.find(r => r.role === role && r.team === team);

        console.log(!!(targetRole && targetRole.player === null))
        return !!(targetRole && targetRole.player === null);
    }).catch(err => console.log(err));
}

export default isRoleAvailable;