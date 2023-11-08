import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';

const About = () => {
  return (
    <ScrollView style={styles.container}>
      
      <Card>
        <Card.Title style={styles.title}>Developed By</Card.Title>
        <Card.Divider/>
        <Text style={[styles.text, {textAlign: 'center'}]}>Long Vu</Text>
      </Card>
      
      <Card>
        <Card.Title style={styles.title}>About CityBeats</Card.Title>
        <Card.Divider/>
        <Text style={styles.text}>
          CityBeats is a React Native app that leverages the Shazam API to provide users with real-time music trend analysis in specific cities. 
          This tool is a must-have for music enthusiasts, event organizers, and DJs who want to stay updated with the latest music trends in targeted local areas.
        </Text>
      </Card>
      
      
      <Card>
        <Card.Title style={styles.title}>Features</Card.Title>
        <Card.Divider/>
        <Text style={styles.boldText}>City-Specific Music Trends:</Text>
        <Text style={styles.text}>Simply enter the name of a city to get a list of trending songs in that city. This feature fulfills the need to discover new music and understand the local likings</Text>
        <Text style={styles.boldText}>Genre Analysis:</Text>
        <Text style={styles.text}>App provides a breakdown of the most popular genres in the selected city. This feature helps users understand the music preferences in different cities.</Text>
        <Text style={styles.boldText}>Search History:</Text>
        <Text style={styles.text}>App keeps a history of the user's past searches, allowing them to quickly revisit the music trends in their favorite cities.</Text>
        <Text style={styles.boldText}>Data Visualization:</Text>
        <Text style={styles.text}>The app will visualize the music trends using engaging and easy to understand charts. This feature will help the user understand the mountain of data easier.</Text>
      </Card>
      
      <Card>
        <Card.Title style={styles.title}>User Flow</Card.Title>
        <Card.Divider/>
        <Text style={styles.boldText}>Start at home screen:</Text>
        <Text style={styles.text}>Can search for a city to see the music trends in that city. Hitting enter will put you into a comfirmation screen, hitting enter again will take you to the results screen.</Text>
        <Text style={styles.boldText}>After:</Text>
        <Text style={styles.text}>The user can go to the history to view past searches if they have it, or go back to home and search for another city. If the city they are looking for does not exist, there will be a prompt that allows the user to try again.</Text>
        <Text style={styles.boldText}>Within the history screen:</Text>
        <Text style={styles.text}>There is a list of previous searches that the user can look through with some info, they can click on it and it takes them to the result screen of that specific search, after they confirm that is the city that they want to look at.</Text>
        <Text style={styles.boldText}>Lastly:</Text>
        <Text style={styles.text}>There is a about screen if they are interested in who made the project and little on how it was made.</Text>
      </Card>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'blue',
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
});

export default About;
