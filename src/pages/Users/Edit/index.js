import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button} from "@mantine/core";
import {Check, ChevronLeft} from "tabler-icons-react";
import {showNotification, updateNotification} from "@mantine/notifications";
import {getUser, updateUser} from "../../../services/users";
import NotFound from "./NotFound";
import Loading from "./Loading";
import FormContent from "./FormContent";
import {getTrainings} from "../../../services/trainings";

function UserEdit() {
    const {identifier} = useParams();
    const [user, setUser] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newRoles, setNewRoles] = useState([]);
    const [newTrainings, setNewTrainings] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const navigate = useNavigate();

    const patchUser = (e) => {
        e.preventDefault();
        if (newRoles === user.roles && newTrainings === user.trained)
            return;

        showNotification({
            id: `edit-user-${identifier}`,
            loading: true,
            title: 'Mise à jour de l\'utilisateur...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        updateUser(identifier, {
            roles: newRoles,
            trained: newTrainings
        }).then((data) => {
            getUser(identifier).then(data => {
                setUser(data.data);
                setNewRoles(data.data.roles)
                setNewTrainings(data.data.trainings)
            }).catch(err => {
                console.log(err);
                setNotFound(true);
            });

            updateNotification({
                id: `edit-user-${data.data.identifier}`,
                color: 'teal',
                title: 'Utilisateur mis à jour',
                message: `L'utilisateur ${data.data.username} a été correctement mis à jour.`,
                icon: <Check/>,
                autoClose: 5000,
            });
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getUser(identifier).then(data => {
            setUser(data.data);
            setNewRoles(data.data.roles);
            setNewTrainings(data.data.trained);
            document.title = `Utilisateur ${data.data.username} - La 7ème Compagnie`;

            getTrainings(-1).then(data => {
                setTrainings(data.data);
                setIsLoading(false);
            }).catch(err => console.log(err));

        }).catch(err => {
            console.log(err);
            setNotFound(true);
        });
    }, [identifier]);

    if (notFound) {
        return (
            <NotFound />
        )
    }

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (<>
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/head-quarters/users')}>
            Retour
        </Button>
        <h1>Utilisateur {user.username}</h1>
        <h2>Général</h2>
        <form action="#">
            <FormContent user={user} trainings={trainings} onRolesChange={setNewRoles} onTrainingsChange={setNewTrainings}/>

            <Button color={"teal"} type="submit" mt={"2rem"} onClick={(e) => patchUser(e)}>Sauvegarder</Button>
        </form>
    </>)
}

export default UserEdit;
