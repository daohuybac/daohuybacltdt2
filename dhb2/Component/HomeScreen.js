import React from 'react';
import { View, ScrollView } from 'react-native';
import ListProduct from './ListProduct';
import Header from './Header';
import HomeBar from './HomeBar';


export default function HomeScreen() {
    return (
        <>
            
            <ScrollView >
                <Header></Header>
                <ListProduct></ListProduct>
            </ScrollView>
            <HomeBar></HomeBar>
        </>

    );
}