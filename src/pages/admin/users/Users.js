import {Button, Center, Modal, Pagination, Skeleton, Table, Text} from "@mantine/core";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Users({isLoading}) {
    const [users, setUsers] = useState([]);
    const [activePage, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [opened, setOpened] = useState(false);
    const [currUserModal, setCurrUserModal] = useState(null);
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
                setMaxPages(data.data);
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
        fetchMaxPages();
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
                        result = "Administrateur"
                    else if (role === 'TRAINER_ROLE')
                        result = "Formateur"
                    if (i < user.roles.length - 1)
                        return <span key={i}>{result}, </span>
                    return <span key={i}>{result}</span>;
                })
            }</td>
            <td>
                <Button color="yellow" size="md" compact onClick={() => navigate(`/admin/users/${user.identifier}`)}>
                    Editer
                </Button>
                <Button onClick={() => updateModal(user)} color="red" size="md" ml={".5rem"} compact>
                    Supprimer
                </Button>
            </td>
        </tr>
    ));

    return (<>
        <h1>Gérer les utilisateurs</h1>
        <Center mb={"1rem"}>
            <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
        </Center>
        <Skeleton visible={isLoading}>
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
        </Skeleton>
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
