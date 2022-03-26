import {Button, Center, Title} from '@mantine/core';
import {BrandDiscord} from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Connexion - La 7ème Compagnie";
    }, []);

    return (
        <Center style={{ width: '100%', height: '100vh', background: 'url("/img/bg.jpg") center center no-repeat', backgroundSize: 'cover', display: 'flex', flexDirection: 'column'}}>
            <Title mb={20} style={{ color: 'white', textShadow: '#000 0 0 20px' }}>Bienvenue sur la 7ème Compagnie</Title>
            <Button onClick={() => { navigate('/dashboard') }} mt={20} size="lg" leftIcon={<BrandDiscord />} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>Se connecter avec Discord</Button>
        </Center>
    );
}

export default Home;