import {Button, Group, Input, InputWrapper, SimpleGrid, Skeleton, Switch, Textarea} from "@mantine/core";
import {LetterCase} from "tabler-icons-react";

function Loading() {
    return (
        <div>
            <h1>Créer une nouvelle formation</h1>
            <form id="create-training">
                <SimpleGrid cols={2}>
                    <InputWrapper
                        label={"Nom de la formation"}
                        required
                    >
                        <Input
                            id={"input-name"}
                            icon={<LetterCase/>}
                            placeholder={"Pilote de tigre"}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label={"Formateurs"}
                    >
                        <Skeleton height={36} width={"100%"}/>
                    </InputWrapper>

                    <Textarea
                        id={"input-description"}
                        label="Description de la formation"
                        placeholder="Cette formation vous apprendra les bases du combat en hélicoptère."
                        required
                    />

                    <InputWrapper
                        label={"Image de la formation"}
                        required
                    >
                        <Group>
                            <Button color={"green"} id="btn-select-files">Sélectionner une image</Button>
                        </Group>
                    </InputWrapper>

                    <Group>
                        <Switch onLabel="OUI" offLabel="NON" defaultChecked={true} id={"input-open"} />
                                label="Les joueurs peuvent demander à être formé dès à présent"
                        />
                    </Group>
                </SimpleGrid>
            </form>

            <Button mt={"lg"} disabled>
                Créer la formation
            </Button>
        </div>
    );
}

export default Loading;