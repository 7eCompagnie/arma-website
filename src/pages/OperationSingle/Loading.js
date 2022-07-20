import {Button, SimpleGrid, Skeleton, Text} from "@mantine/core";
import {ChevronLeft} from "tabler-icons-react";
import {useNavigate} from "react-router-dom";

function Loading() {
    const navigate = useNavigate();
    
    return (
        <>
            <Button variant="outline" compact leftIcon={<ChevronLeft/>} onClick={() => navigate('/operations')}>
                Retour
            </Button>
            <Skeleton my={38} height={16} width={200} />
            <Skeleton height={250} />
            <h2>Informations générales</h2>
            <SimpleGrid columns={2} spacing={4}>
                <Text>
                    <strong>Description:</strong>
                    <Skeleton height={8} my={10} />
                    <Skeleton height={8} my={10} />
                    <Skeleton height={8} width={150} my={10}/>
                </Text>
                <Text style={{display: "flex", alignItems: "center"}}>
                    <strong>Date:</strong>
                    <Skeleton height={8} width={100} ml={10} />
                </Text>
                <Text style={{display: "flex", alignItems: "center"}}>
                    <strong style={{marginRight: '4px'}}>Durée:</strong>
                    <Skeleton height={8} width={100} ml={10} />
                </Text>
                <Text style={{display: "flex", alignItems: "center"}}>
                    <strong>Début des connexions:</strong>
                    <Skeleton height={8} width={100} ml={10} />
                </Text>
            </SimpleGrid>

            <h2>Inscription</h2>
            <SimpleGrid cols={3}>
                <Skeleton height={200} />
                <Skeleton height={200} />
                <Skeleton height={200} />
            </SimpleGrid>
        </>
    )
}

export default Loading;