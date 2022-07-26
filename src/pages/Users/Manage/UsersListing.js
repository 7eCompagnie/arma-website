import {Alert, Table, Text} from "@mantine/core";
import {AlertCircle} from "tabler-icons-react";
import Row from "./Row";

function UsersListing({users, onDelete}) {
    const rows = users.map((user, index) => {
        if (!user.roles.includes('VISITOR_ROLE'))
            return <Row user={user} key={index} onDelete={onDelete}/>
        else
            return null;
    });

    return (
        <>
            <Table striped highlightOnHover>
                <thead>
                    <tr>
                        <th>Pseudo</th>
                        <th>Roles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>

            {!users.length ? <Alert icon={<AlertCircle size={16} />} title="Pas de données" mt={10} color={"red"}>
                <Text>Aucuns utilisateurs trouvés.</Text>
            </Alert> : ""}
        </>
    )
}

export default UsersListing;