import {InputWrapper, Skeleton} from "@mantine/core";

function Loading() {
    return (
        <>
            <h1>Gérer les utilisateurs</h1>

            <InputWrapper
                label={"Choisir un joueur"}
            >
                <Skeleton height={36}/>
            </InputWrapper>
        </>
    );
}

export default Loading;