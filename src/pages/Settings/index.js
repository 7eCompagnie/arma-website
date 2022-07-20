import Loading from "../Dashboard/Loading";
import AccountSettings from "../Dashboard/AccountSettings";

function Settings({isLoading, user}) {
    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (<>
        <h1>Paramètres</h1>

        <h2>Mon compte</h2>
        <AccountSettings user={user}/>
    </>);
}

export default Settings;
