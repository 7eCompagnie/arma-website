import {useEffect} from "react";
import DashboardAppShell from "../../components/DashboardAppShell";
import {Badge, Image, Text} from "@mantine/core";

function Single() {
    useEffect(() => {
        document.title = "Pilote d'hélicoptère - La 7ème Compagnie";
    }, []);

    const formersValues = [
        "Luco#4320",
        "Fradom#9503",
        "RESER#0402"
    ];

    const formers = formersValues.map((former, index) => {
        return (
            <Badge size={"lg"}>{former}</Badge>
        );
    });


    return (<>
        <h1>Pilote de tigre</h1>
        <Image
            radius="md"
            src="/img/tigre.jpg"
            alt="Hélicoptère tigre de l'armée française"
            height={250}
        />
        <h2>Description de la formation</h2>
        <Text>
            <p>
                Le pilote d'hélicoptère est une formation de base qui permet de pratiquer les techniques de pilotage d'un hélicoptère.
                Il est nécessaire de connaître les bases de la formation avant de pouvoir piloter un hélicoptère.
            </p>
        </Text>

        <h2>Formateurs</h2>

        <div style={{ marginBottom: '4rem' }}>
            {formers}
        </div>
    </>);
}

export default Single;
