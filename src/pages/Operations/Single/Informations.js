import {SimpleGrid, Text} from "@mantine/core";
import Moment from "moment";

function Informations({operation}) {
    return (
        <SimpleGrid columns={2} spacing={4}>
            <Text><strong>Description:</strong> {operation.description}</Text>
            <Text>
                <strong>Date:</strong>
                <span style={{textTransform: "capitalize", marginLeft: '4px'}}>
                    {Moment(new Date(operation.date)).format('dddd')}
                </span> {Moment(new Date(operation.date)).format('D MMMM YYYY')}
            </Text>
            <Text>
                <strong style={{marginRight: '4px'}}>Durée:</strong>
                {Moment(new Date(operation.duration[0])).format('HH[h]mm')}
                <span style={{margin: '0 4px'}}>-</span>
                {Moment(new Date(operation.duration[1])).format('HH[h]mm')}
            </Text>
            <Text>
                <strong>Début des connexions:</strong> {Moment(new Date(operation.connectionStartTime)).format('HH[h]mm')}
            </Text>
        </SimpleGrid>
    )
}

export default Informations;