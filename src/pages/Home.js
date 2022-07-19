import {Button, Center, Title} from '@mantine/core';
import {BrandDiscord} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Connexion - La 7ème Compagnie";
        if (localStorage.getItem('token') !== null)
            navigate('/dashboard');
    }, [navigate]);

    return (
        <Center style={{ width: '100%', height: '100vh', background: 'url("/img/bg.jpg") center center no-repeat', backgroundSize: 'cover', display: 'flex', flexDirection: 'column'}}>
            <Title mb={20} style={{ color: 'white', textShadow: '#000 0 0 20px' }}>Bienvenue sur la 7ème Compagnie</Title>
            <Button mt={20} size="lg" leftIcon={<BrandDiscord />} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} onClick={() => {
                if (process.env.NODE_ENV === 'development')
                    window.location = ("https://discord.com/api/oauth2/authorize?client_id=964847392543350835&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard&response_type=code&scope=identify%20email")
                else
                    window.location = ("https://discord.com/api/oauth2/authorize?client_id=964847392543350835&redirect_uri=http%3A%2F%2Fs4.vxls.net%3A3000%2Fdashboard&response_type=code&scope=email%20identify")
            }}>Se connecter avec Discord</Button>
        </Center>
    );
}
export default Home;
