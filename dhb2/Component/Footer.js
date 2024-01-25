import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import HomeBar from './HomeBar';
export default function Footer() {
    return (
        // <>
        <View style={styles.Footer}>
            
            <Text></Text>
            <StatusBar style="auto" />
        </View>
        {/* <HomeBar></HomeBar> */}
        {/* </> */}
    );
}

const styles = StyleSheet.create({
    Footer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        
    },
});
