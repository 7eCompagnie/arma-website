import {useEffect, useRef, useState} from "react";
import {
    Button, Checkbox,
    Container, Group,
    Input,
    InputWrapper, Notification,
    SimpleGrid,
    Table,
    Tabs, Text,
    Textarea, useMantineTheme
} from "@mantine/core";
import {LetterCaseToggle, Calendar, SquarePlus, Pencil, Trash, X, Photo, AlertTriangle} from "tabler-icons-react";
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

function CreateOperation() {
    const titleInput = useRef();
    const dateInput = useRef();
    const descriptionInput = useRef();
    const [activeTab, setActiveTab] = useState(0);
    const [duration, setDuration] = useState([new Date(new Date().setHours(21, 0, 0, 0)), new Date(new Date().setHours(23, 0, 0, 0))]);
    const [startTime, setStartTime] = useState(new Date(new Date().setHours(20, 0, 0, 0)));
    const [operationPicture, setOperationPicture] = useState(null);
    const [notificationError, setNotificationError] = useState(false);
    const theme = useMantineTheme();
    const openRef = useRef();
    const navigate = useNavigate();

    const onChange = (active, tabKey) => {
        setActiveTab(active);
        console.log('tabKey', tabKey);
    };

    useEffect(() => {
        document.title = "Création d'une opération - La 7ème Compagnie";
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const getDifference = (date1, date2) => {
            const diff = date2.getTime() - date1.getTime();
            return diff / (1000 * 60 * 60);
        }
        const diff = getDifference(duration[0], duration[1]) * 60;
        const timeConvert = (n) => {
            let hours = (n / 60);
            let rhours = Math.floor(hours);
            let minutes = (hours - rhours) * 60;
            let rminutes = Math.round(minutes);
            return rhours + "h" + ("0" + rminutes).slice(-2) + "min";
        }

        if (titleInput.current.value == null || titleInput.current.value === "" || descriptionInput.current.value == null || descriptionInput.current.value === "" ||
            dateInput.current.value == null || dateInput.current.value === "" || operationPicture == null) {
            setNotificationError(true);
            return;
        }

        let body = new FormData();
        body.append('title', titleInput.current.value);
        body.append('description', descriptionInput.current.value);
        body.append('date', dateInput.current.value);
        body.append('duration', timeConvert(diff));
        body.append('connectionStartTime', startTime.getHours() + "h" + ("0" + startTime.getMinutes()).slice(-2));
        body.append('picture', operationPicture);

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
                    ref={dateInput}
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
            <Tabs active={activeTab} onTabChange={onChange} >
                <Tabs.Tab label="Zeus" tabKey="zeus">
                    <Table>
                        <thead>
                        <tr>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Zeus</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </Tabs.Tab>
                <Tabs.Tab label="India 2" tabKey="india2">
                    <Table>
                        <thead>
                        <tr>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Chef de Groupe</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Auxiliaire Sanitaire</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Tireur de précision</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ textAlign: 'left', paddingLeft: 20 }}>300</th>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Chef d'équipe</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Fusillier</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>MG</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        </tbody>
                    </Table>

                    <Container>
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
                            <Button ml={20}>Créer</Button>
                        </div>
                    </Container>
                </Tabs.Tab>
                <Tabs.Tab icon={<SquarePlus size={16}/>} label="Créer un groupe" tabKey="createGroup">
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
                        <Button ml={20}>Créer</Button>
                    </div>
                </Tabs.Tab>
            </Tabs>
            <Button color={"green"} fullWidth mt={30} onClick={handleSubmit}>Créer l'opération</Button>
        </form>
    </>)
}

export default CreateOperation;
