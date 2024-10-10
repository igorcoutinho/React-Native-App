import { Alert } from 'react-native';

export const showAlert = (title: string, message: string, onPress: () => void) => {
    return (
        Alert.alert(title, message, [
            {
                text: 'Reject',
                style: 'destructive',
                onPress,
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ])
    );
};

export const decodeNotificationActionData = (actionData: string) => {
    const parts = actionData.split('/');
    const index = parts.indexOf('join');
    const hash = parts[index + 1];
    return decodeURIComponent(hash);
};