import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import Main from './screens/Main';
import Login from './screens/Login';
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket',
    'Remote debugger'
])

const switchNavigator = createSwitchNavigator({
    Main: {
        screen: Main,
        name: 'Main'
    },
    Login: {
        screen: Login,
        name: 'Login'
    }
}, {
    initialRouteName: 'Login'
})

export default createAppContainer(switchNavigator)