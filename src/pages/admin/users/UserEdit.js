import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Input, InputWrapper, MultiSelect, Notification, SimpleGrid, Skeleton} from "@mantine/core";
import {At, Check, ChevronLeft, Id, LetterCase, Numbers} from "tabler-icons-react";

function UserEdit() {
    const {identifier} = useParams();
    const [user, setUser] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newRoles, setNewRoles] = useState([]);
    const [notification, setNotification] = useState(false);
    const navigate = useNavigate();

    const fetchUser = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${identifier}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setUser(data.data);
                setNewRoles(data.data.roles)
                document.title = `Utilisateur ${data.data.username} - La 7ème Compagnie`;
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setNotFound(true);
            });
    }

    const updateUser = () => {
        let body = {};

        body.roles = newRoles;

        console.log(body);

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${identifier}`, {
            method: 'PATCH',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((res) => res.json())
            .then((data) => {
                setNotification(true);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const roles = [
        { value: 'USER_ROLE', label: 'Utilisateur' },
        { value: 'TRAINER_ROLE', label: 'Formateur' },
        { value: 'ADMIN_ROLE', label: 'Zeus' },
    ]

    if (notFound) {
        return (<>
            <h1>Impossible de trouvé l'utilisateur demandé</h1>
            <p>
                L'utilisateur que vous recherchez n'existe pas. <br />
                Vous pouvez retourner sur la liste des utilisateurs <Link to="/admin/users">ici</Link>.
            </p>
        </>)
    }

    if (isLoading) {
        return (<>
            <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/admin/users')}>
                Retour
            </Button>

            <Skeleton my={38} height={16} width={200} />
            <h2>Général</h2>
            <form>
                <SimpleGrid cols={2}>
                    <InputWrapper
                        label={"Nom d'utilisateur"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Discriminateur Discord"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Email"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Identifiant"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Rôles"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>
                </SimpleGrid>
                <Button mt={"2rem"} onClick={updateUser} disabled>Sauvegarder</Button>
            </form>
        </>)
    }

    return (<>
        {notification ? <Notification mb={20} onClose={() => setNotification(false)} icon={<Check size={18} />} color="teal" title="Mise à jour de l'utilisateur">
                Utilisateur {user.username} correctement mis à jour !
        </Notification> : null}
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/zeus/users')}>
            Retour
        </Button>
        <h1>Utilisateur {user.username}</h1>
        <h2>Général</h2>
        <form>
            <SimpleGrid cols={2}>
                <InputWrapper
                    label={"Nom d'utilisateur"}
                >
                    <Input
                        icon={<LetterCase/>}
                        value={user.username}
                        disabled
                        title={"Vous ne pouvez pas changer le pseudo d'un utilisateur."}
                    />
                </InputWrapper>


                <InputWrapper
                    label={"Discriminateur Discord"}
                >
                    <Input
                        icon={<Numbers/>}
                        value={user.discriminator}
                        disabled
                        title={"Vous ne pouvez pas changer le discriminateur Discord d'un utilisateur."}
                    />
                </InputWrapper>
                <InputWrapper
                    label={"Email"}
                >
                    <Input
                        icon={<At/>}
                        value={user.email}
                        disabled
                        title={"Vous ne pouvez pas changer l'email d'un utilisateur."}
                    />
                </InputWrapper>

                <InputWrapper
                    label={"Identifiant"}
                >
                    <Input
                        icon={<Id/>}
                        value={user.identifier}
                        disabled
                        title={"Vous ne pouvez pas changer l'identifiant d'un utilisateur."}
                    />
                </InputWrapper>

                <MultiSelect
                    data={roles}
                    label="Rôles"
                    placeholder="Ajouter / Supprimer des rôles"
                    defaultValue={user.roles}
                    searchable
                    nothingFound="Aucun rôle trouvé"
                    onChange={setNewRoles}
                />
            </SimpleGrid>

            <Button mt={"2rem"} onClick={updateUser}>Sauvegarder</Button>
        </form>
    </>)
}

export default UserEdit;
