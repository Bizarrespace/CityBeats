import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import Search from '../components/Search';
import Home from '../components/Home';

// Mocking Alert
jest.mock('react-native', () => {
  const RealReactNative = jest.requireActual('react-native');
  RealReactNative.Alert.alert = jest.fn();
  return RealReactNative;
});

// Mocking axios
jest.mock('axios');

describe('Home', () => {
  it('handles search correctly', async () => {
    // Mocking navigation
    const navigation = { navigate: jest.fn() };

    const { getByPlaceholderText, getByText } = render(<Home navigation={navigation} />);

    const input = getByPlaceholderText('Enter City');
    fireEvent.changeText(input, 'New York');

    const button = getByText('Confirm');
    fireEvent.press(button);

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

    expect(Alert.alert).toHaveBeenCalledWith(
      'Confirm City',
      'You entered New York. Is this correct?',
      [
        { text: 'No' },
        { text: 'Yes', onPress: expect.any(Function) },
      ],
      { cancelable: false }
    );

    // Simulate pressing 'Yes' in the alert
    const yesAction = Alert.alert.mock.calls[0][2][1];
    yesAction.onPress();

    expect(navigation.navigate).toHaveBeenCalledWith('Search', { city: 'New York' });
  });

  it('does not allow search without city name', async () => {
    //This test here shows that the user is able to search with nothing and hit the comfirm button which is somethign that we do not want
    //Would need to have a edge case checking for non empty string
    // Mocking navigation
    const navigation = { navigate: jest.fn() };

    const { getByPlaceholderText, getByText } = render(<Home navigation={navigation} />);

    const input = getByPlaceholderText('Enter City');
    // Don't enter anything in the input

    const button = getByText('Confirm');
    fireEvent.press(button);

    // Assert that the alert does not get called
    expect(Alert.alert).not.toHaveBeenCalled();
  });
});

describe("Search", () => {
  it('renders error message when city is not found', async () => {
    //Mocking axios
    axios.request.mockResolvedValueOnce({ data: { countries: [] } });

    // Mocking navigation
    const navigation = { setOptions: jest.fn() };

    const { getByText, getByPlaceholderText } = render(<Search route={{ params: { city: 'City that does not exist' } }} navigation={navigation} />);

    

    await act(async () => {});

    expect(getByText('City not found')).toBeTruthy();
    expect(getByPlaceholderText('Enter another city')).toBeTruthy();
  });

  it('makes API calls and updates state correctly when city is found', async () => {
    const navigation = { setOptions: jest.fn() };
    
    const mockData = {
      countries: [
        {
          cities: [
            {
              name: 'Test City',
              listid: '123',
            },
          ],
        },
      ],
    };
    const mockSongs = {
      tracks: [
        {
          title: 'Test Song',
          url: 'http://test.com',
          subtitle: 'Test Artist',
          images: { coverart: 'http://test.com/image.jpg' },
        },
      ],
    };
    
    //Simulates the api call
    //Replaces next call to axios.request with a mock function that returns a promise to mockData and mockSongs
    axios.request.mockResolvedValueOnce({ data: mockData });
    axios.request.mockResolvedValueOnce({ data: mockSongs });

    //Render the search component, and then use the getByText method to get the text of the first song
    const { getByText } = render(<Search route={{ params: { city: 'Test City' } }} navigation={navigation} />);

    // Wait for useEffect to complete and re-render the component
    await act(async () => {});

    expect(getByText('1. Test Song')).toBeTruthy();
  });
});
