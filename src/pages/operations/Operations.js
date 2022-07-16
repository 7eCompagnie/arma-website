import {useEffect} from "react";
import {
    Badge,
    Button,
    Card,
    Group,
    Image,
    SimpleGrid,
    Text, useMantineTheme
} from "@mantine/core";
import {Calendar} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";

function Operations() {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];

    useEffect(() => {
        document.title = "Inscriptions aux opérations - La 7ème Compagnie";
    }, []);

    return(<>
        <h1>Inscriptions au opérations</h1>
        <SimpleGrid cols={2}>
            <Card shadow="sm" p="lg">
                <Card.Section>
                    <Image src="/img/bosso.png" height={160} alt="Norway" />
                </Card.Section>

                <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
                    <Text weight={900} size={"xl"}>Opération Bosso</Text>
                    <Badge color="pink" variant="light">4 places restantes
                    </Badge>
                </Group>

                <Text mb={20} style={{display: 'flex', alignItems: 'center'}}><Calendar size={20} style={{marginRight: '4px'}}/> 24 mai 2022</Text>

                <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porta nisl nisi euismod nisi.
                </Text>

                <Button onClick={() => { navigate('/operations/operation-bosso') }} variant="light" color="blue" fullWidth style={{ marginTop: 14 }}>
                    En savoir plus
                </Button>
            </Card>
        </SimpleGrid>
    </>);
}

export default Operations;
