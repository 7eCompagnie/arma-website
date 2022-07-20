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
            <form>
                <SimpleGrid cols={2}>
                    <InputWrapper
                        label={"Nom de la formation"}
                    >
                        <Skeleton height={36}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Formateurs"}
                    >
                        <Skeleton height={36}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Description"}
                    >
                        <Skeleton height={65}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Image de la formation"}
                    >
                        <Skeleton height={36} />
                    </InputWrapper>

                    <InputWrapper
                        label={"Les joueurs peuvent demander à être formé dès à présent"}
                    >
                        <Skeleton height={36} />
                    </InputWrapper>
                </SimpleGrid>
                <Button mt={"lg"} disabled>
                    Sauvegarder
                </Button>
            </form>
        </>
    )
}

export default Loading;