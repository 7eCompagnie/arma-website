import {Alert, Button, Skeleton} from "@mantine/core";
import {ChevronLeft, InfoCircle} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";

function Loading() {
    const navigate = useNavigate();
    return (
        <>
            <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/trainings')}>
                Retour
            </Button>
            <Skeleton my={38} height={16} width={200} />
            <Skeleton height={250} />
            <h2>Description de la formation</h2>
            <Skeleton height={8} my={10} />
            <Skeleton height={8} my={10} />
            <Skeleton height={8} width={150} mt={10} mb={38}/>
            <h2>Formateurs</h2>
            <Skeleton height={8} width={75} />
            <Alert mt={64} icon={<InfoCircle size={16} />} title="Demande de formation" variant="filled">
                Pour suivre une formation, veuillez contacter un des formateurs sur le channel <a style={{color: "#fff", textDecoration: "non", fontWeight: "bold"}} href={"https://discord.com/channels/864865934233960448/889940051016962118"} target={"_blank"} rel="noreferrer">#formations</a>.
            </Alert>
        </>
    );
}

export default Loading;