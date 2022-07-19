import {Routes, Route, useLocation, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Operations from "./pages/operations/Operations";
import Trainings from "./pages/formers/Trainings";
import SingleOperation from "./pages/operations/SingleOperation";
import ZeusOperationCreate from "./pages/operations/zeus/ZeusOperationCreate";
import NotFound from "./pages/NotFound";
import Users from "./pages/admin/users/Users";
import {AppShell, Center, Container, Header, MantineProvider, Navbar} from "@mantine/core";
import DashboardNavbar from "./components/DashboardNavbar";
import DashboardHeader from "./components/DashboardHeader";
import Settings from "./pages/Settings";
import {useEffect, useState} from "react";
import UserEdit from "./pages/admin/users/UserEdit";
import FormersTrainings from "./pages/formers/trainings/FormersTrainings";
import FormersTrainingEdit from "./pages/formers/trainings/FormersTrainingEdit";
import FormersTrainingCreate from "./pages/formers/trainings/FormersTrainingCreate";
import SingleTraining from "./pages/formers/SingleTraining";
import ZeusOperations from "./pages/operations/zeus/ZeusOperations";
import ZeusOperationEdit from "./pages/operations/zeus/ZeusOperationEdit";
import FormersTrainingsPass from "./pages/formers/trainings/FormersTrainingsPass";
import {Heart} from "tabler-icons-react";
import {NotificationsProvider} from "@mantine/notifications";

function App() {
    const { pathname } = useLocation();
    const [user, setUser] = useState([]);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = () => {
        const token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/users/token/${token}`, {
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

        fetch(`${process.env.REACT_APP_ENDPOINT_URL}/login`, {
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
    })


    if (pathname === '/')
        return <Home />;
    return (
        <MantineProvider>
            <NotificationsProvider limit={5}>
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
                            <Route path="/settings" element={<Settings isLoading={isLoading} user={user}/>}/>
                            <Route path="/dashboard" element={<Dashboard />}/>

                            <Route path="/operations" element={<Operations />}/>
                            <Route path="/operations/:id" element={<SingleOperation />}/>

                            <Route path="/trainings" element={<Trainings />}/>
                            <Route path="/trainings/:id" element={<SingleTraining />}/>

                            <Route path="/formers/trainings" element={<FormersTrainings />}/>
                            <Route path="/formers/trainings/new" element={<FormersTrainingCreate />}/>
                            <Route path="/formers/trainings/pass" element={<FormersTrainingsPass user={user} />}/>
                            <Route path="/formers/trainings/:id" element={<FormersTrainingEdit />}/>

                            <Route path="/zeus/users" element={<Users isLoading={isLoading}/>}/>
                            <Route path="/zeus/users/:identifier" element={<UserEdit/>}/>
                            <Route path="/zeus/operations" element={<ZeusOperations />}/>
                            <Route path="/zeus/operations/new" element={<ZeusOperationCreate />}/>
                            <Route path="/zeus/operations/:id" element={<ZeusOperationEdit />}/>

                            <Route path="*" element={<NotFound />}/>
                        </Routes>
                    </Container>
                    <Center mt={40}>
                        <p>
                            Développé avec <Heart style={{marginBottom: "-4px"}} color={"red"} size={20}/> par <a style={{color: 'teal', textDecoration: 'none', fontWeight: 'bold'}} href="https://sn00ww.github.io/portfolio/" target={"_blank"} rel="noreferrer">Sn0w</a>, le meilleur soldat de la 7ème Compagnie.
                        </p>
                    </Center>
                </AppShell>
            </NotificationsProvider>
        </MantineProvider>);
}

export default App;
