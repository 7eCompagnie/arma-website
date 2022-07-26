import {SimpleGrid, Text} from "@mantine/core";
import Moment from 'moment/min/moment-with-locales';

Moment.locale(window.navigator.userLanguage || window.navigator.language);

function Informations({operation}) {
    return (
        <SimpleGrid cols={3} spacing={4}>
            <div>
                <h2>Général</h2>
                <Text mb={8}><strong>Description:</strong> {operation.description}</Text>

                <Text mb={8}>
                    <strong>Date:</strong>
                    <span style={{textTransform: "capitalize", marginLeft: '4px'}}>
                    {Moment(new Date(operation.date)).format('dddd')}
                </span> {Moment(new Date(operation.date)).format('D MMMM YYYY')}
                </Text>

                <Text mb={8}>
                    <strong style={{marginRight: '4px'}}>Durée:</strong>
                    {Moment(new Date(operation.duration[0])).format('HH[h]mm')}
                    <span style={{margin: '0 4px'}}>-</span>
                    {Moment(new Date(operation.duration[1])).format('HH[h]mm')}
                </Text>

                <Text mb={8}>
                    <strong>Début des connexions:</strong> {Moment(new Date(operation.connectionStartTime)).format('HH[h]mm')}
                </Text>
            </div>

            <div>
                <h2>Arma</h2>
                <Text mb={8}><strong>Adresse:</strong> {operation.serversInformations.arma.address}</Text>

                <Text mb={8}><strong>Port:</strong> {operation.serversInformations.arma.port}</Text>

                <Text mb={8}><strong>Mot de passe:</strong>
                    {operation.serversInformations.arma.password === '' ? " Pas de mot de passe" : ` ${operation.serversInformations.arma.password}`}
                </Text>
            </div>

            <div>
                <h2>Teamspeak</h2>
                <Text mb={8}><strong>Adresse:</strong> {operation.serversInformations.teamspeak.address}</Text>

                <Text mb={8}><strong>Mot de passe:</strong>
                    {operation.serversInformations.teamspeak.password === '' ? " Pas de mot de passe" : ` ${operation.serversInformations.teamspeak.password}`}
                </Text>
            </div>
        </SimpleGrid>
    )
}

export default Informations;