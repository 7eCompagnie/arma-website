import {useEffect, useState} from "react";
import {
    Badge,
    Button,
    Image, Input, InputWrapper, SimpleGrid, Skeleton,
    Text, useMantineTheme,
} from "@mantine/core";
import {Check, ChevronLeft, X} from "tabler-icons-react";
import {useNavigate, useParams} from "react-router-dom";
import Moment from "moment";
import 'moment/locale/fr';
import {showNotification, updateNotification} from "@mantine/notifications";
import Loading from "./Loading";
import Informations from "./Informations";
import Registration from "./Registration";
import {getOperation} from "../../services/operations";
Moment.locale('fr');

function OperationSingle() {
    const {id} = useParams();
    const [operation, setOperation] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getOperation(id).then(data => {
            setOperation(data.data);
            document.title = `${data.data.title} - La 7ème Compagnie`;
            setIsLoading(false);
        }).catch(err => console.log(err));
    }, [id]);

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return(<>
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/operations')}>
            Retour
        </Button>
        <h1>{operation.title}</h1>
        { operation.picture.startsWith("http") ? <Image
            radius="md"
            src={operation.picture}
            alt={operation.title}
            height={250}
        />: <Image
            radius="md"
            src={`${process.env.REACT_APP_ENDPOINT_PUBLIC}/operations/${operation.picture}`}
            alt={operation.title}
            height={250}
        /> }

        <h2>Informations générales</h2>
        <Informations operation={operation} />

        <h2>Inscription</h2>
        <Registration operation={operation} setOperation={setOperation} />
    </>);
}

export default OperationSingle;
