import {BrandDiscord} from "tabler-icons-react";
import {Button} from "@mantine/core";
import popupCenter from "../../utils/popupCenter";

function DiscordLoginButton() {

    return (
        <Button
            mt={20}
            size="lg"
            leftIcon={<BrandDiscord/>}
            variant="gradient"
            gradient={{from: 'indigo', to: 'cyan'}}
            onClick={() => {
                if (process.env.NODE_ENV === 'development')
                    popupCenter("https://discord.com/api/oauth2/authorize?client_id=964847392543350835&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard&response_type=code&scope=identify",
                        "Connexion à la 7ème Compagnie via Discord", 500, 700);
                else
                    popupCenter("https://discord.com/api/oauth2/authorize?client_id=964847392543350835&redirect_uri=https%3A%2F%2Fapp.arma.la7e.fr%2Fdashboard&response_type=code&scope=identify",
                        "Connexion à la 7ème Compagnie via Discord", 500, 700);
                console.log(window.opener);
            }
        }>
                Se connecter avec Discord
        </Button>
    )
}

export default DiscordLoginButton;