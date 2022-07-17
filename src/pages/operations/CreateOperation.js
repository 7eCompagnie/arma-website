import {useEffect, useRef, useState} from "react";
import {
    Button, Checkbox, Group,
    Input,
    InputWrapper, Notification, Select,
    SimpleGrid,
    Table,
    Tabs, Text,
    Textarea, useMantineTheme
} from "@mantine/core";
import {
    LetterCaseToggle,
    Calendar,
    SquarePlus,
    Pencil,
    Trash,
    X,
    Photo,
    AlertTriangle,
    CircleCheck
} from "tabler-icons-react";
import {DatePicker, TimeInput, TimeRangeInput} from "@mantine/dates";
import 'dayjs/locale/fr';
import dayjs from "dayjs";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {useNavigate} from "react-router-dom";

function getIconColor(status, theme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
        : status.rejected
            ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7];
}

function ImageUploadIcon({status, ...props}) {
    if (status.accepted) {
        return <Checkbox {...props} />;
    }

    if (status.rejected) {
        return <X {...props} />;
    }

    return <Photo {...props} />;
}

const dropzoneChildren = (status, theme) => (
    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
        <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />

        <div>
            <Text size="xl" inline>
                Faites glisser l'image ici ou cliquez pour en sélectionner une.
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
                La taille de l'image ne doit pas dépasser 5Mo.
            </Text>
        </div>
    </Group>
)

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function CreateOperation() {
    const titleInput = useRef();
    const descriptionInput = useRef();
    const [activeTab, setActiveTab] = useState(0);
    const [date, setDate] = useState(null);
    const [duration, setDuration] = useState([new Date(new Date().setHours(21, 0, 0, 0)), new Date(new Date().setHours(23, 0, 0, 0))]);
    const [startTime, setStartTime] = useState(new Date(new Date().setHours(20, 0, 0, 0)));
    const [operationPicture, setOperationPicture] = useState(null);
    const [notificationError, setNotificationError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [trainings, setTrainings] = useState([]);
    const [currentTraining, setCurrentTraining] = useState(null);
    const [currentTeam, setCurrentTeam] = useState(null);
    const theme = useMantineTheme();
    const openRef = useRef();
    const navigate = useNavigate();

    const [tabs, setTabs] = useState([{
        title: "Zeus",
        group: [
            { role: 'Zeus', team: "Zeus", player: null, isEditing: false },
            { role: 'Co-Zeus', team: "Zeus", player: null, isEditing: false },
        ],
        teams: [
            { name: "Zeus" },
        ]
    }]);

    const changeTab = (active, tabKey) => {
        setActiveTab(active);
    };

    const fetchTrainings = () => {
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
        fetchTrainings();
        document.title = "Création d'une opération - La 7ème Compagnie";
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const getDifference = (date1, date2) => {
            const diff = date2.getTime() - date1.getTime();
            return diff / (1000 * 60 * 60);
        }

        if (titleInput.current.value == null || titleInput.current.value === "" || descriptionInput.current.value == null || descriptionInput.current.value === "" ||
            date === null || operationPicture == null) {
            setNotificationError(true);
            return;
        }

        let body = new FormData();
        body.append('title', titleInput.current.value);
        body.append('description', descriptionInput.current.value);
        body.append('date', date.toString());
        body.append('duration', duration[0].toString());
        body.append('duration', duration[1].toString());
        body.append('connectionStartTime', startTime.toString());
        body.append('picture', operationPicture);
        body.append('roles', JSON.stringify(tabs));

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations`, {
            method: 'POST',
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
            body: body
        })
            .then(res => res.json())
            .then(data => {
                navigate('/zeus/operations');
            })
            .catch(err => console.log(err));
    }

    const addTab = () => {
        const input = document.getElementById('group-name');

        if (input.value === '' || input.value === null)
            return;

        setTabs([...tabs, {
            title: input.value,
            group: [],
            teams: [{ name: input.value }]
        }]);
    }

    const addRole = (tab) => {
        const input = document.getElementById('role-name');

        if (input.value === '' || input.value === null)
            return;

        let newArray = tabs[tab];

        newArray.group.push({
            role: input.value,
            training: currentTraining,
            team: currentTeam,
            player: null
        });
        setTabs([...tabs.slice(0, tab), newArray, ...tabs.slice(tab + 1)]);
    }

    const addTeam = (tab) => {
        const input = document.getElementById('team-name');

        if (input.value === '' || input.value === null)
            return;

        let newArray = tabs[tab];

        newArray.teams.push({
            name: input.value
        });
        setTabs([...tabs.slice(0, tab), newArray, ...tabs.slice(tab + 1)]);
    }

    const trainingsData = trainings.map(training => {
        return {
            value: training._id,
            label: training.title
        }
    });

    const teamsData = (tab) => {
        if (!tabs[tab])
            return {};
        return tabs[tab].teams.map(team => {
            return {
                value: team.name,
                label: team.name
            }
        });
    }

    const removeRole = (currentRole) => {
        if (!tabs[activeTab])
            return {};

        let newArray = tabs[activeTab];
        let toRemove = newArray.group.find(role => role.role === currentRole.role);

        newArray.group.splice(newArray.group.indexOf(toRemove), 1);
        setTabs([...tabs.slice(0, activeTab), newArray, ...tabs.slice(activeTab + 1)]);
    }

    const editRole = (currentRole) => {
        if (!tabs[activeTab])
            return {};

        let newArray = tabs[activeTab];
        let toEdit = newArray.group.find(role => role.role === currentRole.role);

        toEdit.isEditing = true;
        setTabs([...tabs.slice(0, activeTab), newArray, ...tabs.slice(activeTab + 1)]);
    }

    const confirmEdit = (currentRole, elId) => {
        if (!tabs[activeTab])
            return {};

        let newArray = tabs[activeTab];
        let toEdit = newArray.group.find(role => role.role === currentRole.role);

        toEdit.role = document.getElementById(elId).value;
        toEdit.isEditing = false;
        setTabs([...tabs.slice(0, activeTab), newArray, ...tabs.slice(activeTab + 1)]);
    }

    if (isLoading)
        return (<div>Loading...</div>)

    return (<>
        {notificationError ? <Notification mb={20} onClose={() => setNotificationError(false)} icon={<AlertTriangle size={18} />} color="red" title="Erreur lors de la création de la formation">
            Veuillez remplir tous les champs !
        </Notification> : null}
        <h1>Créer une opération</h1>
        <form>
            <SimpleGrid cols={2}>
                <InputWrapper
                    label={"Nom de l'opération"}
                    required
                >
                    <Input
                        ref={titleInput}
                        icon={<LetterCaseToggle/>}
                        placeholder="Ex: Opération Bosso"
                    />
                </InputWrapper>
                <DatePicker
                    label={"Date de l'opération"}
                    locale="fr"
                    placeholder="Ex: 23 mars 2022"
                    minDate={dayjs(new Date()).toDate()}
                    inputFormat="D MMMM YYYY"
                    icon={<Calendar size={16} />}
                    required
                    value={date}
                    onChange={(value) => setDate(value)}
                />

                <TimeRangeInput
                    label="Durée de l'opération"
                    required
                    value={duration}
                    onChange={setDuration}
                />

                <TimeInput
                    label="Heure de début de connexion"
                    value={startTime}
                    onChange={setStartTime}
                    required
                />

                <Textarea
                    label="Description de l'opération"
                    placeholder='Ex: Le Corps de la Légion Etrangère pose pied au Sahel. Leur première mission : "Prendre la température".'
                    required
                    ref={descriptionInput}
                />

                <InputWrapper
                    label={"Image de la formation"}
                    required
                >
                    <Dropzone
                        style={{display: 'none'}}
                        onDrop={(files) => {
                            console.log('accepted files', files[files.length - 1].name);
                            document.getElementById("btn-select-files").firstChild.firstChild.innerHTML = files[files.length - 1].name;
                            setOperationPicture(files[files.length - 1]);
                        }}
                        onReject={(files) => console.log('rejected files', files)}
                        maxSize={3 * 1024 ** 2}
                        accept={IMAGE_MIME_TYPE}
                        openRef={openRef}
                    >
                        {(status) => dropzoneChildren(status, theme)}
                    </Dropzone>

                    <Group>
                        <Button color={"green"} onClick={() => openRef.current()} id="btn-select-files">Sélectionner une image</Button>
                    </Group>
                </InputWrapper>
            </SimpleGrid>

            <h2>Configuration des groupes et des équipes</h2>
            <Tabs active={activeTab} onTabChange={changeTab}>
                {tabs.map((tab, index) => (
                    <Tabs.Tab label={tab.title} tabKey={tab.title} key={index}>
                            {tab.teams.map((team, index) => (
                                <div key={index}>
                                    <h4>{team.name}</h4>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>Rôle</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tab.group.map((role, i) => {
                                            if (role.team === team.name) {
                                                return (
                                                    <tr key={uuidv4()}>
                                                        <td>{role.isEditing ? <Input id={tab.title + "-" + team.name + "-" + role.role} placeholder="Ex: Fusillier" defaultValue={role.role} required/> : role.role}</td>
                                                        <td>
                                                            {role.isEditing ? <Button color={"green"} mr={10} leftIcon={<CircleCheck size={16}/>} compact onClick={() => {confirmEdit(role, tab.title + "-" + team.name + "-" + role.role)}}>Valider</Button> : <Button mr={10} leftIcon={<Pencil size={16}/>} compact onClick={() => editRole(role)}>Editer</Button>}
                                                            <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"} onClick={() => removeRole(role)}>Supprimer</Button>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        })}
                                        </tbody>
                                    </Table>
                                </div>))}
                        <h3>Ajouter un rôle</h3>
                        <SimpleGrid cols={2}>
                            <InputWrapper
                                label="Nom du rôle"
                                required
                            >
                                <Input
                                    id={'role-name'}
                                    placeholder="Ex: Fusillier"
                                    required/>
                            </InputWrapper>
                            <Select
                                label="Choisir une formation"
                                placeholder="Rechercher une formation..."
                                data={trainingsData}
                                searchable
                                maxDropdownHeight={400}
                                nothingFound="Aucune formation trouvée."
                                onChange={(e) => { setCurrentTraining(e) }}
                                required
                            />
                            <Select
                                label="Choisir une équipe"
                                placeholder="Rechercher une équipe..."
                                data={teamsData(activeTab)}
                                searchable
                                maxDropdownHeight={400}
                                nothingFound="Aucune équipe trouvée."
                                onChange={(e) => { setCurrentTeam(e) }}
                                required
                            />
                        </SimpleGrid>
                        <Button mt={20} onClick={() => addRole(activeTab)}>Ajouter</Button>
                        <div>
                            <h3>Créer une équipe</h3>
                            <div style={{display: 'flex', alignItems: 'end'}}>
                                <InputWrapper
                                    label="Nom de l'équipe"
                                    required
                                >
                                    <Input
                                        id={'team-name'}
                                        placeholder="Ex: 300"
                                        required/>
                                </InputWrapper>
                                <Button ml={20} onClick={() => addTeam(activeTab)}>Créer</Button>
                            </div>
                        </div>
                    </Tabs.Tab>
                ))}
                <Tabs.Tab icon={<SquarePlus size={16}/>} label="Créer un groupe" tabKey="createGroup">
                    <div style={{display: 'flex', alignItems: 'end'}}>
                        <InputWrapper
                            label="Nom de l'équipe"
                            required
                        >
                            <Input
                                id={'group-name'}
                                placeholder="Ex: India 2"
                                required/>
                        </InputWrapper>
                        <Button ml={20} onClick={addTab}>Créer</Button>
                    </div>
                </Tabs.Tab>
            </Tabs>

            <Button mt={30} onClick={handleSubmit}>Créer l'opération</Button>
        </form>
    </>)
}

export default CreateOperation;
