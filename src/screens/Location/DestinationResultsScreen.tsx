import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';
import { getStops, getBuses, Stop, Bus } from '../../api/client';
import { formatLiveStatus } from '../../utils/liveStatus';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';

type DestinationResultsScreenRouteProp = RouteProp<RootStackParamList, 'DestinationResults'>;
type DestinationResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DestinationResults'>;

interface Props {
  route: DestinationResultsScreenRouteProp;
  navigation: DestinationResultsScreenNavigationProp;
}

export default function DestinationResultsScreen({ route, navigation }: Props) {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const { origin } = route.params;
  
  const [destinationQuery, setDestinationQuery] = useState('');
  const [stopSuggestions, setStopSuggestions] = useState<Stop[]>([]);
  const [searchingStops, setSearchingStops] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loadingBuses, setLoadingBuses] = useState(false);
  const [busError, setBusError] = useState<string | null>(null);

  const searchStops = useCallback(async (text: string) => {
    if (!text.trim()) {
      setStopSuggestions([]);
      return;
    }
    setSearchingStops(true);
    try {
      const results = await getStops(text.trim());
      // Filter out origin if matched
      const filtered = results.filter(s => s.name.toLowerCase() !== origin.toLowerCase());
      setStopSuggestions(filtered);
    } catch {
      setStopSuggestions([]);
    } finally {
      setSearchingStops(false);
    }
  }, [origin]);

  const fetchBusesForRoute = useCallback(async (dest: string) => {
    setLoadingBuses(true);
    setBusError(null);
    try {
      const allBuses = await getBuses();
      // Filter buses whose route passes through or matches origin/dest, or all active buses
      const destLower = dest.toLowerCase();
      const originLower = origin.toLowerCase();

      const matched = allBuses.filter(b => {
        if (!b.route) return false;
        const rName = (b.route.name || '').toLowerCase();
        const rOrigin = (b.route.origin || '').toLowerCase();
        const rDest = (b.route.destination || '').toLowerCase();
        
        const matchesDest = rDest.includes(destLower) || rName.includes(destLower);
        const matchesOrigin = rOrigin.includes(originLower) || rName.includes(originLower);
        return matchesDest || matchesOrigin;
      });

      // If specific filter found matches, use it; otherwise provide all registered buses on routes
      setBuses(matched.length > 0 ? matched : allBuses);
    } catch (err: any) {
      setBusError(err?.message || 'Failed to fetch buses for this route.');
    } finally {
      setLoadingBuses(false);
    }
  }, [origin]);

  const handleSearchChange = (text: string) => {
    setDestinationQuery(text);
    if (selectedDestination) {
      setSelectedDestination(null);
    }
    searchStops(text);
  };

  const handleSelectDestination = (stop: Stop) => {
    setDestinationQuery(stop.name);
    setSelectedDestination(stop.name);
    setStopSuggestions([]);
    fetchBusesForRoute(stop.name);
  };

  const renderBusCard = ({ item }: { item: Bus }) => {
    const liveStatus = formatLiveStatus(item.live);
    const routeLabel = item.route?.route_number || item.route?.id || item.id;
    const routeTitle = item.route?.origin && item.route?.destination
      ? `${item.route.origin} → ${item.route.destination}`
      : (item.route?.name || `Bus ${item.id}`);

    return (
      <View style={styles.busCard}>
        <View style={styles.busCardHeaderRow}>
          <View style={styles.busCardLeftRow}>
            <View style={[styles.busNumberBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.busNumberText}>{routeLabel}</Text>
            </View>
            <Text style={styles.routeTagText} numberOfLines={1}>{routeTitle}</Text>
          </View>
          
          <View style={[styles.statusPill, { borderColor: liveStatus.badgeColor, backgroundColor: theme.colors.surface }]}>
            <View style={[styles.statusDot, { backgroundColor: liveStatus.badgeColor }]} />
            <Text style={[styles.statusPillText, { color: liveStatus.badgeColor }]}>
              {liveStatus.statusText}
            </Text>
          </View>
        </View>

        <View style={styles.busCardMiddleRow}>
          <Text style={styles.currentStopText}>
            {item.live?.lat && item.live?.lng
              ? `GPS: ${item.live.lat.toFixed(4)}, ${item.live.lng.toFixed(4)}`
              : 'GPS: No signal received'}
          </Text>
          <View style={styles.etaContainer}>
            <Text style={[styles.etaValueText, { color: liveStatus.isLive ? theme.colors.primary : theme.colors.secondaryText }]}>
              {liveStatus.etaDisplay}
            </Text>
          </View>
        </View>

        <View style={styles.trackButtonContainer}>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('LiveTracking', { 
              busId: item.id, 
              destination: selectedDestination || undefined,
              serviceType: (item.route?.service_type as any) || 'normal'
            })}
            style={[styles.trackButton, { backgroundColor: theme.colors.primary }]}
            icon="crosshairs-gps"
            contentStyle={{ paddingVertical: 4 }}
          >
            Track Live
          </Button>
        </View>

        <View style={styles.infoBar}>
          <View style={styles.infoBarItem}>
            <MaterialCommunityIcons name="seat-passenger" size={16} color={theme.colors.secondaryText} />
            <Text style={styles.infoBarText}>
              Capacity: <Text style={{fontWeight: '700'}}>{item.capacity} seats</Text>
            </Text>
          </View>
          
          <View style={styles.infoBarItemRight}>
             <View style={[styles.statusDot, { backgroundColor: liveStatus.badgeColor, marginRight: 6 }]} />
             <Text style={[styles.infoBarText, { color: liveStatus.badgeColor, fontWeight: '600' }]}>
               {liveStatus.statusText}
             </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('location.destTitle')}</Text>
        </View>

        <View style={styles.searchSection}>
          <View style={[styles.originChip, { backgroundColor: theme.colors.success + '20' }]}>
            <MaterialIcons name="my-location" size={18} color={theme.colors.success} />
            <Text style={[styles.originText, { color: theme.colors.success }]}>From: {origin}</Text>
          </View>

          <Surface style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color={theme.colors.secondaryText} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destination stop..."
              placeholderTextColor={theme.colors.secondaryText}
              value={destinationQuery}
              onChangeText={handleSearchChange}
            />
            {destinationQuery.length > 0 && (
               <TouchableOpacity onPress={() => handleSearchChange('')}>
                 <MaterialIcons name="close" size={20} color={theme.colors.secondaryText} />
               </TouchableOpacity>
            )}
          </Surface>

          {searchingStops && (
            <Surface style={[styles.suggestionsContainer, { padding: 12 }]}>
              <Text style={{ color: theme.colors.secondaryText, textAlign: 'center' }}>Searching stops...</Text>
            </Surface>
          )}

          {destinationQuery.length > 0 && stopSuggestions.length === 0 && !selectedDestination && !searchingStops && (
            <Surface style={[styles.suggestionsContainer, { padding: 16 }]}>
              <Text style={{ color: theme.colors.secondaryText, textAlign: 'center' }}>No matching stops found</Text>
            </Surface>
          )}

          {stopSuggestions.length > 0 && !selectedDestination && (
            <Surface style={styles.suggestionsContainer}>
              <FlatList
                data={stopSuggestions}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.suggestionItem} 
                    onPress={() => handleSelectDestination(item)}
                  >
                    <MaterialIcons name="location-on" size={20} color={theme.colors.secondaryText} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.suggestionText}>{item.name}</Text>
                      <Text style={{ fontSize: 11, color: theme.colors.secondaryText }}>GPS: {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </Surface>
          )}
        </View>

        {selectedDestination && (
          <View style={{ flex: 1 }}>
            {loadingBuses ? (
              <LoadingState message="Finding available buses..." />
            ) : busError ? (
              <ErrorState message={busError} onRetry={() => fetchBusesForRoute(selectedDestination)} />
            ) : buses.length === 0 ? (
              <EmptyState 
                icon="bus-stop" 
                title="No Buses Found" 
                description={`No scheduled buses currently operating between ${origin} and ${selectedDestination}.`} 
              />
            ) : (
              <FlatList
                data={buses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.resultsList}
                renderItem={renderBusCard}
                ListHeaderComponent={() => (
                  <Text style={styles.sectionTitle}>
                    Buses serving this corridor
                  </Text>
                )}
              />
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 8, color: theme.colors.text },
  
  searchSection: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, zIndex: 10 },
  originChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginBottom: 16, alignSelf: 'flex-start' },
  originText: { fontWeight: '700', marginLeft: 8, fontSize: 14 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 16, height: 56, backgroundColor: theme.colors.surface, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: {width:0, height:4}, elevation: 2 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, height: '100%', color: theme.colors.text },
  
  suggestionsContainer: { marginTop: 8, borderRadius: 16, maxHeight: 220, overflow: 'hidden', position: 'absolute', top: 140, left: 24, right: 24, backgroundColor: theme.colors.surface, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:6}, elevation: 4 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  suggestionText: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  separator: { height: 1, backgroundColor: theme.colors.outline },
  
  resultsList: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, letterSpacing: -0.5, marginBottom: 16 },
  
  busCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 16, paddingBottom: 0, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: {width:0,height:6}, elevation: 4 },
  
  busCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  busCardLeftRow: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  busNumberBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 12 },
  busNumberText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  routeTagText: { fontSize: 15, fontWeight: '700', color: theme.colors.text, flex: 1 },
  
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  
  busCardMiddleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  currentStopText: { fontSize: 13, color: theme.colors.secondaryText, fontWeight: '500', flex: 1 },
  
  etaContainer: { alignItems: 'flex-end' },
  etaValueText: { fontSize: 14, fontWeight: '700' },
  
  trackButtonContainer: { marginBottom: 14 },
  trackButton: { borderRadius: 12 },

  infoBar: { flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, padding: 12, marginHorizontal: -16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopWidth: 1, borderColor: theme.colors.outline, justifyContent: 'space-between' },
  infoBarItem: { flexDirection: 'row', alignItems: 'center' },
  infoBarItemRight: { flexDirection: 'row', alignItems: 'center' },
  infoBarText: { fontSize: 13, color: theme.colors.secondaryText, marginLeft: 6 },
});
