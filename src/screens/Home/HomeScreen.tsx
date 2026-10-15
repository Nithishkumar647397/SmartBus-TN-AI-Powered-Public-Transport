import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar } from 'react-native-paper';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function HomeScreen() {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const [tripType, setTripType] = useState<'NORMAL' | 'EXPRESS' | 'POINT-POINT'>('NORMAL');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusesData = useCallback(async (isRefresh = false) => {
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
      setError(err?.message || 'Unable to connect to SmartBus server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBusesData();
    // Poll every 30 seconds for live updates
    const interval = setInterval(() => {
      fetchBusesData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchBusesData]);

  const tripTypeMapping: Record<string, string> = {
    'NORMAL': 'normal',
    'EXPRESS': 'express',
    'POINT-POINT': 'point_to_point',
  };

  const filteredBuses = buses.filter(bus => {
    const desired = tripTypeMapping[tripType];
    const actual = bus.route?.service_type?.toLowerCase() || 'normal';
    return actual === desired;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => fetchBusesData(true)} 
            colors={[theme.colors.primary]} 
            tintColor={theme.colors.primary}
          />
        }
      >
        
        {/* Header Section */}
        <SafeAreaView edges={['top']} style={styles.headerArea}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{t('home.goodMorning')}</Text>
              <Text style={styles.userName}>SmartBus TN</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity 
                style={styles.iconGlassBtn}
                onPress={() => fetchBusesData(true)}
              >
                <Ionicons name="refresh-outline" size={22} color={theme.colors.text} />
              </TouchableOpacity>
              <Avatar.Image size={44} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
            </View>
          </View>
        </SafeAreaView>

        {/* Search Card */}
        <View style={styles.searchCardContainer}>
          <View style={styles.searchCard}>
            
            {/* Trip Type Tabs */}
            <View style={styles.tabContainer}>
              {(['NORMAL', 'EXPRESS', 'POINT-POINT'] as const).map((type) => (
                <TouchableOpacity 
                  key={type} 
                  onPress={() => setTripType(type)} 
                  style={[styles.tabItem, tripType === type && styles.tabItemActive]}
                >
                  <Text style={[styles.tabText, tripType === type && styles.tabTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.routeInputContainer}>
              <View style={styles.routeLineContainer}>
                <View style={styles.routeDot} />
                <View style={styles.routeDottedLine} />
                <View style={styles.routeDot} />
              </View>
              
              <View style={styles.routeFieldsContainer}>
                <TouchableOpacity style={styles.inputField} onPress={() => navigation.navigate('LocationPicker')}>
                  <Text style={styles.inputLabel}>From</Text>
                  <Text style={styles.inputValue}>{t('home.currentLocation')}</Text>
                </TouchableOpacity>
                
                <View style={styles.inputDivider} />
                
                <TouchableOpacity style={styles.inputField} onPress={() => navigation.navigate('LocationPicker')}>
                  <Text style={styles.inputLabel}>To</Text>
                  <Text style={styles.inputValue}>{t('home.whereTo')}</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.swapButtonWrapperNew}
                onPress={() => navigation.navigate('LocationPicker')}
              >
                <View style={styles.swapGradientNew}>
                  <MaterialIcons name="swap-vert" size={20} color={theme.colors.primary} />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => navigation.navigate('LocationPicker')}
            >
              <Text style={styles.searchButtonText}>{t('home.findBuses')}</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* Circular Tinted Quick Actions */}
        <View style={[styles.sectionContainer, styles.quickActionsGrid]}>
           <HoloActionCard 
             icon="radar" 
             title={t('home.liveRadar')} 
             tintColor={theme.dark ? '#1e3a8a' : '#E3F2FD'} 
             iconColor="#2196F3" 
             styles={styles}
             onPress={() => navigation.navigate('LocationPicker')}
           />
           <HoloActionCard 
             icon="map-marker-path" 
             title={t('home.nearby')} 
             tintColor={theme.dark ? '#14532d' : '#E8F5E9'} 
             iconColor="#4CAF50" 
             styles={styles}
             onPress={() => navigation.navigate('LocationPicker')}
           />
           <HoloActionCard 
             icon="star-shooting" 
             title={t('home.favs')} 
             tintColor={theme.dark ? '#7f1d1d' : '#FFEBEE'} 
             iconColor="#F44336" 
             styles={styles}
             onPress={() => {}}
           />
           <HoloActionCard 
             icon="bus-stop" 
             title={t('home.stops')} 
             tintColor={theme.dark ? '#134e4a' : '#E0F2F1'} 
             iconColor="#009688" 
             styles={styles}
             onPress={() => navigation.navigate('LocationPicker')}
           />
        </View>

        {/* Live buses section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('home.liveBuses')}</Text>
            {!loading && !error && (
              <Text style={[styles.busCountBadge, { color: theme.colors.secondaryText }]}>
                {filteredBuses.length} active
              </Text>
            )}
          </View>
          
          {loading ? (
            <LoadingState message="Fetching live buses..." />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchBusesData()} />
          ) : filteredBuses.length === 0 ? (
            <EmptyState 
              icon="bus-alert" 
              title="No buses available"
              description={`No ${tripType.toLowerCase()} buses registered or currently reporting live telemetry.`}
            />
          ) : (
            filteredBuses.map((bus) => {
              const liveStatus = formatLiveStatus(bus.live);
              const routeLabel = bus.route?.route_number || bus.route?.id || bus.id;
              const routeDesc = bus.route?.origin && bus.route?.destination
                ? `${bus.route.origin} → ${bus.route.destination}`
                : (bus.route?.name || `Bus ${bus.id}`);

              return (
                <TouchableOpacity 
                  style={styles.busCard} 
                  key={bus.id} 
                  onPress={() => navigation.navigate('LiveTracking', { 
                    busId: bus.id, 
                    serviceType: (bus.route?.service_type as any) || 'normal' 
                  })}
                  activeOpacity={0.8}
                >
                  <View style={styles.busCardHeaderRow}>
                    <View style={styles.busCardLeftRow}>
                      <View style={[styles.busNumberBadge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.busNumberText}>{routeLabel}</Text>
                      </View>
                      <Text style={styles.routeTagText} numberOfLines={1}>{routeDesc}</Text>
                    </View>
                    
                    <View style={[styles.statusPill, { borderColor: liveStatus.badgeColor }]}>
                      <View style={[styles.statusDot, { backgroundColor: liveStatus.badgeColor }]} />
                      <Text style={[styles.statusPillText, { color: liveStatus.badgeColor }]}>
                        {liveStatus.statusText}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.busCardMiddleRow}>
                    <Text style={styles.currentStopText}>
                      {bus.live?.lat && bus.live?.lng
                        ? `GPS: ${bus.live.lat.toFixed(4)}, ${bus.live.lng.toFixed(4)}`
                        : 'Location pending transmission'}
                    </Text>
                    <View style={styles.etaContainer}>
                      <Text style={[styles.etaValueText, { color: liveStatus.isLive ? theme.colors.primary : theme.colors.secondaryText }]}>
                        {liveStatus.etaDisplay}
                      </Text>
                    </View>
                  </View>

                  {/* Info bar at bottom */}
                  <View style={styles.infoBar}>
                    <View style={styles.infoBarItem}>
                      <MaterialCommunityIcons name="seat-passenger" size={16} color={theme.colors.secondaryText} />
                      <Text style={styles.infoBarText}>
                        Capacity: <Text style={{fontWeight: '700'}}>{bus.capacity} seats</Text>
                      </Text>
                    </View>
                    
                    <View style={styles.infoBarItemRight}>
                       <MaterialCommunityIcons 
                         name={liveStatus.isLive ? "satellite-variant" : "clock-outline"} 
                         size={15} 
                         color={liveStatus.badgeColor} 
                       />
                       <Text style={[styles.infoBarText, { color: liveStatus.badgeColor, fontWeight: '600' }]}>
                         {liveStatus.statusText}
                       </Text>
                    </View>
                  </View>

                </TouchableOpacity>
              );
            })
          )}
        </View>

      </ScrollView>
    </View>
  );
}

function HoloActionCard({ icon, title, tintColor, iconColor, styles, onPress }: any) {
  return (
    <TouchableOpacity style={styles.holoActionCard} activeOpacity={0.7} onPress={onPress}>
       <View style={[styles.holoIconBg, { backgroundColor: tintColor }]}>
         <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
       </View>
       <Text style={styles.holoActionTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContainer: { paddingBottom: 60 },
  
  headerArea: { zIndex: 10 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  greeting: { fontSize: 16, color: theme.colors.secondaryText, fontWeight: '600', marginBottom: 2 },
  userName: { fontSize: 26, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconGlassBtn: { padding: 10, marginRight: 12, backgroundColor: theme.colors.surface, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width:0, height:4}, elevation: 2 },
  avatar: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  
  searchCardContainer: { paddingHorizontal: 20, marginTop: 20, zIndex: 10 },
  searchCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 15, shadowOffset: {width:0, height:8}, elevation: 4 },
  
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.outline },
  tabItem: { paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: theme.colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: theme.colors.secondaryText },
  tabTextActive: { color: theme.colors.primary, fontWeight: '800' },

  routeInputContainer: { flexDirection: 'row', alignItems: 'center' },
  routeLineContainer: { alignItems: 'center', marginRight: 16 },
  routeDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: theme.colors.primary, backgroundColor: theme.colors.surface },
  routeDottedLine: { width: 2, height: 35, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.outline, marginVertical: 4 },
  
  routeFieldsContainer: { flex: 1 },
  inputField: { paddingVertical: 8 },
  inputLabel: { fontSize: 12, color: theme.colors.secondaryText, marginBottom: 4 },
  inputValue: { fontSize: 16, color: theme.colors.text, fontWeight: '600' },
  inputDivider: { height: 1, backgroundColor: theme.colors.surfaceVariant, marginVertical: 4 },
  
  swapButtonWrapperNew: { padding: 8, marginLeft: 8 },
  swapGradientNew: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0,height:2}, borderWidth: 1, borderColor: theme.colors.outline },

  searchButton: { backgroundColor: theme.colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  searchButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  
  sectionContainer: { marginTop: 28, paddingHorizontal: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  busCountBadge: { fontSize: 13, fontWeight: '600' },
  
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  holoActionCard: { width: (width - 40) / 4 - 8, alignItems: 'center' },
  holoIconBg: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset:{width:0,height:2} },
  holoActionTitle: { fontSize: 12, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  
  busCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 16, paddingBottom: 0, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: {width:0,height:6}, elevation: 4 },
  
  busCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  busCardLeftRow: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  busNumberBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 12 },
  busNumberText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  routeTagText: { fontSize: 15, fontWeight: '700', color: theme.colors.text, flex: 1 },
  
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surface },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  
  busCardMiddleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  currentStopText: { fontSize: 13, color: theme.colors.secondaryText, fontWeight: '500', flex: 1 },
  
  etaContainer: { alignItems: 'flex-end' },
  etaValueText: { fontSize: 15, fontWeight: '800' },
  
  infoBar: { flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, padding: 12, marginHorizontal: -16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopWidth: 1, borderColor: theme.colors.outline, justifyContent: 'space-between' },
  infoBarItem: { flexDirection: 'row', alignItems: 'center' },
  infoBarItemRight: { flexDirection: 'row', alignItems: 'center' },
  infoBarText: { fontSize: 13, color: theme.colors.secondaryText, marginLeft: 6 },
});
