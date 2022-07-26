import React, {useEffect, useMemo, useState} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Users/Dashboard";
import OperationsList from "./pages/Operations/List";
import TrainingsList from "./pages/Trainings/List";
import OperationSingle from "./pages/Operations/Single";
import OperationCreate from "./pages/Operations/Create";
import Users from "./pages/Users/Manage";
import {AppShell, Container, Header, MantineProvider, Navbar} from "@mantine/core";
import AppNavbar from "./layouts/AppNavbar";
import AppHeader from "./layouts/AppHeader";
import Settings from "./pages/Users/Settings";
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
import Whitelist from "./pages/Users/Whitelist";
import Protected from "./context/Protected";
import OperationsPast from "./pages/Operations/Past";

function App() {
    const { pathname } = useLocation();
    const [user, setUser] = useState(null);
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
        } else if (localStorage.getItem('token') !== null) {
            const token = localStorage.getItem('token');

            getUserByToken(token).then(data => {
                setUser(data.data);
                setLoading(false);
            }).catch(err => console.log(err));
        } else
            setLoading(false);
    }, [navigate, urlParams]);

    if (isLoading) {
        return (<></>);
    }

    if (pathname === '/') {
        return (
            <Protected condition={!user} path={'/dashboard'}>
                <Home/>
            </Protected>
        );
    }

    return (
        <React.StrictMode>
            <MantineProvider>
                <NotificationsProvider limit={5}>
                    <Protected condition={user} path="/">
                        <AppShell
                            padding="md"
                            navbar={<Navbar width={{ base: 300 }} p="xs">
                                <AppNavbar active={pathname} isLoading={isLoading} user={user}/>
                            </Navbar>}
                            header={<Header height={60} p="xs">
                                <AppHeader isLoading={isLoading} user={user} setUser={setUser}/>
                            </Header>}
                            footer={<AppFooter />}
                            styles={(theme) => ({
                                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                            })}
                        >
                            <Container>
                                <Routes>
                                    <Route path="/settings" element={<Settings isLoading={isLoading} user={user}/>}/>
                                    <Route path="/dashboard" element={<Dashboard isLoading={isLoading} user={user} />}/>


                                    <Route path="/operations" element={
                                        <Protected condition={user && user.roles.includes('USER_ROLE')} path="/dashboard"><OperationsList /></Protected>}/>
                                    <Route path="/operations/:slug" element={
                                        <Protected condition={user && user.roles.includes('USER_ROLE')} path="/dashboard"><OperationSingle /></Protected>}/>


                                    <Route path="/trainings" element={
                                        <Protected condition={user && user.roles.includes('USER_ROLE')} path="/"><TrainingsList /></Protected>}/>
                                    <Route path="/trainings/:slug" element={
                                        <Protected condition={user && user.roles.includes('USER_ROLE')} path="/"><TrainingSingle /></Protected>}/>

                                    <Route path="/trainers/trainings" element={
                                        <Protected condition={user && (user.roles.includes('TRAINER_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE'))} path="/"><TrainingsManage /></Protected>}/>
                                    <Route path="/trainers/trainings/new" element={
                                        <Protected condition={user && (user.roles.includes('TRAINER_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE'))} path="/"><TrainingCreate /></Protected>}/>
                                    <Route path="/trainers/trainings/pass" element={
                                        <Protected condition={user && (user.roles.includes('TRAINER_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE'))} path="/"><TrainingsPass user={user} /></Protected>}/>
                                    <Route path="/trainers/trainings/:id" element={
                                        <Protected condition={user && (user.roles.includes('TRAINER_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE'))} path="/"><TrainingEdit /></Protected>}/>

                                    <Route path="/zeus/operations" element={
                                        <Protected condition={user && (user.roles.includes('ZEUS_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE'))} path="/"><OperationsManage /></Protected>}/>
                                    <Route path="/zeus/operations/new" element={
                                        <Protected condition={user && (user.roles.includes('ZEUS_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE'))} path="/"><OperationCreate /></Protected>}/>
                                    <Route path="/zeus/operations/:id" element={
                                        <Protected condition={user && (user.roles.includes('ZEUS_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE'))} path="/"><OperationEdit /></Protected>}/>
                                    <Route path="/zeus/operations/archives" element={
                                        <Protected condition={user && (user.roles.includes('ZEUS_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE'))} path="/"><OperationsPast /></Protected>}/>

                                    <Route path="/head-quarters/users" element={
                                        <Protected condition={user && user.roles.includes('HEAD_QUARTER_ROLE')} path="/"><Users isLoading={isLoading}/></Protected>}/>
                                    <Route path="/head-quarters/users/:identifier" element={
                                        <Protected condition={user && user.roles.includes('HEAD_QUARTER_ROLE')} path="/"><UserEdit/></Protected>}/>
                                    <Route path="/head-quarters/users/whitelist" element={
                                        <Protected condition={user && user.roles.includes('HEAD_QUARTER_ROLE')} path="/"><Whitelist /></Protected>}/>

                                    <Route path="*" element={<Navigate to="/" replace />}/>
                                </Routes>
                            </Container>
                        </AppShell>
                    </Protected>
                </NotificationsProvider>
            </MantineProvider>
        </React.StrictMode>);
}

export default App;
