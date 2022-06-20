import {Routes, Route, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/operations/Register";
import Formations from "./pages/formations/Formations";
import SingleOperation from "./pages/operations/Single";
import SingleFormation from "./pages/formations/Single";
import Create from "./pages/operations/Create";
import Authorize from "./pages/Authorize";
import {AppShell, Container, Header, Navbar} from "@mantine/core";
import DashboardNavbar from "./components/DashboardNavbar";
import DashboardHeader from "./components/DashboardHeader";

function App() {
    const { pathname } = useLocation();

    return (<>
        <AppShell
            padding="md"
            navbar={<Navbar width={{ base: 300 }} height={500} p="xs">
                <DashboardNavbar active={pathname}/>
            </Navbar>}
            header={<Header height={60} p="xs">
                <DashboardHeader />
            </Header>}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Container>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/authorize" element={<Authorize />}/>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/operations" element={<Register />}/>
                    <Route path="/operations/operation-bosso" element={<SingleOperation />}/>
                    <Route path="/operations/create" element={<Create />}/>
                    <Route path="/formations" element={<Formations />}/>
                    <Route path="/formations/pilote-helico" element={<SingleFormation />}/>
                </Routes>
            </Container>
        </AppShell>

    </>);
}

export default App;
