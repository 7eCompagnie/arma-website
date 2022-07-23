import {
    Button,
    Checkbox,
    Group,
    Input,
    InputWrapper,
    MultiSelect,
    SimpleGrid, Skeleton, Switch,
    Text,
    Textarea,
    useMantineTheme
} from "@mantine/core";
import {Check, LetterCase, Photo, X} from "tabler-icons-react";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {showNotification, updateNotification} from "@mantine/notifications";
import {createTraining} from "../../../services/trainings";
import {getTrainers} from "../../../services/users";
import isOneOfValuesNull from "../../../utils/isOneOfValuesNull";
import Loading from "./Loading";

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

function TrainingCreate() {
    const [isLoading, setIsLoading] = useState(true);
    const [allTrainers, setAllTrainers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [trainingPicture, setTrainingPicture] = useState(null);
    const theme = useMantineTheme();
    const openRef = useRef();
    const switchRef = useRef();
    const navigate = useNavigate();

    const handleOnClick = () => {
        const name = document.getElementById('input-name').value;
        const description = document.getElementById('input-description').value;

        if (isOneOfValuesNull([
            name, description, trainers, trainingPicture
        ]) || trainers.length === 0) {
            showNotification({
                id: "register-player-error",
                title: 'Erreur lors de la création de l\'opération',
                message: 'Veuillez renseigner les champs obligatoires.',
                icon: <X/>,
                autoClose: 5000,
                color: "red"
            });
            return;
        }

        showNotification({
            id: `create-training-${name}`,
            loading: true,
            title: 'Création de la formation en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        let body = new FormData();
        body.append('title', name);
        body.append('description', description);
        body.append('trainers', JSON.stringify(trainers));
        body.append('isOpen', switchRef.current.checked);
        body.append('picture', trainingPicture);

        createTraining(body).then(data => {
            updateNotification({
                id: `create-training-${data.data.title}`,
                color: 'teal',
                title: 'Création terminée',
                message: `Vous avez correctement créer la formation ${data.data.title}.`,
                icon: <Check />,
                autoClose: 5000,
            });
            navigate('/trainers/trainings');
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getTrainers().then((data) => {
            setAllTrainers(data);
            setIsLoading(false);
        });

        document.title = "Créer une formation - La 7ème Compagnie"
    }, []);

    const allTrainersName = allTrainers.map((trainer, i) => {
        return (
            {value: trainer.identifier, label: trainer.username}
        );
    })

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (<>
        <div>
            <h1>Créer une nouvelle formation</h1>
            <form id="create-training">
                <SimpleGrid cols={2}>
                    <InputWrapper
                        label={"Nom de la formation"}
                        required
                    >
                        <Input
                            id={"input-name"}
                            icon={<LetterCase/>}
                            placeholder={"Pilote de tigre"}
                        />
                    </InputWrapper>

                    <MultiSelect
                        data={allTrainersName}
                        label="Formateurs"
                        placeholder="Choisis les formateurs de la formation"
                        required
                        onChange={setTrainers}
                        value={trainers}
                        searchable
                    />

                    <Textarea
                        id={"input-description"}
                        label="Description de la formation"
                        placeholder="Cette formation vous apprendra les bases du combat en hélicoptère."
                        required
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
                                setTrainingPicture(files[files.length - 1]);
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

                    <Group>
                        <Switch onLabel="OUI" offLabel="NON" defaultChecked={true} id={"input-open"} ref={switchRef}
                            label="Les joueurs peuvent demander à être formé dès à présent"
                        />
                    </Group>
                </SimpleGrid>
            </form>

            <Button mt={"lg"} onClick={handleOnClick}>
                Créer la formation
            </Button>
        </div>
    </>);
}

export default TrainingCreate;