import {
    ActionIcon,
    Alert,
    Avatar,
    Badge,
    Button,
    Center,
    Divider,
    Menu,
    Modal,
    Skeleton,
    Text,
    Tooltip
} from "@mantine/core";
import '../css/dashboard.css';
import {AlertCircle, Bell, BellRinging, Logout, Settings, Tools} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

function DashboardHeader({isLoading, user}) {
    const navigate = useNavigate();
    const [opened, setOpened] = useState(false);

    const revokeToken = async () => {
        const body = new URLSearchParams();
        body.append('token', localStorage.getItem('token'));

        await fetch(`${process.env.REACT_APP_ENDPOINT_URL}/revoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        })
            .then(res => res.json())
            .then(data => {
                localStorage.removeItem('token');
                navigate('/');
            })
            .catch(err => console.log(err));
    }

    if (isLoading) {
        return (<div style={{height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem'}}>
            <Center style={{ height: '100%'}}>
                <img src="/img/logo.webp" alt="Logo de la 7ème Compagnie" height="90%" />
                <span style={{ marginLeft: '1rem', fontWeight: 900, fontSize: '14pt' }}>La 7ème Compagnie</span>
                <Badge ml={10} color="yellow" variant="outline">
                    <Center>
                        <Tools size={14} style={{marginRight: '3px'}}/>{process.env.REACT_APP_VERSION}
                    </Center>
                </Badge>
            </Center>
            <Center>
                <ActionIcon title="Bientôt disponible." disabled size="lg" radius="xl" variant={"transparent"}>
                    <Skeleton height={26} width={26} circle/>
                </ActionIcon>
                <ActionIcon title="Bientôt disponible." disabled ml={20} size="lg" radius="xl" onClick={() => navigate('/settings')}>
                    <Bell />
                </ActionIcon>

                <Tooltip
                    label="Paramètres"
                    position="bottom"
                    withArrow
                >
                    <ActionIcon ml={20} size="lg" radius="xl" onClick={() => navigate('/settings')}>
                        <Settings />
                    </ActionIcon>
                </Tooltip>

                <ActionIcon color={"red"} ml={20} size="lg" radius="xl" onClick={() => { revokeToken() }}>
                    <Logout />
                </ActionIcon>
            </Center>
        </div>);
    }
    return (<div style={{height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem'}}>
        <Center style={{ height: '100%'}}>
            <img src="/img/logo.webp" alt="Logo de la 7ème Compagnie" height="90%" />
            <span style={{ marginLeft: '1rem', fontWeight: 900, fontSize: '14pt' }}>La 7ème Compagnie</span>
            <Badge ml={10} color="yellow" variant="outline">
                <Center>
                    <Tools size={14} style={{marginRight: '3px'}}/>{process.env.REACT_APP_VERSION}
                </Center>
            </Badge>
        </Center>
        <Center>
            <Tooltip
                label="Mon profil"
                position="bottom"
                withArrow
            >
                <ActionIcon title="Bientôt disponible." disabled size="lg" radius="xl" variant={"transparent"}>
                    <Avatar radius="xl" size="sm" src={`https://cdn.discordapp.com/avatars/${user.identifier}/${user.avatar}.png`} />
                </ActionIcon>
            </Tooltip>

            <Tooltip
                label="Notifications"
                position="bottom"
                withArrow
                ml={20}
            >
                <ActionIcon title="Bientôt disponible." disabled size="lg" radius="xl" onClick={() => navigate('/settings')}>
                    <Bell />
                </ActionIcon>
            </Tooltip>

            <Tooltip
                label="Paramètres"
                position="bottom"
                withArrow
                ml={20}
            >
                <ActionIcon size="lg" radius="xl" onClick={() => navigate('/settings')}>
                    <Settings />
                </ActionIcon>
            </Tooltip>

            <Tooltip
                label="Se déconnecter"
                position="bottom"
                placement="end"
                withArrow
                ml={20}
            >
                <ActionIcon color={"red"} size="lg" radius="xl" onClick={() => { revokeToken() }}>
                    <Logout />
                </ActionIcon>
            </Tooltip>
        </Center>

        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={<Text size="lg" weight="bold">Notifications</Text>}
        >
            <Alert icon={<AlertCircle size={16} />} title="Vous êtes à jour !" color="yellow">
                Vous n'avez aucune notification !
            </Alert>
        </Modal>
    </div>);
}

export default DashboardHeader;
