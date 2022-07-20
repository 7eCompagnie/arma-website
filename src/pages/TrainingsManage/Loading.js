import {Button, Center, Pagination, Skeleton, Table} from "@mantine/core";
import {Plus} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";

function Loading() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Gérer les formations</h1>
            <Button leftIcon={<Plus size={22}/>} onClick={() => navigate('/trainers/trainings/new')}>Créer une formation</Button>
            <Center my={"1rem"}>
                <Pagination page={1} total={1} withEdges />
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
                <Pagination page={1} total={1} withEdges />
            </Center>
        </>
    );
}

export default Loading;