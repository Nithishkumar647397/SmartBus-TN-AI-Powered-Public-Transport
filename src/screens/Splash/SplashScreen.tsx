import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme, AppTheme } from '../../utils/theme';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useAppTheme();
  const styles = useStyles(theme);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <MaterialIcons name="directions-bus" size={80} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>SmartBus TN</Text>
      <Text style={styles.subtitle}>AI Powered Public Transport</Text>
    </View>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    backgroundColor: theme.colors.background,
    padding: 24,
    borderRadius: 100,
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF', // keep white on primary background
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
});
