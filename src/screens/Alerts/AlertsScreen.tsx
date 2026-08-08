import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Surface, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import SOSButton from '../../components/SOSButton';

type AlertsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function AlertsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<AlertsScreenNavigationProp>();
  
  const [showSOSAlert, setShowSOSAlert] = useState(false);
  const [sosActive, setSosActive] = useState(true);

  const handleSOSConfirmed = () => {
    setShowSOSAlert(true);
    setSosActive(true);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    setTimeout(() => setShowSOSAlert(false), 300); // fade out effect conceptually
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      
      <View style={styles.headerRow}>
        <Avatar.Image size={36} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
        <Text style={styles.appTitle}>SmartBus TN</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <MaterialCommunityIcons name="bell-outline" size={22} color="#334155" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Alerts</Text>
          <TouchableOpacity style={styles.markReadBtn}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* New Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New</Text>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{showSOSAlert ? '3' : '2'}</Text>
          </View>
        </View>

        {/* SOS Alert Card (Dynamic) */}
        {showSOSAlert && sosActive && (
          <Surface style={[styles.card, styles.sosCard]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBg, { backgroundColor: '#FEE2E2' }]}>
                <MaterialCommunityIcons name="alert-decagram" size={22} color="#EF4444" />
              </View>
              <View style={styles.cardTitleContent}>
                <Text style={styles.sosCardTitle}>SOS Alert Sent</Text>
                <Text style={styles.timestampText}>Just now</Text>
              </View>
            </View>
            <Text style={styles.cardBody}>
              Your emergency alert was sent with your live location to <Text style={{fontWeight: '700', color: '#0F172A'}}>Emergency Contacts</Text> and nearest authorities.
            </Text>
            <View style={styles.actionButtonsRow}>
              <Button 
                mode="contained" 
                style={[styles.actionBtnPrimary, { backgroundColor: theme.colors.primary }]}
                labelStyle={styles.actionBtnLabel}
                onPress={() => {}}
              >
                View Status
              </Button>
              <Button 
                mode="outlined" 
                style={styles.actionBtnSecondarySOS}
                labelStyle={[styles.actionBtnLabel, { color: '#EF4444' }]}
                onPress={handleCancelSOS}
              >
                Cancel Alert
              </Button>
            </View>
          </Surface>
        )}

        {/* Bus Arriving Soon Card */}
        <Surface style={[styles.card, { borderLeftColor: theme.colors.success }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBg, { backgroundColor: '#F1F5F9' }]}>
              <MaterialCommunityIcons name="bus" size={22} color="#64748B" />
              <View style={styles.liveDot} />
            </View>
            <View style={styles.cardTitleContent}>
              <Text style={styles.cardTitle}>Bus Arriving Soon</Text>
              <Text style={styles.timestampText}>2 mins ago</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            <Text style={{fontWeight: '700', color: '#0F172A'}}>570</Text> to CMBT is arriving at <Text style={{fontWeight: '700', color: '#0F172A'}}>Navalur</Text> in 5 minutes.
          </Text>
          <View style={styles.actionButtonsRow}>
            <Button 
              mode="contained" 
              style={[styles.actionBtnPrimary, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.actionBtnLabel}
              onPress={() => navigation.navigate('LiveTracking', { busId: '3' })}
            >
              View Live Map
            </Button>
            <Button 
              mode="outlined" 
              style={styles.actionBtnSecondary}
              labelStyle={[styles.actionBtnLabel, { color: '#64748B' }]}
              onPress={() => {}}
            >
              Dismiss
            </Button>
          </View>
        </Surface>

        {/* Route Update Card */}
        <Surface style={[styles.card, { borderLeftColor: '#F59E0B' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBg, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="alert" size={22} color="#F59E0B" />
            </View>
            <View style={styles.cardTitleContent}>
              <Text style={styles.cardTitle}>Route Update</Text>
              <Text style={styles.timestampText}>15 mins ago</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            Heavy traffic detected on OMR. Expect delays of 10-15 minutes for all buses heading towards Sholinganallur.
          </Text>
        </Surface>

        {/* Earlier Section */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Earlier</Text>
        </View>

        {/* New Feature Card */}
        <Surface style={[styles.card, { borderLeftColor: theme.colors.primary }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBg, { backgroundColor: '#E0E7FF' }]}>
              <MaterialCommunityIcons name="star-shooting-outline" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.cardTitleContent}>
              <Text style={styles.cardTitle}>New Feature</Text>
              <Text style={styles.timestampText}>Yesterday</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            AI-powered crowd estimation now available for all routes. Check estimated capacity before you board!
          </Text>
        </Surface>

      </ScrollView>

      {/* Floating SOS Button */}
      <SOSButton onSOSConfirmed={handleSOSConfirmed} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  notificationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // padding for floating button
    paddingTop: 24,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },
  markReadBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    marginBottom: 4,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderLeftWidth: 4,
  },
  sosCard: {
    backgroundColor: '#FEF2F2', // subtle red bg
    borderLeftColor: '#EF4444',
    borderLeftWidth: 6, // thicker
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  liveDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  cardTitleContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sosCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626', // red tinted
  },
  timestampText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  cardBody: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnPrimary: {
    flex: 1,
    borderRadius: 12,
  },
  actionBtnSecondary: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#E2E8F0',
  },
  actionBtnSecondarySOS: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#FECACA',
  },
  actionBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
});
