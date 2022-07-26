import {Center} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import background from '../../assets/images/background.jpg'
import DiscordLoginButton from "./DiscordLoginButton";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Connexion - La 7ème Compagnie";
    }, [navigate]);

    return (
        <div style={{ width: '100%', height: '100vh', background: `url(${background}) center center no-repeat`, backgroundSize: 'cover'}}>
            <Center style={{backgroundColor: "rgba(0, 0, 0, .4)", height: "100vh", display: 'flex', flexDirection: 'column'}}>
                <h1 style={{ color: 'white', textShadow: '#000 0 0 20px', marginBottom: '2rem', fontSize: "38pt"}}>Bienvenue chez la 7ème Compagnie</h1>
                <DiscordLoginButton />
            </Center>
        </div>
    );
}
export default Home;
