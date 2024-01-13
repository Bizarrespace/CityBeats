import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Home from '../components/Home';

// Mocking Alert
jest.mock('react-native', () => {
  const RealReactNative = jest.requireActual('react-native');
  RealReactNative.Alert.alert = jest.fn();
  return RealReactNative;
});

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