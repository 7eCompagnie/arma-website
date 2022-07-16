import {useEffect} from "react";
import {
    Badge,
    Button,
    Image, SimpleGrid,
    Table, Text, useMantineTheme,
} from "@mantine/core";
import {Ban} from "tabler-icons-react";

function SingleOperation() {
    const theme = useMantineTheme();

    useEffect(() => {
        document.title = "Opération Bosso - La 7ème Compagnie";
    }, []);

    return(<>
        <h1>Opération Bosso</h1>
        <Image
            radius="md"
            src="/img/bosso.png"
            alt="Image de soldats de la 7ème Compagnie lors de l'opération Bosso"
            height={250}
        />
        <h2>Rôles disponibles</h2>
        <Table>
            <thead>
            <tr>
                <th>Rôle</th>
                <th>Groupe</th>
                <th>Equipe</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Fusillier</td>
                <td>India 3</td>
                <td>300</td>
                <td>
                    <Button color={"green"} compact>S'inscrire</Button>
                </td>
            </tr>
            <tr>
                <td>Tireur de précision</td>
                <td>India 2</td>
                <td>600</td>
                <td>
                    <Button color={"green"} compact>S'inscrire</Button>
                </td>
            </tr>
            <tr>
                <td>Chef d'équipe</td>
                <td>India 2</td>
                <td>600</td>
                <td>
                    <Button color={"green"} compact>S'inscrire</Button>
                </td>
            </tr>
            <tr>
                <td>Pilote de tigre</td>
                <td>Dragon 1</td>
                <td><Ban size={16}/></td>
                <td>
                    <Button color={"green"} compact disabled>S'inscrire</Button>
                </td>
            </tr>
            </tbody>
        </Table>

        <h2>Inscrits</h2>
        <SimpleGrid cols={3}>
            <div>
                <h3>India 2</h3>
                <ul style={{ listStyle: "none" }}>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>CDG</Badge>
                            Marston
                        </div>
                    </li>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>TP</Badge>
                            Engourdy
                        </div>
                    </li>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>AUX. SAN</Badge>
                            Rouliane
                        </div>
                    </li>
                    <Text mt={10} style={{ fontWeight: 900 }}>
                        300
                    </Text>
                    <ul style={{ listStyle: "none" }}>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>CDE</Badge>
                                Fradom
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                DJmaxou
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Kurt
                            </div>
                        </li>
                    </ul>
                    <Text mt={10} style={{ fontWeight: 900 }}>
                        600
                    </Text>
                    <ul style={{ listStyle: "none" }}>
                        <li>
                            <div style={{color: theme.colors.gray[5], display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>CDE</Badge>
                                Disponible
                            </div>
                        </li>
                        <li>
                            <div style={{color: theme.colors.gray[5], display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>MIT</Badge>
                                Disponible
                            </div>
                        </li>
                        <li>
                            <div style={{color: theme.colors.gray[5], display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Disponible
                            </div>
                        </li>
                    </ul>
                </ul>
            </div>
            <div>
                <h3>India 3</h3>
                <ul style={{ listStyle: "none" }}>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>CDG</Badge>
                            H1RO
                        </div>
                    </li>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>TP</Badge>
                            Red
                        </div>
                    </li>
                    <li>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={"blue"} mr={10}>AUX. SAN</Badge>
                            Luco
                        </div>
                    </li>
                    <Text mt={10} style={{ fontWeight: 900 }}>
                        300
                    </Text>
                    <ul style={{ listStyle: "none" }}>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>CDE</Badge>
                                Drake Sn0w
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Undertaker
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Myckaël
                            </div>
                        </li>
                    </ul>
                    <Text mt={10} style={{ fontWeight: 900 }}>
                        600
                    </Text>
                    <ul style={{ listStyle: "none" }}>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>CDE</Badge>
                                Sn0w
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>MIT</Badge>
                                XrayG4mer
                            </div>
                        </li>
                        <li>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Badge color={"blue"} mr={10}>FUS</Badge>
                                Alexios Gan
                            </div>
                        </li>
                    </ul>
                </ul>
            </div>
        </SimpleGrid>
    </>);
}

export default SingleOperation;
