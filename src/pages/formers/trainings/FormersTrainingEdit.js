import {
    Badge,
    Button,
    Input,
    InputWrapper,
    MultiSelect,
    Notification,
    SimpleGrid,
    Skeleton,
    Textarea
} from "@mantine/core";
import {AlignJustified, At, Check, ChevronLeft, Id, LetterCase, Numbers} from "tabler-icons-react";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

function FormersTrainingEdit() {
    const {id} = useParams();
    const [training, setTraining] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [allTrainers, setAllTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [notification, setNotification] = useState(false);
    const navigate = useNavigate();

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
            })
            .catch(err => {
                console.log(err);
                setNotFound(true);
            });
    }

    const fetchTrainers = (t) => {
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
                    document.title = `${data.data.title} - La 7ème Compagnie`;
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
    }, []);

    // const trainersName = trainers.map((trainer, i) => {
    //     return (trainer.username);
    // });

    const allTrainersName = allTrainers.map((trainer) => {
        return (trainer.name);
    })

    if (isLoading) {
        return (<>
            <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/admin/users')}>
                Retour
            </Button>
            <Skeleton my={38} height={10} width={150} />
            <form>
                <SimpleGrid cols={2}>
                    <div>
                        <Skeleton height={8} width={100} my={10}/>
                        <Skeleton height={36} width={"100%"}/>
                    </div>

                    <div>
                        <Skeleton height={8} width={100} my={10}/>
                        <Skeleton height={36} width={"100%"}/>
                    </div>

                    <div>
                        <Skeleton height={8} width={100} my={10}/>
                        <Skeleton height={36} width={"100%"}/>
                    </div>
                </SimpleGrid>
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
        {notification ? <Notification mb={20} onClose={() => setNotification(false)} icon={<Check size={18} />} color="teal" title="Mise à jour de l'utilisateur">
            Formation {training.title} correctement mis à jour !
        </Notification> : null}
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/formers/trainings')}>
            Retour
        </Button>
        <h1 style={{marginTop: 0}}>Formation {training.title}</h1>
        <form>
            <SimpleGrid cols={2}>
                <InputWrapper
                    label={"Nom"}
                >
                    <Input
                        icon={<LetterCase/>}
                        value={training.title}
                        disabled
                    />
                </InputWrapper>

                <InputWrapper
                    label={"Description"}
                >
                    <Textarea
                        icon={<AlignJustified/>}
                        value={training.description}
                        disabled
                    />
                </InputWrapper>

                {/*<MultiSelect*/}
                {/*    data={allTrainersName}*/}
                {/*    label="Formateurs"*/}
                {/*    placeholder="Ajouter / Supprimer des formateurs"*/}
                {/*    // defaultValue={trainersName}*/}
                {/*    searchable*/}
                {/*    nothingFound="Aucun formateur trouvé"*/}
                {/*    onChange={setTrainers}*/}
                {/*/>*/}
            </SimpleGrid>

            {/*<Button mt={"2rem"} onClick={updateUser}>Sauvegarder</Button>*/}
        </form>
    </>)
}

export default FormersTrainingEdit;
