import {Alert, Button, Center, Modal, Pagination, Skeleton, Table, Text} from "@mantine/core";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AlertCircle} from "tabler-icons-react";

function Users() {
    const [users, setUsers] = useState([]);
    const [activePage, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [opened, setOpened] = useState(false);
    const [currUserModal, setCurrUserModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUsers = (page) => {
        const currPage = page || 1;

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users?page=${currPage}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data.data);
                setCurrUserModal(data.data[0]);
                fetchMaxPages();
            })
            .catch(err => console.log(err));
    }

    const fetchMaxPages = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/maxPages`, {
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

    const updateModal = (currUser) => {
        setCurrUserModal(currUser)
        setOpened(true)
    }

    const deleteUser = (user) => {
        setOpened(false);
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${user.identifier}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                fetchUsers(activePage)
                setCurrUserModal(null)
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchUsers(activePage);
        document.title = "Utilisateurs - La 7ème Compagnie";
    }, [activePage]);

    const rows = users.map((user, i) => (
        <tr key={i}>
            <td>{user.username}#{user.discriminator}</td>
            <td>{user.email}</td>
            <td>{
                user.roles.map((role, i) => {
                    let result = " ";
                    if (role === 'USER_ROLE')
                        result = "Utilisateur"
                    else if (role === 'ADMIN_ROLE')
                        result = "Zeus"
                    else if (role === 'TRAINER_ROLE')
                        result = "Formateur"
                    if (i < user.roles.length - 1)
                        return <span key={i}>{result}, </span>
                    return <span key={i}>{result}</span>;
                })
            }</td>
            <td>
                <Center>
                    <Button color="yellow" size="md" compact onClick={() => navigate(`/zeus/users/${user.identifier}`)}>
                        Editer
                    </Button>
                    <Button onClick={() => updateModal(user)} color="red" size="md" ml={".5rem"} compact>
                        Supprimer
                    </Button>
                </Center>
            </td>
        </tr>
    ));

    if (isLoading) {
        return (<>
            <h1>Gérer les utilisateurs</h1>
            <Center my={"1rem"}>
                <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
            </Center>
            <Table striped highlightOnHover>
                <thead>
                <tr>
                    <th>Pseudo</th>
                    <th>Adresse email</th>
                    <th>Roles</th>
                    <th>Actions</th>
                </tr>
                </thead>
            </Table>
            <Skeleton height={250} mt={10} />
            <Center mt={"1rem"}>
                <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
            </Center>
        </>)
    }

    return (<>
        <h1>Gérer les utilisateurs</h1>
        <Center my={"1rem"}>
            <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
        </Center>
        <Table striped highlightOnHover>
            <thead>
            <tr>
                <th>Pseudo</th>
                <th>Adresse email</th>
                <th>Roles</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
        {!users.length ? <Alert icon={<AlertCircle size={16} />} title="Pas de données" mt={10} color={"red"}>
            <Text>Aucuns utilisateurs trouvés.</Text>
        </Alert> : ""}
        <Center mt={"1rem"}>
            <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
        </Center>
        <Modal
            centered
            opened={opened}
            onClose={() => setOpened(false)}
            title={`Confirmation de la suppression du compte de ${currUserModal == null ? "Null" : currUserModal.username}`}
            size={"xl"}
            style={{paddingBottom: "-2rem"}}
        >
            <Text>
                La suppression du compte <strong>supprimera toutes les données</strong> relatives à ce dernier (formations, opérations, statistiques, etc.)<br/>
                <strong>Vous ne pourrez pas récupérer ces données.</strong>
            </Text>

            <div style={{display: "flex", justifyContent: "flex-end", marginTop: "2rem"}}>
                <Button variant={"outline"} color={"gray"}>Annuler</Button>
                <Button ml={"1rem"} color={"red"} onClick={() => deleteUser(currUserModal)}>Supprimer</Button>
            </div>
        </Modal>
    </>);
}

export default Users;
