import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import RegisterActa from './screens/RegisterActa';

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="HomeMain" 
        component={Home}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen 
        name="RegisterActa" 
        component={RegisterActa}
        options={{ title: 'Registrar Acta' }}
      />
    </HomeStack.Navigator>
  );
}
export default HomeStackScreen;