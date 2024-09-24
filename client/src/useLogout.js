import { useNavigate } from 'react-router-dom';

function useLogout() {
    const navigate = useNavigate();

    const logout = () => {
        // Clear any user session data (if stored)
        localStorage.removeItem('user');
        // Navigate to the login page
        navigate('/login');
    };

    return logout;
}
export default useLogout;