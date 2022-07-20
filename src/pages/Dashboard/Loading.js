import {Checkbox, InputWrapper, SimpleGrid, Skeleton} from "@mantine/core";

function Loading() {
    return (
        <>
            <h1>Paramètres</h1>
            <h2>Mon compte</h2>
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

            <h2>Autres</h2>
            <Checkbox
                label="Thème clair"
                disabled
                checked
                title={"Bientôt disponible."}
            />
        </>
    )
}

export default Loading;