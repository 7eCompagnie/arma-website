import {Button, Center, Pagination, Table} from "@mantine/core";
import {useEffect, useState} from "react";

function Users() {
    const [users, setUsers] = useState([]);
    const [activePage, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);

    const fetchUsers = (page) => {
        const currPage = page || 1;
        fetch(`http://localhost:8000/api/v1/users?page=${currPage}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data.data);
            })
            .catch(err => console.log(err));
    }

    const fetchMaxPages = () => {
        fetch(`http://localhost:8000/api/v1/users/maxPages`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.data);
                setMaxPages(data.data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchUsers(activePage);
        fetchMaxPages();
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
                    else if (role === 'FORMATOR_ROLE')
                        result = "Formateur"
                    if (i < user.roles.length - 1)
                        return <span key={i}>{result}, </span>
                    return <span key={i}>{result}</span>;
                })
            }</td>
            <td>
                <Button color="yellow" size="md" compact>
                    Editer
                </Button>
                <Button color="red" size="md" ml={".5rem"} compact>
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
        <Center mt={"1rem"}>
            <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
        </Center>
    </>);
}

export default Users;
