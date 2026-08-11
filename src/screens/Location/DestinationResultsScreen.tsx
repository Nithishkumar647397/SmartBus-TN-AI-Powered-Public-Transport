import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockRouteBuses, RouteBus } from '../../data/mockRouteBuses';
import { MOCK_PLACES } from '../../data/mockPlaces';
import { useTranslation } from 'react-i18next';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  
  const handleSearch = (text: string) => {
    setDestinationQuery(text);
    if (text.length > 0) {
      const filtered = MOCK_PLACES.filter(
        town => town.toLowerCase().includes(text.toLowerCase()) && town !== origin
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    if (selectedDestination) {
      setSelectedDestination(null);
    }
  };

  const handleSelectDestination = (destination: string) => {
    setDestinationQuery(destination);
    setSelectedDestination(destination);
    setSuggestions([]);
  };

  const getStatusColor = (status: string, crowd: string) => {
    if (status === 'Delayed' || crowd === 'high') return theme.colors.error;
    if (crowd === 'moderate') return '#FFB300';
    return theme.colors.success;
  };

  const renderBusCard = ({ item, isNextBuses = false }: { item: RouteBus, isNextBuses?: boolean }) => {
    const statusColor = getStatusColor(item.status, item.crowdLevel);
    
    return (
      <View style={[styles.busCard, isNextBuses && styles.busCardCompact]}>
        <View style={styles.busCardHeaderRow}>
          <View style={styles.busCardLeftRow}>
            <View style={[styles.busNumberBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.busNumberText}>{item.busNumber}</Text>
            </View>
            <Text style={styles.routeTagText} numberOfLines={1}>{item.fullRoute.join(' → ')}</Text>
          </View>
          
          <View style={[styles.statusPill, { borderColor: statusColor, backgroundColor: theme.colors.surface }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusPillText, { color: statusColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.busCardMiddleRow}>
          <Text style={styles.currentStopText}>Currently: {item.currentStop}</Text>
          <View style={styles.etaContainer}>
            <Text style={[styles.etaValueText, { color: theme.colors.primary }]}>{item.etaToUser}</Text>
            <Text style={styles.etaLabelText}>min</Text>
          </View>
        </View>

        {!isNextBuses && (
          <View style={styles.trackButtonContainer}>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('LiveTracking', { busId: item.id, destination: selectedDestination || undefined })}
              style={[styles.trackButton, { backgroundColor: theme.colors.primary }]}
              icon="crosshairs-gps"
              contentStyle={{ paddingVertical: 4 }}
            >
              Track Live
            </Button>
          </View>
        )}

        <View style={styles.infoBar}>
          <View style={styles.infoBarItem}>
            <MaterialCommunityIcons name="seat-passenger" size={16} color={theme.colors.secondaryText} />
            <Text style={styles.infoBarText}>
              Est. Available: <Text style={{fontWeight: '700'}}>{item.seatsAvailable}</Text>
            </Text>
          </View>
          
          <View style={styles.infoBarItemRight}>
             <View style={[styles.statusDot, { backgroundColor: statusColor, marginRight: 6 }]} />
             <Text style={[styles.infoBarText, { color: statusColor, fontWeight: '600' }]}>
               {item.crowdLevel.charAt(0).toUpperCase() + item.crowdLevel.slice(1)} crowd
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

          <Surface style={styles.searchContainer} >
            <MaterialIcons name="search" size={24} color={theme.colors.secondaryText} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Where do you want to go?"
              placeholderTextColor={theme.colors.secondaryText}
              value={destinationQuery}
              onChangeText={handleSearch}
            />
            {destinationQuery.length > 0 && (
               <TouchableOpacity onPress={() => handleSearch('')}>
                 <MaterialIcons name="close" size={20} color={theme.colors.secondaryText} />
               </TouchableOpacity>
            )}
          </Surface>

          {destinationQuery.length > 0 && suggestions.length === 0 && !selectedDestination && (
            <Surface style={[styles.suggestionsContainer, { padding: 16 }]}>
              <Text style={{ color: theme.colors.secondaryText, textAlign: 'center' }}>No results found</Text>
            </Surface>
          )}

          {suggestions.length > 0 && !selectedDestination && (
            <Surface style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.suggestionItem} 
                    onPress={() => handleSelectDestination(item)}
                  >
                    <MaterialIcons name="location-on" size={20} color={theme.colors.secondaryText} />
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </Surface>
          )}
        </View>

        {selectedDestination && (
          <FlatList
            data={[mockRouteBuses[0]]} // Main result
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsList}
            renderItem={renderBusCard}
            ListHeaderComponent={() => (
              <Text style={styles.sectionTitle}>
                Buses passing through your route
              </Text>
            )}
            ListFooterComponent={() => (
              <View style={styles.nextBusesSection}>
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                  Next Buses
                </Text>
                {mockRouteBuses.slice(1).map(bus => (
                  <View key={bus.id} style={styles.nextBusWrapper}>
                    {renderBusCard({ item: bus, isNextBuses: true })}
                  </View>
                ))}
              </View>
            )}
          />
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
  
  suggestionsContainer: { marginTop: 8, borderRadius: 16, maxHeight: 200, overflow: 'hidden', position: 'absolute', top: 140, left: 24, right: 24, backgroundColor: theme.colors.surface, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:6}, elevation: 4 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  suggestionText: { marginLeft: 12, fontSize: 16, color: theme.colors.text },
  separator: { height: 1, backgroundColor: theme.colors.outline },
  
  resultsList: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, marginBottom: 16 },
  
  busCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 16, paddingBottom: 0, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: {width:0,height:6}, elevation: 4 },
  busCardCompact: { shadowOpacity: 0.03, elevation: 2 },
  
  busCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  busCardLeftRow: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  busNumberBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 12 },
  busNumberText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  routeTagText: { fontSize: 15, fontWeight: '700', color: theme.colors.text, flex: 1 },
  
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  
  busCardMiddleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  currentStopText: { fontSize: 14, color: theme.colors.secondaryText, fontWeight: '500', flex: 1 },
  
  etaContainer: { alignItems: 'flex-end' },
  etaValueText: { fontSize: 24, fontWeight: '900', marginBottom: -4 },
  etaLabelText: { fontSize: 12, color: theme.colors.secondaryText, fontWeight: '600' },
  
  trackButtonContainer: { marginBottom: 16 },
  trackButton: { borderRadius: 12 },

  infoBar: { flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, padding: 12, marginHorizontal: -16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopWidth: 1, borderColor: theme.colors.outline, justifyContent: 'space-between' },
  infoBarItem: { flexDirection: 'row', alignItems: 'center' },
  infoBarItemRight: { flexDirection: 'row', alignItems: 'center' },
  infoBarText: { fontSize: 13, color: theme.colors.secondaryText, marginLeft: 6 },
  
  nextBusesSection: { marginTop: 8 },
  nextBusWrapper: { marginBottom: 4 }
});
