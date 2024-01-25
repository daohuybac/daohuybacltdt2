import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function Header() {
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);

  const sliderImages = [
    require('../Image/slider.jpg'),
    require('../Image/slider1.jpg'),
    require('../Image/slider2.jpg'),
    // Add more slider images as needed
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      
      setCurrentSliderIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);// Tự động chuyển slider sau mỗi ... giây

    // Clear interval khi component unmount
    return () => clearInterval(intervalId);
  }, []); // [] đảm bảo useEffect chỉ chạy một lần sau khi component mount

  return (
    <View style={styles.header}>
      <StatusBar style="auto" />

      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={sliderImages[currentSliderIndex]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        //paddingTop: 30,
        paddingBottom: 0,
        //borderBottomWidth: 1,
        //borderBottomColor: '#ccc',

    },
    text: {
        marginBottom: 10,
        marginTop:-30
        
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        height: 160,
        width: 370,
    },
    search:
    {
        marginTop: 5,
        height: 100,
        width: 370,
        marginBottom: -50
    }
});
