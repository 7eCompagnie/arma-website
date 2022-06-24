import {Alert, Avatar, Button, Center, Divider, Menu, Modal, Skeleton, Text} from "@mantine/core";
import '../css/dashboard.css';
import {AlertCircle, BellRinging, Logout, Settings} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

function DashboardHeader({isLoading, user}) {
    const navigate = useNavigate();
    const [opened, setOpened] = useState(false);

    const revokeToken = async () => {
        const body = new URLSearchParams();
        body.append('token', localStorage.getItem('token'));

        await fetch(`http://localhost:8000/api/v1/revoke`, {
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
            </Center>
            <div>
                <Menu control={
                    <Button color="gray">
                        <Skeleton height=".5rem" width="6rem" mr=".75rem"/>
                        <Skeleton height="1.5rem" width=".5rem" circle/>
                    </Button>
                }>
                    <Menu.Label>Mon compte</Menu.Label>
                    {/*<Menu.Item onClick={() => setOpened(true)} icon={<BellRinging size={14} />} rightSection={<Badge color="green" variant="light">1</Badge>}>Notifications</Menu.Item>*/}
                    <Menu.Item disabled onClick={() => setOpened(true)} icon={<BellRinging size={14} />}>Notifications</Menu.Item>
                    <Menu.Item onClick={() => navigate('/settings')} icon={<Settings size={14} />}>Paramètres</Menu.Item>
                    <Divider />
                    <Menu.Item color="red" icon={<Logout size={14} />} onClick={() => { revokeToken().then(r => navigate('/')) }}>Se déconnecter</Menu.Item>
                </Menu>
            </div>
        </div>);
    }
    return (<div style={{height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem'}}>
        <Center style={{ height: '100%'}}>
            <img src="/img/logo.webp" alt="Logo de la 7ème Compagnie" height="90%" />
            <span style={{ marginLeft: '1rem', fontWeight: 900, fontSize: '14pt' }}>La 7ème Compagnie</span>
        </Center>
        <div>
            <Menu control={
                <Button color="gray">
                    <Text size="md" style={{marginLeft: '.45rem', marginRight: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{user.username}</Text>
                    <Avatar radius="xl" size="sm" src={`https://cdn.discordapp.com/avatars/${user.identifier}/${user.avatar}.png`} />
                </Button>
            }>
                <Menu.Label>Mon compte</Menu.Label>
                {/*<Menu.Item onClick={() => setOpened(true)} icon={<BellRinging size={14} />} rightSection={<Badge color="green" variant="light">1</Badge>}>Notifications</Menu.Item>*/}
                <Menu.Item disabled onClick={() => setOpened(true)} icon={<BellRinging size={14} />}>Notifications</Menu.Item>
                <Menu.Item onClick={() => navigate('/settings')} icon={<Settings size={14} />}>Paramètres</Menu.Item>
                <Divider />
                <Menu.Item color="red" icon={<Logout size={14} />} onClick={() => { revokeToken() }}>Se déconnecter</Menu.Item>
            </Menu>
        </div>

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
