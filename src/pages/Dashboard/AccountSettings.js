import {Input, InputWrapper, MultiSelect, SimpleGrid} from "@mantine/core";
import {At, Numbers} from "tabler-icons-react";
import roles from "../../data/roles.json";

function AccountSettings({user}) {
    return (
        <SimpleGrid cols={2}>
            <InputWrapper
                label={"Nom d'utilisateur"}
            >
                <Input
                    icon={<Numbers/>}
                    value={user.username}
                    disabled
                    title={"Veuillez changer votre pseudo Discord pour changer votre pseudo sur le site."}
                />
            </InputWrapper>

            <InputWrapper
                label={"Discriminateur Discord"}
            >
                <Input
                    icon={<Numbers/>}
                    value={user.discriminator}
                    disabled
                    title={"Veuillez changer votre discriminateur Discord pour changer votre discriminateur sur le site."}
                />
            </InputWrapper>

            <InputWrapper
                label={"Identifiant"}
            >
                <Input
                    icon={<Numbers/>}
                    value={user.identifier}
                    disabled
                    title={"Vous ne pouvez pas changer votre identifiant."}
                />
            </InputWrapper>

            <MultiSelect
                data={roles.roles}
                label="Rôles"
                placeholder="Ajouter / Supprimer des rôles"
                defaultValue={user.roles}
                searchable
                nothingFound="Aucun rôle trouvé"
                disabled
                title={"Vous ne pouvez pas changer vos rôles."}
            />
        </SimpleGrid>
    )
}

export default AccountSettings;