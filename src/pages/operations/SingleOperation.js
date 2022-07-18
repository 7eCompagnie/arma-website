import {useEffect, useState} from "react";
import {
    Alert,
    Badge,
    Button,
    Image, Notification, SimpleGrid, Skeleton,
    Table, Text, useMantineTheme,
} from "@mantine/core";
import {AlertCircle, Ban, Check, ChevronLeft} from "tabler-icons-react";
import {useNavigate, useParams} from "react-router-dom";
import Moment from "moment";
import 'moment/locale/fr';
Moment.locale('fr');

function SingleOperation() {
    const {id} = useParams();
    const [operation, setOperation] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [updatedUser, setUpdatedUser] = useState({});
    const [allUsers, setAllUsers] = useState({});
    const theme = useMantineTheme();
    const navigate = useNavigate();

    const isUserRegistered = () => {
        for (let i = 0; i < groups.length; i++) {
            for (let j = 0; j < groups[i].group.length; j++)
                if (groups[i].group[j].player === updatedUser.identifier)
                    return true;
        }
        return false;
    }

    const fetchOperation = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/${id}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setOperation(data.data);
                setGroups(data.data.roles);
                document.title = `${data.data.title} - La 7ème Compagnie`;
                fetchUser();
            })
            .catch(err => console.log(err));
    }

    const fetchUser = () => {
        const token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/token/${token}`, {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        })
            .then(res => res.json())
            .then(data => {
                setUpdatedUser(data.data);
                fetchAllUsers();
            })
            .catch(err => console.log(err));
    }

    const fetchAllUsers = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setAllUsers(data.data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchOperation();
    }, []);

    const unregisterPlayer = () => {
        let newRoles = [...operation.roles];

        for (let i = 0; i < newRoles.length; i++) {
            for (let j = 0; j < newRoles[i].group.length; j++) {
                if (newRoles[i].group[j].player === updatedUser.identifier)
                    newRoles[i].group[j].player = null;
            }
        }

        const body = {
            roles: newRoles
        };
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/${id}`, {
            method: 'PATCH',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((res) => res.json())
            .then(() => {
                fetchOperation();
            })
            .catch(err => {
                console.log(err);
            });
    }

    const getPlayerInfo = () => {
        for (let i = 0; i < groups.length; i++) {
            for (let j = 0; j < groups[i].group.length; j++) {
                if (groups[i].group[j].player === updatedUser.identifier) {
                    let infos = groups[i].group[j];
                    infos.group = groups[i].title;
                    return infos;
                }
            }
        }
        return false;
    }

    const registerPlayer = (group, role) => {
        let newRoles = [...operation.roles];

        newRoles.find(r => r.title === group.title).group.find(r => r.role === role.role && r.team === role.team).player = updatedUser.identifier;

        const body = {
            roles: newRoles
        };
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/${id}`, {
            method: 'PATCH',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((res) => res.json())
            .then(() => {
                fetchOperation();
            })
            .catch(err => {
                console.log(err);
            });
    }

    const roles = groups.map((group, index) => {
        return (group.group.map((role, i) => {
            if (isLoading)
                return;
            if (role.player === null) {
                return (
                    <tr key={i}>
                        <td>{role.role}</td>
                        <td>{group.title}</td>
                        <td>{role.team}</td>
                        <td>
                            { updatedUser.trained.includes(role.training) || (role.training === undefined && updatedUser.roles.includes('ADMIN_ROLE')) ?
                                <Button color={"green"} compact onClick={() => registerPlayer(group, role)}>S'inscrire</Button> :
                                <Button color={"green"} compact disabled title={"Vous n'avez pas la formation requise"}>S'inscrire</Button>}
                        </td>
                    </tr>
                )
            }
            if (updatedUser.roles.includes('ADMIN_ROLE')) {
                return (
                    <tr key={i}>
                        <td>{role.role}</td>
                        <td>{group.title}</td>
                        <td>{role.team}</td>
                        <td>
                            <Button color={"green"} compact>S'inscrire</Button>
                        </td>
                    </tr>
                )
            }
        }))
    });

    if (isLoading) {
        return (<>
            <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/operations')}>
                Retour
            </Button>
            <Skeleton my={38} height={16} width={200} />
            <Skeleton height={250} />
            <h2>Informations générales</h2>
            <SimpleGrid columns={2} spacing={4}>
                <Text>
                    <strong>Description:</strong>
                    <Skeleton height={8} my={10} />
                    <Skeleton height={8} my={10} />
                    <Skeleton height={8} width={150} my={10}/>
                </Text>
                <Text style={{display: "flex", alignItems: "center"}}>
                    <strong>Date:</strong>
                    <Skeleton height={8} width={100} ml={10} />
                </Text>
                <Text style={{display: "flex", alignItems: "center"}}>
                    <strong style={{marginRight: '4px'}}>Durée:</strong>
                    <Skeleton height={8} width={100} ml={10} />
                </Text>
                <Text style={{display: "flex", alignItems: "center"}}>
                    <strong>Début des connexions:</strong>
                    <Skeleton height={8} width={100} ml={10} />
                </Text>
            </SimpleGrid>

            <h2>Rôles disponibles</h2>
            <Table>
                <thead>
                <tr>
                    <th>Rôle</th>
                    <th>Groupe</th>
                    <th>Equipe</th>
                    <th>Actions</th>
                </tr>
                </thead>
            </Table>
            <Skeleton height={200} mt={10} />

            <h2>Inscrits</h2>
            <SimpleGrid cols={3}>
                <Skeleton height={200} />
                <Skeleton height={200} />
                <Skeleton height={200} />
            </SimpleGrid>
        </>)
    }

    return(<>
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/operations')}>
            Retour
        </Button>
        <h1>{operation.title}</h1>
        { operation.picture.startsWith("http") ? <Image
            radius="md"
            src={operation.picture}
            alt={operation.title}
            height={250}
        />: <Image
            radius="md"
            src={`${process.env.REACT_APP_ENDPOINT_PUBLIC}/operations/${operation.picture}`}
            alt={operation.title}
            height={250}
        /> }
        <h2>Informations générales</h2>
        <SimpleGrid columns={2} spacing={4}>
            <Text><strong>Description:</strong> {operation.description}</Text>
            <Text>
                <strong>Date:</strong>
                <span style={{textTransform: "capitalize", marginLeft: '4px'}}>
                    {Moment(operation.date).format('dddd')}
                </span> {Moment(operation.date).format('D MMMM YYYY')}
            </Text>
            <Text>
                <strong style={{marginRight: '4px'}}>Durée:</strong>
                {Moment(operation.duration[0]).format('HH[h]mm')}
                <span style={{margin: '0 4px'}}>-</span>
                {Moment(operation.duration[1]).format('HH[h]mm')}
            </Text>
            <Text>
                <strong>Début des connexions:</strong> {Moment(operation.connectionStartTime).format('HH[h]mm')}
            </Text>
        </SimpleGrid>

        <h2>Rôles disponibles</h2>
        {isUserRegistered() ? <>
            <Alert icon={<AlertCircle size={16} />} title="Déjà inscrit !" color="teal">
                Vous êtes déjà inscrit sur cette opération en tant que <strong>{getPlayerInfo().role}</strong> dans le groupe <strong>{getPlayerInfo().group}</strong>, équipe <strong>{getPlayerInfo().team}</strong>.<br/>
                Si vous souhaitez changer de rôle, vous pouvez vous désinscrire en dessous.
            </Alert>
            <Button color={"red"} mt={20} onClick={() => unregisterPlayer()}>Se désinscrire</Button>
        </> : <>
            <Table>
                <thead>
                <tr>
                    <th>Rôle</th>
                    <th>Groupe</th>
                    <th>Equipe</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {roles}
                </tbody>
            </Table>
        </>}

        <h2>Inscrits</h2>
        <SimpleGrid cols={3}>
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
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <Badge color={"blue"} mr={10}>{role.role}</Badge>
                                                { allUsers.find(user => user.identifier === role.player).username }
                                            </div> :
                                            <div style={{color: theme.colors.gray[5], display: 'flex', alignItems: 'center'}}>
                                                <Badge color={"blue"} mr={10}>{role.role}</Badge>
                                                Disponible
                                            </div>
                                        }
                                    </li>)
                                }
                            })}
                        </ul>
                    </div>))}
                </div>
            ))}
        </SimpleGrid>
    </>);
}

export default SingleOperation;
