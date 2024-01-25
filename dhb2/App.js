import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Component/Login';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SingleProductScreen from './Component/SingleProductScreen';
import HomeScreen from './Component/HomeScreen';
import CartScreen from './Component/CartScreen';
import { CartProvider } from './Component/CartContent';
import Register from './Component/Register';
import Payment from './Component/Payment';
import HomeBar from './Component/HomeBar';
const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerTitle: 'Đăng nhập' }}
            />
               <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerTitle: 'Đăng ký' }}
            />


            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                headerTitle: '𝕱𝖆𝖑𝖑𝖊𝖓_𝖑𝖊𝖌𝖊𝖓𝖉𝖘',
                headerTitleStyle: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft:55,
                  marginTop: 3,
                  color: '#33CCFF',
                },
              }}
            />
            
            <Stack.Screen name="SingleProduct" component={SingleProductScreen} />
            <Stack.Screen name="HomeBar" component={HomeBar} />

            <Stack.Screen
              name="CartScreen"
              component={CartScreen}
              options={{ headerTitle: 'Giỏ hàng' }}
            />
            
            <Stack.Screen 
            name="Payment" 
            component={Payment} 
            /> 
           
          </Stack.Navigator>


        </NavigationContainer>
      </View>
    </CartProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',


    
  },
});
