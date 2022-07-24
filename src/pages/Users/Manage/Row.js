import {Button, Center} from "@mantine/core";
import roles from "../../../data/roles.json";
import {useNavigate} from "react-router-dom";

function Row({user, onDelete}) {
    const navigate = useNavigate();

    const displayRoles = user.roles.map((role, i) => {
        const returnRole = roles.roles.find((r) => r.value === role);

        return returnRole.label;
    }).join(', ');

    return (
        <tr>
            <td>
                {user.username}#{user.discriminator}
            </td>
            <td>
                { displayRoles }
            </td>
            <td>
                <Center>
                    <Button color="yellow" size="md" compact onClick={() => navigate(`/head-quarters/users/${user.identifier}`)}>
                        Editer
                    </Button>
                    <Button onClick={onDelete} color="red" size="md" ml={".5rem"} compact>
                        Supprimer
                    </Button>
                </Center>
            </td>
        </tr>
    )
}

export default Row;