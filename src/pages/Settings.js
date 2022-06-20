import {Checkbox, Input, InputWrapper, SimpleGrid, Skeleton, Textarea} from "@mantine/core";
import {At, Calendar, LetterCaseToggle, Numbers} from "tabler-icons-react";
import {DatePicker, TimeInput, TimeRangeInput} from "@mantine/dates";
import dayjs from "dayjs";
import {useEffect} from "react";

function Settings({isLoading, user}) {
    if (isLoading) {
        return (<>
            <h1>Paramètres</h1>
            <h2>Mon compte</h2>
            <form>
                <SimpleGrid cols={2}>
                    <div>
                        <Skeleton height={8} width={100} my={10}/>
                        <Skeleton height={36} width={"100%"}/>
                    </div>

                    <div>
                        <Skeleton height={8} width={100} my={10}/>
                        <Skeleton height={36} width={"100%"}/>
                    </div>

                    <div>
                        <Skeleton height={8} width={100} my={10}/>
                        <Skeleton height={36} width={"100%"}/>
                    </div>
                </SimpleGrid>
            </form>
        </>);
    }
    return (<>
        <h1>Paramètres</h1>
        <h2>Mon compte</h2>
        <form>
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
            </SimpleGrid>
        </form>

        <h2>Autres</h2>
        <form>
            <Checkbox
                label="Thème clair"
                disabled
                checked
                title={"Bientôt disponible."}
            />
        </form>
    </>);
}

export default Settings;
