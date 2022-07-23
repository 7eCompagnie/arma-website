import {BrandDiscord} from "tabler-icons-react";
import {Button} from "@mantine/core";

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
                    window.location = ("https://discord.com/api/oauth2/authorize?client_id=964847392543350835&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard&response_type=code&scope=identify")
                else
                    window.location = ("https://discord.com/api/oauth2/authorize?client_id=964847392543350835&redirect_uri=http%3A%2F%2Fs4.vxls.net%3A3000%2Fdashboard&response_type=code&scope=identify")
            }}>
                Se connecter avec Discord
        </Button>
    )
}

export default DiscordLoginButton;