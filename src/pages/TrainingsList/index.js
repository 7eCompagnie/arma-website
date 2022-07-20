import {useEffect, useState} from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Group,
    Image,
    SimpleGrid, Skeleton, Text, useMantineTheme
} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {AlertCircle} from "tabler-icons-react";
import {getTrainings} from "../../services/trainings";
import Loading from "./Loading";

function TrainingsList() {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];
    const [trainings, setTrainings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getTrainings(-1).then(data => {
            setTrainings(data.data);
            setIsLoading(false);
        }).catch(err => console.log(err));

        document.title = "Nos formations - La 7ème Compagnie";
    }, []);

    const trainingsToDisplay = trainings.map((training, i) => {
        return (<Card shadow="sm" p="lg" key={i}>
            <Card.Section>
                { training.picture.startsWith("http") ? <Image src={training.picture} height={160} alt={training.title} /> : <Image src={`${process.env.REACT_APP_ENDPOINT_PUBLIC}/trainings/${training.picture}`} height={160} alt={training.title} /> }
            </Card.Section>

            <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
                <Text weight={900} size={"xl"}>{training.title}</Text>
                {training.isOpen === true ? <Badge color="green" variant="light">Ouvert</Badge> : <Badge color="red" variant="light">Fermé</Badge>}
            </Group>

            <Text lineClamp={4} size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
                {training.description}
            </Text>

            <Button onClick={() => { navigate(`/trainings/${training._id}`) }} variant="light" color="blue" fullWidth style={{ marginTop: 14 }}>
                En savoir plus
            </Button>
        </Card>)
    });

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return(<>
        <h1>Les formations disponibles</h1>

        {!trainingsToDisplay.length ? <Alert icon={<AlertCircle size={16} />} title="Désolé soldat, aucune formation n'est disponible..." mt={10} color={"red"}>
            <Text>Pour l'instant, tu vas devoir rester avec ton vieux F1. Alors reviens plus tard si tu veux pas tombé avant d'avoir pû tirer.
            </Text>
        </Alert> : <SimpleGrid cols={2}>
            {trainingsToDisplay}
        </SimpleGrid>}
    </>);
}

export default TrainingsList;
