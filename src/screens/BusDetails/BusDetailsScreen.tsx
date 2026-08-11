import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Surface, Switch, Button } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';

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
  const styles = useStyles(theme);
  const { t } = useTranslation();
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.appBarIconBtn}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>{t('busDetails.title')}</Text>
        <TouchableOpacity style={styles.appBarIconBtn} onPress={() => {}}>
          <MaterialCommunityIcons name="share-variant-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Card */}
        <Surface style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.badgesLeft}>
              <View style={styles.badgeSolid}>
                <Text style={styles.badgeSolidText}>101 TNSTC</Text>
              </View>
              <View style={styles.badgeOutline}>
                <Text style={styles.badgeOutlineText}>{getServiceBadgeText()}</Text>
              </View>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusPillText}>On Time</Text>
            </View>
          </View>
          
          <Text style={styles.routeTitle}>Tiruppur to Karur</Text>

          <View style={styles.infoBanner}>
            <MaterialCommunityIcons name="star-four-points-outline" size={20} color={theme.colors.success} style={styles.bannerIcon} />
            <View style={styles.bannerTextCol}>
              <Text style={styles.bannerPrimaryText}>{t('busDetails.estCapacity')}<Text style={{fontWeight: '700'}}>23 {t('busDetails.seats')}</Text></Text>
              <Text style={styles.bannerSecondaryText}>{t('busDetails.crowd')}<Text style={{fontWeight: '700'}}>Moderate</Text></Text>
            </View>
          </View>
        </Surface>

        {/* Live Route Tracking Card */}
        <Surface style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>{t('busDetails.liveTracking')}</Text>
          
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
                            <Text style={styles.arrivedBadgeText}>{t('busDetails.arrived')}</Text>
                          </View>
                        </View>
                        <Text style={styles.currentStopSubtitle}>{t('busDetails.arrival')} {stop.estimatedTime} • {t('busDetails.currentlyBoarding')}</Text>
                      </View>
                    ) : (
                      <View style={styles.normalStopRow}>
                        <Text style={[
                          styles.normalStopName, 
                          isPast && styles.textPast,
                          stop.status === 'destination' && styles.textDestination
                        ]}>
                          {stop.stopName} {stop.status === 'destination' && <Text style={styles.destLabel}>{t('busDetails.dest')}</Text>}
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
            {t('busDetails.viewFullRoute')}
          </Button>
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
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: theme.colors.background },
  appBarIconBtn: { padding: 8 },
  appBarTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  headerCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgesLeft: { flexDirection: 'row', alignItems: 'center' },
  badgeSolid: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8, backgroundColor: theme.colors.primary },
  badgeSolidText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  badgeOutline: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: theme.colors.outline },
  badgeOutlineText: { color: theme.colors.secondaryText, fontSize: 11, fontWeight: '700' },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: theme.colors.success + '20' }, // faint success
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4, backgroundColor: theme.colors.success },
  statusPillText: { fontSize: 11, fontWeight: '700', color: theme.colors.success },
  routeTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.text, marginBottom: 16 },
  infoBanner: { flexDirection: 'row', backgroundColor: theme.colors.success + '10', borderWidth: 1, borderColor: theme.colors.success + '30', borderRadius: 12, padding: 12, alignItems: 'flex-start' },
  bannerIcon: { marginRight: 10, marginTop: 2 },
  bannerTextCol: { flex: 1 },
  bannerPrimaryText: { fontSize: 13, color: theme.colors.text, marginBottom: 2 },
  bannerSecondaryText: { fontSize: 13, color: theme.colors.text },
  timelineCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  timelineTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 24 },
  timelineContainer: { marginBottom: 20 },
  timelineRow: { flexDirection: 'row' },
  timelineGraphicCol: { width: 24, alignItems: 'center' },
  dotPast: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.outline, marginTop: 6 },
  dotCurrent: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dotUpcoming: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: theme.colors.text, marginTop: 6, backgroundColor: theme.colors.surface },
  dotDestination: { width: 14, height: 14, borderWidth: 2, borderColor: theme.colors.text, marginTop: 6, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center' },
  dotDestinationInner: { width: 4, height: 4, backgroundColor: theme.colors.text },
  timelineLine: { width: 2, flex: 1, marginVertical: 4 },
  lineSolid: { backgroundColor: theme.colors.outline },
  lineSolidDark: { backgroundColor: theme.colors.text },
  stopContentCol: { flex: 1, paddingLeft: 16, paddingBottom: 24 },
  normalStopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 2 },
  normalStopName: { fontSize: 15, fontWeight: '600', color: theme.colors.text, flex: 1, paddingRight: 8 },
  textPast: { color: theme.colors.secondaryText },
  textDestination: { color: theme.colors.text, fontWeight: '800' },
  destLabel: { fontSize: 12, color: theme.colors.secondaryText, fontWeight: '500' },
  timeCol: { alignItems: 'flex-end' },
  absoluteTimeText: { fontSize: 13, color: theme.colors.secondaryText, fontWeight: '500' },
  relativeTimeText: { fontSize: 14, fontWeight: '800', color: theme.colors.text, marginBottom: 2 },
  currentStopCard: { backgroundColor: theme.colors.surfaceVariant, borderWidth: 1, borderColor: theme.colors.outline, borderRadius: 12, padding: 12, marginTop: -8 },
  currentStopHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  currentStopName: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  arrivedBadge: { backgroundColor: theme.colors.primary + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  arrivedBadgeText: { fontSize: 10, fontWeight: '800', color: theme.colors.primary },
  currentStopSubtitle: { fontSize: 13, color: theme.colors.text },
  fullRouteBtn: { borderRadius: 12, borderColor: theme.colors.text },
  fullRouteBtnContent: { paddingVertical: 6 },
  fullRouteBtnLabel: { color: theme.colors.text, fontWeight: '700' },
  notifyCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  notifyLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 16 },
  notifyIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  notifyTextCol: { flex: 1 },
  notifyTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  notifySubtitle: { fontSize: 13, color: theme.colors.secondaryText, lineHeight: 18 },
});
