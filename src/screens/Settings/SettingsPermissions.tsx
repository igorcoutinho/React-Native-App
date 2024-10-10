import {
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, Platform, View } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { BaseButton, BaseButtonIcon } from '../../components/BaseButton';
import { HeaderWithImage } from '../../components/elements/HeaderWithImage';
import { Spacer } from '../../components/elements/Spacer';
import {
    MainContainer
} from '../../components/MainContainer';
import { useTabsBarBottomSize } from '../../components/TabsBar';
import { Heading } from '../../components/Typography';
import { Colors } from '../../theme/colors';
import { Gap } from '../../theme/sizes';
import { styles } from './PermissionsStyles';

const permissionsList = [
    {
        name: 'Camera',
        type: Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA,
    },
    {
        name: 'Location',
        type: Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    },
    {
        name: 'Gallery',
        type: Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE : PERMISSIONS.IOS.PHOTO_LIBRARY,
    },
];

export const SettingsPermissions = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [permissions, setPermissions] = useState<any[]>([]);

    useEffect(() => {
        const checkPermissions = async () => {
            const statuses = await Promise.all(
                permissionsList.map(async (permission) => {
                    const result = await check(permission.type);
                    return {
                        ...permission,
                        status: result,
                    };
                })
            );
            setPermissions(statuses);
        };

        checkPermissions();
    }, []);

    const handlePermissionRequest = async (permissionType: any) => {
        console.log('Requesting permission for:', permissionType); // Log the permission type
        const result = await request(permissionType);
        console.log('Permission result:', result); // Log the result
        if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
            Alert.alert(
                'Permission Blocked or Unavailable',
                'Please enable the permission from settings.',
                [
                    {
                        text: 'Go to Settings',
                        onPress: () => {
                            if (Platform.OS === 'ios') {
                                Linking.openURL('app-settings:');
                            } else {
                                Linking.openSettings();
                            }
                        },
                    },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        } else {
            setPermissions((prevPermissions) =>
                prevPermissions.map((perm) =>
                    perm.type === permissionType ? { ...perm, status: result } : perm
                )
            );
        }
    };

    const renderItem = ({ item }) => (
        <View key={item.name} style={styles.permissionContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Heading
                    color={Colors.SUB_TEXT}
                    size="small"
                    style={{
                        textTransform: 'uppercase',
                    }}
                >
                    {item.name}
                </Heading>
            </View>
            {item.status === RESULTS.GRANTED ? (
                <BaseButtonIcon
                    icon={faCheck}
                    variant="inline"
                    iconColor={Colors.success}
                    disabled
                    style={{
                        marginRight: 15
                    }}
                />

            ) : (
                <BaseButton
                    style={styles.button}
                    onPress={() => handlePermissionRequest(item.type)}
                    flatten
                >
                    Enable
                </BaseButton>
            )}
        </View>
    );

    return (
        <MainContainer paddingBottom={useTabsBarBottomSize()}>

            <HeaderWithImage
                title="App Permissions"
                description="Manage app permissions easily with status indicators and direct settings access."
            />
            <FlatList
                data={permissions}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <Spacer size={Gap.small} />}
            />
        </MainContainer>
    );
};
