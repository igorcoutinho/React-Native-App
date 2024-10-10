import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
    permissionContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light,
        borderRadius: 12,
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',
        height: 50
    },
    icon: {
        marginRight: 10,
    },
    button: {
        backgroundColor: Colors.success,
    },
    buttonContainer: {
        backgroundColor: Colors.greyLight,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
