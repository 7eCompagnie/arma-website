import {Avatar, Button, Center} from "@mantine/core";
import roles from "../../../data/roles.json";
import {useNavigate} from "react-router-dom";

function Row({user, trainings, onDelete}) {
    const navigate = useNavigate();

    const displayRoles = user.roles.map((role, i) => {
        const returnRole = roles.roles.find((r) => r.value === role);

        return returnRole.label;
    }).join(', ');

    const displayTrainings = user.trained.map((training, i) => {
        const returnTraining = trainings.find((t) => t.value === training);

        return returnTraining.label;
    }).join(', ');

    return (
        <tr>
            <td>
                <Avatar radius="xl" size="sm" src={`https://cdn.discordapp.com/avatars/${user.identifier}/${user.avatar}.png`} />
            </td>
            <td>
                {user.username}#{user.discriminator}
            </td>
            <td>
                { !displayRoles ? "Aucun" : displayRoles }
            </td>
            <td>
                { !displayTrainings ? "Aucune" : displayTrainings }
            </td>
            <td>
                <Center>
                    <Button color="yellow" size="md" compact onClick={() => navigate(`/head-quarters/users/${user.identifier}`)}>
                        Editer
                    </Button>
                    <Button onClick={() => onDelete(user)} color="red" size="md" ml={".5rem"} compact>
                        Supprimer
                    </Button>
                </Center>
            </td>
        </tr>
    )
}

export default Row;