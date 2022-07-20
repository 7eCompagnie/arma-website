import isUserRegisteredToOperation from "../../utils/isUserRegisteredToOperation";
import {Badge, Button, Input, InputWrapper, SimpleGrid, Text, useMantineTheme} from "@mantine/core";
import {showNotification, updateNotification} from "@mantine/notifications";
import {Check, X} from "tabler-icons-react";
import {useEffect, useState} from "react";
import {getUser, getUserByToken, getUsers} from "../../services/users";
import {getOperation, updateOperation} from "../../services/operations";

function Registration({operation, setOperation}) {
    const [playerRPName, setPlayerRPName] = useState('');
    const [groups, setGroups] = useState(operation.roles);
    const [allUsers, setAllUsers] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const theme = useMantineTheme();

    useEffect(() => {
        getUserByToken(localStorage.getItem('token')).then(data => {
            setUpdatedUser(data.data);

            getUsers(-1).then(data => {
                setAllUsers(data.data);
                setIsLoading(false);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        const interval = setInterval(() => {
            getOperation(operation._id).then(data => {
                setGroups(data.data.roles);
            }).catch(err => console.log(err));
        }, 2000);
        return () => clearInterval(interval);
    }, []);


    const fetchUpdate = () => {
        getOperation(operation._id).then(data => {
            setGroups(data.data.roles);
        }).catch(err => console.log(err));
    }

    const registerPlayer = (group, role) => {
        if (playerRPName === '') {
            showNotification({
                id: "register-player-error",
                title: 'Erreur lors de l\'inscription',
                message: 'Veuillez renseigner un nom RP avant de vous inscrire.',
                icon: <X/>,
                autoClose: 5000,
                color: "red"
            });
            return;
        }

        showNotification({
            id: 'register-player',
            loading: true,
            title: 'Inscription en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });
        let newRoles = [...operation.roles];

        newRoles.find(r => r.title === group.title).group.find(r => r.role === role.role && r.team === role.team).player = updatedUser.identifier;
        newRoles.find(r => r.title === group.title).group.find(r => r.role === role.role && r.team === role.team).playerRPName = playerRPName;

        updateOperation(operation._id, {
            roles: newRoles
        }).then(() => {
            updateNotification({
                id: 'register-player',
                color: 'teal',
                title: 'Inscription validée',
                message: 'Vous vous êtes correctement inscrit.',
                icon: <Check />,
                autoClose: 5000,
            });
            fetchUpdate();
        }).catch(err => console.log(err));
    }

    const unregisterPlayer = () => {
        showNotification({
            id: 'unregister-player',
            loading: true,
            title: 'Désinscription en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        let newRoles = [...operation.roles];

        for (let i = 0; i < newRoles.length; i++) {
            for (let j = 0; j < newRoles[i].group.length; j++) {
                if (newRoles[i].group[j].player === updatedUser.identifier) {
                    newRoles[i].group[j].player = null;
                    newRoles[i].group[j].playerRPName = null;
                }
            }
        }

        updateOperation(operation._id, {
            roles: newRoles
        }).then(() => {
            updateNotification({
                id: 'unregister-player',
                color: 'teal',
                title: 'Désincription validée',
                message: 'Vous vous êtes correctement désinscrit.',
                icon: <Check />,
                autoClose: 5000,
            });
            fetchUpdate();
        }).catch(err => console.log(err));
    }

    if (isLoading) {
        return (
            <div>
                loading
            </div>
        )
    }

    return (
        <>
            { !isUserRegisteredToOperation(groups, updatedUser) ? <SimpleGrid cols={2}>
                <div style={{display: 'flex', alignItems: 'end'}}>
                    <InputWrapper label={"Nom RP"} required>
                        <Input placeholder={"Ex: Augustin Hubert"} value={playerRPName} onChange={(e) => setPlayerRPName(e.target.value)}/>
                    </InputWrapper>
                </div>
            </SimpleGrid> : ""}
            <SimpleGrid cols={2}>
                {groups.map((group, index) => (
                    <div key={index}>
                        <h3>{group.title}</h3>
                        {group.teams.map((team, i) => (<div key={i}>
                            <Text mt={10} style={{ fontWeight: 900 }}>
                                {group.title !== team.name ? team.name : ""}
                            </Text>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {group.group.map((role, j) => {
                                    if (role.team === team.name) {
                                        return (<li key={j}>
                                            { role.player !== null ?
                                                <div style={{marginBottom: "10px", display: 'flex', alignItems: 'center'}}>
                                                    <Badge color={"blue"} mr={10}>{role.role}</Badge>
                                                    <span>
                                                        <strong>{ role.playerRPName ? role.playerRPName : playerRPName }</strong> ({ allUsers.find(user => user.identifier === role.player).username })
                                                    </span>
                                                    <Button ml={10} color={"red"} onClick={() => unregisterPlayer()} compact>Se désinscrire</Button>
                                                </div> :
                                                <div style={{marginBottom: "10px", color: theme.colors.gray[5], display: 'flex', alignItems: 'center'}}>
                                                    <Badge color={"blue"} mr={10}>{role.shortName}</Badge>
                                                    Disponible
                                                    { !isUserRegisteredToOperation(groups, updatedUser) ? (updatedUser.trained.includes(role.training) || updatedUser.roles.includes('ADMIN_ROLE') ?
                                                        <Button ml={10} color={"green"} compact onClick={() => registerPlayer(group, role)}>S'inscrire</Button> :
                                                        <Button ml={10} color={"green"} compact disabled title={"Vous n'avez pas la formation requise"}>S'inscrire</Button>) : ""}
                                                </div>
                                            }
                                        </li>)
                                    }
                                    return null
                                })}
                            </ul>
                        </div>))}
                    </div>
                ))}
            </SimpleGrid>
        </>
    )
}

export default Registration;