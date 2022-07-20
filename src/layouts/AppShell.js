import {AppShell, Container, Header, Navbar} from "@mantine/core";
import AppNavbar from "./AppNavbar";
import AppHeader from "./AppHeader";

function AppShell({active, content}) {
    return(<>
        <AppShell
            padding="md"
            navbar={<AppNavbar width={{ base: 300 }} height={500} p="xs">
                <AppNavbar active={active}/>
            </AppNavbar>}
            header={<AppHeader height={60} p="xs">
                <AppHeader />
            </AppHeader>}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Container>
                {content}
            </Container>
        </AppShell>
    </>);
}

export default AppShell;