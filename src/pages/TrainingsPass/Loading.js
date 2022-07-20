import {InputWrapper, Skeleton} from "@mantine/core";

function Loading() {
    return (
        <>
            <h1>Ajouter une formation à un joueur</h1>
            <InputWrapper
                label={"Choisir un joueur"}
            >
                <Skeleton height={36}/>
            </InputWrapper>
        </>
    );
}

export default Loading;