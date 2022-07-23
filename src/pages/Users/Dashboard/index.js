import {Alert} from '@mantine/core';
import {useEffect} from "react";
import {InfoCircle} from "tabler-icons-react";

function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard - La 7ème Compagnie";
    }, []);

    return(<>
        <h1>Dashboard</h1>
        <Alert color={"yellow"} icon={<InfoCircle size={16} />} title="En cours de développement..." variant="filled">
            Bonjour, et bienvenue sur la plateforme de gestion des opérations de la 7ème Compagnie.
            Cette plateforme est encore en cours de développement, et nous vous invitons à laisser vos commentaires notre Discord afin de proposer des améliorations et de signaler les bugs rencontrés.
            Cette page sera bientôt disponible, vous pourrez y consulter des statistiques sur vos opérations.
        </Alert>
    </>);
}

export default Dashboard;
