import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Center, Modal, Pagination, Skeleton, Table, Text} from "@mantine/core";

function FormersTrainings() {
    const [trainings, setTrainings] = useState([]);
    const [activePage, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [opened, setOpened] = useState(false);
    const [currTrainingModal, setCurrTrainingModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [trainers, setTrainers] = useState([]);
    const navigate = useNavigate();

    const fetchTrainings = (page) => {
        const currPage = page || 1;

        fetch(`http://localhost:8000/api/v1/trainings?page=${currPage}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setTrainings(data.data);
                setCurrTrainingModal(data.data[0]);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    const fetchMaxPages = () => {
        fetch(`http://localhost:8000/api/v1/trainings/maxPages`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setMaxPages(data.data);
            })
            .catch(err => console.log(err));
    }

    const updateModal = (currTraining) => {
        setCurrTrainingModal(currTraining)
        setOpened(true)
    }

    const deleteTraining = (training) => {
        setOpened(false);
        fetch(`http://localhost:8000/api/v1/trainings/${training._id}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                fetchTrainings(activePage)
                setCurrTrainingModal(null)
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchTrainings(activePage);
        fetchMaxPages();
        document.title = "Formations - La 7ème Compagnie";
    }, [activePage]);

    const rows = (trainings.map((training, i) => (
        <tr key={i}>
            <td>{training.title}</td>
            <td>{training.description}</td>
            <td>
                <Button color="yellow" size="md" compact onClick={() => navigate(`/formers/trainings/${training._id}`)}>
                    Editer
                </Button>
                <Button onClick={() => updateModal(training)} color="red" size="md" ml={".5rem"} compact>
                    Supprimer
                </Button>
            </td>
        </tr>
    )));

    return (<>
        <h1>Gérer les formations</h1>
        <Center mb={"1rem"}>
            <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
        </Center>
        <Skeleton visible={isLoading}>
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
        </Skeleton>
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
                <Button ml={"1rem"} color={"red"} onClick={() => deleteTraining(currTrainingModal)}>Supprimer</Button>
            </div>
        </Modal>
    </>);
}

export default FormersTrainings;
