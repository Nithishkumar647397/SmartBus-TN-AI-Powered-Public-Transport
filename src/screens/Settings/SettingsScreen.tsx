// TEMPORARY: settings not persisted, wire to AsyncStorage or backend user preferences later
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Switch, Surface, Button } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function SettingsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const [language, setLanguage] = useState<'EN' | 'TA'>('EN');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [tripAlertsEnabled, setTripAlertsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => {
            // Stub logout logic
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <Avatar.Image size={80} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.profileAvatar} />
          <Text style={styles.profileName}>Nithish</Text>
          <Text style={styles.profileMobile}>+91 98XXX XXX21</Text>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Surface style={styles.card}>
            
            {/* Language Row */}
            <View style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="web" size={20} color="#64748B" />
                </View>
                <Text style={styles.rowTitle}>Language</Text>
              </View>
              
              <View style={styles.segmentedControl}>
                <TouchableOpacity 
                  style={[styles.segmentBtn, language === 'EN' && { backgroundColor: theme.colors.primary }]}
                  onPress={() => setLanguage('EN')}
                >
                  <Text style={[styles.segmentText, language === 'EN' && { color: '#FFFFFF' }]}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.segmentBtn, language === 'TA' && { backgroundColor: theme.colors.primary }]}
                  onPress={() => setLanguage('TA')}
                >
                  <Text style={[styles.segmentText, language === 'TA' && { color: '#FFFFFF' }]}>தமிழ்</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* App Theme Row */}
            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="palette-outline" size={20} color="#64748B" />
                </View>
                <Text style={styles.rowTitle}>App Theme</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>Light</Text>
                <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
              </View>
            </TouchableOpacity>

          </Surface>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Surface style={styles.card}>
            
            {/* Push Notifications */}
            <View style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="bell-ring-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>Push Notifications</Text>
                  <Text style={styles.rowSubtitle}>Allow general app updates</Text>
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
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="bus-alert" size={20} color="#64748B" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>Trip Alerts</Text>
                  <Text style={styles.rowSubtitle}>Delays and route changes</Text>
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
          <Text style={styles.sectionTitle}>Account & Security</Text>
          <Surface style={styles.card}>
            
            {/* Mobile Number */}
            <TouchableOpacity style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="phone-outline" size={20} color="#64748B" />
                </View>
                <Text style={styles.rowTitle}>Mobile Number</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>+91 98XXX XXX21</Text>
                <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="shield-check-outline" size={20} color="#64748B" />
                </View>
                <Text style={styles.rowTitle}>Privacy Policy</Text>
              </View>
              <View style={styles.rowRight}>
                <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
              </View>
            </TouchableOpacity>

          </Surface>
        </View>

        {/* Support & Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Feedback</Text>
          <Surface style={styles.card}>
            
            <TouchableOpacity style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="star-outline" size={20} color="#64748B" />
                </View>
                <Text style={styles.rowTitle}>Rate Us</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#64748B" />
                </View>
                <Text style={styles.rowTitle}>Suggest a Feature</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.row, styles.borderBottom]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#64748B" />
                </View>
                <Text style={styles.rowTitle}>Report Issue</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="share-variant-outline" size={20} color="#64748B" />
                </View>
                <Text style={styles.rowTitle}>Share App</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
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
          textColor="#EF4444"
        >
          Log Out
        </Button>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
  },
  profileAvatar: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  profileMobile: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 16,
  },
  editProfileBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
    marginRight: 4,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 4,
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  logoutBtn: {
    marginTop: 16,
    borderColor: '#EF4444',
    borderWidth: 1.5,
    borderRadius: 16,
  },
  logoutBtnContent: {
    paddingVertical: 8,
  },
  logoutBtnLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
