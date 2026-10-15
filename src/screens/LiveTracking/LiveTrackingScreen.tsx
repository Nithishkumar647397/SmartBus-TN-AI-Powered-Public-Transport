import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';
import { getBuses, Bus } from '../../api/client';
import { formatLiveStatus } from '../../utils/liveStatus';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';

export default function LiveTrackingScreen() {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveBuses = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getBuses();
      setBuses(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch live bus telematics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveBuses();
    const interval = setInterval(() => {
      fetchLiveBuses(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchLiveBuses]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('live.title') || 'Live Radar'}</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => fetchLiveBuses(true)}>
          <MaterialIcons name="refresh" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <LoadingState message="Connecting to live bus GPS streams..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchLiveBuses()} />
      ) : buses.length === 0 ? (
        <EmptyState 
          icon="radar"
          title="No Live Telemetry"
          description="There are currently no active buses transmitting live coordinates."
        />
      ) : (
        <FlatList
          data={buses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={() => fetchLiveBuses(true)} 
              colors={[theme.colors.primary]} 
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({ item }) => {
            const liveStatus = formatLiveStatus(item.live);
            const routeLabel = item.route?.route_number || item.route?.id || item.id;
            const routeDesc = item.route?.origin && item.route?.destination
              ? `${item.route.origin} → ${item.route.destination}`
              : (item.route?.name || `Bus ${item.id}`);

            return (
              <Surface style={styles.busCard}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('LiveTracking', { 
                    busId: item.id,
                    serviceType: (item.route?.service_type as any) || 'normal'
                  })}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.headerLeft}>
                      <View style={[styles.busBadge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.busBadgeText}>{routeLabel}</Text>
                      </View>
                      <Text style={styles.routeText} numberOfLines={1}>{routeDesc}</Text>
                    </View>
                    <View style={[styles.statusPill, { borderColor: liveStatus.badgeColor }]}>
                      <View style={[styles.statusDot, { backgroundColor: liveStatus.badgeColor }]} />
                      <Text style={[styles.statusPillText, { color: liveStatus.badgeColor }]}>
                        {liveStatus.statusText}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBodyRow}>
                    <View style={styles.coordCol}>
                      <Text style={styles.coordLabel}>GPS Fix</Text>
                      <Text style={styles.coordValue}>
                        {item.live?.lat && item.live?.lng
                          ? `${item.live.lat.toFixed(4)}, ${item.live.lng.toFixed(4)}`
                          : 'No coordinates logged'}
                      </Text>
                    </View>

                    <View style={styles.speedCol}>
                      <Text style={styles.coordLabel}>Telemetry</Text>
                      <Text style={[styles.coordValue, { color: liveStatus.isLive ? theme.colors.primary : theme.colors.secondaryText }]}>
                        {liveStatus.etaDisplay}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.footerText}>
                      Capacity: {item.capacity} seats • ID: {item.id}
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color={theme.colors.secondaryText} />
                  </View>
                </TouchableOpacity>
              </Surface>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 24, fontWeight: '900', color: theme.colors.text },
  refreshBtn: { padding: 8 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  busCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  busBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 10 },
  busBadgeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  routeText: { fontSize: 15, fontWeight: '700', color: theme.colors.text, flex: 1 },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  statusDot: { width: 7, height: 7, borderRadius: 4, marginRight: 5 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  cardBodyRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme.colors.outline },
  coordCol: { flex: 1 },
  speedCol: { alignItems: 'flex-end' },
  coordLabel: { fontSize: 11, color: theme.colors.secondaryText, marginBottom: 2 },
  coordValue: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  footerText: { fontSize: 12, color: theme.colors.secondaryText },
});
