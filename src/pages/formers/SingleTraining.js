import {useEffect, useState} from "react";
import {Alert, Badge, Button, Image, Skeleton, Text} from "@mantine/core";
import {useNavigate, useParams} from "react-router-dom";
import {ChevronLeft, InfoCircle} from "tabler-icons-react";

function SingleTraining() {
    const {id} = useParams();
    const [training, setTraining] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchTraining = () => {
        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/trainings/${id}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(data => {
                setTraining(data.data);
                fetchTrainers(data.data.trainers);
                document.title = `${data.data.title} - La 7ème Compagnie`;
            })
            .catch(err => console.log(err));
    }

    const fetchTrainers = (t) => {
        t.forEach((trainer) => {
            fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/${trainer}`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },
            })
                .then(res => res.json())
                .then(data => {
                    setTrainers(trainers => trainers.concat(data.data));
                    setIsLoading(false);
                })
                .catch(err => console.log(err));
        })
    }

    useEffect(() => {
        fetchTraining();
    }, []);

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
        return (<>
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
        </>)
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

export default SingleTraining;
