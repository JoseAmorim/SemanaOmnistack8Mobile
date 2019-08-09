import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import io from 'socket.io-client'

import api from '../services/api'
import AsyncStorage from '@react-native-community/async-storage';

export default ({ navigation }) => {
    const userId = navigation.getParam('user')

    const [devs, setDevs] = useState([])
    const [matchDev, setMatchDev] = useState(null)

    console.log(userId)

    useEffect(() => {
        const asyncLoadUsers = async () => {
            const response = await api.get('/devs', {
                headers: {
                    user: userId
                }
            })

            setDevs(response.data)
        }

        asyncLoadUsers()
    }, [userId])

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: userId }
        })

        socket.on('match', dev => {
            setMatchDev(dev)
        })
    }, [userId])

    const handleLike = async () => {
        const [dev, ...rest] = devs

        await api.post(`/devs/${dev._id}/likes`, {}, {
            headers: {
                user: userId
            }
        })

        setDevs(rest)
    }

    const handleDislike = async () => {
        const [dev, ...rest] = devs

        await api.post(`/devs/${dev._id}/dislikes`, {}, {
            headers: {
                user: userId
            }
        })

        setDevs(rest)
    }

    const handleLogout = async () => {
        await AsyncStorage.clear()

        navigation.navigate('Login')
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo}
                    source={require('../../assets/logo.png')} />
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                {devs.length === 0
                    ? <Text style={styles.empty}>Acabou :(</Text>
                    : devs.map((item, index) => (
                        <View key={item._id} style={[styles.card, { zIndex: devs.length - index }]}>
                            <Image style={styles.avatar}
                                source={{ uri: item.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{item.bio}</Text>
                            </View>
                        </View>
                    ))}
            </View>

            {devs.length > 0 && <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleDislike}
                    style={styles.button}>
                    <Image source={require('../../assets/dislike.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLike}
                    style={styles.button}>
                    <Image source={require('../../assets/like.png')} />
                </TouchableOpacity>
            </View>}

            {matchDev && (
                <View style={styles.matchContainer}>
                    <Image styles={styles.matchImage} source={require('../../assets/itsamatch.png')} />
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        marginTop: 30,
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    avatar: {
        flex: 1,
        height: 300,
    },
    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 2,
        lineHeight: 18
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    matchImage: {
        height: 60,
        resizeMode: 'contain'
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical: 30,
    },
    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255,.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    closeMatch: {
        fontSize: 16,
        color: 'rgba(255,255,255,.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold',
    }
})