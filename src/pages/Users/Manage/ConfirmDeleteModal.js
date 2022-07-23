import {Button, Modal, Text} from "@mantine/core";

function ConfirmDeleteModal({opened, setOpened, user, onClose, onConfirm}) {
    return (
        <Modal
            centered
            opened={opened}
            onClose={onClose}
            title={`Confirmation de la suppression du compte de ${user == null ? "Null" : user.username}`}
            size={"xl"}
            style={{paddingBottom: "-2rem"}}
        >
            <Text>
                La suppression du compte <strong>supprimera toutes les données</strong> relatives à ce dernier (formations, opérations, statistiques, etc.)<br/>
                <strong>Vous ne pourrez pas récupérer ces données.</strong>
            </Text>

            <div style={{display: "flex", justifyContent: "flex-end", marginTop: "2rem"}}>
                <Button variant={"outline"} color={"gray"} onClick={onClose}>Annuler</Button>
                <Button ml={"1rem"} color={"red"} onClick={onConfirm}>Supprimer</Button>
            </div>
        </Modal>
    )
}

export default ConfirmDeleteModal;