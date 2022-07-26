import {Avatar, Button, Group, MultiSelect, Select, Text} from "@mantine/core";
import {forwardRef, useEffect, useState} from "react";
import {deleteUser, getMaxPages, getUser, getUsers, updateUser} from "../../../services/users";
import Loading from "./Loading";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {showNotification, updateNotification} from "@mantine/notifications";
import {Check} from "tabler-icons-react";
import FormContent from "../Edit/FormContent";

function Users() {
    const [users, setUsers] = useState([]);
    const [opened, setOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRoles, setNewRoles] = useState([]);

    useEffect(() => {
        document.title = "Utilisateurs - La 7ème Compagnie";

        getUsers(-1).then(data => {
            setUsers(data.data);
            setIsLoading(false);
        }).catch(err => console.log(err));
    }, []);

    const updateUsers = () => {
        window.location.reload();
    }

    const removeUser = (user) => {
        setOpened(false);

        showNotification({
            id: `delete-user-${user.identifier}`,
            loading: true,
            title: 'Suppression de l\'utilisateur...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        deleteUser(user.identifier).then(() => {
            updateNotification({
                id: `delete-user-${user.identifier}`,
                color: 'teal',
                title: 'Utilisateur supprimé',
                message: `L'utilisateur ${user.username} a été correctement supprimé.`,
                icon: <Check/>,
                autoClose: 5000,
            });
            updateUsers();
        }).catch(err => console.log(err));
    }

    const data = users.map((user, i) => {
        return ({
            image: `https://cdn.discordapp.com/avatars/${user.identifier}/${user.avatar}.png`,
            label: user.username,
            value: user.identifier,
            key: i
        })
    });

    const SelectItem = forwardRef(
        ({ image, label, description, ...others }, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} radius="xl" />

                    <div>
                        <Text size="sm">{label}</Text>
                    </div>
                </Group>
            </div>
        )
    );

    const setCurrentUser = (user) => {
        getUser(user).then(data => {
            setSelectedUser(data.data);
        }).catch(err => console.log(err));
    }

    const patchUser = (e) => {
        e.preventDefault();
        if (newRoles === selectedUser.roles)
            return;

        showNotification({
            id: `edit-user-${selectedUser.identifier}`,
            loading: true,
            title: 'Mise à jour de l\'utilisateur...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        updateUser(selectedUser.identifier, {
            roles: newRoles
        }).then((data) => {
            getUser(selectedUser.identifier).then(data => {
                setSelectedUser(data.data);
                setNewRoles(data.data.roles)
            }).catch(err => {
                console.log(err);
            });

            updateNotification({
                id: `edit-user-${data.data.identifier}`,
                color: 'teal',
                title: 'Utilisateur mis à jour',
                message: `L'utilisateur ${data.data.username} a été correctement mis à jour.`,
                icon: <Check/>,
                autoClose: 5000,
            });
        }).catch(err => console.log(err));
    }

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (<>
        <h1>Gérer les utilisateurs</h1>

        <Select
            label="Choisir un joueur"
            placeholder="Rechercher un joueur..."
            itemComponent={SelectItem}
            data={data}
            searchable
            maxDropdownHeight={400}
            nothingFound="Aucun utilisateur trouvé."
            allowDeselect
            clearable
            onChange={(e) => { setCurrentUser(e) }}
        />

        {selectedUser ? <form action="#" style={{marginTop: "20px"}}>
                <FormContent user={selectedUser} onRolesChange={setNewRoles}/>

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button color={"teal"} mt={20} onClick={(e) => patchUser(e)}>Sauvegarder</Button>
                    <Button color={"red"} mt={20} onClick={() => setOpened(true)}>Supprimer l'utilisateur</Button>
                </div>
            </form>
         : null}

        <ConfirmDeleteModal user={selectedUser} opened={opened} onClose={() => setOpened(false)} onConfirm={() => removeUser(selectedUser)} />
    </>);
}

export default Users;
