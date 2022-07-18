import {useEffect, useRef, useState} from "react";
import {
    Button, Center, Checkbox, Group,
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
import RolesCreation from "../../components/RolesCreation";

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
    const descriptionInput = useRef();
    const openRef = useRef();
    const [date, setDate] = useState(null);
    const [duration, setDuration] = useState([new Date(new Date().setHours(21, 0, 0, 0)), new Date(new Date().setHours(23, 0, 0, 0))]);
    const [startTime, setStartTime] = useState(new Date(new Date().setHours(20, 0, 0, 0)));
    const [operationPicture, setOperationPicture] = useState(null);
    const [notificationError, setNotificationError] = useState(false);
    const theme = useMantineTheme();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Création d'une opération - La 7ème Compagnie";
    }, []);

    const callback = (data) => {
        handleSubmit(data);
    }

    const handleSubmit = (data) => {
        if (titleInput.current.value == null || titleInput.current.value === "" || descriptionInput.current.value == null || descriptionInput.current.value === "" ||
            date === null || operationPicture == null) {
            setNotificationError(true);
            return;
        }

        data.forEach(group => {
            group.group.forEach(item => {
               delete item.isEditing;
            });
            group.teams.forEach(item => {
                delete item.isEditing;
            });
        });

        let body = new FormData();
        body.append('title', titleInput.current.value);
        body.append('description', descriptionInput.current.value);
        body.append('date', date.toString());
        body.append('duration', duration[0].toString());
        body.append('duration', duration[1].toString());
        body.append('connectionStartTime', startTime.toString());
        body.append('picture', operationPicture);
        body.append('roles', JSON.stringify(data));

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
            <RolesCreation callback={callback} buttonText={"Créer l'opération"}/>
        </form>
    </>)
}

export default CreateOperation;
