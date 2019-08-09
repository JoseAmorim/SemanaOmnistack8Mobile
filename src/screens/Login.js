import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';
import api from '../services/api';

export default ({ navigation }) => {

    const [name, setName] = useState('')

    useEffect(() => {
        AsyncStorage.getItem('user').then(id => {
            if (id) {
                navigation.navigate('Main', { user: id })
            }
        })
    }, [])

    const onLogin = async () => {
        const response = await api.post('/devs', { username: name })

        const { _id } = response.data

        await AsyncStorage.setItem('user', _id)

        navigation.navigate('Main', { user: _id })
    }

    return (
        <KeyboardAvoidingView behavior='padding'
            enabled={Platform.OS === 'ios'}
            style={styles.container}>
            <Image source={require('../../assets/logo.png')} />
            <TextInput style={styles.input}
                autoCapitalize='none'
                autoCorrect={false}
                placeholder='Digite seu usuário no Github'
                placeholderTextColor='#999'
                value={name}
                onChangeText={setName} />
            <TouchableOpacity style={styles.button}
                onPress={onLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        marginTop: 20,
        height: 46,
        alignSelf: 'stretch',
        borderColor: '#ddd',
        borderRadius: 4,
        borderWidth: 1,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
    },
    button: {
        marginTop: 10,
        height: 46,
        alignSelf: 'stretch',
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#DF4723',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#FFF',
        fontSize: 16,
    }
})