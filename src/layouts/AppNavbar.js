import {Navbar, Skeleton} from "@mantine/core";
import AppNavbarLink from "./AppNavbarLink";
import {
    Award,
    Book,
    Books,
    BookUpload,
    CalendarEvent,
    CalendarPlus,
    CalendarStats,
    Checklist, HourglassLow,
    Users
} from "tabler-icons-react";
import {Dashboard} from "tabler-icons-react";

function AppNavbar({active, isLoading, user}) {

    const userLinks = [
        {
            icon: <Dashboard size={16}/>,
            color: "blue",
            label: "Tableau de bord",
            to: "/dashboard",
            disabledIfVisitor: false
        },
        {
            icon: <CalendarEvent size={16}/>,
            color: "teal",
            label: "Prochaines opérations",
            to: "/operations",
            disabledIfVisitor: true
        },
        {
            icon: <Award size={16}/>,
            color: "yellow",
            label: "Suivre une formation",
            to: "/trainings",
            disabledIfVisitor: true
        }
    ]

    const userLinksToDisplay = userLinks.map((link, i) => {
        if (isLoading)
            return <AppNavbarLink key={i} link={link.to} isActive={link.isActive} icon={link.icon} color={link.color} label={link.label} />
        if (link.to === active)
            link.isActive = true;
        return <AppNavbarLink key={i} link={link.to} isActive={link.isActive} icon={link.icon} color={link.color} label={link.label} disabled={!!user.roles.includes('VISITOR_ROLE') && link.disabledIfVisitor} />
    })

    const zeusLinks = [
        {
            icon: <CalendarStats size={16}/>,
            color: "orange",
            label: "Gérer les opérations",
            to: "/zeus/operations"
        },
        {
            icon: <CalendarPlus size={16}/>,
            color: "cyan",
            label: "Créer une opération",
            to: "/zeus/operations/new"
        },
        {
            icon: <HourglassLow size={16}/>,
            color: "brown",
            label: "Opérations archivées",
            to: "/zeus/operations/archives"
        }
    ]

    const zeusLinksToDisplay = zeusLinks.map((link, i) => {
        if (link.to === active)
            link.isActive = true;
        return <AppNavbarLink key={i} link={link.to} isActive={link.isActive} icon={link.icon} color={link.color} label={link.label} />
    })

    const trainersLinks = [
        {
            icon: <Book size={16}/>,
            color: "orange",
            label: "Gérer les formations",
            to: "/trainers/trainings"
        },
        {
            icon: <BookUpload size={16}/>,
            color: "cyan",
            label: "Créer une formation",
            to: "/trainers/trainings/new"
        },
        {
            icon: <Books size={16}/>,
            color: "red",
            label: "Faire passer une formation",
            to: "/trainers/trainings/pass"
        }
    ]

    const trainersLinksToDisplay = trainersLinks.map((link, i) => {
        if (link.to === active)
            link.isActive = true;
        return <AppNavbarLink key={i} link={link.to} isActive={link.isActive} icon={link.icon} color={link.color} label={link.label} />
    })

    const headQuartersLinks = [
        {
            icon: <Users size={16}/>,
            color: "lime",
            label: "Gérer les utilisateurs",
            to: "/head-quarters/users"
        },
        {
            icon: <Checklist size={16}/>,
            color: "blue",
            label: "Faire passer une whitelist",
            to: "/head-quarters/users/whitelist"
        }
    ]

    const headQuartersLinksToDisplay = headQuartersLinks.map((link, i) => {
        if (link.to === active)
            link.isActive = true;
        return <AppNavbarLink key={i} link={link.to} isActive={link.isActive} icon={link.icon} color={link.color} label={link.label} />
    });

    let skeletons = [];

    for (let i = 0; i < userLinks.length; i++) {
        skeletons.push(<div key={i} style={{display: "flex", alignItems: "center", marginLeft: "10px"}}>
            <Skeleton height={26} width={26} my={10}/>
            <Skeleton height={10} width={"70%"} ml={20}/>
        </div>)
    }

    if (isLoading) {
        return (<>
            <Navbar.Section grow mt="md">
                {skeletons}
            </Navbar.Section>
        </>);
    }

    return (<>
        <Navbar.Section grow mt="md">
            {user.roles.includes('USER_ROLE') ? userLinksToDisplay : userLinksToDisplay}

            {user.roles.includes('TRAINER_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE') ? <h3 style={{fontSize: "1rem", margin: "1rem 0 0 .75rem", textTransform: "uppercase", color: "#b2bec3"}}>Formateurs</h3> : null}
            {user.roles.includes('TRAINER_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE') ? trainersLinksToDisplay : null}

            {user.roles.includes('ZEUS_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE')? <h3 style={{fontSize: "1rem", margin: "1rem 0 0 .75rem", textTransform: "uppercase", color: "#b2bec3"}}>Zeus</h3> : null}
            {user.roles.includes('ZEUS_ROLE') || user.roles.includes('HEAD_QUARTER_ROLE')? zeusLinksToDisplay : null}

            {user.roles.includes('HEAD_QUARTER_ROLE') ? <h3 style={{fontSize: "1rem", margin: "1rem 0 0 .75rem", textTransform: "uppercase", color: "#b2bec3"}}>États-Major</h3> : null}
            {user.roles.includes('HEAD_QUARTER_ROLE') ? headQuartersLinksToDisplay : null}
        </Navbar.Section>
    </>);
}

export default AppNavbar;
