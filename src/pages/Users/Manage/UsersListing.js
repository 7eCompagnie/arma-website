import {Alert, Table, Text} from "@mantine/core";
import {AlertCircle} from "tabler-icons-react";
import Row from "./Row";

function UsersListing({users, trainings, onDelete}) {
    const dataTrainings = trainings.map((t) => {
        return {
            value: t._id,
            label: t.title
        }
    });

    const rows = users.map((user, index) => {
        return <Row user={user} trainings={dataTrainings} key={index} onDelete={onDelete}/>
    });

    return (
        <>
            <Table striped highlightOnHover>
                <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>Pseudo</th>
                        <th>Roles</th>
                        <th>Formations</th>
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