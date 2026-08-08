import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar } from 'react-native-paper';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function HomeScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const dummyBuses = [
    { id: '1', route: '101A', start: 'Guindy', dest: 'Karur', currentStop: 'Guindy National Park', eta: '5', capacity: 23, crowd: 'Moderate', status: 'LIVE' },
    { id: '2', route: '21G', start: 'Tambaram', dest: 'Broadway', currentStop: 'Chromepet', eta: '2', capacity: 5, crowd: 'High', status: 'LIVE' },
    { id: '3', route: '570', start: 'Kelambakkam', dest: 'CMBT', currentStop: 'Navalur', eta: '18', capacity: 45, crowd: 'Low', status: 'Delayed' },
  ];

  const getStatusColor = (status: string, crowd: string) => {
    if (status === 'Delayed' || crowd === 'High') return theme.colors.error;
    if (crowd === 'Moderate') return '#FFB300';
    return theme.colors.success;
  };

  const getStatusText = (status: string) => {
    return status === 'LIVE' ? 'LIVE' : status;
  };

  const getCrowdText = (crowd: string) => {
    return crowd + ' crowd';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <SafeAreaView edges={['top']} style={styles.headerArea}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good Morning,</Text>
              <Text style={styles.userName}>Nithish <Text style={{fontSize: 22}}>👋</Text></Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconGlassBtn}>
                <Ionicons name="notifications-outline" size={24} color="#334155" />
                <View style={styles.neonBadge} />
              </TouchableOpacity>
              <Avatar.Image size={48} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
            </View>
          </View>
        </SafeAreaView>

        {/* Search Card */}
        <View style={styles.searchCardContainer}>
          <View style={styles.searchCard}>
            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => navigation.navigate('LocationPicker')}
            >
              <View style={[styles.iconChip, { backgroundColor: '#E8F5E9' }]}>
                 <MaterialCommunityIcons name="target-account" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.inputTextPlaceholder}>Current Location</Text>
            </TouchableOpacity>
            
            <View style={styles.dividerContainer}>
              <View style={styles.verticalDashedLine} />
              <TouchableOpacity style={styles.swapButtonWrapper}>
                 <View style={styles.swapGradient}>
                   <MaterialIcons name="swap-vert" size={20} color={theme.colors.primary} />
                 </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => navigation.navigate('LocationPicker')}
            >
              <View style={[styles.iconChip, { backgroundColor: '#FFEBEE' }]}>
                 <MaterialCommunityIcons name="map-marker-radius" size={20} color="#F44336" />
              </View>
              <Text style={styles.inputTextPlaceholder}>Where to?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Circular Tinted Quick Actions */}
        <View style={[styles.sectionContainer, styles.quickActionsGrid]}>
           <HoloActionCard icon="radar" title="Live Radar" tintColor="#E3F2FD" iconColor="#2196F3" />
           <HoloActionCard icon="map-marker-path" title="Nearby" tintColor="#E8F5E9" iconColor="#4CAF50" />
           <HoloActionCard icon="star-shooting" title="Favs" tintColor="#FFEBEE" iconColor="#F44336" />
           <HoloActionCard icon="bus-stop" title="Stops" tintColor="#E0F2F1" iconColor="#009688" />
        </View>

        {/* SmartBus AI Recommendation Card */}
        <View style={styles.sectionContainer}>
          <View style={styles.aiCard}>
             <View style={styles.aiHeader}>
               <MaterialCommunityIcons name="robot-outline" size={24} color={theme.colors.primary} />
               <Text style={styles.aiTitle}>SmartBus AI Suggestion</Text>
               <MaterialCommunityIcons name="auto-fix" size={20} color="#FFB300" />
             </View>
             <Text style={styles.aiBody}>
               Take route <Text style={{fontWeight: '700'}}>570</Text> in 10 mins to avoid the crowd. ETA to destination is 45 mins.
             </Text>
          </View>
        </View>

        {/* Live buses near you */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Live buses near you</Text>
          
          {dummyBuses.map((bus) => (
            <View style={styles.busCard} key={bus.id}>
              
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
                <Text style={styles.currentStopText}>Currently: {bus.currentStop}</Text>
                <View style={styles.etaContainer}>
                  <Text style={[styles.etaValueText, { color: theme.colors.primary }]}>{bus.eta}</Text>
                  <Text style={styles.etaLabelText}>min</Text>
                </View>
              </View>

              {/* Info bar at bottom */}
              <View style={styles.infoBar}>
                <View style={styles.infoBarItem}>
                  <MaterialCommunityIcons name="seat-passenger" size={16} color="#64748B" />
                  <Text style={styles.infoBarText}>
                    Est. Available: <Text style={{fontWeight: '700'}}>{bus.capacity}</Text>
                  </Text>
                </View>
                
                <View style={styles.infoBarItemRight}>
                   <View style={[styles.statusDot, { backgroundColor: getStatusColor(bus.status, bus.crowd), marginRight: 6 }]} />
                   <Text style={[styles.infoBarText, { color: getStatusColor(bus.status, bus.crowd), fontWeight: '600' }]}>
                     {getCrowdText(bus.crowd)}
                   </Text>
                </View>
              </View>

            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

function HoloActionCard({ icon, title, tintColor, iconColor }: any) {
  return (
    <TouchableOpacity style={styles.holoActionCard} activeOpacity={0.7}>
       <View style={[styles.holoIconBg, { backgroundColor: tintColor }]}>
         <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
       </View>
       <Text style={styles.holoActionTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 60 },
  
  headerArea: { zIndex: 10 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  greeting: { fontSize: 16, color: '#64748B', fontWeight: '600', marginBottom: 2 },
  userName: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -1 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconGlassBtn: { padding: 8, marginRight: 12, backgroundColor: '#FFFFFF', borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width:0, height:4}, elevation: 2 },
  neonBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#FFFFFF' },
  avatar: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  
  searchCardContainer: { paddingHorizontal: 20, marginTop: 24, zIndex: 10 },
  searchCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 15, shadowOffset: {width:0, height:8}, elevation: 4 },
  
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  iconChip: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  inputTextPlaceholder: { fontSize: 17, color: '#64748B', fontWeight: '600', flex: 1 },
  dividerContainer: { height: 24, marginLeft: 20, position: 'relative', justifyContent: 'center' },
  verticalDashedLine: { position: 'absolute', left: -1, top: -4, bottom: -4, width: 2, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#E2E8F0' },
  swapButtonWrapper: { position: 'absolute', right: 0, zIndex: 10 },
  swapGradient: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0,height:2}, borderWidth: 1, borderColor: '#E2E8F0' },
  
  sectionContainer: { marginTop: 32, paddingHorizontal: 20 },
  
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  holoActionCard: { width: (width - 40) / 4 - 8, alignItems: 'center' },
  holoIconBg: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset:{width:0,height:2} },
  holoActionTitle: { fontSize: 12, fontWeight: '700', color: '#334155', textAlign: 'center' },
  
  aiCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: {width:0, height:5}, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  aiTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginLeft: 8, marginRight: 8 },
  aiBody: { fontSize: 14, color: '#475569', lineHeight: 22 },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5, marginBottom: 16 },
  
  busCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, paddingBottom: 0, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: {width:0,height:6}, elevation: 4 },
  
  busCardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  busCardLeftRow: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  busNumberBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 12 },
  busNumberText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  routeTagText: { fontSize: 15, fontWeight: '700', color: '#334155', flex: 1 },
  
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, backgroundColor: '#FFFFFF' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  
  busCardMiddleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  currentStopText: { fontSize: 14, color: '#64748B', fontWeight: '500', flex: 1 },
  
  etaContainer: { alignItems: 'flex-end' },
  etaValueText: { fontSize: 24, fontWeight: '900', marginBottom: -4 },
  etaLabelText: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  
  infoBar: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, marginHorizontal: -16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopWidth: 1, borderColor: '#F1F5F9', justifyContent: 'space-between' },
  infoBarItem: { flexDirection: 'row', alignItems: 'center' },
  infoBarItemRight: { flexDirection: 'row', alignItems: 'center' },
  infoBarText: { fontSize: 13, color: '#64748B', marginLeft: 6 },
});
