import {useEffect, useState} from "react";
import {
    Badge,
    Button,
    Card,
    Group,
    Image,
    SimpleGrid, Text, useMantineTheme
} from "@mantine/core";
import {useNavigate} from "react-router-dom";

function Trainings() {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];
    const [trainings, setTrainings] = useState([]);

    const fetchTrainings = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings/`,
            {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },
            })
            .then(res => res.json())
            .then(data => {
                setTrainings(data.data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        document.title = "Formations - La 7ème Compagnie";
        fetchTrainings();
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

    return(<>
        <h1>Les formations disponibles</h1>
        <SimpleGrid cols={3}>
            {trainingsToDisplay}
        </SimpleGrid>
    </>);
}

export default Trainings;
