import {Avatar, Badge, Button, Group, MultiSelect, Select, Text} from "@mantine/core";
import {forwardRef, useEffect, useState} from 'react';
import {Check} from "tabler-icons-react";
import {showNotification, updateNotification} from "@mantine/notifications";
import {getTrainings} from "../../../services/trainings";
import {getUser, getUsers, updateUser} from "../../../services/users";
import Loading from "./Loading";

function TrainingsPass({user}) {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [newTrained, setNewTrained] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        getUsers(-1).then(data => {
            setUsers(data.data);

            getTrainings(-1).then(data => {
                setTrainings(data.data);
                setIsLoading(false);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        document.title = "Faire passer une formation - La 7ème Compagnie";
    }, []);

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
            setNewTrained(data.data.trained)
        }).catch(err => console.log(err));
    }

    const trainingsData = trainings.map((training, i) => {
        if (user.roles.includes('HEAD_QUARTER_ROLE')) {
            return ({
                value: training._id,
                label: training.title,
                is_trained: 'true'});
        } else {
            return ({
                value: training._id,
                label: training.title,
                disabled: !user.trained.includes(training._id),
                is_trained: user.trained.includes(training._id).toString()
            });
        }
    });

    const SelectItemTraining = forwardRef(
        ({ label, is_trained, ...others }, ref) => (
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}} ref={ref} {...others}>
                <Text>{label}</Text>
                { !(is_trained === 'true') ? <Badge color="red">Pas formé</Badge> : "" }
            </div>
        )
    );

    const handleClick = () => {
        let body = {};
        body.trained = newTrained;

        showNotification({
            id: `edit-user-training-${selectedUser.identifier}`,
            loading: true,
            title: 'Mise à jour de l\'utilisateur en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        updateUser(selectedUser.identifier, body).then(data => {
            updateNotification({
                id: `edit-user-training-${data.data.identifier}`,
                color: 'teal',
                title: 'Edition terminée',
                message: `Vous avez correctement ajouter la formation à l'utilisateur ${data.data.username}`,
                icon: <Check />,
                autoClose: 5000,
            });
        }).catch(err => console.log(err));
    }

    if (isLoading) {
        return (
            <Loading />
        );
    }
    return (<>
        <h1>Ajouter une formation à un joueur</h1>
        <Select
            label="Choisir un joueur"
            placeholder="Rechercher un joueur..."
            itemComponent={SelectItem}
            data={data}
            searchable
            maxDropdownHeight={400}
            nothingFound="Aucun utilisateur trouvé."
            onChange={(e) => { setCurrentUser(e) }}
        />

        {selectedUser ? <>
            <MultiSelect
                mt={10}
                data={trainingsData}
                label={`Modifier les formations de ${selectedUser.username}`}
                placeholder="Rechercher une formation..."
                searchable
                nothingFound="Aucune formation trouvée."
                value={newTrained}
                onChange={setNewTrained}
                itemComponent={SelectItemTraining}
            />
            <Button color={"teal"} mt={20} onClick={handleClick}>Sauvegarder</Button>
        </> : null}
    </>);
}

export default TrainingsPass;