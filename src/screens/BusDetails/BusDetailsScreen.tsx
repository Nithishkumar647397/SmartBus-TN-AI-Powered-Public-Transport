import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Surface, Switch, Button } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../utils/theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type BusDetailsRouteProp = RouteProp<RootStackParamList, 'LiveTracking'>;

interface RouteStop {
  id: string;
  stopName: string;
  status: 'past' | 'current' | 'upcoming' | 'destination';
  estimatedTime: string;
  relativeTime?: string;
}

// TEMPORARY: upcoming stop times are static mock estimates. Replace with dynamic ETA calculated from live GPS speed/position once hardware is integrated. Do not treat as a fixed schedule.
const mockTimeline: RouteStop[] = [
  { id: '1', stopName: 'Tiruppur Central', status: 'past', estimatedTime: '10:00 AM' },
  { id: '2', stopName: 'Tiruppur Old Bus Stand', status: 'past', estimatedTime: '10:15 AM' },
  { id: '3', stopName: 'Palladam', status: 'current', estimatedTime: '10:45 AM' },
  { id: '4', stopName: 'Kangeyam', status: 'upcoming', estimatedTime: '11:15 AM', relativeTime: '30 mins' },
  { id: '5', stopName: 'Vellakoil', status: 'upcoming', estimatedTime: '11:45 AM', relativeTime: '1h 0m' },
  { id: '6', stopName: 'Karur', status: 'destination', estimatedTime: '12:20 PM', relativeTime: '1h 35m' },
];

export default function BusDetailsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<BusDetailsRouteProp>();
  const { destination, serviceType } = route.params || {};

  const getServiceBadgeText = () => {
    switch(serviceType) {
      case 'express': return 'EXP';
      case 'point_to_point': return 'P2P';
      case 'normal':
      default: return 'NORMAL';
    }
  };

  const [notifyEnabled, setNotifyEnabled] = useState(!!destination);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.appBarIconBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Bus Details</Text>
        <TouchableOpacity style={styles.appBarIconBtn} onPress={() => {}}>
          <MaterialCommunityIcons name="share-variant-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Card */}
        <Surface style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.badgesLeft}>
              <View style={[styles.badgeSolid, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.badgeSolidText}>101 TNSTC</Text>
              </View>
              <View style={styles.badgeOutline}>
                <Text style={styles.badgeOutlineText}>{getServiceBadgeText()}</Text>
              </View>
            </View>
            <View style={[styles.statusPill, { backgroundColor: '#DCFCE7' }]}>
              <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
              <Text style={[styles.statusPillText, { color: '#166534' }]}>On Time</Text>
            </View>
          </View>
          
          <Text style={styles.routeTitle}>Tiruppur to Karur</Text>

          <View style={styles.infoBanner}>
            <MaterialCommunityIcons name="star-four-points-outline" size={20} color="#047857" style={styles.bannerIcon} />
            <View style={styles.bannerTextCol}>
              <Text style={styles.bannerPrimaryText}>Estimated available capacity: <Text style={{fontWeight: '700'}}>23 seats</Text></Text>
              <Text style={styles.bannerSecondaryText}>Crowd: <Text style={{fontWeight: '700'}}>Moderate</Text></Text>
            </View>
          </View>
        </Surface>

        {/* Live Route Tracking Card */}
        <Surface style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Live Route Tracking</Text>
          
          <View style={styles.timelineContainer}>
            {mockTimeline.map((stop, index) => {
              const isLast = index === mockTimeline.length - 1;
              const isPast = stop.status === 'past';
              const isCurrent = stop.status === 'current';
              
              return (
                <View key={stop.id} style={styles.timelineRow}>
                  {/* Timeline Graphic */}
                  <View style={styles.timelineGraphicCol}>
                    {isPast && <View style={styles.dotPast} />}
                    {isCurrent && (
                      <View style={[styles.dotCurrent, { backgroundColor: theme.colors.primary }]}>
                         <MaterialCommunityIcons name="bus" size={12} color="#FFFFFF" />
                      </View>
                    )}
                    {stop.status === 'upcoming' && <View style={styles.dotUpcoming} />}
                    {stop.status === 'destination' && (
                      <View style={styles.dotDestination}>
                         <View style={styles.dotDestinationInner} />
                      </View>
                    )}
                    
                    {!isLast && (
                       <View style={[
                         styles.timelineLine,
                         (isPast || isCurrent) ? styles.lineSolid : styles.lineSolidDark
                       ]} />
                    )}
                  </View>

                  {/* Stop Content */}
                  <View style={[styles.stopContentCol, isLast && { paddingBottom: 0 }]}>
                    
                    {isCurrent ? (
                      <View style={styles.currentStopCard}>
                        <View style={styles.currentStopHeaderRow}>
                          <Text style={styles.currentStopName}>{stop.stopName}</Text>
                          <View style={styles.arrivedBadge}>
                            <Text style={styles.arrivedBadgeText}>ARRIVED</Text>
                          </View>
                        </View>
                        <Text style={styles.currentStopSubtitle}>Arrival: {stop.estimatedTime} • Currently boarding</Text>
                      </View>
                    ) : (
                      <View style={styles.normalStopRow}>
                        <Text style={[
                          styles.normalStopName, 
                          isPast && styles.textPast,
                          stop.status === 'destination' && styles.textDestination
                        ]}>
                          {stop.stopName} {stop.status === 'destination' && <Text style={styles.destLabel}>(Dest)</Text>}
                        </Text>
                        
                        <View style={styles.timeCol}>
                          {stop.status === 'upcoming' || stop.status === 'destination' ? (
                            <>
                              <Text style={styles.relativeTimeText}>{stop.relativeTime}</Text>
                              <Text style={styles.absoluteTimeText}>{stop.estimatedTime}</Text>
                            </>
                          ) : (
                            <Text style={[styles.absoluteTimeText, isPast && styles.textPast]}>{stop.estimatedTime}</Text>
                          )}
                        </View>
                      </View>
                    )}

                  </View>
                </View>
              );
            })}
          </View>

          <Button 
            mode="outlined" 
            style={styles.fullRouteBtn}
            contentStyle={styles.fullRouteBtnContent}
            labelStyle={styles.fullRouteBtnLabel}
            onPress={() => {}}
          >
            View Full Route (12 Stops)
          </Button>
        </Surface>

        {/* Notify Me Card */}
        <Surface style={styles.notifyCard}>
          <View style={styles.notifyLeft}>
            <View style={styles.notifyIconBg}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#0F172A" />
            </View>
            <View style={styles.notifyTextCol}>
              <Text style={styles.notifyTitle}>Notify me</Text>
              {destination ? (
                <Text style={styles.notifySubtitle}>Alert when 5 mins away from {destination}</Text>
              ) : (
                <Text style={styles.notifySubtitle}>Set your destination to enable stop alerts</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F7FA',
  },
  appBarIconBtn: {
    padding: 8,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeSolid: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeSolidText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  badgeOutline: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  badgeOutlineText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  bannerIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerPrimaryText: {
    fontSize: 13,
    color: '#064E3B',
    marginBottom: 2,
  },
  bannerSecondaryText: {
    fontSize: 13,
    color: '#064E3B',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 24,
  },
  timelineContainer: {
    marginBottom: 20,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineGraphicCol: {
    width: 24,
    alignItems: 'center',
  },
  dotPast: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
    marginTop: 6,
  },
  dotCurrent: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotUpcoming: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0F172A',
    marginTop: 6,
    backgroundColor: '#FFFFFF',
  },
  dotDestination: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#0F172A',
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDestinationInner: {
    width: 4,
    height: 4,
    backgroundColor: '#0F172A',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  lineSolid: {
    backgroundColor: '#CBD5E1',
  },
  lineSolidDark: {
    backgroundColor: '#0F172A',
  },
  stopContentCol: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 24,
  },
  normalStopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 2, // align text with dot
  },
  normalStopName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    paddingRight: 8,
  },
  textPast: {
    color: '#94A3B8',
  },
  textDestination: {
    color: '#0F172A',
    fontWeight: '800',
  },
  destLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  timeCol: {
    alignItems: 'flex-end',
  },
  absoluteTimeText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  relativeTimeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  currentStopCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginTop: -8, // pull up slightly to align with larger dot
  },
  currentStopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  currentStopName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  arrivedBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  arrivedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  currentStopSubtitle: {
    fontSize: 13,
    color: '#475569',
  },
  fullRouteBtn: {
    borderRadius: 12,
    borderColor: '#0F172A',
  },
  fullRouteBtnContent: {
    paddingVertical: 6,
  },
  fullRouteBtnLabel: {
    color: '#0F172A',
    fontWeight: '700',
  },
  notifyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  notifyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  notifyIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifyTextCol: {
    flex: 1,
  },
  notifyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  notifySubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
});
