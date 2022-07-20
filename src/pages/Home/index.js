import {Center, Title} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import background from '../../assets/images/background.jpg'
import DiscordLoginButton from "./DiscordLoginButton";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Connexion - La 7ème Compagnie";

        if (localStorage.getItem('token') !== null)
            navigate('/dashboard');
    }, [navigate]);

    return (
        <Center style={{ width: '100%', height: '100vh', background: `url(${background}) center center no-repeat`, backgroundSize: 'cover', display: 'flex', flexDirection: 'column'}}>
            <Title mb={20} style={{ color: 'white', textShadow: '#000 0 0 20px' }}>Bienvenue sur la 7ème Compagnie</Title>
            <DiscordLoginButton />
        </Center>
    );
}
export default Home;
