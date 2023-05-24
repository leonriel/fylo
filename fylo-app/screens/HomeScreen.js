import { useContext } from 'react';
import { Button } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
    const {signOut } = useContext(AuthContext);

    const onLogout = () => {
        signOut();
    }

    return (
        <>
            <Button title="Logout" onPress={onLogout} />
        </>
    );
}

export default HomeScreen;