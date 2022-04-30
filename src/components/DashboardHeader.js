import {Alert, Avatar, Badge, Button, Center, Divider, Menu, Modal, Text} from "@mantine/core";
import { useMantineTheme } from '@mantine/core';
import '../css/dashboard.css';
import {AlertCircle, BellRinging, Logout, Settings} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";


function DashboardHeader() {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(false);
    const [user, setUser] = useState([]);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const fetchToken = () => {
        fetch(`http://localhost:4000/api/v1/discord/authorize?code=${urlParams.get('code')}`)
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('token', data.data.token);
                navigate('/dashboard');
            }).catch(err => console.log(err));
    }

    const fetchData = () => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:4000/api/v1/users/token/${token}`)
            .then(res => res.json())
            .then(data => {
                setUser(data.data);
            })
            .catch(err => console.log(err));
    }

    const revokeToken = () => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:4000/api/v1/discord/revoke?token=${localStorage.getItem('token')}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                localStorage.removeItem('token');
                navigate('/');
            });
    }

    useEffect(() => {
        if (urlParams.get('code') !== null)
            fetchToken();
        if (localStorage.getItem('token') === null && urlParams.get('code') === null)
            navigate('/');
        if (localStorage.getItem('token') !== null)
            fetchData();
    }, []);

    return (<div style={{height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem'}}>
        <Center style={{ height: '100%'}}>
            <img src="/img/logo.png" alt="Logo de la 7ème Compagnie" height="90%" />
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
                <Menu.Item onClick={() => setOpened(true)} icon={<BellRinging size={14} />}>Notifications</Menu.Item>
                <Menu.Item icon={<Settings size={14} />}>Paramètres</Menu.Item>
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