import React from 'react';
import {Routes, Route, useLocation, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Users/Dashboard";
import OperationsList from "./pages/Operations/List";
import TrainingsList from "./pages/Trainings/List";
import OperationSingle from "./pages/Operations/Single";
import OperationCreate from "./pages/Operations/Create";
import NotFound from "./pages/NotFound/";
import Users from "./pages/Users/Manage";
import {AppShell, Container, Header, MantineProvider, Navbar} from "@mantine/core";
import AppNavbar from "./layouts/AppNavbar";
import AppHeader from "./layouts/AppHeader";
import Settings from "./pages/Users/Settings";
import {useEffect, useMemo, useState} from "react";
import UserEdit from "./pages/Users/Edit";
import TrainingsManage from "./pages/Trainings/Manage";
import TrainingEdit from "./pages/Trainings/Edit";
import TrainingCreate from "./pages/Trainings/Create";
import TrainingSingle from "./pages/Trainings/Single";
import OperationsManage from "./pages/Operations/Manage";
import OperationEdit from "./pages/Operations/Edit";
import TrainingsPass from "./pages/Trainings/Pass";
import {NotificationsProvider} from "@mantine/notifications";
import {getUserByToken, getUserToken} from "./services/users";
import AppFooter from "./layouts/AppFooter";
import "./assets/css/style.css";

function App() {
    const { pathname } = useLocation();
    const [user, setUser] = useState([]);
    const queryString = window.location.search;
    const urlParams = useMemo(() => new URLSearchParams(queryString), [queryString]);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (urlParams.get('code') !== null) {
            const code = urlParams.get('code');

            getUserToken(code).then(data => {
                localStorage.setItem('token', data.data);

                getUserByToken(data.data).then(data => {
                    setUser(data.data);
                    setLoading(false);
                }).catch(err => console.log(err));

                navigate('/dashboard');
            }).catch(err => console.log(err));
        }

        if (localStorage.getItem('token') === null && urlParams.get('code') === null)
            navigate('/');

        if (localStorage.getItem('token') !== null) {
            const token = localStorage.getItem('token');

            getUserByToken(token).then(data => {
                setUser(data.data);
                setLoading(false);
            }).catch(err => console.log(err));
        }
    }, [navigate, urlParams]);

    if (pathname === '/')
        return <Home />;

    return (
        <React.StrictMode>
            <MantineProvider>
                <NotificationsProvider limit={5}>
                    <AppShell
                        padding="md"
                        navbar={<Navbar width={{ base: 300 }} p="xs">
                            <AppNavbar active={pathname} isLoading={isLoading} user={user}/>
                        </Navbar>}
                        header={<Header height={60} p="xs">
                            <AppHeader isLoading={isLoading} user={user}/>
                        </Header>}
                        footer={<AppFooter />}
                        styles={(theme) => ({
                            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                        })}
                    >
                        <Container>
                            <Routes>
                                <Route path="/settings" element={<Settings isLoading={isLoading} user={user}/>}/>
                                <Route path="/dashboard" element={<Dashboard />}/>

                                <Route path="/operations" element={<OperationsList />}/>
                                <Route path="/operations/:id" element={<OperationSingle />}/>

                                <Route path="/trainings" element={<TrainingsList />}/>
                                <Route path="/trainings/:id" element={<TrainingSingle />}/>

                                <Route path="/trainers/trainings" element={<TrainingsManage />}/>
                                <Route path="/trainers/trainings/new" element={<TrainingCreate />}/>
                                <Route path="/trainers/trainings/pass" element={<TrainingsPass user={user} />}/>
                                <Route path="/trainers/trainings/:id" element={<TrainingEdit />}/>

                                <Route path="/zeus/operations" element={<OperationsManage />}/>
                                <Route path="/zeus/operations/new" element={<OperationCreate />}/>
                                <Route path="/zeus/operations/:id" element={<OperationEdit />}/>

                                <Route path="/head-quarters/users" element={<Users isLoading={isLoading}/>}/>
                                <Route path="/head-quarters/users/:identifier" element={<UserEdit/>}/>

                                <Route path="*" element={<NotFound />}/>
                            </Routes>
                        </Container>
                    </AppShell>
                </NotificationsProvider>
            </MantineProvider>
        </React.StrictMode>);
}

export default App;
