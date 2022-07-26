import {Button, Center, Pagination, Skeleton, Table} from "@mantine/core";
import {Plus} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";

function Loading() {
    const navigate = useNavigate();
    const activePage = 1;
    const maxPages = 1;

    return (
        <>
            <h1>Gérer les archives</h1>
            <Button leftIcon={<Plus size={22}/>} onClick={() => navigate('/zeus/operations/new')}>Créer une opération</Button>
            <Center my={"1rem"}>
                <Pagination page={activePage} total={maxPages} withEdges />
            </Center>
            <Table striped highlightOnHover>
                <thead>
                <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
            </Table>
            <Skeleton height={250} mt={10} />
            <Center mt={"1rem"}>
                <Pagination page={activePage} total={maxPages} withEdges />
            </Center>
        </>
    );
}

export default Loading;