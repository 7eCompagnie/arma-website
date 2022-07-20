import {Button, InputWrapper, SimpleGrid, Skeleton} from "@mantine/core";
import {ChevronLeft} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";

function Loading() {
    const navigate = useNavigate();

    return (
        <>
            <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/admin/users')}>
                Retour
            </Button>

            <Skeleton my={38} height={16} width={200} />
            <h2>Général</h2>
            <form action="#">
                <SimpleGrid cols={2}>
                    <InputWrapper
                        label={"Nom d'utilisateur"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Discriminateur Discord"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Email"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Identifiant"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Rôles"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>
                </SimpleGrid>
                <Button type="submit" mt={"2rem"} disabled>Sauvegarder</Button>
            </form>
        </>
    )
}

export default Loading;