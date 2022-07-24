import {Button, Center} from "@mantine/core";
import {updateUser} from "../../../services/users";
import {showNotification, updateNotification} from "@mantine/notifications";
import {Check, CircleCheck} from "tabler-icons-react";
import {getFetch} from "../../../lib/fetch";

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