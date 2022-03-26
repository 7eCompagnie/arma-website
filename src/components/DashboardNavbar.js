import {Navbar} from "@mantine/core";
import DashboardNavbarLink from "./DashboardNavbarLink";
import {Award, CalendarEvent, CalendarPlus} from "tabler-icons-react";
import {Dashboard} from "tabler-icons-react";

function DashboardNavbar({active}) {
    return (<>
        <Navbar.Section grow mt="md">
            <DashboardNavbarLink link={"/dashboard"} isActive={active === "dashboard"} icon={<Dashboard size={16}/>} color="blue" label={"Dashboard"}/>
            <DashboardNavbarLink link={"/operations/register"} isActive={active === "operation-register"} icon={<CalendarEvent size={16}/>} color="teal" label={"S'inscrire aux opérations"}/>
            <DashboardNavbarLink link={"/formations"} isActive={active === "formations"} icon={<Award size={16}/>} color="red" label={"Formations"}/>
            <DashboardNavbarLink link={"/operations/create"} isActive={active === "createFormation"} icon={<CalendarPlus size={16}/>} color="grape" label={"Créer une opération"}/>
        </Navbar.Section>
    </>);
}

export default DashboardNavbar;