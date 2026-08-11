import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar } from 'react-native-paper';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation, Trans } from 'react-i18next';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function HomeScreen() {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [tripType, setTripType] = useState('NORMAL');
  
  const dummyBuses = [
    { id: '1', route: '101A', start: 'Guindy', dest: 'Karur', currentStop: 'Guindy National Park', eta: '5', capacity: 23, crowd: 'Moderate', status: 'LIVE', serviceType: 'normal' },
    { id: '2', route: '21G', start: 'Tambaram', dest: 'Broadway', currentStop: 'Chromepet', eta: '2', capacity: 5, crowd: 'High', status: 'LIVE', serviceType: 'express' },
    { id: '3', route: '570', start: 'Kelambakkam', dest: 'CMBT', currentStop: 'Navalur', eta: '18', capacity: 45, crowd: 'Low', status: 'Delayed', serviceType: 'point_to_point' },
  ] as const;

  const tripTypeMapping: Record<string, string> = {
    'NORMAL': 'normal',
    'EXPRESS': 'express',
    'POINT-POINT': 'point_to_point'
  };

  const filteredBuses = dummyBuses.filter(bus => bus.serviceType === tripTypeMapping[tripType]);

  const getStatusColor = (status: string, crowd: string) => {
    if (status === 'Delayed' || crowd === 'High') return theme.colors.error;
    if (crowd === 'Moderate') return '#FFB300';
    return theme.colors.success;
  };

  const getStatusText = (status: string) => {
    return status === 'LIVE' ? 'LIVE' : status; // Not translating LIVE for now as it acts like a badge
  };

  const getCrowdText = (crowd: string) => {
    return crowd + ' crowd'; // For a complete implementation, crowd states would also be in i18n
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <SafeAreaView edges={['top']} style={styles.headerArea}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{t('home.goodMorning')}</Text>
              <Text style={styles.userName}>Nithish <Text style={{fontSize: 22}}>👋</Text></Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconGlassBtn}>
                <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
                <View style={styles.neonBadge} />
              </TouchableOpacity>
              <Avatar.Image size={48} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
            </View>
          </View>
        </SafeAreaView>

        {/* Search Card */}
        <View style={styles.searchCardContainer}>
          <View style={styles.searchCard}>
            
            {/* Trip Type Tabs */}
            <View style={styles.tabContainer}>
              {['NORMAL', 'EXPRESS', 'POINT-POINT'].map((type) => (
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
              
              <TouchableOpacity style={styles.swapButtonWrapperNew}>
                <View style={styles.swapGradientNew}>
                  <MaterialIcons name="swap-vert" size={20} color={theme.colors.primary} />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>{t('home.findBuses')}</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* Circular Tinted Quick Actions */}
        <View style={[styles.sectionContainer, styles.quickActionsGrid]}>
           <HoloActionCard icon="radar" title={t('home.liveRadar')} tintColor={theme.dark ? '#1e3a8a' : '#E3F2FD'} iconColor="#2196F3" styles={styles} />
           <HoloActionCard icon="map-marker-path" title={t('home.nearby')} tintColor={theme.dark ? '#14532d' : '#E8F5E9'} iconColor="#4CAF50" styles={styles} />
           <HoloActionCard icon="star-shooting" title={t('home.favs')} tintColor={theme.dark ? '#7f1d1d' : '#FFEBEE'} iconColor="#F44336" styles={styles} />
           <HoloActionCard icon="bus-stop" title={t('home.stops')} tintColor={theme.dark ? '#134e4a' : '#E0F2F1'} iconColor="#009688" styles={styles} />
        </View>

        {/* SmartBus AI Recommendation Card */}
        <View style={styles.sectionContainer}>
          <View style={styles.aiCard}>
             <View style={styles.aiHeader}>
               <MaterialCommunityIcons name="robot-outline" size={24} color={theme.colors.primary} />
               <Text style={styles.aiTitle}>{t('home.aiSuggestion')}</Text>
               <MaterialCommunityIcons name="auto-fix" size={20} color="#FFB300" />
             </View>
             <Text style={styles.aiBody}>
               <Trans i18nKey="home.aiBody">
                 Take route <Text style={{fontWeight: '700'}}>570</Text> in 10 mins to avoid the crowd. ETA to destination is 45 mins.
               </Trans>
             </Text>
          </View>
        </View>

        {/* Live buses near you */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('home.liveBuses')}</Text>
          
          {filteredBuses.map((bus) => (
            <TouchableOpacity 
              style={styles.busCard} 
              key={bus.id} 
              onPress={() => navigation.navigate('LiveTracking', { busId: bus.id, serviceType: bus.serviceType })}
              activeOpacity={0.8}
            >
              
              <View style={styles.busCardHeaderRow}>
                <View style={styles.busCardLeftRow}>
                  <View style={[styles.busNumberBadge, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.busNumberText}>{bus.route}</Text>
                  </View>
                  <Text style={styles.routeTagText}>{bus.start} → {bus.dest}</Text>
                </View>
                
                <View style={[styles.statusPill, { borderColor: getStatusColor(bus.status, bus.crowd) }]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(bus.status, bus.crowd) }]} />
                  <Text style={[styles.statusPillText, { color: getStatusColor(bus.status, bus.crowd) }]}>
                    {getStatusText(bus.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.busCardMiddleRow}>
                <Text style={styles.currentStopText}>{t('home.currently')}{bus.currentStop}</Text>
                <View style={styles.etaContainer}>
                  <Text style={[styles.etaValueText, { color: theme.colors.primary }]}>{bus.eta}</Text>
                  <Text style={styles.etaLabelText}>{t('home.min')}</Text>
                </View>
              </View>

              {/* Info bar at bottom */}
              <View style={styles.infoBar}>
                <View style={styles.infoBarItem}>
                  <MaterialCommunityIcons name="seat-passenger" size={16} color={theme.colors.secondaryText} />
                  <Text style={styles.infoBarText}>
                    {t('home.estAvailable')}<Text style={{fontWeight: '700'}}>{bus.capacity}</Text>
                  </Text>
                </View>
                
                <View style={styles.infoBarItemRight}>
                   <View style={[styles.statusDot, { backgroundColor: getStatusColor(bus.status, bus.crowd), marginRight: 6 }]} />
                   <Text style={[styles.infoBarText, { color: getStatusColor(bus.status, bus.crowd), fontWeight: '600' }]}>
                     {getCrowdText(bus.crowd)}
                   </Text>
                </View>
              </View>

            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

function HoloActionCard({ icon, title, tintColor, iconColor, styles }: any) {
  return (
    <TouchableOpacity style={styles.holoActionCard} activeOpacity={0.7}>
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
  userName: { fontSize: 28, fontWeight: '900', color: theme.colors.text, letterSpacing: -1 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconGlassBtn: { padding: 8, marginRight: 12, backgroundColor: theme.colors.surface, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width:0, height:4}, elevation: 2 },
  neonBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.error, borderWidth: 1.5, borderColor: theme.colors.surface },
  avatar: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  
  searchCardContainer: { paddingHorizontal: 20, marginTop: 24, zIndex: 10 },
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
  searchButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }, // search button text is always white
  
  sectionContainer: { marginTop: 32, paddingHorizontal: 20 },
  
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  holoActionCard: { width: (width - 40) / 4 - 8, alignItems: 'center' },
  holoIconBg: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset:{width:0,height:2} },
  holoActionTitle: { fontSize: 12, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  
  aiCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: {width:0, height:5}, elevation: 3, borderWidth: 1, borderColor: theme.colors.outline },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  aiTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginLeft: 8, marginRight: 8 },
  aiBody: { fontSize: 14, color: theme.colors.text, lineHeight: 22 },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5, marginBottom: 16 },
  
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
  currentStopText: { fontSize: 14, color: theme.colors.secondaryText, fontWeight: '500', flex: 1 },
  
  etaContainer: { alignItems: 'flex-end' },
  etaValueText: { fontSize: 24, fontWeight: '900', marginBottom: -4 },
  etaLabelText: { fontSize: 12, color: theme.colors.secondaryText, fontWeight: '600' },
  
  infoBar: { flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, padding: 12, marginHorizontal: -16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopWidth: 1, borderColor: theme.colors.outline, justifyContent: 'space-between' },
  infoBarItem: { flexDirection: 'row', alignItems: 'center' },
  infoBarItemRight: { flexDirection: 'row', alignItems: 'center' },
  infoBarText: { fontSize: 13, color: theme.colors.secondaryText, marginLeft: 6 },
});
