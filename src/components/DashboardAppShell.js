import {AppShell, Container, Header, Navbar} from "@mantine/core";
import DashboardNavbar from "./DashboardNavbar";
import DashboardHeader from "./DashboardHeader";

function DashboardAppShell({active, content}) {
    return(<>
        <AppShell
            padding="md"
            navbar={<Navbar width={{ base: 300 }} height={500} p="xs">
                <DashboardNavbar active={active}/>
            </Navbar>}
            header={<Header height={60} p="xs">
                <DashboardHeader />
            </Header>}
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

export default DashboardAppShell;