import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Surface, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import SOSButton from '../../components/SOSButton';
import { useTranslation, Trans } from 'react-i18next';

type AlertsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function AlertsScreen() {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<AlertsScreenNavigationProp>();
  
  const [showSOSAlert, setShowSOSAlert] = useState(false);
  const [sosActive, setSosActive] = useState(true);

  const handleSOSConfirmed = () => {
    setShowSOSAlert(true);
    setSosActive(true);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    setTimeout(() => setShowSOSAlert(false), 300);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      
      <View style={styles.headerRow}>
        <Avatar.Image size={36} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
        <Text style={styles.appTitle}>SmartBus TN</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <MaterialCommunityIcons name="bell-outline" size={22} color={theme.colors.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>{t('alerts.title')}</Text>
          <TouchableOpacity style={styles.markReadBtn}>
            <Text style={styles.markReadText}>{t('alerts.markAllRead')}</Text>
          </TouchableOpacity>
        </View>

        {/* New Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('alerts.new')}</Text>
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
                <Text style={styles.sosCardTitle}>{t('alerts.sosSent')}</Text>
                <Text style={styles.timestampText}>{t('alerts.justNow')}</Text>
              </View>
            </View>
            <Text style={styles.cardBodySOS}>
              <Trans i18nKey="alerts.sosBody">
                Your emergency alert was sent with your live location to <Text style={{fontWeight: '700', color: theme.dark ? '#FCA5A5' : '#0F172A'}}>Emergency Contacts</Text> and nearest authorities.
              </Trans>
            </Text>
            <View style={styles.actionButtonsRow}>
              <Button 
                mode="contained" 
                style={[styles.actionBtnPrimary, { backgroundColor: theme.colors.primary }]}
                labelStyle={styles.actionBtnLabel}
                onPress={() => {}}
              >
                {t('alerts.viewStatus')}
              </Button>
              <Button 
                mode="outlined" 
                style={styles.actionBtnSecondarySOS}
                labelStyle={[styles.actionBtnLabel, { color: '#EF4444' }]}
                onPress={handleCancelSOS}
              >
                {t('alerts.cancelAlert')}
              </Button>
            </View>
          </Surface>
        )}

        {/* Bus Arriving Soon Card */}
        <Surface style={[styles.card, { borderLeftColor: theme.colors.success }]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBg}>
              <MaterialCommunityIcons name="bus" size={22} color={theme.colors.secondaryText} />
              <View style={styles.liveDot} />
            </View>
            <View style={styles.cardTitleContent}>
              <Text style={styles.cardTitle}>{t('alerts.busArriving')}</Text>
              <Text style={styles.timestampText}>{t('alerts.minsAgo2')}</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            <Trans i18nKey="alerts.busArrivingBody">
              <Text style={{fontWeight: '700', color: theme.colors.text}}>570</Text> to CMBT is arriving at <Text style={{fontWeight: '700', color: theme.colors.text}}>Navalur</Text> in 5 minutes.
            </Trans>
          </Text>
          <View style={styles.actionButtonsRow}>
            <Button 
              mode="contained" 
              style={[styles.actionBtnPrimary, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.actionBtnLabel}
              onPress={() => navigation.navigate('LiveTracking', { busId: '3' })}
            >
              {t('alerts.viewLiveMap')}
            </Button>
            <Button 
              mode="outlined" 
              style={styles.actionBtnSecondary}
              labelStyle={[styles.actionBtnLabel, { color: theme.colors.secondaryText }]}
              onPress={() => {}}
            >
              {t('alerts.dismiss')}
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
              <Text style={styles.cardTitle}>{t('alerts.routeUpdate')}</Text>
              <Text style={styles.timestampText}>{t('alerts.minsAgo15')}</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            {t('alerts.routeUpdateBody')}
          </Text>
        </Surface>

        {/* Earlier Section */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>{t('alerts.earlier')}</Text>
        </View>

        {/* New Feature Card */}
        <Surface style={[styles.card, { borderLeftColor: theme.colors.primary }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBg, { backgroundColor: theme.dark ? theme.colors.primary + '40' : '#E0E7FF' }]}>
              <MaterialCommunityIcons name="star-shooting-outline" size={22} color={theme.dark ? '#818cf8' : theme.colors.primary} />
            </View>
            <View style={styles.cardTitleContent}>
              <Text style={styles.cardTitle}>{t('alerts.newFeature')}</Text>
              <Text style={styles.timestampText}>{t('alerts.yesterday')}</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            {t('alerts.newFeatureBody')}
          </Text>
        </Surface>

      </ScrollView>

      {/* Floating SOS Button */}
      <SOSButton onSOSConfirmed={handleSOSConfirmed} />

    </SafeAreaView>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.outline, backgroundColor: theme.colors.surface },
  avatar: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  appTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  notificationBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' },
  notificationBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.error, borderWidth: 1.5, borderColor: theme.colors.surfaceVariant },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 24 },
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: theme.colors.text, letterSpacing: -1 },
  markReadBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: theme.colors.surfaceVariant, borderRadius: 16, marginBottom: 4 },
  markReadText: { fontSize: 12, fontWeight: '700', color: theme.colors.secondaryText },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginRight: 8 },
  unreadBadge: { backgroundColor: theme.colors.error, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, minWidth: 20, alignItems: 'center' },
  unreadText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  card: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3, borderLeftWidth: 4 },
  sosCard: { backgroundColor: theme.dark ? '#450a0a' : '#FEF2F2', borderLeftColor: '#EF4444', borderLeftWidth: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: theme.colors.surfaceVariant },
  liveDot: { position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.success, borderWidth: 2, borderColor: theme.colors.surfaceVariant },
  cardTitleContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  sosCardTitle: { fontSize: 16, fontWeight: '900', color: theme.dark ? '#fca5a5' : '#DC2626' },
  timestampText: { fontSize: 12, color: theme.colors.secondaryText, fontWeight: '600', marginTop: 2 },
  cardBody: { fontSize: 14, color: theme.colors.text, lineHeight: 22, marginBottom: 16 },
  cardBodySOS: { fontSize: 14, color: theme.dark ? '#fca5a5' : '#475569', lineHeight: 22, marginBottom: 16 },
  actionButtonsRow: { flexDirection: 'row', gap: 12 },
  actionBtnPrimary: { flex: 1, borderRadius: 12 },
  actionBtnSecondary: { flex: 1, borderRadius: 12, borderColor: theme.colors.outline },
  actionBtnSecondarySOS: { flex: 1, borderRadius: 12, borderColor: theme.dark ? '#991b1b' : '#FECACA' },
  actionBtnLabel: { fontSize: 14, fontWeight: '700' },
});
