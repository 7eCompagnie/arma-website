import {Center, Pagination, Skeleton, Table} from "@mantine/core";

function Loading() {
    return (
        <>
            <h1>Gérer les utilisateurs</h1>
            <Center my={"1rem"}>
                <Pagination page={1} total={1} withEdges />
            </Center>
            <Table striped highlightOnHover>
                <thead>
                <tr>
                    <th>Pseudo</th>
                    <th>Adresse email</th>
                    <th>Roles</th>
                    <th>Actions</th>
                </tr>
                </thead>
            </Table>
            <Skeleton height={250} mt={10} />
            <Center mt={"1rem"}>
                <Pagination page={1} total={1} withEdges />
            </Center>
        </>
    )
}

export default Loading;