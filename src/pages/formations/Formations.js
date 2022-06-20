import {useEffect} from "react";
import {
    Badge,
    Button,
    Card,
    Group,
    Image,
    SimpleGrid,
    Text,
    useMantineTheme
} from "@mantine/core";
import {useNavigate} from "react-router-dom";

function Formations() {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];

    useEffect(() => {
        document.title = "Formations - La 7ème Compagnie";
    }, []);

    return(<>
        <h1>Les formations disponibles</h1>
        <SimpleGrid cols={3}>
            <Card shadow="sm" p="lg">
                <Card.Section>
                    <Image src="/img/tigre.jpg" height={160} alt="Tigre" />
                </Card.Section>

                <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
                    <Text weight={900} size={"xl"}>Pilote d'hélicoptère</Text>
                    <Badge color="green" variant="light">
                        Ouvert
                    </Badge>
                </Group>

                <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porta nisl nisi euismod nisi.
                </Text>

                <Button onClick={() => { navigate('/formations/pilote-helico') }} variant="light" color="blue" fullWidth style={{ marginTop: 14 }}>
                    En savoir plus
                </Button>
            </Card>
            <Card shadow="sm" p="lg">
                <Card.Section>
                    <Image src="/img/griffon.jpg" height={160} alt="Griffon" />
                </Card.Section>

                <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
                    <Text weight={900} size={"xl"}>Tireur Griffon</Text>
                    <Badge color="green" variant="light">
                        Ouvert
                    </Badge>
                </Group>

                <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porta nisl nisi euismod nisi.
                </Text>

                <Button variant="light" color="blue" fullWidth style={{ marginTop: 14 }}>
                    En savoir plus
                </Button>
            </Card>
        </SimpleGrid>
    </>);
}

export default Formations;
