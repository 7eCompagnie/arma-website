import {SimpleGrid, Skeleton} from "@mantine/core";

function Loading() {
    return (
        <>
            <h1>Inscription aux opérations</h1>
            <SimpleGrid cols={2}>
                <Skeleton height={300} />
                <Skeleton height={300} />
            </SimpleGrid>
        </>
    )
}

export default Loading;