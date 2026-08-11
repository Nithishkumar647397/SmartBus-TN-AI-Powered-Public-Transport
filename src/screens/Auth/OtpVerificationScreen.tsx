// TEMPORARY: mock OTP flow. Replace with real SMS OTP provider (e.g. Firebase Auth Phone, MSG91) before production.
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';

type OtpScreenRouteProp = RouteProp<RootStackParamList, 'OtpVerification'>;

export default function OtpVerificationScreen() {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OtpScreenRouteProp>();
  const { mobile } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const inputRefs = useRef<Array<RNTextInput | null>>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onResendOtp = () => {
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const onVerify = () => {
    setIsVerifying(true);
    // Mock 2-second delay
    setTimeout(() => {
      setIsVerifying(false);
      navigation.replace('MainTabs');
    }, 2000);
  };

  const isOtpComplete = otp.every((digit) => digit.length === 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="security" size={40} color={theme.colors.surface} />
            </View>
          </View>

          <Surface style={styles.card}>
            <Text style={styles.welcomeText}>{t('auth.verifyNumber')}</Text>
            <Text style={styles.subtitleText}>
              {t('auth.verifySubtitle', { mobile: `${mobile.slice(0,5)} ${mobile.slice(5)}` })}
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <RNTextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    { borderColor: digit ? theme.colors.primary : theme.colors.outline }
                  ]}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            <View style={styles.resendContainer}>
              {timer > 0 ? (
                <Text style={styles.timerText}>{t('auth.resendIn', { timer })}</Text>
              ) : (
                <TouchableOpacity onPress={onResendOtp}>
                  <Text style={styles.resendLink}>{t('auth.resendOtp')}</Text>
                </TouchableOpacity>
              )}
            </View>

            <Button
              mode="contained"
              onPress={onVerify}
              loading={isVerifying}
              disabled={!isOtpComplete || isVerifying}
              style={[
                styles.primaryButton,
                { backgroundColor: (!isOtpComplete || isVerifying) ? theme.colors.outline : theme.colors.primary }
              ]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {t('auth.verifyBtn')}
            </Button>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
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
    marginTop: 16,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
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
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 15,
    color: theme.colors.secondaryText,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 45,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.text,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    fontWeight: '600',
  },
  resendLink: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  primaryButton: {
    borderRadius: 14,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
