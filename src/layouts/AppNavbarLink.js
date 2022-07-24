import {Group, Text, ThemeIcon, UnstyledButton} from "@mantine/core";
import {useNavigate} from "react-router-dom";

function AppNavbarLink({ icon, color, label, isActive, link, disabled }) {
    const navigate = useNavigate();

    if (disabled) {
        return (
            <UnstyledButton disabled title={"Vous ne pouvez pas accéder à cette page"}
                sx={(theme) => ({
                    display: 'block',
                    width: '100%',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                    backgroundColor: isActive ? (theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]) : 'transparent',
                    cursor: 'not-allowed'
                })}
            >
                <Group>
                    <ThemeIcon color={color} variant="light">
                        {icon}
                    </ThemeIcon>

                    <Text size="sm" color={"gray"}>{label}</Text>
                </Group>
            </UnstyledButton>
        )
    }

    return (
        <UnstyledButton onClick={() => { navigate(link) }}
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                backgroundColor: isActive ? (theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]) : 'transparent',

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
            })}
        >
            <Group>
                <ThemeIcon color={color} variant="light">
                    {icon}
                </ThemeIcon>

                <Text size="sm">{label}</Text>
            </Group>
        </UnstyledButton>
    )
}

export default AppNavbarLink;
