import {Alert, Skeleton} from '@mantine/core';
import {useEffect} from "react";
import {InfoCircle} from "tabler-icons-react";

function Dashboard({user, isLoading}) {
    useEffect(() => {
        document.title = "Dashboard - La 7ème Compagnie";
    }, [user]);

    if (isLoading) {
        return (<>
            <h1>Dashboard</h1>
            <Skeleton height={8} mb={8}/>
            <Skeleton height={8} mb={8}/>
            <Skeleton height={8} mb={8}/>
            <Skeleton height={8} width={"30%"}/>
        </>);
    }

    if (user.roles.includes('VISITOR_ROLE')) {
        return (<>
            <h1>Dashboard</h1>
            <Alert color={"teal"} icon={<InfoCircle size={16} />} title={`Bienvenue visiteur ${user.username}`} variant="filled">
                Bonjour, et bienvenue sur la plateforme de gestion des opérations de la 7ème Compagnie. <br />
                Comme vous pouvez le voir, vous ne pouvez pas accèder au contenu de la plateforme. Pour pouvoir y accèder, vous devez nous contacter sur Discord.
                Une fois ceci fait, vous passerez en tant que membre de la 7ème Compagnie et pourrez profiter de notre contenu de qualité.
                <br/> <br/>
                A bientôt soldat !
            </Alert>
        </>);
    }

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
