import {Button, InputWrapper, SimpleGrid, Skeleton} from "@mantine/core";
import {ChevronLeft} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";

function Loading() {
    const navigate = useNavigate();

    return (
        <>
            <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/zeus/operations')}>
                Retour
            </Button>
            <Skeleton my={38} height={16} width={200} />
            <form>
                <SimpleGrid cols={2}>
                    <InputWrapper
                        label={"Nom de l'opération"}
                    >
                        <Skeleton height={36}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Date de l'opération"}
                    >
                        <Skeleton height={36}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Durée de l'opération"}
                    >
                        <Skeleton height={36}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Heure de début de connexion"}
                    >
                        <Skeleton height={36}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Description de l'opération"}
                    >
                        <Skeleton height={65}/>
                    </InputWrapper>

                    <InputWrapper
                        label={"Image de la formation"}
                    >
                        <Skeleton height={36} />
                    </InputWrapper>
                </SimpleGrid>

                <h2>Configuration des groupes et des équipes</h2>
                <Skeleton height={200} />
            </form>
        </>
    )
}

export default Loading;