import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Surface, Switch, Button } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';
import { getBus, getRouteStops, getBusLive, Bus, RouteStop, BusLive } from '../../api/client';
import { formatLiveStatus } from '../../utils/liveStatus';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';

type BusDetailsRouteProp = RouteProp<RootStackParamList, 'LiveTracking'>;

export default function BusDetailsScreen() {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<BusDetailsRouteProp>();
  const { busId, destination, serviceType } = route.params || {};

  const [bus, setBus] = useState<Bus | null>(null);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [live, setLive] = useState<BusLive | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifyEnabled, setNotifyEnabled] = useState(!!destination);

  const loadData = useCallback(async (isRefresh = false) => {
    if (!busId) {
      setError('No bus identifier provided.');
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const busData = await getBus(busId);
      setBus(busData);

      // Fetch route stops if route exists
      if (busData.route_id) {
        try {
          const stopsData = await getRouteStops(busData.route_id);
          setStops(stopsData);
        } catch {
          setStops([]);
        }
      }

      // Fetch latest live telemetry
      try {
        const liveData = await getBusLive(busId);
        setLive(liveData);
      } catch {
        setLive(busData.live || null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load bus details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [busId]);

  useEffect(() => {
    loadData();
    // Poll live telemetry every 15s
    const timer = setInterval(() => {
      if (busId) {
        getBusLive(busId).then(setLive).catch(() => {});
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [loadData, busId]);

  const getServiceBadgeText = () => {
    const sType = serviceType || bus?.route?.service_type;
    switch(sType) {
      case 'express': return 'EXP';
      case 'point_to_point': return 'P2P';
      case 'normal':
      default: return 'NORMAL';
    }
  };

  const liveStatus = formatLiveStatus(live);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.appBarIconBtn}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>{t('busDetails.title')}</Text>
        </View>
        <LoadingState message="Loading bus telemetry and route timeline..." />
      </SafeAreaView>
    );
  }

  if (error || !bus) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.appBarIconBtn}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>{t('busDetails.title')}</Text>
        </View>
        <ErrorState message={error || 'Bus record not found.'} onRetry={() => loadData()} />
      </SafeAreaView>
    );
  }

  const routeTitle = bus.route?.origin && bus.route?.destination
    ? `${bus.route.origin} to ${bus.route.destination}`
    : (bus.route?.name || `Bus ${bus.id}`);
  const busNumber = bus.route?.route_number || bus.id;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.appBarIconBtn}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>{t('busDetails.title')}</Text>
        <TouchableOpacity style={styles.appBarIconBtn} onPress={() => loadData(true)}>
          <MaterialIcons name="refresh" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => loadData(true)} 
            colors={[theme.colors.primary]} 
            tintColor={theme.colors.primary}
          />
        }
      >
        
        {/* Header Card */}
        <Surface style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.badgesLeft}>
              <View style={styles.badgeSolid}>
                <Text style={styles.badgeSolidText}>{busNumber}</Text>
              </View>
              <View style={styles.badgeOutline}>
                <Text style={styles.badgeOutlineText}>{getServiceBadgeText()}</Text>
              </View>
            </View>
            <View style={[styles.statusPill, { borderColor: liveStatus.badgeColor }]}>
              <View style={[styles.statusDot, { backgroundColor: liveStatus.badgeColor }]} />
              <Text style={[styles.statusPillText, { color: liveStatus.badgeColor }]}>
                {liveStatus.statusText}
              </Text>
            </View>
          </View>
          
          <Text style={styles.routeTitle}>{routeTitle}</Text>

          <View style={styles.infoBanner}>
            <MaterialCommunityIcons 
              name={liveStatus.isLive ? "satellite-variant" : "information-outline"} 
              size={20} 
              color={liveStatus.badgeColor} 
              style={styles.bannerIcon} 
            />
            <View style={styles.bannerTextCol}>
              <Text style={styles.bannerPrimaryText}>
                Telemetry: <Text style={{fontWeight: '700'}}>{liveStatus.statusText}</Text>
              </Text>
              <Text style={styles.bannerSecondaryText}>
                {live?.lat && live?.lng
                  ? `Coordinates: ${live.lat.toFixed(4)}, ${live.lng.toFixed(4)}`
                  : 'No GPS broadcast logged yet'}
              </Text>
            </View>
          </View>
        </Surface>

        {/* Live Route Tracking Timeline Card */}
        <Surface style={styles.timelineCard}>
          <View style={styles.timelineHeaderRow}>
            <Text style={styles.timelineTitle}>{t('busDetails.liveTracking')}</Text>
            <Text style={styles.timelineSubtitle}>
              {stops.length > 0 ? `${stops.length} official stops` : 'Scheduled stops'}
            </Text>
          </View>
          
          {stops.length === 0 ? (
            <EmptyState 
              icon="map-marker-path"
              title="No Stops Defined"
              description="Route stops have not been configured for this route."
            />
          ) : (
            <View style={styles.timelineContainer}>
              {stops.map((stop, index) => {
                const isLast = index === stops.length - 1;
                const isFirst = index === 0;
                
                return (
                  <View key={stop.stop_id || String(index)} style={styles.timelineRow}>
                    {/* Timeline Graphic */}
                    <View style={styles.timelineGraphicCol}>
                      {isFirst ? (
                        <View style={[styles.dotCurrent, { backgroundColor: theme.colors.primary }]}>
                          <MaterialCommunityIcons name="bus" size={12} color="#FFFFFF" />
                        </View>
                      ) : isLast ? (
                        <View style={styles.dotDestination}>
                          <View style={styles.dotDestinationInner} />
                        </View>
                      ) : (
                        <View style={styles.dotUpcoming} />
                      )}
                      
                      {!isLast && (
                        <View style={[styles.timelineLine, styles.lineSolidDark]} />
                      )}
                    </View>

                    {/* Stop Content */}
                    <View style={[styles.stopContentCol, isLast && { paddingBottom: 0 }]}>
                      <View style={styles.normalStopRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.normalStopName, isLast && styles.textDestination]}>
                            {stop.name || `Stop ${stop.sequence}`} {isLast && <Text style={styles.destLabel}> (Terminus)</Text>}
                          </Text>
                          {stop.lat && stop.lng && (
                            <Text style={styles.stopCoordSub}>
                              GPS: {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                            </Text>
                          )}
                        </View>
                        
                        <View style={styles.timeCol}>
                          <Text style={styles.relativeTimeText}>
                            {stop.scheduled_offset_minutes > 0 ? `+${stop.scheduled_offset_minutes} min` : 'Origin'}
                          </Text>
                          <Text style={styles.seqBadge}>Stop #{stop.sequence}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </Surface>

        {/* Bus Specification Card */}
        <Surface style={styles.specCard}>
          <Text style={styles.specTitle}>Vehicle Information</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Bus Registration ID</Text>
            <Text style={styles.specValue}>{bus.id}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Total Seating Capacity</Text>
            <Text style={styles.specValue}>{bus.capacity} seats</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Telemetry Telematics</Text>
            <Text style={[styles.specValue, { color: liveStatus.badgeColor }]}>{liveStatus.statusText}</Text>
          </View>
        </Surface>

        {/* Notify Me Card */}
        <Surface style={styles.notifyCard}>
          <View style={styles.notifyLeft}>
            <View style={styles.notifyIconBg}>
              <MaterialCommunityIcons name="bell-outline" size={24} color={theme.colors.text} />
            </View>
            <View style={styles.notifyTextCol}>
              <Text style={styles.notifyTitle}>{t('busDetails.notifyMe')}</Text>
              {destination ? (
                <Text style={styles.notifySubtitle}>{t('busDetails.alertWhenAway')}{destination}</Text>
              ) : (
                <Text style={styles.notifySubtitle}>{t('busDetails.setDestAlert')}</Text>
              )}
            </View>
          </View>
          <Switch 
            value={notifyEnabled} 
            onValueChange={setNotifyEnabled} 
            color={theme.colors.primary}
            disabled={!destination} 
          />
        </Surface>

      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  appBarIconBtn: { padding: 8 },
  appBarTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  
  headerCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgesLeft: { flexDirection: 'row', alignItems: 'center' },
  badgeSolid: { backgroundColor: theme.colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  badgeSolidText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  badgeOutline: { borderWidth: 1, borderColor: theme.colors.outline, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeOutlineText: { fontSize: 11, fontWeight: '700', color: theme.colors.secondaryText },
  
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surface },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  
  routeTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.text, marginBottom: 14 },
  
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, padding: 12, borderRadius: 12 },
  bannerIcon: { marginRight: 10 },
  bannerTextCol: { flex: 1 },
  bannerPrimaryText: { fontSize: 13, color: theme.colors.text, fontWeight: '600' },
  bannerSecondaryText: { fontSize: 12, color: theme.colors.secondaryText, marginTop: 2 },
  
  timelineCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  timelineHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  timelineTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  timelineSubtitle: { fontSize: 12, color: theme.colors.secondaryText, fontWeight: '600' },
  
  timelineContainer: { paddingLeft: 4 },
  timelineRow: { flexDirection: 'row' },
  timelineGraphicCol: { width: 28, alignItems: 'center' },
  dotCurrent: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  dotUpcoming: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: theme.colors.outline, backgroundColor: theme.colors.surface, zIndex: 2 },
  dotDestination: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', zIndex: 2, backgroundColor: theme.colors.surface },
  dotDestinationInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary },
  
  timelineLine: { width: 2, flex: 1, marginVertical: 4 },
  lineSolidDark: { backgroundColor: theme.colors.outline },
  
  stopContentCol: { flex: 1, paddingLeft: 12, paddingBottom: 24 },
  normalStopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  normalStopName: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  stopCoordSub: { fontSize: 11, color: theme.colors.secondaryText, marginTop: 2 },
  textDestination: { color: theme.colors.primary, fontWeight: '800' },
  destLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },
  timeCol: { alignItems: 'flex-end' },
  relativeTimeText: { fontSize: 13, fontWeight: '700', color: theme.colors.primary },
  seqBadge: { fontSize: 11, color: theme.colors.secondaryText, marginTop: 2 },

  specCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 18, marginBottom: 16, elevation: 2 },
  specTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 12 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: theme.colors.outline },
  specLabel: { fontSize: 13, color: theme.colors.secondaryText },
  specValue: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  
  notifyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 20, padding: 16, elevation: 2 },
  notifyLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 12 },
  notifyIconBg: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  notifyTextCol: { flex: 1 },
  notifyTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  notifySubtitle: { fontSize: 12, color: theme.colors.secondaryText, marginTop: 2 },
});
