import {Heart} from "tabler-icons-react";
import {Center} from "@mantine/core";

function AppFooter() {
    return (
        <Center>
            <p>
                Développé avec <Heart style={{marginBottom: "-4px"}} color={"red"} size={20}/> par <a style={{color: 'teal', textDecoration: 'none', fontWeight: 'bold'}} href="https://sn00ww.github.io/portfolio/" target={"_blank"} rel="noreferrer">Sn0w</a>, le meilleur soldat de la 7ème Compagnie.
            </p>
        </Center>
    )
}

export default AppFooter;