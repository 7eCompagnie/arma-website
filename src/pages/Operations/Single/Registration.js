import isUserRegisteredToOperation from "../../../utils/isUserRegisteredToOperation";
import {Badge, Button, Input, InputWrapper, SimpleGrid, Text, useMantineTheme} from "@mantine/core";
import {showNotification, updateNotification} from "@mantine/notifications";
import {Check, X} from "tabler-icons-react";
import {useEffect, useState} from "react";
import {getUserByToken, getUsers, updateUser} from "../../../services/users";
import {getOperation, updateOperation} from "../../../services/operations";
import {sendWebhookMessage} from "../../../services/discord";

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
        }, 1000);
        return () => clearInterval(interval);
    }, [operation._id]);


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
            message: 'Veuillez patienter... Cette op??ration peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        getOperation(operation._id).then(data => {
            setGroups(data.data.roles);
            let newRoles = [...data.data.roles];
            const targetRole = newRoles.find(r => r.title === group.title).group.find(r => r.role === role.role && r.team === role.team);

            if (targetRole.player === null) {
                targetRole.player = updatedUser.identifier;
                targetRole.playerRPName = playerRPName;

                updateOperation(operation._id, {
                    roles: newRoles
                }).then(() => {
                    let newOperations = updatedUser.operations || [];

                    newOperations.push({
                        operation: operation._id,
                        role: role.role,
                        team: role.team,
                        group: group.title,
                        playerRPName: playerRPName,
                        played: false,
                        rating: null
                    });

                    updateUser(updatedUser.identifier, {
                        operations: newOperations
                    }).then(() => {
                        updateNotification({
                            id: 'register-player',
                            color: 'teal',
                            title: 'Inscription valid??e',
                            message: 'Vous vous ??tes correctement inscrit.',
                            icon: <Check/>,
                            autoClose: 5000,
                        });

                        fetchUpdate();

                        if (process.env.NODE_ENV === 'production') {
                            sendWebhookMessage(process.env.REACT_APP_AMOUK_WEBHOOK_URL, {
                                content: `:green_square: **[${operation.title}]** Inscription de <@${updatedUser.identifier}> - ${group.title}, ${role.team}, ${role.role}`
                            }).catch(err => console.log(err));
                        }
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            } else {
                updateNotification({
                    id: 'register-player',
                    color: 'red',
                    title: 'R??le d??j?? pris',
                    message: 'Ce r??le est d??j?? pris par un autre joueur.',
                    icon: <X/>,
                    autoClose: 5000,
                });
            }
        }).catch(err => console.log(err));
    }

    const unregisterPlayer = (group, role) => {
        showNotification({
            id: 'unregister-player',
            loading: true,
            title: 'D??sinscription en cours...',
            message: 'Veuillez patienter... Cette op??ration peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        getOperation(operation._id).then(data => {
            setGroups(data.data.roles);

            setGroups(data.data.roles);
            let newRoles = [...data.data.roles];
            const targetRole = newRoles.find(r => r.title === group.title).group.find(r => r.role === role.role && r.team === role.team);

            if (targetRole.player === updatedUser.identifier) {
                targetRole.player = null;
                targetRole.playerRPName = null;

                updateOperation(operation._id, {
                    roles: newRoles
                }).then(() => {
                    let newOperations = updatedUser.operations || [];

                    newOperations.splice(newOperations.findIndex(o => o.operation === operation._id), 1);

                    updateUser(updatedUser.identifier, {
                        operations: newOperations
                    }).then(() => {
                        updateNotification({
                            id: 'unregister-player',
                            color: 'teal',
                            title: 'D??sincription valid??e',
                            message: 'Vous vous ??tes correctement d??sinscrit.',
                            icon: <Check/>,
                            autoClose: 5000,
                        });

                        if (process.env.NODE_ENV === 'production') {
                            sendWebhookMessage(process.env.REACT_APP_AMOUK_WEBHOOK_URL, {
                                content: `:red_square: **[${operation.title}]** D??sinscription de <@${updatedUser.identifier}> - ${group.title}, ${role.team}, ${role.role}`
                            }).catch(err => console.log(err));
                        }

                        fetchUpdate();
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            } else {
                updateNotification({
                    id: 'unregister-player',
                    color: 'red',
                    title: 'R??le d??j?? libre',
                    message: 'Ce r??le est d??j?? libre.',
                    icon: <X/>,
                    autoClose: 5000,
                });
            }
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
                                                    { role.player === updatedUser.identifier ? <Button ml={10} color={"red"} onClick={() => unregisterPlayer(group, role)} compact>Se d??sinscrire</Button> : null }
                                                </div> :
                                                <div style={{marginBottom: "10px", color: theme.colors.gray[5], display: 'flex', alignItems: 'center'}}>
                                                    <Badge color={"blue"} mr={10}>{role.shortName}</Badge>
                                                    Disponible
                                                    { !isUserRegisteredToOperation(groups, updatedUser) ? (updatedUser.trained.includes(role.training) || updatedUser.roles.includes('HEAD_QUARTER_ROLE') || role.training === '-1' ?
                                                        <Button ml={10} color={"teal"} compact onClick={() => registerPlayer(group, role)}>S'inscrire</Button> :
                                                        <Button ml={10} color={"teal"} compact disabled title={"Vous n'avez pas la formation requise"}>S'inscrire</Button>) : ""}
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