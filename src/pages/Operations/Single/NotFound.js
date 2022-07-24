import {Link} from "react-router-dom";

function NotFound() {
    return (
        <>
            <h1>Impossible de trouvé la formation demandé</h1>
            <p>
                La formation que vous recherchez n'existe pas. <br />
                Vous pouvez retourner sur la liste des formations <Link to="/trainings">ici</Link>.
            </p>
        </>
    )
}

export default NotFound;