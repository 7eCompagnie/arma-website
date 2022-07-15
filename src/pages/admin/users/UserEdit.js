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
                setIsLoading(false);
                document.title = `Utilisateur ${data.data.username} - La 7ème Compagnie`;
            })
            .catch(err => {
                console.log(err);
                setNotFound(true);
            });
    }

    const updateUser = () => {
        const body = new URLSearchParams();
        newRoles.forEach((role) => {
            body.append('roles', role);
        })

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${identifier}`, {
            method: 'PATCH',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
            body: body
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
        { value: 'ADMIN_ROLE', label: 'Administrateur' },
    ]

    if (isLoading) {
        return (<>
            <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/admin/users')}>
                Retour
            </Button>
            <Skeleton my={38} height={10} width={150} />
            <h2>Général</h2>
            <form>
                <SimpleGrid cols={2}>
                    <div>
                        <Skeleton height={8} width={100} my={10}/>
                        <Skeleton height={36} width={"100%"}/>
                    </div>

                    <div>
                        <Skeleton height={8} width={100} my={10}/>
                        <Skeleton height={36} width={"100%"}/>
                    </div>

                    <div>
                        <Skeleton height={8} width={100} my={10}/>
                        <Skeleton height={36} width={"100%"}/>
                    </div>
                </SimpleGrid>
            </form>
        </>)
    }

    if (notFound) {
        return (<>
            <h1>Impossible de trouvé l'utilisateur demandé</h1>
            <p>
                L'utilisateur que vous recherchez n'existe pas. <br />
                Vous pouvez retourner sur la liste des utilisateurs <Link to="/admin/users">ici</Link>.
            </p>
        </>)
    }

    return (<>
        {notification ? <Notification mb={20} onClose={() => setNotification(false)} icon={<Check size={18} />} color="teal" title="Mise à jour de l'utilisateur">
                Utilisateur {user.username} correctement mis à jour !
        </Notification> : null}
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/admin/users')}>
            Retour
        </Button>
        <h1 style={{marginTop: 0}}>Utilisateur {user.username}</h1>
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
                    label="Roles"
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
