import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Divider, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../utils/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mobile, setMobile] = useState('');

  const onSendOtp = () => {
    if (mobile.length >= 10) {
      navigation.navigate('OtpVerification', { mobile });
    }
  };

  const onRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="directions-bus" size={48} color={theme.colors.surface} />
            </View>
            <Text style={styles.brandTitle}>SmartBus TN</Text>
            <Text style={styles.brandTagline}>Smart Travel for Tamil Nadu</Text>
          </View>

          <Surface style={styles.card}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue your journey</Text>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                mode="outlined"
                placeholder="Enter your mobile number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                left={<TextInput.Affix text="+91 " />}
                outlineColor="#E2E8F0"
                activeOutlineColor={theme.colors.primary}
                style={styles.input}
              />

              <Button
                mode="contained"
                onPress={onSendOtp}
                disabled={mobile.length < 10}
                style={[styles.primaryButton, { backgroundColor: mobile.length < 10 ? '#CBD5E1' : theme.colors.primary }]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Send OTP
              </Button>

              <View style={styles.registerPrompt}>
                <Text style={styles.promptText}>Don't have an account? </Text>
                <TouchableOpacity onPress={onRegister}>
                  <Text style={styles.registerText}>Register</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text style={styles.orText}>OR SIGN IN WITH</Text>
                <Divider style={styles.divider} />
              </View>

              <Button
                mode="outlined"
                onPress={() => {}}
                icon="google"
                style={styles.googleButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.googleButtonLabel}
                textColor="#334155"
              >
                Google
              </Button>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 32,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    marginBottom: 24,
  },
  primaryButton: {
    borderRadius: 14,
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  promptText: {
    fontSize: 14,
    color: '#64748B',
  },
  registerText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    height: 1.5,
  },
  orText: {
    marginHorizontal: 16,
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  googleButton: {
    borderRadius: 14,
    borderColor: '#E2E8F0',
    borderWidth: 1.5,
  },
  googleButtonLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
});
