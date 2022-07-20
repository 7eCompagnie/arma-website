import {Link} from "react-router-dom";

function NotFound() {
    return (<>
        <h1>Erreur 404</h1>
        <p>
            La page que vous demandez n'existe pas. <br />
            Vous pouvez retourner sur la page d'accueil <Link to="/">ici</Link>.
        </p>
    </>)
}

export default NotFound;
