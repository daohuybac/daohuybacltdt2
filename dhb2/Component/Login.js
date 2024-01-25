import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet, Image, Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ImageBackground, Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://65ad4a0eadbd5aa31be08198.mockapi.io/api/login');
      const data = await response.json();

      // Assuming your API returns an array of user objects with 'username' and 'password' fields
      const user = data.find(user => user.username === username && user.password === password);

      if (user) {
        // Successful login
        alert('Đăng nhập thành công');
        navigation.navigate('HomeScreen');
      } else {
        // Invalid credentials
        alert('Đăng nhập thất bại, vui lòng kiểm tra lại tên đăng nhập và mật khẩu');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };
  
  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile']);
      if (result.isCancelled) {
        // Handle cancelation
        console.log('Login canceled');
      } else {
        // Get the access token
        const accessTokenData = await AccessToken.getCurrentAccessToken();
        if (accessTokenData) {
          const accessToken = accessTokenData.accessToken.toString();
          console.log('Access Token:', accessToken);
  
          // Call your API or perform any required logic with the access token
  
          // Assuming the login is successful
          alert('Logged in with Facebook');
          navigation.navigate('HomeScreen');
        } else {
          console.log('Failed to get access token');
        }
      }
    } catch (error) {
      console.error('Error during Facebook login:', error);
      alert('Failed to log in with Facebook');
    }
  };
  

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
    >
      <View>
        <ImageBackground style={styles.background}>
          <Text style={styles.title}>ĐĂNG NHẬP</Text>
          <View style={{ marginTop: 40 }}>
            <View style={styles.iconinput}>
              <Icon style={styles.icon} name="user" size={25} color="black" />
              <TextInput
                style={styles.input}
                placeholderTextColor={"#000033"}
                placeholder="Nhập tên đăng nhập hoặc email"
                onChangeText={(text) => setUsername(text)}
              />
            </View>
  
            <View style={styles.iconinput}>
              <Icon style={styles.icon} name="lock" size={25} color="black" />
              <TextInput
                style={styles.input}
                placeholderTextColor={"#000033"}
                placeholder="Nhập mật khẩu"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <Text style={{ alignSelf: 'flex-end', fontSize: 16 }}>Quên mật khẩu?</Text>
  
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <View style={styles.socialContainer}>
      
    </View>
          
          <View style={styles.rowContainer}>
            <Text style={{ alignSelf: 'flex-end', fontSize: 16 }}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ textAlign: 'center', color: '#191970', fontSize: 16 }}> Đăng kí</Text>
            </TouchableOpacity>
          </View>
       <View style={styles.socialContainer}>
       <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
        {/* <Image
          source={require('../Image/facebook.png')}
          resizeMode="contain"
          style={styles.socialIcon}
        /> */}
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        {/* <Image
          source={require('../Image/google.png')}
          resizeMode="contain"
          style={styles.socialIcon}
        /> */}
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        {/* <Image
          source={require('../Image/apple-logo.png')}
          resizeMode="contain"
          style={styles.socialIcon}
        /> */}
      </TouchableOpacity>
    </View>
          <StatusBar style="auto" />
        </ImageBackground>
      </View>
  
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconinput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'black',
    borderBottomWidth: 0.3,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 300,

    backgroundColor: 'white',

    paddingHorizontal: 10,

  },
  button: {
    backgroundColor: '#000033',
    padding: 10,
    marginTop: 30,
  },
  buttonText: {
    width: 300,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  background: {
    flex: 1,

    backgroundColor: 'white',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: 420
  },
});

export default Login;
