# CityBeats
Location music trend analysis app 

<br>**Elevator Pitch**
<br>City Beasts is an app in react native that leverages the Shazam API to provide 
users real time music trend analysis in specific cities. This tool is a must have 
for music enthusiasts, event organizers, and DJs who want to stay updated with 
the latests music trends in targeted local areas. 

<br> **Features**
* City-Specific Music Trends: Simply enter the name of a city to get a list of
trending songs in that city. This feature fulfills the need to discover new music and 
understand the local likings
* Genre Analysis: App provides a breakdown of the most popular genres in the 
selected city. This feature helps users understand the music preferences in 
different cities.
* Search History: App keeps a history of the user's past searches, allowing them to 
quickly revisit the music trends in their favorite cities.
* Data Visualization: The app will visualize the music trends using engaging and 
easy to understand charts. This feature will help the user understand the mountain 
of data easier

<br> **User Flow**
* Start at home screen, can search for a city to see the music trends in that city 
  * Hitting enter will put them into a comfirmation screen, hitting enter again will 
take them to the results screen. 
* After the user can go to the history to view past searches if they have it, or go back 
to home and search for another city.
  * If the city they are looking for does not exist, there will be a prompt that allows the
user to try again.
* Within the history screen, there is a list of previous searches that the user can look
through with some info, they can click on it and it takes them to the result screen
of that specific search, after they confirm that is the city that they want to look at.
* Lastly there is a about screen if they are interested in who made the project and 
little on how it was made

<br> **UI Flow**
![FlowUI](https://github.com/Bizarrespace/CityBeats/assets/78052960/a1a49ea0-c3f2-4fa3-8f33-5a740f603a66)

<br> **UI Mocks**
![UI Mockup](https://github.com/Bizarrespace/CityBeats/assets/78052960/36bc32c5-dc8d-4dfe-a8bd-418b2efc8042)

# If you want to run
* Did not push all the files needed for react to run
* Have your own react native cli up and running, and just change these files:
  * App.js
  * Home.js
  * package.json
  * package-lock.json
  * in components:
    * About.js
  * in assets:
    * logo.png
  

# How to handle Rapid API request
* First you have to get the data, so you use axios and then get the data using fetchData, and then do the API request, this will return raw JSON data
* We only want for now Title, image, url so we have to filter out the JSON file to get just that
  * Make sure after we filter it out, we also save it to an array of objects with each object containing, title, image, and url
* Now that we have that filtered data, we can pass it into a history.js file for example, and then either flatlist it or something else to make it look good
* Having just that down will be good, then you can make sure that the API call works and that you are able to get the data that you want from it
* From there you can move on to see what stats you can get from the JSON as well maybe so that you are able to do the analysis
  * Can get genre from shazam-songs/get-details
  * resources, shazam-songs, id, attribute, agenre, primary(could have another field to it too idk)
