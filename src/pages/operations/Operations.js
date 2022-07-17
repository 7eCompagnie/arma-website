import {useEffect, useState} from "react";
import {
    Badge,
    Button,
    Card, Center,
    Group,
    Image, Pagination,
    SimpleGrid,
    Text, useMantineTheme
} from "@mantine/core";
import {Calendar} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";
import Moment from "moment";
import 'moment/locale/fr';
Moment.locale('fr');

function Operations() {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];
    const [operations, setOperations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activePage, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);

    const fetchOperations = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/operations/`,
            {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },
            })
            .then(res => res.json())
            .then(data => {
                setOperations(data.data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchOperations();
        document.title = "Inscriptions aux opérations - La 7ème Compagnie";
    }, []);

    const getRemainingSeats = (operation) => {
        let counter = 0;

        for (let i = 0; i < operation.roles.length; i++) {
            for (let j = 0; j < operation.roles[i].group.length; j++) {
                if (operation.roles[i].group[j].player === null)
                    counter++;
            }
        }
        return counter;
    }

    const operationsCards = operations.map((operation, i) => {
        if (new Date(operation.date) < new Date())
            return;
        return (<Card shadow="sm" p="lg" key={i}>
            <Card.Section>
                <Image src={`${process.env.REACT_APP_ENDPOINT_PUBLIC}/operations/${operation.picture}`} height={160}
                       alt="Norway"/>
            </Card.Section>

            <Group position="apart" style={{marginBottom: 5, marginTop: theme.spacing.sm}}>
                <Text weight={900} size={"xl"}>{operation.title}</Text>
                <Badge color="pink" variant="light">{getRemainingSeats(operation)} place(s) restante(s)</Badge>
            </Group>

            <Text mb={20} style={{display: 'flex', alignItems: 'center'}}><Calendar size={20}
                                                                                    style={{marginRight: '4px'}}/>
                <span style={{
                    textTransform: "capitalize",
                    marginRight: '4px'
                }}>{Moment(operation.date).format('dddd')}</span> {Moment(operation.date).format('D MMMM YYYY')}
            </Text>

            <Text size="sm" style={{color: secondaryColor, lineHeight: 1.5}}>
                {operation.description}
            </Text>

            <Button onClick={() => {
                navigate(`/operations/${operation._id}`)
            }} variant="light" color="blue" fullWidth style={{marginTop: 14}}>
                En savoir plus
            </Button>
        </Card>)
    });

    if (isLoading)
        return <div>Loading...</div>

    return(<>
        <h1>Inscription aux opérations</h1>
        <SimpleGrid cols={2}>
            {operationsCards}
        </SimpleGrid>
    </>);
}

export default Operations;
