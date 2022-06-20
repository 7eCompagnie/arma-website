import {useEffect, useState} from "react";
import {
    Button,
    Container,
    Input,
    InputWrapper,
    SimpleGrid,
    Table,
    Tabs,
    Textarea
} from "@mantine/core";
import {LetterCaseToggle, Calendar, SquarePlus, Pencil, Trash} from "tabler-icons-react";
import {DatePicker, TimeInput, TimeRangeInput} from "@mantine/dates";
import 'dayjs/locale/fr';
import dayjs from "dayjs";

function Create() {
    useEffect(() => {
        document.title = "Création d'une opération - La 7ème Compagnie";
    }, []);
    const [activeTab, setActiveTab] = useState(0);
    const onChange = (active, tabKey) => {
        setActiveTab(active);
        console.log('tabKey', tabKey);
    };

    return (<>
        <h1>Créer une opération</h1>
        <form>
            <SimpleGrid cols={2}>
                <InputWrapper
                    label={"Nom de l'opération"}
                    required
                >
                    <Input
                        icon={<LetterCaseToggle/>}
                        placeholder="Ex: Opération Bosso"
                    />
                </InputWrapper>
                <DatePicker
                    label={"Date de l'opération"}
                    locale="fr"
                    placeholder="Ex: 23 mars 2022"
                    minDate={dayjs(new Date()).toDate()}
                    inputFormat="D MMMM YYYY"
                    icon={<Calendar size={16} />}
                    required
                />

                <TimeRangeInput
                    id={'operation-duration'}
                    label="Durée de l'opération"
                    defaultValue={[new Date(new Date().setHours(21, 0, 0, 0)), new Date(new Date().setHours(23, 0, 0, 0))]}
                    required
                />

                <TimeInput
                    label="Heure de début de connexion"
                    defaultValue={new Date(new Date().setHours(20, 0, 0, 0))}
                    required
                />

                <Textarea
                    label="Description de l'opération"
                    placeholder='Ex: Le Corps de la Légion Etrangère pose pied au Sahel. Leur première mission : "Prendre la température".'
                    required
                />
            </SimpleGrid>

            <h2>Configuration des groupes et des équipes</h2>
            <Tabs active={activeTab} onTabChange={onChange} >
                <Tabs.Tab label="Zeus" tabKey="zeus">
                    <Table>
                        <thead>
                        <tr>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Zeus</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </Tabs.Tab>
                <Tabs.Tab label="India 2" tabKey="india2">
                    <Table>
                        <thead>
                        <tr>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Chef de Groupe</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Auxiliaire Sanitaire</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Tireur de précision</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ textAlign: 'left', paddingLeft: 20 }}>300</th>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Chef d'équipe</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>Fusillier</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>MG</td>
                            <td>
                                <Button mr={10} leftIcon={<Pencil size={16}/>} compact>Editer</Button>
                                <Button ml={10} leftIcon={<Trash size={16}/>} compact color={"red"}>Supprimer</Button>
                            </td>
                        </tr>
                        </tbody>
                    </Table>

                    <Container>
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
                            <Button ml={20}>Créer</Button>
                        </div>
                    </Container>
                </Tabs.Tab>
                <Tabs.Tab icon={<SquarePlus size={16}/>} label="Créer un groupe" tabKey="createGroup">
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
                        <Button ml={20}>Créer</Button>
                    </div>
                </Tabs.Tab>
            </Tabs>
            <Button color={"green"} fullWidth mt={30}>Créer l'opération</Button>
        </form>
    </>)
}

export default Create;
