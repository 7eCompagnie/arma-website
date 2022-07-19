import {Button, Center, Input, InputWrapper, Select, SimpleGrid, Skeleton, Table, Tabs} from "@mantine/core";
import {AlertTriangle, CircleCheck, Pencil, SquarePlus, Trash, X} from "tabler-icons-react";
import {useEffect, useState} from "react";
import {showNotification} from "@mantine/notifications";

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function RolesCreation({callback, data, buttonText}) {
    const [activeTab, setActiveTab] = useState(0);
    const [trainings, setTrainings] = useState([]);
    const [currentTraining, setCurrentTraining] = useState(null);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tabs, setTabs] = useState(data || [{
        title: "Zeus",
        group: [
            { role: 'Zeus', team: "Zeus", player: null, isEditing: false },
            { role: 'Co-Zeus', team: "Zeus", player: null, isEditing: false },
        ],
        teams: [
            { name: "Zeus", isEditing: false },
        ]
    }]);

    const fetchTrainings = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setTrainings(data.data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchTrainings();
    }, []);

    const changeTab = (active, tabKey) => {
        setActiveTab(active);
    };

    const trainingsData = trainings.map(training => {
        return {
            value: training._id,
            label: training.title
        }
    });

    const addTab = () => {
        const input = document.getElementById('group-name');

        if (input.value === '' || input.value === null) {
            showNotification({
                id: "tab-creation-error",
                title: 'Erreur lors de la création du groupe',
                message: 'Veuillez renseigner les champs obligatoires.',
                icon: <X/>,
                autoClose: 5000,
                color: "red"
            });
            return;
        }

        setTabs([...tabs, {
            title: input.value,
            group: [],
            teams: [{ name: input.value }]
        }]);
    }

    const addRole = (tab) => {
        const input = document.getElementById('role-name');

        if (input.value === '' || input.value === null || currentTeam === null || currentTraining === null) {
            showNotification({
                id: "role-creation-error",
                title: 'Erreur lors de l\'ajout du rôle',
                message: 'Veuillez renseigner les champs obligatoires.',
                icon: <X/>,
                autoClose: 5000,
                color: "red"
            });
            return;
        }

        if (buttonText === "Sauvegarder") {
            showNotification({
                id: "confirm-delete-warning",
                title: 'Ajout du rôle',
                message: 'Pensez à bien sauvegarder les modifications, en cliquant sur le bouton "Sauvegarder" en bas de la page.',
                icon: <AlertTriangle/>,
                autoClose: 5000,
                color: "orange"
            });
        }

        let newArray = tabs[tab];

        newArray.group.push({
            role: input.value,
            training: currentTraining,
            team: currentTeam,
            player: null,
            isEditing: false
        });
        setTabs([...tabs.slice(0, tab), newArray, ...tabs.slice(tab + 1)]);
    }

    const addTeam = (tab) => {
        const input = document.getElementById('team-name');

        if (input.value === '' || input.value === null) {
            showNotification({
                id: "team-creation-error",
                title: 'Erreur lors de la création de l\'équipe',
                message: 'Veuillez renseigner les champs obligatoires.',
                icon: <X/>,
                autoClose: 5000,
                color: "red"
            });
            return;
        }

        if (buttonText === "Sauvegarder") {
            showNotification({
                id: "add-team-warning",
                title: 'Création de l\'équipe',
                message: 'Pensez à bien sauvegarder les modifications, en cliquant sur le bouton "Sauvegarder" en bas de la page.',
                icon: <AlertTriangle/>,
                autoClose: 5000,
                color: "orange"
            });
        }

        let newArray = tabs[tab];

        newArray.teams.push({
            name: input.value,
            isEditing: false
        });
        setTabs([...tabs.slice(0, tab), newArray, ...tabs.slice(tab + 1)]);
    }

    const teamsData = (tab) => {
        if (!tabs[tab])
            return {};
        return tabs[tab].teams.map(team => {
            return {
                value: team.name,
                label: team.name
            }
        });
    }

    const removeRole = (currentRole) => {
        if (!tabs[activeTab])
            return {};

        if (buttonText === "Sauvegarder") {
            showNotification({
                id: "delete-warning",
                title: 'Suppression du rôle',
                message: 'Pensez à bien sauvegarder les modifications, en cliquant sur le bouton "Sauvegarder" en bas de la page.',
                icon: <AlertTriangle/>,
                autoClose: 5000,
                color: "yellow"
            });
        }

        let newArray = tabs[activeTab];
        let toRemove = newArray.group.find(role => role.role === currentRole.role);

        newArray.group.splice(newArray.group.indexOf(toRemove), 1);
        setTabs([...tabs.slice(0, activeTab), newArray, ...tabs.slice(activeTab + 1)]);
    }

    const editRole = (currentRole) => {
        if (!tabs[activeTab])
            return {};

        let newArray = tabs[activeTab];
        let toEdit = newArray.group.find(role => role.role === currentRole.role);

        toEdit.isEditing = true;
        setTabs([...tabs.slice(0, activeTab), newArray, ...tabs.slice(activeTab + 1)]);
    }

    const confirmEdit = (currentRole, elId) => {
        if (!tabs[activeTab])
            return {};

        if (buttonText === "Sauvegarder") {
            showNotification({
                id: "confirm-edit-warning",
                title: 'Edition du nom du rôle',
                message: 'Pensez à bien sauvegarder les modifications, en cliquant sur le bouton "Sauvegarder" en bas de la page.',
                icon: <AlertTriangle/>,
                autoClose: 5000,
                color: "yellow"
            });
        }

        let newArray = tabs[activeTab];
        let toEdit = newArray.group.find(role => role.role === currentRole.role);

        toEdit.role = document.getElementById(elId).value;
        toEdit.isEditing = false;
        setTabs([...tabs.slice(0, activeTab), newArray, ...tabs.slice(activeTab + 1)]);
    }

    const removeTeam = (currentTeam) => {
        if (!tabs[activeTab])
            return {};

        if (buttonText === "Sauvegarder") {
            showNotification({
                id: "delete-team-warning",
                title: 'Suppression de l\'équipe',
                message: 'Pensez à bien sauvegarder les modifications, en cliquant sur le bouton "Sauvegarder" en bas de la page.',
                icon: <AlertTriangle/>,
                autoClose: 5000,
                color: "yellow"
            });
        }

        let newArray = tabs[activeTab];
        let toRemove = newArray.teams.find(team => team.name === currentTeam.name);
        let toRemoves = [];

        newArray.group.forEach(role => {
            if (role.team === toRemove.name)
                toRemoves.push(role);
        });

        toRemoves.forEach(role => {
            newArray.group.splice(newArray.group.indexOf(role), 1);
        });
        newArray.teams.splice(newArray.teams.indexOf(toRemove), 1);
        setTabs([...tabs.slice(0, activeTab), newArray, ...tabs.slice(activeTab + 1)]);
    }

    const editTeam = (currentTeam) => {
        if (!tabs[activeTab])
            return {};

        let newArray = tabs[activeTab];
        let toEdit = newArray.teams.find(team => team.name === currentTeam.name);

        toEdit.isEditing = true;
        setTabs([...tabs.slice(0, activeTab), newArray, ...tabs.slice(activeTab + 1)]);
    }

    const confirmEditTeam = (currentTeam, elId) => {
        if (!tabs[activeTab])
            return {};

        if (buttonText === "Sauvegarder") {
            showNotification({
                id: "confirm-edit-team-warning",
                title: 'Edition du nom de l\'équipe',
                message: 'Pensez à bien sauvegarder les modifications, en cliquant sur le bouton "Sauvegarder" en bas de la page.',
                icon: <AlertTriangle/>,
                autoClose: 5000,
                color: "yellow"
            });
        }

        let newArray = tabs[activeTab];
        let toEdit = newArray.teams.find(team => team.name === currentTeam.name);

        newArray.group.forEach(role => {
            if (role.team === toEdit.name)
                role.team = document.getElementById(elId).value;
        })
        toEdit.name = document.getElementById(elId).value
        toEdit.isEditing = false;
        setTabs([...tabs.slice(0, activeTab), newArray, ...tabs.slice(activeTab + 1)]);
    }

    if (isLoading) {
        return (<>
            <Tabs active={activeTab} onTabChange={changeTab}>
                {tabs.map((tab, index) => (
                    <Tabs.Tab label={tab.title} tabKey={tab.title} key={index}>
                        {tab.teams.map((team, index) => (
                            <div key={index}>
                                <SimpleGrid cols={2}>
                                    <h4>
                                        {team.isEditing ? <Input id={tab.title + "-" + team.name} placeholder="Ex: 300"
                                                                 defaultValue={team.name} required/> : team.name}
                                    </h4>
                                    <Center>
                                        {team.isEditing ?
                                            <Button color={"green"} mr={10} leftIcon={<CircleCheck size={16}/>} compact
                                                    onClick={() => {
                                                        confirmEditTeam(team, tab.title + "-" + team.name)
                                                    }}>Valider</Button> :
                                            <Button mr={10} leftIcon={<Pencil size={16}/>} compact
                                                    onClick={() => editTeam(team)}>Editer</Button>}
                                        <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}
                                                onClick={() => removeTeam(team)}>Supprimer</Button>
                                    </Center>
                                </SimpleGrid>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Rôle</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {tab.group.map((role, i) => {
                                        if (role.team === team.name) {
                                            return (
                                                <tr key={uuidv4()}>
                                                    <td>{role.isEditing ?
                                                        <Input id={tab.title + "-" + team.name + "-" + role.role}
                                                               placeholder="Ex: Fusillier" defaultValue={role.role}
                                                               required/> : role.role}</td>
                                                    <td>
                                                        {role.isEditing ? <Button color={"green"} mr={10}
                                                                                  leftIcon={<CircleCheck size={16}/>}
                                                                                  compact onClick={() => {
                                                                confirmEdit(role, tab.title + "-" + team.name + "-" + role.role)
                                                            }}>Valider</Button> :
                                                            <Button mr={10} leftIcon={<Pencil size={16}/>} compact
                                                                    onClick={() => editRole(role)}>Editer</Button>}
                                                        <Button ml={10} leftIcon={<Trash size={16}/>} compact
                                                                color={"red"}
                                                                onClick={() => removeRole(role)}>Supprimer</Button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}
                                    </tbody>
                                </Table>
                            </div>))}
                        <h3>Ajouter un rôle</h3>
                        <SimpleGrid cols={2}>
                            <InputWrapper
                                label="Nom du rôle"
                                required
                            >
                                <Input
                                    id={'role-name'}
                                    placeholder="Ex: Fusillier"
                                    required/>
                            </InputWrapper>
                            <InputWrapper
                                label={"Choisir une formation"}
                            >
                                <Skeleton height={36}/>
                            </InputWrapper>
                            <Select
                                label="Choisir une équipe"
                                placeholder="Rechercher une équipe..."
                                data={teamsData(activeTab)}
                                searchable
                                maxDropdownHeight={400}
                                nothingFound="Aucune équipe trouvée."
                                onChange={(e) => {
                                    setCurrentTeam(e)
                                }}
                                required
                            />
                        </SimpleGrid>
                        <Button mt={20} onClick={() => addRole(activeTab)} disabled>Ajouter</Button>
                        <div>
                            <h3>Créer une équipe</h3>
                            <div style={{display: 'flex', alignItems: 'end'}}>
                                <InputWrapper
                                    label="Nom de l'équipe"
                                    required
                                >
                                    <Input
                                        id={'team-name'}
                                        placeholder="Ex: 300"
                                        required/>
                                </InputWrapper>
                                <Button ml={20} onClick={() => addTeam(activeTab)}>Créer</Button>
                            </div>
                        </div>
                    </Tabs.Tab>
                ))}
                <Tabs.Tab icon={<SquarePlus size={16}/>} label="Créer un groupe" tabKey="createGroup">
                    <div style={{display: 'flex', alignItems: 'end'}}>
                        <InputWrapper
                            label="Nom de l'équipe"
                            required
                        >
                            <Input
                                id={'group-name'}
                                placeholder="Ex: India 2"
                                required/>
                        </InputWrapper>
                        <Button ml={20} onClick={addTab}>Créer</Button>
                    </div>
                </Tabs.Tab>
            </Tabs>
            <Button disabled mt={30} onClick={(e) => {
                callback(tabs);
                e.preventDefault();
            }}>{buttonText}</Button>
        </>);
    }

    return (<>
        <Tabs active={activeTab} onTabChange={changeTab}>
            {tabs.map((tab, index) => (
                <Tabs.Tab label={tab.title} tabKey={tab.title} key={index}>
                    {tab.teams.map((team, index) => (
                        <div key={index}>
                            <SimpleGrid cols={2}>
                                <h4>
                                    {team.isEditing ? <Input id={tab.title + "-" + team.name} placeholder="Ex: 300" defaultValue={team.name} required/> : team.name}
                                </h4>
                                <Center>
                                    {team.isEditing ? <Button color={"green"} mr={10} leftIcon={<CircleCheck size={16}/>} compact onClick={() => {confirmEditTeam(team, tab.title + "-" + team.name)}}>Valider</Button> : <Button mr={10} leftIcon={<Pencil size={16}/>} compact onClick={() => editTeam(team)}>Editer</Button>}
                                    <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"} onClick={() => removeTeam(team)}>Supprimer</Button>
                                </Center>
                            </SimpleGrid>
                            <Table>
                                <thead>
                                <tr>
                                    <th>Rôle</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tab.group.map((role, i) => {
                                    if (role.team === team.name) {
                                        return (
                                            <tr key={uuidv4()}>
                                                <td>{role.isEditing ? <Input id={tab.title + "-" + team.name + "-" + role.role} placeholder="Ex: Fusillier" defaultValue={role.role} required/> : role.role}</td>
                                                <td>
                                                    {role.isEditing ? <Button color={"green"} mr={10} leftIcon={<CircleCheck size={16}/>} compact onClick={() => {confirmEdit(role, tab.title + "-" + team.name + "-" + role.role)}}>Valider</Button> : <Button mr={10} leftIcon={<Pencil size={16}/>} compact onClick={() => editRole(role)}>Editer</Button>}
                                                    <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"} onClick={() => removeRole(role)}>Supprimer</Button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })}
                                </tbody>
                            </Table>
                        </div>))}
                    <h3>Ajouter un rôle</h3>
                    <SimpleGrid cols={2}>
                        <InputWrapper
                            label="Nom du rôle"
                            required
                        >
                            <Input
                                id={'role-name'}
                                placeholder="Ex: Fusillier"
                                required/>
                        </InputWrapper>
                        <Select
                            label="Choisir une formation"
                            placeholder="Rechercher une formation..."
                            data={trainingsData}
                            searchable
                            maxDropdownHeight={400}
                            nothingFound="Aucune formation trouvée."
                            onChange={(e) => { setCurrentTraining(e) }}
                            required
                        />
                        <Select
                            label="Choisir une équipe"
                            placeholder="Rechercher une équipe..."
                            data={teamsData(activeTab)}
                            searchable
                            maxDropdownHeight={400}
                            nothingFound="Aucune équipe trouvée."
                            onChange={(e) => { setCurrentTeam(e) }}
                            required
                        />
                    </SimpleGrid>
                    <Button mt={20} onClick={() => addRole(activeTab)}>Ajouter</Button>
                    <div>
                        <h3>Créer une équipe</h3>
                        <div style={{display: 'flex', alignItems: 'end'}}>
                            <InputWrapper
                                label="Nom de l'équipe"
                                required
                            >
                                <Input
                                    id={'team-name'}
                                    placeholder="Ex: 300"
                                    required/>
                            </InputWrapper>
                            <Button ml={20} onClick={() => addTeam(activeTab)}>Créer</Button>
                        </div>
                    </div>
                </Tabs.Tab>
            ))}
            <Tabs.Tab icon={<SquarePlus size={16}/>} label="Créer un groupe" tabKey="createGroup">
                <div style={{display: 'flex', alignItems: 'end'}}>
                    <InputWrapper
                        label="Nom de l'équipe"
                        required
                    >
                        <Input
                            id={'group-name'}
                            placeholder="Ex: India 2"
                            required/>
                    </InputWrapper>
                    <Button ml={20} onClick={addTab}>Créer</Button>
                </div>
            </Tabs.Tab>
        </Tabs>
        <Button mt={30} onClick={(e) => {
            callback(tabs);
            e.preventDefault();
        }}>{buttonText}</Button>
    </>);
}

export default RolesCreation;