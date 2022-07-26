import {Alert, SimpleGrid, Skeleton} from '@mantine/core';
import {useEffect} from "react";
import {DeviceGamepad, InfoCircle, Stars, Sword} from "tabler-icons-react";
import {
    getNextOperationsCount,
    getPlayedOperationsCount,
    getRatedOperationsCount
} from "../../../utils/operationsStatistics";

function Dashboard({user, isLoading}) {
    useEffect(() => {
        if (window.opener && window.opener !== window) {
            window.opener.location.reload();
            window.close();
        }
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

    const getRatedOperations = () => {
        return 0;
    }

    return(<>
        <h1>Dashboard</h1>
        <Alert color={"yellow"} icon={<InfoCircle size={16} />} title="En cours de développement..." variant="light">
            Bonjour, et bienvenue sur la plateforme de gestion des opérations de la 7ème Compagnie.
            Cette plateforme est encore en cours de développement, et nous vous invitons à laisser vos commentaires notre Discord afin de proposer des améliorations et de signaler les bugs rencontrés.
            Cette page sera bientôt disponible, vous pourrez y consulter des statistiques sur vos opérations.
        </Alert>

        <SimpleGrid mt={30} cols={3}>
            <div style={{ boxShadow: 'rgba(0, 0, 0, .4) 0 15px 20px', padding: '0 2rem', borderRadius: '.75rem', height: '150px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', background: 'linear-gradient(140deg, rgba(2,0,36,1) 0%, rgba(8,0,255,1) 100%)' }}>
                <DeviceGamepad size={60}/>
                <p style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{fontSize: '30pt', fontWeight: 900}}>{getPlayedOperationsCount(user.operations)}</span> opérations jouées
                </p>
            </div>
            <div style={{ boxShadow: 'rgba(0, 0, 0, .4) 0 15px 20px', padding: '0 2rem', borderRadius: '.75rem', height: '150px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', background: 'linear-gradient(140deg, rgba(8,0,255,1) 0%, rgba(96,57,128,1) 100%)' }}>
                <Sword size={60}/>
                <p style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{fontSize: '30pt', fontWeight: 900}}>{getNextOperationsCount(user.operations)}</span> prochaines opérations
                </p>
            </div>
            <div style={{ boxShadow: 'rgba(0, 0, 0, .4) 0 15px 20px', padding: '0 2rem', borderRadius: '.75rem', height: '150px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', background: 'linear-gradient(140deg, rgba(96,57,128,1) 0%, rgba(175,0,255,1) 100%)' }}>
                <Stars size={60}/>
                <p style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{fontSize: '30pt', fontWeight: 900}}>{getRatedOperationsCount(user.operations)}</span> opérations notées
                </p>
            </div>
        </SimpleGrid>
    </>);
}

export default Dashboard;
