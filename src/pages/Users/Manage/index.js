import {Center, Pagination} from "@mantine/core";
import {useEffect, useState} from "react";
import {deleteUser, getMaxPages, getUsers} from "../../../services/users";
import Loading from "./Loading";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {showNotification, updateNotification} from "@mantine/notifications";
import {Check} from "tabler-icons-react";
import UsersListing from "./UsersListing";
import {getTrainings} from "../../../services/trainings";

function Users() {
    const [users, setUsers] = useState([]);
    const [activePage, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [opened, setOpened] = useState(false);
    const [currUserModal, setCurrUserModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        document.title = "Utilisateurs - La 7ème Compagnie";

        getUsers(activePage).then(data => {
            setUsers(data.data);
            setCurrUserModal(data.data[0]);

            getMaxPages().then(data => {
                !data.data ? setMaxPages(1) : setMaxPages(data.data);

                getTrainings(-1).then(data => {
                    setTrainings(data.data);
                    setIsLoading(false);
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }, [activePage]);

    const updateUsers = (page) => {
        const currPage = page || 1;

        getUsers(currPage).then(data => {
            setUsers(data.data);
            setCurrUserModal(data.data[0]);

            getMaxPages().then(data => {
                if (data.data === 0)
                    setMaxPages(1);
                else
                    setMaxPages(data.data);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }

    const removeUser = (user) => {
        setOpened(false);

        showNotification({
            id: `delete-user-${user.identifier}`,
            loading: true,
            title: 'Suppression de l\'utilisateur...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        deleteUser(user.identifier).then(() => {
            updateNotification({
                id: `delete-user-${user.identifier}`,
                color: 'teal',
                title: 'Utilisateur supprimé',
                message: `L'utilisateur ${user.username} a été correctement supprimé.`,
                icon: <Check/>,
                autoClose: 5000,
            });
            updateUsers(activePage);
            setCurrUserModal(null);
        }).catch(err => console.log(err));
    }

    const updateModal = (currUser) => {
        setCurrUserModal(currUser)
        setOpened(true)
    }

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (<>
            <h1>Gérer les utilisateurs ({users.length})</h1>

            <Center my={"1rem"}>
                <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
            </Center>

            <UsersListing users={users} trainings={trainings} onDelete={updateModal}/>

            <Center mt={"1rem"}>
                <Pagination page={activePage} onChange={setPage} total={maxPages} withEdges />
            </Center>

            <ConfirmDeleteModal user={currUserModal} opened={opened} onClose={() => setOpened(false)} onConfirm={() => removeUser(currUserModal)} />
    </>
    );
}

export default Users;
