import {SimpleGrid, Skeleton} from "@mantine/core";

function Loading() {
    return (
        <>
            <h1>Les formations disponibles</h1>
            <SimpleGrid cols={3}>
                <Skeleton height={300} />
                <Skeleton height={300} />
                <Skeleton height={300} />
            </SimpleGrid>
        </>
    );
}

export default Loading;