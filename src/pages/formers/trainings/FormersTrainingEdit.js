import {
    Button, Checkbox, Group,
    Input,
    InputWrapper,
    MultiSelect,
    SimpleGrid,
    Skeleton, Switch, Text,
    Textarea, useMantineTheme
} from "@mantine/core";
import {Check, ChevronLeft, LetterCase, Photo, X} from "tabler-icons-react";
import {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {showNotification, updateNotification} from "@mantine/notifications";

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

function FormersTrainingEdit() {
    const {id} = useParams();
    const [training, setTraining] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [newTrainers, setNewTrainers] = useState([]);
    const [allTrainers, setAllTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [trainingTitle, setTrainingTitle] = useState('');
    const [trainingDescription, setTrainingDescription] = useState('');
    const [trainingPicture, setTrainingPicture] = useState('');
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const openRef = useRef();
    const switchRef = useRef();

    const fetchTraining = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings/${id}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setTraining(data.data);
                fetchTrainers(data.data.trainers);
                document.title = `${data.data.title} - La 7ème Compagnie`;
                setTrainingTitle(data.data.title);
                setTrainingDescription(data.data.description);
                setTrainingPicture(data.data.picture);
            })
            .catch(err => {
                console.log(err);
                setNotFound(true);
            });
    }

    const fetchTrainers = (t) => {
        if (t.length === 0)
            fetchAllTrainers();
        t.forEach((trainer) => {
            fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${trainer}`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },
            })
                .then(res => res.json())
                .then(data => {
                    setTrainers(trainers => trainers.concat(data.data));
                    setNewTrainers(trainers => trainers.concat(data.data.identifier));
                    fetchAllTrainers();
                })
                .catch(err => console.log(err));
        })
    }

    const fetchAllTrainers = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/trainers`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setAllTrainers(data.data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchTraining();
    });

    const trainersName = trainers.map((trainer, i) => {
        if (isLoading === true) {
            return (
                <Skeleton key={i}/>
            )
        } else {
            return (
                trainer.identifier
            );
        }
    });

    const allTrainersName = allTrainers.map((trainer, i) => {
        if (isLoading === true) {
            return (
                <Skeleton key={i}/>
            )
        } else {
            return (
                {value: trainer.identifier, label: trainer.username}
            );
        }
    })

    const handleOnClick = () => {
        showNotification({
            id: `edit-training-${training._id}`,
            loading: true,
            title: 'Mise à jour de la formation en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        let body = {};

        if (trainingTitle !== training.title)
            body.title = trainingTitle;
        if (trainingDescription !== training.description)
            body.description = trainingDescription;
        if (trainingPicture !== training.picture)
            body.picture = trainingPicture;
        body.trainers = newTrainers;
        if (switchRef.current.checked !== training.isOpen)
            body.isOpen = switchRef.current.checked;

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings/${training._id}`, {
            method: 'PATCH',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((res) => res.json())
            .then((data) => {
                updateNotification({
                    id: `edit-training-${data.data._id}`,
                    color: 'teal',
                    title: 'Edition terminée',
                    message: `Vous avez correctement mis à jour la formation ${data.data.title}`,
                    icon: <Check />,
                    autoClose: 5000,
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    if (isLoading) {
        return (<>
            <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/admin/users')}>
                Retour
            </Button>
            <Skeleton my={38} height={16} width={200} />
            <form>
                <SimpleGrid cols={2}>
                    <InputWrapper
                        label={"Nom de la formation"}
                    >
                        <Skeleton height={36}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Formateurs"}
                    >
                        <Skeleton height={36}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Description"}
                    >
                        <Skeleton height={65}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Image de la formation"}
                    >
                        <Skeleton height={36} />
                    </InputWrapper>

                    <InputWrapper
                        label={"Les joueurs peuvent demander à être formé dès à présent"}
                    >
                        <Skeleton height={36} />
                    </InputWrapper>
                </SimpleGrid>
                <Button mt={"lg"} onClick={handleOnClick} disabled>
                    Sauvegarder
                </Button>
            </form>
        </>)
    }

    if (notFound) {
        return (<>
            <h1>Impossible de trouvé la formation demandé</h1>
            <p>
                La formation que vous recherchez n'existe pas. <br />
                Vous pouvez retourner sur la liste des formations <Link to="/formers/trainings">ici</Link>.
            </p>
        </>)
    }

    return (<>
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/formers/trainings')}>
            Retour
        </Button>
        <h1>Formation {training.title}</h1>
        <form action="#">
            <SimpleGrid cols={2}>
                <InputWrapper
                    label={"Nom de la formation"}
                >
                    <Input
                        icon={<LetterCase/>}
                        value={trainingTitle}
                        onChange={(e) => setTrainingTitle(e.target.value)}
                    />
                </InputWrapper>

                <MultiSelect
                    data={allTrainersName}
                    label="Formateurs"
                    placeholder="Ajouter / Supprimer des formateurs"
                    defaultValue={trainersName}
                    searchable
                    nothingFound="Aucun formateur trouvé"
                    onChange={setNewTrainers}
                />

                <Textarea
                    label="Description de la formation"
                    value={trainingDescription}
                    onChange={(e) => setTrainingDescription(e.target.value)}
                />

                <InputWrapper
                    label={"Image de la formation"}
                >
                    <Dropzone
                        style={{display: 'none'}}
                        onDrop={(files) => {
                            document.getElementById("btn-select-files").firstChild.firstChild.innerHTML = files[files.length - 1].name;
                        }}
                        onReject={(files) => console.log('rejected files', files)}
                        maxSize={3 * 1024 ** 2}
                        accept={IMAGE_MIME_TYPE}
                        openRef={openRef}
                    >
                        {(status) => dropzoneChildren(status, theme)}
                    </Dropzone>

                    <Group>
                        <Button color={"green"} onClick={() => openRef.current()} id="btn-select-files" disabled title={"Désactiver momentanément. Veuillez supprimer, puis recréer la formation."}>{trainingPicture}</Button>
                    </Group>
                </InputWrapper>

                <Group>
                    <Switch onLabel="OUI" offLabel="NON" defaultChecked={training.isOpen} ref={switchRef}
                            label="Les joueurs peuvent demander à être formé dès à présent"
                    />
                </Group>
            </SimpleGrid>

            <Button type="submit" mt={"lg"} onClick={handleOnClick}>
                Sauvegarder
            </Button>
        </form>
    </>)
}

export default FormersTrainingEdit;
