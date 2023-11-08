import React from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Home = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#F5FCFF', '#841584']}
      style={styles.container}
    >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
            />
            <Text style={styles.title}>Welcome to CityBeats</Text>
            <Text style={styles.description}>Discover the latest music trends in your city!</Text>
            <View style={styles.buttonContainer}>
                <Button 
                    title='Search City'
                    onPress={() => navigation.navigate('Search')}
                    color='#841584'
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title='View Search History'
                    onPress={() => navigation.navigate('History')}
                    color='#841584'
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title='About'
                    onPress={() => navigation.navigate('About')}
                    color='#841584'
                />
            </View>
        </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '30%',
        marginTop: -150,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
    },
    description: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333333',
    },
    buttonContainer: {
        marginBottom: 20,
        width: '80%',
        borderRadius: 25,
        overflow: 'hidden',
    },
});

export default Home;