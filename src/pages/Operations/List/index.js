import {useEffect, useState} from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Group,
    Image,
    SimpleGrid, Text, useMantineTheme
} from "@mantine/core";
import {AlertCircle, Calendar} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";
import Moment from "moment";
import 'moment/locale/fr';
import {getOperations} from "../../../services/operations";
import getOperationRemainingSeats from "../../../utils/getOperationRemainingSeats";
import Loading from "./Loading";
Moment.locale('fr');

function OperationsList() {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];
    const [operations, setOperations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getOperations(-1).then(data => {
            setOperations(data.data);
            setIsLoading(false);
        }).catch(err => console.log(err));
        document.title = "Nos opérations - La 7ème Compagnie";
    }, []);

    const operationsCards = operations.map((operation, i) => {
        if (new Date(operation.duration[1]) > new Date()) {
            return (<Card shadow="sm" p="lg" key={i}>
                <Card.Section>
                    {operation.picture.startsWith("http") ?
                        <Image src={operation.picture} height={160} alt={operation.title}/> :
                        <Image src={`${process.env.REACT_APP_ENDPOINT_PUBLIC}/operations/${operation.picture}`}
                               height={160} alt={operation.title}/>}
                </Card.Section>

                <Group position="apart" style={{marginBottom: 5, marginTop: theme.spacing.sm}}>
                    <Text weight={900} size={"xl"}>{operation.title}</Text>
                    {getOperationRemainingSeats(operation) > 0 ?
                        <Badge color="teal" variant="light">{getOperationRemainingSeats(operation)} places restantes</Badge> :
                        <Badge color="pink" variant="light">Aucunes places</Badge>}
                </Group>

                <Text lineClamp={4} mb={20} style={{display: 'flex', alignItems: 'center'}}><Calendar size={20}
                                                                                                      style={{marginRight: '4px'}}/>
                    <span style={{
                        textTransform: "capitalize",
                        marginRight: '4px'
                    }}>{Moment(new Date(operation.date)).format('dddd')}</span> {Moment(new Date(operation.date)).format('D MMMM YYYY')}
                </Text>

                <Text size="sm" style={{color: secondaryColor, lineHeight: 1.5}}>
                    {operation.description}
                </Text>

                <Button onClick={() => {
                    navigate(`/operations/${operation.slug}`)
                }} variant="light" color="blue" fullWidth style={{marginTop: 14}}>
                    En savoir plus
                </Button>
            </Card>)
        } else {
            return null;
        }
    });

    if (isLoading) {
        return (
            <Loading/>
        );
    }

    return (
        <>
            <h1>Inscription aux opérations</h1>
            {operationsCards.every(element => element === null) ? <Alert icon={<AlertCircle size={16} />} title="Désolé soldat, aucune opération n'est prévu prochainement..." mt={10} color={"red"}>
                <Text>Reviens plus tard pour t'inscrire et partir au combat. <br/>
                    N'oublie pas de suivre les annonces de notre Discord pour rester informé des prochaines opérations.</Text>
            </Alert> : <SimpleGrid cols={2}>
                {operationsCards}
            </SimpleGrid>}
        </>
    );
}

export default OperationsList;
