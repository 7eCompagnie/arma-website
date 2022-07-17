import {useEffect, useState} from "react";
import {
    Alert,
    Badge,
    Button,
    Image, Notification, SimpleGrid,
    Table, Text, useMantineTheme,
} from "@mantine/core";
import {AlertCircle, Ban, Check, ChevronLeft} from "tabler-icons-react";
import {useNavigate, useParams} from "react-router-dom";
import Moment from "moment";
import 'moment/locale/fr';
Moment.locale('fr');

function SingleOperation({user, isUserLoading}) {
    const {id} = useParams();
    const [operation, setOperation] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const theme = useMantineTheme();
    const navigate = useNavigate();

    const isUserRegistered = () => {
        for (let i = 0; i < groups.length; i++) {
            for (let j = 0; j < groups[i].group.length; j++)
                if (groups[i].group[j].player === user.identifier)
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
                setIsLoading(false);
                document.title = `${data.data.title} - La 7ème Compagnie`;
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchOperation();
    }, []);

    if (isLoading) {
        return (
            <div>loading</div>
        )
    }

    const unregisterPlayer = () => {
        let newRoles = [...operation.roles];

        for (let i = 0; i < newRoles.length; i++) {
            for (let j = 0; j < newRoles[i].group.length; j++) {
                if (newRoles[i].group[j].player === user.identifier)
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
                if (groups[i].group[j].player === user.identifier) {
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

        newRoles.find(r => r.title === group.title).group.find(r => r.title === role.title && r.team === role.team).player = user.identifier;

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
            if (isUserLoading)
                return;
            if (role.player === null) {
                return (
                    <tr key={i}>
                        <td>{role.role}</td>
                        <td>{group.title}</td>
                        <td>{role.team}</td>
                        <td>
                            <Button color={"green"} compact onClick={() => registerPlayer(group, role)}>S'inscrire</Button>
                        </td>
                    </tr>
                )
            }
            if (!role.training && user.roles.includes('ADMIN_ROLE')) {
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

    return(<>
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/operations')}>
            Retour
        </Button>
        <h1>{operation.title}</h1>
        <Image
            radius="md"
            src={`${process.env.REACT_APP_ENDPOINT_PUBLIC}/operations/${operation.picture}`}
            alt="Image de soldats de la 7ème Compagnie lors de l'opération Bosso"
            height={250}
        />
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
            <div>
                <h3>India 2</h3>
                <ul style={{ listStyle: "none" }}>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>CDG</Badge>
                            Marston
                        </div>
                    </li>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>TP</Badge>
                            Engourdy
                        </div>
                    </li>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>AUX. SAN</Badge>
                            Rouliane
                        </div>
                    </li>
                    <Text mt={10} style={{ fontWeight: 900 }}>
                        300
                    </Text>
                    <ul style={{ listStyle: "none" }}>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>CDE</Badge>
                                Fradom
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                DJmaxou
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Kurt
                            </div>
                        </li>
                    </ul>
                    <Text mt={10} style={{ fontWeight: 900 }}>
                        600
                    </Text>
                    <ul style={{ listStyle: "none" }}>
                        <li>
                            <div style={{color: theme.colors.gray[5], display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>CDE</Badge>
                                Disponible
                            </div>
                        </li>
                        <li>
                            <div style={{color: theme.colors.gray[5], display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>MIT</Badge>
                                Disponible
                            </div>
                        </li>
                        <li>
                            <div style={{color: theme.colors.gray[5], display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Disponible
                            </div>
                        </li>
                    </ul>
                </ul>
            </div>
            <div>
                <h3>India 3</h3>
                <ul style={{ listStyle: "none" }}>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>CDG</Badge>
                            H1RO
                        </div>
                    </li>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>TP</Badge>
                            Red
                        </div>
                    </li>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>AUX. SAN</Badge>
                            Luco
                        </div>
                    </li>
                    <Text mt={10} style={{ fontWeight: 900 }}>
                        300
                    </Text>
                    <ul style={{ listStyle: "none" }}>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>CDE</Badge>
                                Drake Sn0w
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Undertaker
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Myckaël
                            </div>
                        </li>
                    </ul>
                    <Text mt={10} style={{ fontWeight: 900 }}>
                        600
                    </Text>
                    <ul style={{ listStyle: "none" }}>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>CDE</Badge>
                                Sn0w
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>MIT</Badge>
                                XrayG4mer
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Alexios Gan
                            </div>
                        </li>
                    </ul>
                </ul>
            </div>
        </SimpleGrid>
    </>);
}

export default SingleOperation;
