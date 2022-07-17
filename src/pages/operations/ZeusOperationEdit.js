import {
    Badge,
    Button, Checkbox, Container, Group,
    Input,
    InputWrapper,
    MultiSelect,
    Notification,
    SimpleGrid,
    Skeleton, Switch, Table, Tabs, Text,
    Textarea, useMantineTheme
} from "@mantine/core";
import {
    AlignJustified,
    At, Calendar,
    Check,
    ChevronLeft,
    Id,
    LetterCase,
    LetterCaseToggle,
    Numbers, Pencil,
    Photo, SquarePlus, Trash,
    X
} from "tabler-icons-react";
import {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {DatePicker, TimeInput, TimeRangeInput} from "@mantine/dates";
import dayjs from "dayjs";
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

function ZeusOperationEdit() {
    const {id} = useParams();
    const [operation, setOperation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [notification, setNotification] = useState(false);
    const [operationTitle, setOperationTitle] = useState('');
    const [operationDate, setOperationDate] = useState(null);
    const [operationDescription, setOperationDescription] = useState('');
    const [operationPicture, setOperationPicture] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [duration, setDuration] = useState(null);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    const openRef = useRef();
    const theme = useMantineTheme();

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
                document.title = `${data.data.title} - La 7ème Compagnie`;
                setOperationTitle(data.data.title);
                setOperationDate(new Date(data.data.date));
                setOperationDescription(data.data.description);
                setOperationPicture(data.data.picture);
                setStartTime(new Date(data.data.connectionStartTime));
                setDuration([new Date(data.data.duration[0]), new Date(data.data.duration[1])]);
                setRoles(data.data.roles);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setNotFound(true);
            });
    }

    useEffect(() => {
        fetchOperation();
    }, []);


    const callback = (data) => {
        handleSubmit(data);
    }

    const handleSubmit = (data) => {
        let body = {};

        if (operationTitle !== operation.title)
            body.title = operationTitle;
        if (operationDescription !== operation.description)
            body.description = operationDescription;
        if (operationDate !== operation.date)
            body.date = operationDate;
        if (startTime !== operation.connectionStartTime)
            body.connectionStartTime = startTime;
        if (duration !== operation.duration)
            body.duration = duration;
        body.roles = data;

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/${operation._id}`, {
            method: 'PATCH',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((res) => res.json())
            .then(() => {
                setNotification(true);
            })
            .catch(err => {
                console.log(err);
            });
    }

    if (isLoading) {
        return (<>
            loading...
        </>)
    }

    if (notFound) {
        return (<>
            <h1>Impossible de trouvé la formation demandé</h1>
            <p>
                La formation que vous recherchez n'existe pas. <br />
                Vous pouvez retourner sur la liste des formations <Link to="/formers/operations">ici</Link>.
            </p>
        </>)
    }

    return (<>
        {notification ? <Notification mb={20} onClose={() => setNotification(false)} icon={<Check size={18} />} color="teal" title="Mise à jour de l'opération">
            L'opération {operation.title} correctement mis à jour !
        </Notification> : null}
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/zeus/operations')}>
            Retour
        </Button>
        <h1>{operation.title}</h1>
        <form>
            <SimpleGrid cols={2}>
                <InputWrapper
                    label={"Nom de l'opération"}
                    required
                >
                    <Input
                        icon={<LetterCaseToggle/>}
                        placeholder="Ex: Opération Bosso"
                        onChange={(e) => setOperationTitle(e.target.value)}
                        value={operationTitle}
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
                    value={operationDate}
                    onChange={(date) => setOperationDate(date)}
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
                    value={operationDescription}
                    onChange={(e) => setOperationDescription(e.target.value)}
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
                        <Button color={"green"} onClick={() => openRef.current()} id="btn-select-files" disabled title={"Désactiver momentanément. Veuillez supprimer, puis recréer la formation."}>{operationPicture}</Button>
                    </Group>
                </InputWrapper>
            </SimpleGrid>

            <h2>Configuration des groupes et des équipes</h2>
            <RolesCreation callback={callback} data={roles} buttonText={"Sauvegarder"}/>
        </form>
    </>)
}

export default ZeusOperationEdit;
