import {useEffect, useState} from "react";
import {Alert, Badge, Button, Image, Skeleton, Text} from "@mantine/core";
import {useNavigate, useParams} from "react-router-dom";
import {ChevronLeft, InfoCircle} from "tabler-icons-react";
import {getTraining, getTrainingBySlug} from "../../../services/trainings";
import {getUser} from "../../../services/users";
import Loading from "./Loading";
import NotFound from "../../Operations/Single/NotFound";

function TrainingSingle() {
    const {slug} = useParams();
    const [training, setTraining] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getTrainingBySlug(slug).then(data => {
            if (!data.success) {
                setNotFound(true);
                setIsLoading(false);
                return;
            }

            setTraining(data.data);
            document.title = `${data.data.title} - La 7ème Compagnie`;
            fetchTrainers(data.data.trainers);
        }).catch(err => console.log(err));

        const fetchTrainers = (t) => {
            t.forEach((trainer) => {
                getUser(trainer).then(data => {
                    if (data.success === false)
                        return;
                    setTrainers(trainers => trainers.concat(data.data));
                    setIsLoading(false);
                }).catch(err => console.log(err));
            })
        }
    }, [slug]);

    const trainersToDisplay = trainers.map((trainer, i) => {
        if (isLoading === true) {
            return (
                <Skeleton key={i}/>
            )
        } else {
            return (
                <Badge variant="outline" key={i} mr={10}>{trainer.username}#{trainer.discriminator}</Badge>
            );
        }
    });

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
        <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/trainings')}>
            Retour
        </Button>
        <h1>{training.title}</h1>
        {training.picture.startsWith("http") ? <Image
            radius="md"
            src={training.picture}
            alt={training.title}
            height={250}
        /> : <Image
            radius="md"
            src={`${process.env.REACT_APP_ENDPOINT_PUBLIC}/trainings/${training.picture}`}
            alt={training.title}
            height={250}
        /> }
        <h2>Description de la formation</h2>
        <Text>
            <p>
                {training.description}
            </p>
        </Text>

        <h2>Formateurs</h2>

        <div style={{ marginBottom: '4rem' }}>
            {trainersToDisplay}
        </div>

        <Alert icon={<InfoCircle size={16} />} title="Demande de formation" variant="filled">
            Pour suivre une formation, veuillez contacter un des formateurs sur le channel <a style={{color: "#fff", textDecoration: "non", fontWeight: "bold"}} href={"https://discord.com/channels/864865934233960448/889940051016962118"} target={"_blank"} rel="noreferrer">#formations</a>.
        </Alert>
    </>);
}

export default TrainingSingle;
