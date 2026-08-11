import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, ActionSheetIOS, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Switch, Surface, Button } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';
import { usePreferences, ThemeMode } from '../../context/PreferencesContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function SettingsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { t } = useTranslation();
  const { language, setLanguage, themeMode, setThemeMode } = usePreferences();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [tripAlertsEnabled, setTripAlertsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      t('settings.logoutConfirmTitle'),
      t('settings.logoutConfirmMsg'),
      [
        { text: t('settings.cancel'), style: "cancel" },
        { 
          text: t('settings.logOut'), 
          style: "destructive",
          onPress: () => {
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const handleChangeTheme = () => {
    const options = [t('settings.themeLight'), t('settings.themeDark'), t('settings.themeSystem'), t('settings.cancel')];
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 3 },
        (buttonIndex) => {
          if (buttonIndex < 3) setThemeMode(modes[buttonIndex]);
        }
      );
    } else {
      Alert.alert(
        t('settings.appTheme'),
        '',
        [
          { text: t('settings.themeLight'), onPress: () => setThemeMode('light') },
          { text: t('settings.themeDark'), onPress: () => setThemeMode('dark') },
          { text: t('settings.themeSystem'), onPress: () => setThemeMode('system') },
          { text: t('settings.cancel'), style: 'cancel' },
        ]
      );
    }
  };

  const getThemeDisplay = () => {
    if (themeMode === 'light') return t('settings.themeLight');
    if (themeMode === 'dark') return t('settings.themeDark');
    return t('settings.themeSystem');
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
    profileHeader: { alignItems: 'center', paddingVertical: 32, marginBottom: 8 },
    profileAvatar: { marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    profileName: { fontSize: 24, fontWeight: '900', color: theme.colors.text, marginBottom: 4 },
    profileMobile: { fontSize: 15, color: theme.colors.secondaryText, marginBottom: 16 },
    editProfileBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.colors.surfaceVariant },
    editProfileText: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 12, marginLeft: 4 },
    card: { backgroundColor: theme.colors.surface, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 6 }, elevation: 3, paddingHorizontal: 16 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.outline },
    rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 16, backgroundColor: theme.colors.surfaceVariant },
    textContainer: { flex: 1, paddingRight: 16 },
    rowTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
    rowSubtitle: { fontSize: 13, color: theme.colors.secondaryText, marginTop: 2 },
    rowRight: { flexDirection: 'row', alignItems: 'center' },
    rowValue: { fontSize: 15, color: theme.colors.secondaryText, fontWeight: '500', marginRight: 4 },
    segmentedControl: { flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, borderRadius: 20, padding: 4 },
    segmentBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
    segmentText: { fontSize: 13, fontWeight: '700', color: theme.colors.secondaryText },
    logoutBtn: { marginTop: 16, borderColor: theme.colors.error, borderWidth: 1.5, borderRadius: 16 },
    logoutBtnContent: { paddingVertical: 8 },
    logoutBtnLabel: { fontSize: 16, fontWeight: '700' },
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <Avatar.Image size={80} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.profileAvatar} />
          <Text style={styles.profileName}>Nithish</Text>
          <Text style={styles.profileMobile}>+91 98XXX XXX21</Text>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>{t('settings.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
          <Surface style={styles.card}>
            
            {/* Language Row */}
            <View style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="web" size={20} color={theme.colors.secondaryText} />
                </View>
                <Text style={styles.rowTitle}>{t('settings.language')}</Text>
              </View>
              
              <View style={styles.segmentedControl}>
                <TouchableOpacity 
                  style={[styles.segmentBtn, language === 'en' && { backgroundColor: theme.colors.primary }]}
                  onPress={() => setLanguage('en')}
                >
                  <Text style={[styles.segmentText, language === 'en' && { color: '#FFFFFF' }]}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.segmentBtn, language === 'ta' && { backgroundColor: theme.colors.primary }]}
                  onPress={() => setLanguage('ta')}
                >
                  <Text style={[styles.segmentText, language === 'ta' && { color: '#FFFFFF' }]}>தமிழ்</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* App Theme Row */}
            <TouchableOpacity style={styles.row} onPress={handleChangeTheme}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="palette-outline" size={20} color={theme.colors.secondaryText} />
                </View>
                <Text style={styles.rowTitle}>{t('settings.appTheme')}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{getThemeDisplay()}</Text>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.secondaryText} />
              </View>
            </TouchableOpacity>

          </Surface>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
          <Surface style={styles.card}>
            
            {/* Push Notifications */}
            <View style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="bell-ring-outline" size={20} color={theme.colors.secondaryText} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>{t('settings.pushNotifications')}</Text>
                  <Text style={styles.rowSubtitle}>{t('settings.pushSubtitle')}</Text>
                </View>
              </View>
              <Switch 
                value={pushEnabled} 
                onValueChange={setPushEnabled} 
                color={theme.colors.primary} 
              />
            </View>

            {/* Trip Alerts */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="bus-alert" size={20} color={theme.colors.secondaryText} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>{t('settings.tripAlerts')}</Text>
                  <Text style={styles.rowSubtitle}>{t('settings.tripAlertsSubtitle')}</Text>
                </View>
              </View>
              <Switch 
                value={tripAlertsEnabled} 
                onValueChange={setTripAlertsEnabled} 
                color={theme.colors.primary} 
              />
            </View>

          </Surface>
        </View>

        {/* Account & Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.accountSecurity')}</Text>
          <Surface style={styles.card}>
            
            {/* Mobile Number */}
            <TouchableOpacity style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="phone-outline" size={20} color={theme.colors.secondaryText} />
                </View>
                <Text style={styles.rowTitle}>{t('settings.mobileNumber')}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>+91 98XXX XXX21</Text>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.secondaryText} />
              </View>
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="shield-check-outline" size={20} color={theme.colors.secondaryText} />
                </View>
                <Text style={styles.rowTitle}>{t('settings.privacyPolicy')}</Text>
              </View>
              <View style={styles.rowRight}>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.secondaryText} />
              </View>
            </TouchableOpacity>

          </Surface>
        </View>

        {/* Support & Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.supportFeedback')}</Text>
          <Surface style={styles.card}>
            
            <TouchableOpacity style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="star-outline" size={20} color={theme.colors.secondaryText} />
                </View>
                <Text style={styles.rowTitle}>{t('settings.rateUs')}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.secondaryText} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={theme.colors.secondaryText} />
                </View>
                <Text style={styles.rowTitle}>{t('settings.suggestFeature')}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.secondaryText} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.secondaryText} />
                </View>
                <Text style={styles.rowTitle}>{t('settings.reportIssue')}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.secondaryText} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="share-variant-outline" size={20} color={theme.colors.secondaryText} />
                </View>
                <Text style={styles.rowTitle}>{t('settings.shareApp')}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.secondaryText} />
            </TouchableOpacity>

          </Surface>
        </View>

        {/* Log Out Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          icon="logout"
          style={styles.logoutBtn}
          contentStyle={styles.logoutBtnContent}
          labelStyle={styles.logoutBtnLabel}
          textColor={theme.colors.error}
        >
          {t('settings.logOut')}
        </Button>

      </ScrollView>
    </SafeAreaView>
  );
}
