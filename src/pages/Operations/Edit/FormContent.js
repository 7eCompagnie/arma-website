import {Button, Checkbox, Group, Input, InputWrapper, SimpleGrid, Text, Textarea, useMantineTheme} from "@mantine/core";
import {Calendar, Check, LetterCaseToggle, Photo, X} from "tabler-icons-react";
import {DatePicker, TimeInput, TimeRangeInput} from "@mantine/dates";
import dayjs from "dayjs";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import RolesCreation from "../../../components/RolesCreation";
import {showNotification, updateNotification} from "@mantine/notifications";
import {updateOperation} from "../../../services/operations";
import {useRef, useState} from "react";

function getIconColor(status, theme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
        : status.rejected
            ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7];
}

function ImageUploadIcon({status, ...props}) {
    if (status.accepted) {
        return <Checkbox {...props} />;
    }

    if (status.rejected) {
        return <X {...props} />;
    }

    return <Photo {...props} />;
}

const dropzoneChildren = (status, theme) => (
    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
        <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />

        <div>
            <Text size="xl" inline>
                Faites glisser l'image ici ou cliquez pour en sélectionner une.
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
                La taille de l'image ne doit pas dépasser 5Mo.
            </Text>
        </div>
    </Group>
)

function FormContent({operation}) {
    const openRef = useRef();
    const theme = useMantineTheme();
    const [updatedOperation, setUpdatedOperation] = useState({
        ...operation,
        date: new Date(operation.date),
        duration: [
            new Date(operation.duration[0]),
            new Date(operation.duration[1])
        ],
        connectionStartTime: new Date(operation.connectionStartTime),
    });

    const callback = (data) => {
        handleSubmit(data);
    }

    const handleSubmit = (data) => {
        showNotification({
            id: `edit-operation-${operation._id}`,
            loading: true,
            title: 'Mise à jour de l\'opération en cours...',
            message: 'Veuillez patienter... Cette opération peut prendre quelques secondes.',
            autoClose: false,
            disallowClose: true,
        });

        let body = {};

        if (updatedOperation.title !== operation.title)
            body.title = updatedOperation.title;
        if (updatedOperation.description !== operation.description)
            body.description = updatedOperation.description;
        if (updatedOperation.date !== operation.date)
            body.date = updatedOperation.date.toUTCString();

        updatedOperation.duration[0].setDate(updatedOperation.date.getDate());
        updatedOperation.duration[1].setDate(updatedOperation.date.getDate());
        updatedOperation.connectionStartTime.setDate(updatedOperation.date.getDate());

        body.duration = [
            updatedOperation.duration[0].toUTCString(),
            updatedOperation.duration[1].toUTCString()
        ];

        body.connectionStartTime = updatedOperation.connectionStartTime.toUTCString();
        body.roles = data;

        updateOperation(operation._id, body).then((data) => {
            updateNotification({
                id: `edit-operation-${data.data._id}`,
                color: 'teal',
                title: 'Edition terminée',
                message: `Vous avez mis à jour correctement l'opération ${data.data.title}`,
                icon: <Check />,
                autoClose: 5000,
            });
        }).catch(err => console.log(err));
    }

    return (
        <form action="src/pages/Operations/Edit/OperationEdit#index.js">
            <SimpleGrid cols={2}>
                <InputWrapper
                    label={"Nom de l'opération"}
                    required
                >
                    <Input
                        icon={<LetterCaseToggle/>}
                        placeholder="Ex: Opération Bosso"
                        onChange={(e) => setUpdatedOperation({...updatedOperation, title: e.target.value})}
                        value={updatedOperation.title}
                    />
                </InputWrapper>
                <DatePicker
                    label={"Date de l'opération"}
                    locale="fr"
                    placeholder="Ex: 23 mars 2022"
                    minDate={dayjs(new Date()).toDate()}
                    inputFormat="D MMMM YYYY"
                    icon={<Calendar size={16} />}
                    required
                    value={updatedOperation.date}
                    onChange={(date) => setUpdatedOperation({...updatedOperation, date: date})}
                />

                <TimeRangeInput
                    label="Durée de l'opération"
                    required
                    value={updatedOperation.duration}
                    onChange={(duration) => setUpdatedOperation({...updatedOperation, duration: duration})}
                />

                <TimeInput
                    label="Heure de début de connexion"
                    value={updatedOperation.connectionStartTime}
                    onChange={(connectionStartTime) => setUpdatedOperation({...updatedOperation, connectionStartTime})}
                    required
                />

                <Textarea
                    label="Description de l'opération"
                    placeholder='Ex: Le Corps de la Légion Etrangère pose pied au Sahel. Leur première mission : "Prendre la température".'
                    required
                    value={updatedOperation.description}
                    onChange={(e) => setUpdatedOperation({...updatedOperation, description: e.target.value})}
                />

                <InputWrapper
                    label={"Image de la formation"}
                    required
                >
                    <Dropzone
                        style={{display: 'none'}}
                        onDrop={(files) => {
                            console.log('accepted files', files[files.length - 1].name);
                            document.getElementById("btn-select-files").firstChild.firstChild.innerHTML = files[files.length - 1].name;
                            setUpdatedOperation({...updatedOperation, picture: (files[files.length - 1])});
                        }}
                        onReject={(files) => console.log('rejected files', files)}
                        maxSize={3 * 1024 ** 2}
                        accept={IMAGE_MIME_TYPE}
                        openRef={openRef}
                    >
                        {(status) => dropzoneChildren(status, theme)}
                    </Dropzone>

                    <Group>
                        <Button color={"green"} onClick={() => openRef.current()} id="btn-select-files" disabled title={"Désactiver momentanément. Veuillez supprimer, puis recréer la formation."}>{operation.picture}</Button>
                    </Group>
                </InputWrapper>
            </SimpleGrid>

            <h2>Configuration des groupes et des équipes</h2>
            <RolesCreation callback={callback} data={updatedOperation.roles} buttonText={"Sauvegarder"}/>
        </form>
    )
}

export default FormContent;