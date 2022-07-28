import {Input, InputWrapper, MultiSelect, SimpleGrid} from "@mantine/core";
import {Id, LetterCase, Numbers} from "tabler-icons-react";
import roles from "../../../data/roles.json";

function FormContent({user, trainings, onRolesChange, onTrainingsChange}) {
    const trainingsData = trainings.map((training) => {
        return ({
            value: training._id,
            label: training.title
        });
    });

    return (
        <SimpleGrid cols={2}>
            <InputWrapper
                label={"Nom d'utilisateur"}
            >
                <Input
                    icon={<LetterCase/>}
                    value={user.username}
                    disabled
                    title={"Vous ne pouvez pas changer le pseudo d'un utilisateur."}
                />
            </InputWrapper>


            <InputWrapper
                label={"Discriminateur Discord"}
            >
                <Input
                    icon={<Numbers/>}
                    value={user.discriminator}
                    disabled
                    title={"Vous ne pouvez pas changer le discriminateur Discord d'un utilisateur."}
                />
            </InputWrapper>

            <InputWrapper
                label={"Identifiant"}
            >
                <Input
                    icon={<Id/>}
                    value={user.identifier}
                    disabled
                    title={"Vous ne pouvez pas changer l'identifiant d'un utilisateur."}
                />
            </InputWrapper>

            <MultiSelect
                data={roles.roles}
                label="Rôles"
                placeholder="Ajouter / Supprimer des rôles"
                defaultValue={user.roles}
                searchable
                nothingFound="Aucun rôle trouvé"
                onChange={onRolesChange}
            />

            <MultiSelect
                mt={10}
                data={trainingsData}
                label={`Modifier les formations de ${user.username}`}
                placeholder="Rechercher une formation..."
                searchable
                nothingFound="Aucune formation trouvée."
                defaultValue={user.trained}
                onChange={onTrainingsChange}
            />
        </SimpleGrid>
    )
}

export default FormContent;