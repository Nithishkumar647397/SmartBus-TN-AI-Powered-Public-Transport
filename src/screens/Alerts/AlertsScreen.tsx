import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Surface, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import SOSButton from '../../components/SOSButton';
import { useTranslation, Trans } from 'react-i18next';
import { getAlerts, Alert } from '../../api/client';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';

type AlertsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function AlertsScreen() {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<AlertsScreenNavigationProp>();
  
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showSOSAlert, setShowSOSAlert] = useState(false);
  const [sosActive, setSosActive] = useState(true);

  const fetchAlertsData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch alerts from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlertsData();
  }, [fetchAlertsData]);

  const handleSOSConfirmed = () => {
    setShowSOSAlert(true);
    setSosActive(true);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    setTimeout(() => setShowSOSAlert(false), 300);
  };

  const unreadCount = alerts.length + (showSOSAlert ? 1 : 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      
      <View style={styles.headerRow}>
        <Avatar.Image size={36} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
        <Text style={styles.appTitle}>SmartBus TN</Text>
        <TouchableOpacity style={styles.notificationBtn} onPress={() => fetchAlertsData(true)}>
          <MaterialCommunityIcons name="refresh" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => fetchAlertsData(true)} 
            colors={[theme.colors.primary]} 
            tintColor={theme.colors.primary}
          />
        }
      >
        
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>{t('alerts.title')}</Text>
          {alerts.length > 0 && (
            <TouchableOpacity style={styles.markReadBtn} onPress={() => setAlerts([])}>
              <Text style={styles.markReadText}>{t('alerts.markAllRead')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('alerts.new')}</Text>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        </View>

        {/* SOS Alert Card (Dynamic on user trigger) */}
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

        {/* Dynamic Alerts from API */}
        {loading ? (
          <LoadingState message="Checking system route alerts..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchAlertsData()} />
        ) : alerts.length === 0 && !showSOSAlert ? (
          <EmptyState 
            icon="bell-check-outline"
            title="No Active Alerts"
            description="All transit lines and routes are currently operating without reported incidents or delays."
          />
        ) : (
          alerts.map((alert) => (
            <Surface key={alert.id} style={[styles.card, { borderLeftColor: alert.type === 'warning' ? '#F59E0B' : theme.colors.primary }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBg, { backgroundColor: alert.type === 'warning' ? '#FEF3C7' : theme.colors.surfaceVariant }]}>
                  <MaterialCommunityIcons 
                    name={alert.type === 'warning' ? 'alert' : 'information'} 
                    size={22} 
                    color={alert.type === 'warning' ? '#F59E0B' : theme.colors.primary} 
                  />
                </View>
                <View style={styles.cardTitleContent}>
                  <Text style={styles.cardTitle}>{alert.title}</Text>
                  <Text style={styles.timestampText}>
                    {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardBody}>{alert.body}</Text>
            </Surface>
          ))
        )}

      </ScrollView>

      {/* Floating SOS Button */}
      <SOSButton onSOSConfirmed={handleSOSConfirmed} />

    </SafeAreaView>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  avatar: { elevation: 2 },
  appTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  notificationBtn: { padding: 8 },
  
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12, marginBottom: 20 },
  pageTitle: { fontSize: 26, fontWeight: '900', color: theme.colors.text },
  markReadBtn: { paddingBottom: 4 },
  markReadText: { fontSize: 13, color: theme.colors.primary, fontWeight: '600' },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginRight: 8 },
  unreadBadge: { backgroundColor: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  unreadText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  
  card: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderLeftWidth: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  sosCard: { borderLeftColor: '#EF4444', backgroundColor: theme.dark ? '#1e1010' : '#FFF5F5' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitleContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  sosCardTitle: { fontSize: 16, fontWeight: '800', color: '#EF4444' },
  timestampText: { fontSize: 12, color: theme.colors.secondaryText, marginTop: 2 },
  cardBody: { fontSize: 14, color: theme.colors.text, lineHeight: 20, marginBottom: 12 },
  cardBodySOS: { fontSize: 14, color: theme.colors.text, lineHeight: 20, marginBottom: 16 },
  
  actionButtonsRow: { flexDirection: 'row', gap: 10 },
  actionBtnSecondarySOS: { borderColor: '#EF4444', borderRadius: 10 },
  actionBtnLabel: { fontSize: 13, fontWeight: '600' },
});
