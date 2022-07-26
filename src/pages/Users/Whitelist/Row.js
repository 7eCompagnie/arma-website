import {Button} from "@mantine/core";
import {CircleCheck} from "tabler-icons-react";

function Row({user, acceptUser}) {

    return (
        <tr>
            <td>
                {user.username}#{user.discriminator}
            </td>
            <td>
                { user.identifier}
            </td>
            <td>
                <Button leftIcon={<CircleCheck size={16} />} color="teal" size="md" compact onClick={() => acceptUser(user)}>
                    Accepter
                </Button>
            </td>
        </tr>
    )
}

export default Row;