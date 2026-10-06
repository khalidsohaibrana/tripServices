import React from 'react';
import {ImageBackground, SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Icon} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Logo from '../../theme/assets/TripServicesLogo.jpeg';
import BgImage from '../../theme/assets/bgImage.jpg';
import {colors} from '../../theme/colors';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={BgImage}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay} />
        <View style={styles.header}>
          <Icon source={Logo} size={300} />
        </View>
        <View style={styles.headerStrip}></View>

        <View style={styles.container}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('InvoiceScreen')}
            labelStyle={styles.buttonLabel}
            style={styles.button}>
            Create New Invoice
          </Button>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 150,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  header: {
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  headerStrip: {
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    padding: 10,
    width: '79%',
    backgroundColor: colors.accent,
  },
  button: {
    height: 50,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
