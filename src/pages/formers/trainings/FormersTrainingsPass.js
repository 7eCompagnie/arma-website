import {Avatar, Badge, Button, Center, Group, MultiSelect, Notification, Select, Skeleton, Text} from "@mantine/core";
import {forwardRef, useEffect, useState} from 'react';
import {Check} from "tabler-icons-react";

function FormersTrainingsPass({user}) {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [newTrained, setNewTrained] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [notification, setNotification] = useState(false);

    const fetchAllUsers = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/all`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data.data);
                fetchAllTrainings();
            })
            .catch(err => console.log(err));
    }

    const fetchAllTrainings = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setTrainings(data.data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const data = users.map((user, i) => {
        return ({
            image: `https://cdn.discordapp.com/avatars/${user.identifier}/${user.avatar}.png`,
            label: user.username,
            value: user.identifier,
            key: i
        })
    });

    if (isLoading) {
        return (
            <div>
                loading...
            </div>
        );
    }

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
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${user}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setSelectedUser(data.data);
                setNewTrained(data.data.trained)
            })
            .catch(err => {
                console.log(err)
            });
    }

    const trainingsData = trainings.map((training, i) => {
        if (isLoading === true)
            return (<Skeleton key={i}/>)
        else {
            if (user.roles.includes('ADMIN_ROLE')) {
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

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${selectedUser.identifier}`, {
            method: 'PATCH',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(data => {
                setNotification(true);
            })
            .catch(err => console.log(err));
    }

    return (<>
        {notification ? <Notification mb={20} onClose={() => setNotification(false)} icon={<Check size={18} />} color="teal" title="Mise à jour de l'utilisateur">
            L'utilisateur {selectedUser.username} à bien été mis à jour !
        </Notification> : null}
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
            <Button color={"green"} mt={20} onClick={handleClick}>Sauvegarder</Button>
        </> : null}
    </>);
}

export default FormersTrainingsPass;