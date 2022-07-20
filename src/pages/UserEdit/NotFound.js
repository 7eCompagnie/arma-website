import {Link} from "react-router-dom";

function NotFound() {
    return (
        <>
            <h1>Impossible de trouvé l'utilisateur demandé</h1>
            <p>
                L'utilisateur que vous recherchez n'existe pas. <br />
                Vous pouvez retourner sur la liste des utilisateurs <Link to="/zeus/users">ici</Link>.
            </p>
        </>
    )
}

export default NotFound;