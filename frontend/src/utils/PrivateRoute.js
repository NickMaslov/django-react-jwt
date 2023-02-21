import { Navigate } from 'react-router-dom';
import { useContext } from 'react';

import AuthContext from '../contexts/AuthContext';

const PrivateRoute = ({ children, ...rest }) => {
    let { user } = useContext(AuthContext);

    return user ? children : <Navigate to='/login' />;
    // return <Route {...rest}>{children}</Route>;
    // return children;
};

export default PrivateRoute;
