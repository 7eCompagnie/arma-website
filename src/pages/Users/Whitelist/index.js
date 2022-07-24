import {Alert, Table, Text} from "@mantine/core";
import Loading from "../Manage/Loading";
import {useEffect, useState} from "react";
import {getNotWhitelistedUsers, updateUser} from "../../../services/users";
import {AlertCircle, Check} from "tabler-icons-react";
import Row from "./Row";
import {showNotification, updateNotification} from "@mantine/notifications";

function Whitelist() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "Whitelist - La 7ème Compagnie";

        getNotWhitelistedUsers().then(data => {
            setUsers(data);
            setIsLoading(false);
        }).catch(err => console.log(err));
    }, []);

    const acceptUser = (user) => {
        showNotification({
            id: `pass-whitelist-${user.identifier}`,
            loading: true,
            title: 'Passage de la whitelist en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        updateUser(user.identifier, {
            roles: ['USER_ROLE']
        }).then((data) => {
            updateNotification({
                id: `pass-whitelist-${user.identifier}`,
                color: 'teal',
                title: 'Joueur whitelisté',
                message: `${data.data.username} peut maintenant accéder à la plateforme.`,
                icon: <Check />,
                autoClose: 5000,
            });

            getNotWhitelistedUsers().then(data => {
                setUsers(data);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }

    const rows = users.map((user, index) => (
        <Row user={user} key={index} acceptUser={acceptUser} />
    ));

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <h1>Passer une whitelist</h1>

            <Table striped highlightOnHover>
                <thead>
                <tr>
                    <th>Pseudo</th>
                    <th>Identifiant</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>

            {!users.length ? <Alert icon={<AlertCircle size={16} />} title="Pas de données" mt={10} color={"red"}>
                <Text>Aucuns utilisateurs en attente de whitelist.</Text>
            </Alert> : ""}
        </>
    );
}

export default Whitelist;