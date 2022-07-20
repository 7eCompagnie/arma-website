import {Link} from "react-router-dom";

function NotFound() {
    return (
        <>
            <h1>Impossible de trouvé l'opération demandé</h1>
            <p>
                L'opération que vous recherchez n'existe pas. <br />
                Vous pouvez retourner sur la liste des opérations <Link to="/formers/operations">ici</Link>.
            </p>
        </>
    )
}

export default NotFound;