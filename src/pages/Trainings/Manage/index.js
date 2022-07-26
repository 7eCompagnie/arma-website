import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Center, Modal, Pagination, Table, Text} from "@mantine/core";
import {AlertCircle, Check, Plus} from "tabler-icons-react";
import {showNotification, updateNotification} from "@mantine/notifications";
import {deleteTraining, getMaxPages, getTrainings} from "../../../services/trainings";
import Loading from "./Loading";

function TrainingsManage() {
    const [trainings, setTrainings] = useState([]);
    const [activePage, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [opened, setOpened] = useState(false);
    const [currTrainingModal, setCurrTrainingModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUpdate = (page) => {
        const currPage = page || 1;

        getTrainings(currPage).then(data => {
            setTrainings(data.data);
            setCurrTrainingModal(data.data[0]);

            getMaxPages().then(data => {
                !data.data ? setMaxPages(1) : setMaxPages(data.data);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getTrainings(activePage).then(data => {
            setTrainings(data.data);
            setCurrTrainingModal(data.data[0]);

            getMaxPages().then(data => {
                !data.data ? setMaxPages(1) : setMaxPages(data.data);
                setIsLoading(false);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        document.title = "Formations - La 7ème Compagnie";
    }, [activePage]);

    const updateModal = (currTraining) => {
        setCurrTrainingModal(currTraining)
        setOpened(true)
    }

    const removeTraining = (training) => {
        setOpened(false);

        showNotification({
            id: `delete-training-${training._id}`,
            loading: true,
            title: 'Suppression de la formation en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        deleteTraining(training._id).then(data => {
            updateNotification({
                id: `delete-training-${training._id}`,
                color: 'teal',
                title: 'Suppression terminée',
                message: `Vous avez correctement supprimer la formation ${training.title}`,
                icon: <Check />,
                autoClose: 5000,
            });

            fetchUpdate(activePage);
            setCurrTrainingModal(null);
        }).catch(err => console.log(err));
    }

    const rows = (trainings.map((training, i) => (
        <tr key={i}>
            <td>{training.title}</td>
            <td>
                <Text lineClamp={1} size={"14px"}>
                    {training.description}
                </Text>
            </td>
            <td>
                <Center>
                    <Button color="yellow" size="md" compact onClick={() => navigate(`/trainers/trainings/${training._id}`)}>
                        Editer
                    </Button>
                    <Button onClick={() => updateModal(training)} color="red" size="md" ml={".5rem"} compact>
                        Supprimer
                    </Button>
                </Center>
            </td>
        </tr>
    )));

    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (<>
        <h1>Gérer les formations</h1>
        <Button leftIcon={<Plus size={22}/>} onClick={() => navigate('/trainers/trainings/new')}>Créer une formation</Button>
        <Center my={"1rem"}>
            <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
        </Center>
        <Table striped highlightOnHover>
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
        {!trainings.length ? <Alert icon={<AlertCircle size={16} />} title="Pas de données" mt={10} color={"red"}>
            <Text>Aucunes formations trouvées.</Text>
        </Alert> : ""}
        <Center mt={"1rem"}>
            <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
        </Center>
        <Modal
            centered
            opened={opened}
            onClose={() => setOpened(false)}
            title={`Confirmation de la suppression de la formation ${currTrainingModal == null ? "Null" : currTrainingModal.title}`}
            size={"xl"}
            style={{paddingBottom: "-2rem"}}
        >
            <Text>
                La suppression de la formation <strong>supprimera toutes les données</strong> relatives à cette dernière (formateurs, formés, statistiques, etc.)<br/>
                <strong>Vous ne pourrez pas récupérer ces données.</strong>
            </Text>

            <div style={{display: "flex", justifyContent: "flex-end", marginTop: "2rem"}}>
                <Button variant={"outline"} color={"gray"}>Annuler</Button>
                <Button ml={"1rem"} color={"red"} onClick={() => removeTraining(currTrainingModal)}>Supprimer</Button>
            </div>
        </Modal>
    </>);
}

export default TrainingsManage;
