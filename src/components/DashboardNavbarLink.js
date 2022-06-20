import {Group, Text, ThemeIcon, UnstyledButton} from "@mantine/core";
import {useNavigate} from "react-router-dom";

function DashboardNavbarLink({ icon, color, label, isActive, link }) {
    const navigate = useNavigate();

    return (<UnstyledButton onClick={() => { navigate(link) }}
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
        </UnstyledButton>)
}

export default DashboardNavbarLink;
