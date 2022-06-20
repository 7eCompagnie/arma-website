import {Routes, Route, useLocation, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/operations/Register";
import Formations from "./pages/formations/Formations";
import SingleOperation from "./pages/operations/Single";
import SingleFormation from "./pages/formations/Single";
import Create from "./pages/operations/Create";
import NotFound from "./pages/NotFound";
import {AppShell, Container, Header, Navbar} from "@mantine/core";
import DashboardNavbar from "./components/DashboardNavbar";
import DashboardHeader from "./components/DashboardHeader";
import Settings from "./pages/Settings";
import {useEffect, useState} from "react";

function App() {
    const { pathname } = useLocation();
    const [user, setUser] = useState([]);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = () => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8000/api/v1/users/token/${token}`, {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data.data);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }

    const fetchToken = () => {
        const body = new URLSearchParams();
        body.append('code', urlParams.get('code'));

        fetch('http://localhost:8000/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': localStorage.getItem('token')
            },
            body: body
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('token', data.data);
                fetchData();
                navigate('/dashboard');
            }).catch(err => console.log(err));
    }

    useEffect(() => {
        if (urlParams.get('code') !== null)
            fetchToken();
        if (localStorage.getItem('token') === null && urlParams.get('code') === null)
            navigate('/');
        if (localStorage.getItem('token') !== null)
            fetchData();
    }, [])


    return (<>
        <AppShell
            padding="md"
            navbar={<Navbar width={{ base: 300 }} height={500} p="xs">
                <DashboardNavbar active={pathname} isLoading={isLoading} user={user}/>
            </Navbar>}
            header={<Header height={60} p="xs">
                <DashboardHeader isLoading={isLoading} user={user}/>
            </Header>}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Container>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/settings" element={<Settings isLoading={isLoading} user={user}/>}/>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/operations" element={<Register />}/>
                    <Route path="/operations/operation-bosso" element={<SingleOperation />}/>
                    <Route path="/operations/create" element={<Create />}/>
                    <Route path="/formations" element={<Formations />}/>
                    <Route path="/formations/pilote-helico" element={<SingleFormation />}/>
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </Container>
        </AppShell>

    </>);
}

export default App;
