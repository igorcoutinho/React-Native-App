/* eslint-disable react-hooks/exhaustive-deps */
import { faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Colors } from '../../theme/colors';

export const AvatarImage = ({
    value,
    icon,
    useIcon = false,
    borderRadius = 12,
    iconSize = 60
}: {
    value: string;
    icon?: IconDefinition;
    useIcon: boolean;
    borderRadius?: number;
    iconSize?: number;
}) => {

    const [isLoadingImage, setIsLoadingImage] = useState(true);
    const [imageError, setImageError] = useState(false);

    return (
        <>
            {!value || imageError ? (
                <View
                    style={{
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: Colors.greyLight,
                        borderRadius: 100,
                        height: 130,
                        justifyContent: 'center',
                        width: 130,
                    }}
                >
                    <FontAwesomeIcon
                        icon={icon || faUser}
                        size={iconSize}
                        color={Colors.mutedDark}
                    />
                </View>
            ) : (
                <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {isLoadingImage && (
                        <ActivityIndicator
                            style={{
                                flex: 1,
                                justifyContent: 'center'
                            }}
                            size="small"
                            color={Colors.PURPLE}
                        />
                    )}
                    <FastImage
                        style={{
                            height: '100%',
                            position: 'absolute',
                            width: '100%',
                            borderRadius: borderRadius,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        onLoadEnd={() => setIsLoadingImage(false)}
                        onError={() => {
                            setIsLoadingImage(false);
                            setImageError(true);
                        }}
                        source={{
                            uri: value,
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable,
                        }}
                    />
                </View>
            )}
        </>
    );
};
