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
import {getOperation, getOperationBySlug} from "../../../services/operations";
import NotFound from "./NotFound";
Moment.locale('fr');

function OperationSingle() {
    const {slug} = useParams();
    const [operation, setOperation] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getOperationBySlug(slug).then(data => {
            if (!data.success) {
                setNotFound(true);
                setIsLoading(false);
                return;
            }
            setOperation(data.data);
            setIsLoading(false);

            document.title = `${data.data.title} - La 7ème Compagnie`;
        }).catch(err => console.log(err));
    }, [slug]);

    if (isLoading) {
        return (
            <Loading />
        )
    }

    if (notFound) {
        return (
            <NotFound />
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

        <h2>Informations</h2>
        <Informations operation={operation} />

        <h2>Inscription</h2>
        <Registration operation={operation} setOperation={setOperation} />
    </>);
}

export default OperationSingle;
