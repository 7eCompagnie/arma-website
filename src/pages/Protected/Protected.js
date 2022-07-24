import { Navigate } from 'react-router-dom';
import {useEffect} from "react";

function Protected({condition, path, children}) {
    if (!condition)
        return <Navigate to={path} replace />;

    return children;
}

export default Protected;