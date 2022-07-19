import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Center, Modal, Pagination, Skeleton, Table, Text} from "@mantine/core";
import {AlertCircle, Plus} from "tabler-icons-react";

function ZeusOperations() {
    const [operations, setOperations] = useState([]);
    const [activePage, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [opened, setOpened] = useState(false);
    const [currOperationModal, setCurrOperationModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOperations = (page) => {
        const currPage = page || 1;

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations?page=${currPage}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setOperations(data.data);
                setCurrOperationModal(data.data[0]);
                fetchMaxPages();
            })
            .catch(err => console.log(err));
    }

    const fetchMaxPages = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/maxPages`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.data === 0)
                    setMaxPages(1);
                else
                    setMaxPages(data.data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    const updateModal = (currOperation) => {
        setCurrOperationModal(currOperation)
        setOpened(true)
    }

    const deleteOperation = (operation) => {
        setOpened(false);
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/${operation._id}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                fetchOperations(activePage)
                setCurrOperationModal(null)
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchOperations(activePage);
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
        return (<>
            <h1>Gérer les opérations</h1>
            <Button leftIcon={<Plus size={22}/>} onClick={() => navigate('/zeus/operations/new')}>Créer une opération</Button>
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
            </Table>
            <Skeleton height={250} mt={10} />
            <Center mt={"1rem"}>
                <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
            </Center>
        </>);
    }

    return (<>
        <h1>Gérer les formations</h1>
        <Button leftIcon={<Plus size={22}/>} onClick={() => navigate('/zeus/operations/new')}>Créer une opération</Button>
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
        {!operations.length ? <Alert icon={<AlertCircle size={16} />} title="Pas de données" mt={10} color={"red"}>
            <Text>Aucunes opérations trouvées.</Text>
        </Alert> : ""}
        <Center mt={"1rem"}>
            <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
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
                <Button ml={"1rem"} color={"red"} onClick={() => deleteOperation(currOperationModal)}>Supprimer</Button>
            </div>
        </Modal>
    </>);
}

export default ZeusOperations;
