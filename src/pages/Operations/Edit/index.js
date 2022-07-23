import {
    Button,
    Checkbox,
    Group,
    Input,
    InputWrapper,
    SimpleGrid,
    Skeleton,
    Text,
    Textarea,
    useMantineTheme
} from "@mantine/core";
import {Calendar, Check, ChevronLeft, LetterCaseToggle, Photo, X} from "tabler-icons-react";
import {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {DatePicker, TimeInput, TimeRangeInput} from "@mantine/dates";
import dayjs from "dayjs";
import RolesCreation from "../../../components/RolesCreation";
import {showNotification, updateNotification} from "@mantine/notifications";
import {getOperation, updateOperation} from "../../../services/operations";
import NotFound from "./NotFound";
import Loading from "./Loading";
import FormContent from "./FormContent";

function OperationEdit() {
    const {id} = useParams();
    const [operation, setOperation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getOperation(id).then(data => {
            if (data.success === false) {
                setNotFound(true);
                setIsLoading(false);
                return;
            }
            document.title = `${data.data.title} - La 7ème Compagnie`;
            setOperation(data.data);
            setIsLoading(false);
        }).catch(err => console.log(err));
    }, [id]);

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

    return (<>
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/zeus/operations')}>
            Retour
        </Button>
        <h1>{operation.title}</h1>

        <FormContent operation={operation} />
    </>)
}

export default OperationEdit;
