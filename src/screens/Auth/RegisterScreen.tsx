import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Divider, Surface, Checkbox } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../utils/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const onCreateAccount = () => {
    if (mobile.length >= 10 && fullName.trim().length > 0 && acceptedTerms) {
      navigation.navigate('OtpVerification', { mobile, isRegistration: true });
    }
  };

  const isFormValid = mobile.length >= 10 && fullName.trim().length > 0 && acceptedTerms;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="account-plus" size={40} color={theme.colors.surface} />
            </View>
            <Text style={styles.brandTitle}>SmartBus TN</Text>
            <Text style={styles.brandTagline}>Smart Travel for Tamil Nadu</Text>
          </View>

          <Surface style={styles.card}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>Join us for a smarter transit experience</Text>

            <View style={styles.formContainer}>
              
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                mode="outlined"
                placeholder="e.g. John Doe"
                value={fullName}
                onChangeText={setFullName}
                outlineColor="#E2E8F0"
                activeOutlineColor={theme.colors.primary}
                style={styles.input}
              />

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

              <Text style={styles.label}>Email Address <Text style={styles.optionalText}>(Optional)</Text></Text>
              <TextInput
                mode="outlined"
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                outlineColor="#E2E8F0"
                activeOutlineColor={theme.colors.primary}
                style={styles.input}
              />

              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={acceptedTerms ? 'checked' : 'unchecked'}
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                  color={theme.colors.primary}
                  uncheckedColor="#94A3B8"
                />
                <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                mode="contained"
                onPress={onCreateAccount}
                disabled={!isFormValid}
                style={[styles.primaryButton, { backgroundColor: !isFormValid ? '#CBD5E1' : theme.colors.primary }]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Create Account
              </Button>

              <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text style={styles.orText}>OR REGISTER WITH</Text>
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
    paddingBottom: 48,
  },
  header: {
    paddingVertical: 16,
    marginLeft: -8,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 13,
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
  optionalText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
  },
  input: {
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginLeft: -8,
  },
  termsTextContainer: {
    flex: 1,
    paddingTop: 8,
  },
  termsText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: '600',
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
