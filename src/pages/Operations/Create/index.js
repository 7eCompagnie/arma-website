import {useEffect, useRef, useState} from "react";
import {
    Button,
    Checkbox,
    Group,
    Input,
    InputWrapper,
    NumberInput,
    SimpleGrid,
    Text,
    Textarea,
    useMantineTheme
} from "@mantine/core";
import {Calendar, Check, LetterCaseToggle, Numbers, Photo, Server, ShieldLock, X} from "tabler-icons-react";
import {DatePicker, TimeInput, TimeRangeInput} from "@mantine/dates";
import 'dayjs/locale/fr';
import dayjs from "dayjs";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {useNavigate} from "react-router-dom";
import RolesCreation from "../../../components/RolesCreation";
import {showNotification, updateNotification} from "@mantine/notifications";
import {createOperation} from "../../../services/operations";
import isOneOfValuesNull from "../../../utils/isOneOfValuesNull";

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
// TODO: Clean code
function OperationCreate() {
    const titleInput = useRef();
    const descriptionInput = useRef();
    const openRef = useRef();
    const armaAddress = useRef('s1.vxls.net');
    const armaPort = useRef(2302);
    const armaPassword = useRef('456');
    const teamspeakAddress = useRef('TAF1');
    const teamspeakPassword = useRef('');
    const [date, setDate] = useState(null);
    const [duration, setDuration] = useState([new Date(new Date().setHours(21, 0, 0, 0)), new Date(new Date().setHours(23, 0, 0, 0))]);
    const [startTime, setStartTime] = useState(new Date(new Date().setHours(20, 0, 0, 0)));
    const [operationPicture, setOperationPicture] = useState(null);
    const theme = useMantineTheme();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Création d'une opération - La 7ème Compagnie";
    }, []);

    const callback = (e, data) => {
        handleSubmit(e, data);
    }

    const handleSubmit = (e, data) => {
        e.preventDefault();

        if (isOneOfValuesNull([
            titleInput.current.value,
            descriptionInput.current.value,
            date,
            operationPicture
        ])) {
            showNotification({
                id: "operation-creation-error",
                title: 'Erreur lors de la création de l\'opération',
                message: 'Veuillez renseigner les champs obligatoires.',
                icon: <X/>,
                autoClose: 5000,
                color: "red"
            });
            return;
        }

        showNotification({
            id: `create-operation-${titleInput.current.value}`,
            loading: true,
            title: 'Création de l\'opération en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        data.forEach(group => {
            group.group.forEach(item => {
                delete item.isEditing;
            });
            group.teams.forEach(item => {
                delete item.isEditing;
            });
        });

        duration[0].setDate(date.getDate());
        duration[1].setDate(date.getDate());
        startTime.setDate(date.getDate());

        let body = new FormData();
        body.append('title', titleInput.current.value);
        body.append('description', descriptionInput.current.value);
        body.append('date', date.toUTCString());
        body.append('duration', duration[0].toUTCString());
        body.append('duration', duration[1].toUTCString());
        body.append('connectionStartTime', startTime.toUTCString());
        body.append('picture', operationPicture);
        body.append('roles', JSON.stringify(data));
        body.append('serversInformations', JSON.stringify({
            arma: {
                address: armaAddress.current.value,
                port: armaPort.current.value,
                password: armaPassword.current.value
            },
            teamspeak: {
                address: teamspeakAddress.current.value,
                password: teamspeakPassword.current.value
            }
        }));

        createOperation(body).then((data) => {
            if (data.success === true) {
                updateNotification({
                    id: `create-operation-${data.data.title}`,
                    color: 'teal',
                    title: 'Création terminée',
                    message: `Vous avez correctement créer l'opération ${data.data.title}`,
                    icon: <Check/>,
                    autoClose: 5000,
                });
                navigate('/zeus/operations');
            } else {
                updateNotification({
                    id: `create-operation-${titleInput.current.value}`,
                    color: 'red',
                    title: 'Erreur lors de la création de l\'opération',
                    message: `${data.message}`,
                    icon: <X/>,
                    autoClose: 5000,
                });
            }
        }).catch((error) => console.log(error));
    }

    return (<>
        <h1>Créer une opération</h1>

        <form>
            <h2>Général</h2>
            <SimpleGrid cols={2} mb={50}>
                <InputWrapper
                    label={"Nom de l'opération"}
                    required
                >
                    <Input
                        ref={titleInput}
                        icon={<LetterCaseToggle/>}
                        placeholder="Ex: Opération Bosso"
                        required
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
                        <Button onClick={() => openRef.current()} id="btn-select-files">Sélectionner une image</Button>
                    </Group>
                </InputWrapper>
            </SimpleGrid>

            <h2>Serveurs</h2>
            <SimpleGrid cols={2} mb={50}>
                <div>
                    <h3 style={{marginTop: 0}}>Arma</h3>
                    <InputWrapper
                        label={"Adresse"}
                        required
                    >
                        <Input
                            ref={armaAddress}
                            icon={<Server/>}
                            placeholder="Ex: s1.vxls.net"
                            defaultValue="s1.vxls.net"
                            required
                        />
                    </InputWrapper>

                    <InputWrapper
                        label={"Port"}
                        required
                        mt={16}
                    >
                        <NumberInput
                            ref={armaPort}
                            icon={<Numbers />}
                            placeholder="Ex: 2302"
                            defaultValue={2302}
                        required/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Mot de passe (vide si pas de mot de passe)"}
                        mt={16}
                    >
                        <Input
                            ref={armaPassword}
                            icon={<ShieldLock />}
                            placeholder="Ex: 456"
                            defaultValue="456"
                        />
                    </InputWrapper>
                </div>
                <div>
                    <h3 style={{marginTop: 0}}>TeamSpeak</h3>
                    <InputWrapper
                        label={"Adresse"}
                        required
                    >
                        <Input
                            ref={teamspeakAddress}
                            icon={<Server/>}
                            placeholder="Ex: TAF1"
                            defaultValue="TAF1"
                            required
                        />
                    </InputWrapper>

                    <InputWrapper
                        label={"Mot de passe (vide si pas de mot de passe)"}
                        mt={16}
                    >
                        <Input
                            ref={teamspeakPassword}
                            icon={<ShieldLock />}
                            placeholder="Ex: 456"
                            defaultValue=""
                        />
                    </InputWrapper>
                </div>
            </SimpleGrid>

            <h2>Configuration des groupes et des équipes</h2>
            <RolesCreation callback={callback} buttonText={"Créer l'opération"}/>
        </form>
    </>)
}

export default OperationCreate;
