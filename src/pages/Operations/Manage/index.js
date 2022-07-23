import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Center, Modal, Pagination, Skeleton, Table, Text} from "@mantine/core";
import {AlertCircle, Check, Plus} from "tabler-icons-react";
import {showNotification, updateNotification} from "@mantine/notifications";
import {deleteOperation, getMaxPages, getOperations} from "../../../services/operations";
import Loading from "./Loading";

function OperationsManage() {
    const [operations, setOperations] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [opened, setOpened] = useState(false);
    const [currOperationModal, setCurrOperationModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const updateModal = (currOperation) => {
        setCurrOperationModal(currOperation)
        setOpened(true)
    }

    const updateOperations = (page) => {
        const currentPage = page || 1;

        getOperations(currentPage).then(data => {
            setOperations(data.data);
            setCurrOperationModal(data.data[0]);

            getMaxPages().then(data => {
                !data.data ? setMaxPages(1) : setMaxPages(data.data);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }

    const removeOperation = (operation) => {
        setOpened(false);

        showNotification({
            id: `delete-operation-${operation._id}`,
            loading: true,
            title: 'Suppression de l\'opération en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        deleteOperation(operation._id).then(() => {
            updateNotification({
                id: `delete-operation-${operation._id}`,
                color: 'teal',
                title: 'Suppression terminée',
                message: `Vous avez correctement supprimer l'opération ${operation.title}`,
                icon: <Check />,
                autoClose: 5000,
            });

            updateOperations(activePage);
            setCurrOperationModal(null);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getOperations(activePage).then(data => {
            setOperations(data.data);
            setCurrOperationModal(data.data[0]);

            getMaxPages().then(data => {
                !data.data ? setMaxPages(1) : setMaxPages(data.data);
                setIsLoading(false);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));

        document.title = "Opérations - La 7ème Compagnie";
    }, [activePage]);

    const rows = (operations.map((operation, i) => (
        <tr key={i}>
            <td>{operation.title}</td>
            <td>
                <Text lineClamp={1} size={"14px"}>
                    {operation.description}
                </Text>
            </td>
            <td>
                <Center>
                    <Button color="yellow" size="md" compact onClick={() => navigate(`/zeus/operations/${operation._id}`)}>
                        Editer
                    </Button>
                    <Button onClick={() => updateModal(operation)} color="red" size="md" ml={".5rem"} compact>
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
        <Button leftIcon={<Plus size={22}/>} onClick={() => navigate('/zeus/operations/new')}>Créer une opération</Button>
        <Center my={"1rem"}>
            <Pagination page={activePage} onChange={setActivePage} total={maxPages} withEdges />
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
        {!operations.length ? <Alert icon={<AlertCircle size={16} />} title="Pas de données" mt={10} color={"red"}>
            <Text>Aucunes opérations trouvées.</Text>
        </Alert> : ""}
        <Center mt={"1rem"}>
            <Pagination page={activePage} onChange={setActivePage} total={maxPages} withEdges />
        </Center>
        <Modal
            centered
            opened={opened}
            onClose={() => setOpened(false)}
            title={`Confirmation de la suppression de la formation ${currOperationModal == null ? "Null" : currOperationModal.title}`}
            size={"xl"}
            style={{paddingBottom: "-2rem"}}
        >
            <Text>
                La suppression de la formation <strong>supprimera toutes les données</strong> relatives à cette dernière (formateurs, formés, statistiques, etc.)<br/>
                <strong>Vous ne pourrez pas récupérer ces données.</strong>
            </Text>

            <div style={{display: "flex", justifyContent: "flex-end", marginTop: "2rem"}}>
                <Button variant={"outline"} color={"gray"}>Annuler</Button>
                <Button ml={"1rem"} color={"red"} onClick={() => removeOperation(currOperationModal)}>Supprimer</Button>
            </div>
        </Modal>
    </>);
}

export default OperationsManage;
