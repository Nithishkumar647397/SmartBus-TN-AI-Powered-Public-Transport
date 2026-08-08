import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar } from 'react-native-paper';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [activeChip, setActiveChip] = useState('Nearby');
  const chips = ['Nearby', 'Favorites', 'Recent', 'AI Suggested'];
  
  // Animation value for soft glowing background orb
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();
  }, []);

  const dummyBuses = [
    { id: '1', route: '101A', dest: 'Karur', eta: '5m', capacity: '23', crowd: 'Mod', crowdColor: '#F59E0B', status: 'On Time', gradient: ['#FF758C', '#FF7EB3'] },
    { id: '2', route: '21G', dest: 'Broadway', eta: '2m', capacity: '5', crowd: 'High', crowdColor: '#EF4444', status: 'Delayed', gradient: ['#A18CD1', '#FBC2EB'] },
    { id: '3', route: '570', dest: 'CMBT', eta: '18m', capacity: '45', crowd: 'Low', crowdColor: '#10B981', status: 'On Time', gradient: ['#84FAB0', '#8FD3F4'] },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* Soft Pastel Animated Background Orbs */}
      <Animated.View style={[styles.glowOrb, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient colors={['rgba(99, 102, 241, 0.15)', 'rgba(99, 102, 241, 0)']} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[styles.glowOrb2, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient colors={['rgba(236, 72, 153, 0.12)', 'rgba(236, 72, 153, 0)']} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[styles.glowOrb3, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient colors={['rgba(56, 189, 248, 0.15)', 'rgba(56, 189, 248, 0)']} style={StyleSheet.absoluteFill} />
      </Animated.View>

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
                <BlurView intensity={30} tint="light" style={styles.glassInner}>
                  <Ionicons name="notifications-outline" size={24} color="#334155" />
                  <View style={styles.neonBadge} />
                </BlurView>
              </TouchableOpacity>
              <Avatar.Image size={48} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
            </View>
          </View>
        </SafeAreaView>

        {/* Airy Glassmorphism Search Card */}
        <View style={styles.searchCardContainer}>
          <BlurView intensity={60} tint="light" style={styles.searchGlassCard}>
            <View style={styles.inputContainer}>
               <View style={styles.inputRow}>
                 <MaterialCommunityIcons name="target-account" size={24} color="#3B82F6" style={styles.inputIcon} />
                 <Text style={styles.inputTextPlaceholder}>Current Location</Text>
               </View>
               
               <View style={styles.dividerContainer}>
                 <View style={styles.verticalDashedLine} />
                 <TouchableOpacity style={styles.swapButtonWrapper} activeOpacity={0.7}>
                    <LinearGradient colors={['#DBEAFE', '#EFF6FF']} style={styles.swapGradient}>
                      <MaterialIcons name="swap-vert" size={22} color="#2563EB" />
                    </LinearGradient>
                 </TouchableOpacity>
               </View>

               <View style={styles.inputRow}>
                 <MaterialCommunityIcons name="map-marker-radius" size={24} color="#F43F5E" style={styles.inputIcon} />
                 <Text style={styles.inputTextPlaceholder}>Where to?</Text>
               </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} style={styles.searchBtnShadow}>
              <LinearGradient colors={['#3B82F6', '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.searchBtnGradient}>
                <Text style={styles.searchBtnText}>Find Smart Buses</Text>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Floating Active Chips */}
        <View style={styles.sectionContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {chips.map((label, i) => {
              const isActive = activeChip === label;
              return (
                <TouchableOpacity key={i} onPress={() => setActiveChip(label)} activeOpacity={0.8} style={{marginRight: 12}}>
                  {isActive ? (
                    <LinearGradient colors={['#3B82F6', '#2563EB']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.chipActive}>
                      <Text style={styles.chipTextActive}>{label}</Text>
                    </LinearGradient>
                  ) : (
                    <BlurView intensity={40} tint="light" style={styles.chipInactive}>
                      <Text style={styles.chipTextInactive}>{label}</Text>
                    </BlurView>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Airy Holographic Quick Actions */}
        <View style={[styles.sectionContainer, styles.quickActionsGrid]}>
           <HoloActionCard icon="radar" title="Live Radar" colors={['#60A5FA', '#3B82F6']} iconColor="#FFFFFF" />
           <HoloActionCard icon="map-marker-path" title="Nearby" colors={['#F472B6', '#EC4899']} iconColor="#FFFFFF" />
           <HoloActionCard icon="star-shooting" title="Favs" colors={['#A78BFA', '#8B5CF6']} iconColor="#FFFFFF" />
           <HoloActionCard icon="robot-outline" title="AI Magic" colors={['#34D399', '#10B981']} iconColor="#FFFFFF" />
        </View>

        {/* Upcoming Buses (Light Floating Tickets) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Live Feed <View style={styles.liveDot} /></Text>
          
          {dummyBuses.map((bus) => (
            <BlurView intensity={80} tint="light" style={styles.busCard} key={bus.id}>
              <View style={styles.busCardLeft}>
                <LinearGradient colors={bus.gradient as [string, string]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.routeTagGradient}>
                  <Text style={styles.routeTagText}>{bus.route}</Text>
                </LinearGradient>
                <View style={styles.busCardDetails}>
                  <Text style={styles.destTextBold}>{bus.dest}</Text>
                  <Text style={styles.statusText}>{bus.status}</Text>
                </View>
              </View>

              <View style={styles.busCardRight}>
                <Text style={styles.etaText}>{bus.eta}</Text>
                <View style={styles.miniStatsRow}>
                  <MaterialCommunityIcons name="seat-passenger" size={15} color="#64748B" />
                  <Text style={styles.miniStatText}>{bus.capacity}</Text>
                  <View style={[styles.crowdIndicator, { backgroundColor: bus.crowdColor }]} />
                </View>
              </View>
            </BlurView>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

function HoloActionCard({ icon, title, colors, iconColor }: any) {
  return (
    <TouchableOpacity style={styles.holoActionCard} activeOpacity={0.7}>
       <BlurView intensity={50} tint="light" style={styles.holoBlur}>
         <LinearGradient colors={colors} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.holoIconBg}>
           <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
         </LinearGradient>
         <Text style={styles.holoActionTitle}>{title}</Text>
       </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' }, // Light airy background
  scrollContainer: { paddingBottom: 60 },
  
  glowOrb: { position: 'absolute', top: -50, right: -50, width: 350, height: 350, borderRadius: 175 },
  glowOrb2: { position: 'absolute', top: 250, left: -100, width: 300, height: 300, borderRadius: 150 },
  glowOrb3: { position: 'absolute', bottom: -50, right: -80, width: 250, height: 250, borderRadius: 125 },
  
  headerArea: { zIndex: 10 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 },
  greeting: { fontSize: 16, color: '#64748B', fontWeight: '600', marginBottom: 2 },
  userName: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -1 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconGlassBtn: { borderRadius: 24, overflow: 'hidden', marginRight: 16, borderColor: 'rgba(255,255,255,0.6)', borderWidth: 1.5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: {width:0, height:4} },
  glassInner: { padding: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.4)' },
  neonBadge: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#FFFFFF' },
  avatar: { borderWidth: 3, borderColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  
  searchCardContainer: { paddingHorizontal: 20, marginTop: 32, zIndex: 10 },
  searchGlassCard: { borderRadius: 32, padding: 24, overflow: 'hidden', borderColor: 'rgba(255,255,255,0.8)', borderWidth: 1.5, backgroundColor: 'rgba(255,255,255,0.5)', shadowColor: '#94A3B8', shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: {width:0, height:10} },
  inputContainer: { marginBottom: 24 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  inputIcon: { marginRight: 16 },
  inputTextPlaceholder: { fontSize: 17, color: '#64748B', fontWeight: '600', flex: 1 },
  dividerContainer: { height: 32, marginLeft: 11, position: 'relative', justifyContent: 'center' },
  verticalDashedLine: { position: 'absolute', left: 0, top: -8, bottom: -8, width: 2, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#CBD5E1' },
  swapButtonWrapper: { position: 'absolute', right: 0, zIndex: 10 },
  swapGradient: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#3B82F6', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: {width:0,height:4}, borderWidth: 2, borderColor: '#FFFFFF' },
  
  searchBtnShadow: { shadowColor: '#2563EB', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: {width:0,height:8}, elevation: 8 },
  searchBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 20 },
  searchBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.5, marginRight: 8 },
  
  sectionContainer: { marginTop: 36, paddingHorizontal: 20 },
  chipsScroll: { paddingRight: 20, overflow: 'visible', paddingBottom: 8 },
  chipActive: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset:{width:0, height:4} },
  chipInactive: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30, borderColor: '#E2E8F0', borderWidth: 1, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.6)' },
  chipTextActive: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  chipTextInactive: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  holoActionCard: { width: (width - 40) / 4 - 8 },
  holoBlur: { borderRadius: 24, padding: 12, alignItems: 'center', borderColor: 'rgba(255,255,255,0.8)', borderWidth: 1.5, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.5)', shadowColor: '#94A3B8', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: {width:0, height:4} },
  holoIconBg: { width: 48, height: 48, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset:{width:0,height:3} },
  holoActionTitle: { fontSize: 11, fontWeight: '800', color: '#334155', textAlign: 'center' },
  
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', marginLeft: 8, shadowColor: '#EF4444', shadowOpacity: 0.6, shadowRadius: 6, shadowOffset:{width:0, height:0} },
  
  busCard: { borderRadius: 24, padding: 16, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: 'rgba(255,255,255,0.8)', borderWidth: 1.5, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.6)', shadowColor: '#94A3B8', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: {width:0,height:6} },
  busCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  routeTagGradient: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16, marginRight: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset:{width:0,height:2} },
  routeTagText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.1)', textShadowRadius: 2, textShadowOffset:{width:0,height:1} },
  busCardDetails: { flex: 1 },
  destTextBold: { color: '#0F172A', fontWeight: '800', fontSize: 16, marginBottom: 4 },
  statusText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  
  busCardRight: { alignItems: 'flex-end' },
  etaText: { fontSize: 24, fontWeight: '900', color: '#3B82F6', marginBottom: 6 },
  miniStatsRow: { flexDirection: 'row', alignItems: 'center' },
  miniStatText: { fontSize: 13, fontWeight: '700', color: '#64748B', marginLeft: 4, marginRight: 8 },
  crowdIndicator: { width: 8, height: 8, borderRadius: 4 },
});
