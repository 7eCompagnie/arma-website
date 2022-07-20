import {Checkbox, Input, InputWrapper, MultiSelect, SimpleGrid, Skeleton} from "@mantine/core";
import {At, Numbers} from "tabler-icons-react";

function Settings({isLoading, user}) {

    const roles = [
        { value: 'USER_ROLE', label: 'Utilisateur' },
        { value: 'TRAINER_ROLE', label: 'Formateur' },
        { value: 'ADMIN_ROLE', label: 'Zeus' },
    ]

    if (isLoading) {
        return (<>
            <h1>Paramètres</h1>
            <h2>Mon compte</h2>
            <SimpleGrid cols={2}>
                <InputWrapper
                    label={"Nom d'utilisateur"}
                >
                    <Skeleton height={36} width={"100%"}/>
                </InputWrapper>

                <InputWrapper
                    label={"Discriminateur Discord"}
                >
                    <Skeleton height={36} width={"100%"}/>
                </InputWrapper>

                <InputWrapper
                    label={"Email"}
                >
                    <Skeleton height={36} width={"100%"}/>
                </InputWrapper>

                <InputWrapper
                    label={"Identifiant"}
                >
                    <Skeleton height={36} width={"100%"}/>
                </InputWrapper>

                <InputWrapper
                    label={"Rôles"}
                >
                    <Skeleton height={36} width={"100%"}/>
                </InputWrapper>
            </SimpleGrid>

            <h2>Autres</h2>
            <Checkbox
                label="Thème clair"
                disabled
                checked
                title={"Bientôt disponible."}
            />
        </>);
    }

    return (<>
        <h1>Paramètres</h1>
        <h2>Mon compte</h2>

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
                label={"Email"}
            >
                <Input
                    icon={<At/>}
                    value={user.email}
                    disabled
                    title={"Veuillez changer votre email Discord pour changer votre email sur le site."}
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
                data={roles}
                label="Rôles"
                placeholder="Ajouter / Supprimer des rôles"
                defaultValue={user.roles}
                searchable
                nothingFound="Aucun rôle trouvé"
                disabled
                title={"Vous ne pouvez pas changer vos rôles."}
            />
        </SimpleGrid>

        <h2>Autres</h2>
        <Checkbox
            label="Thème clair"
            disabled
            checked
            title={"Bientôt disponible."}
        />
    </>);
}

export default Settings;
