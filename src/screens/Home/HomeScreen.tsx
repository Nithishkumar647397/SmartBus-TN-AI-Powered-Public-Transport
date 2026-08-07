import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, Avatar, IconButton, Chip, TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

export default function HomeScreen() {
  const dummyBuses = [
    { id: '1', route: 'TNSTC-101', dest: 'Karur', eta: '10 min', capacity: '23 seats', crowd: 'Moderate', status: 'On Time' },
    { id: '2', route: 'TNSTC-21G', dest: 'Broadway', eta: '2 min', capacity: '5 seats', crowd: 'High', status: 'Delayed' },
    { id: '3', route: 'TNSTC-570', dest: 'CMBT', eta: '18 min', capacity: '45 seats', crowd: 'Low', status: 'On Time' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning, Nithish 👋</Text>
            <Text style={styles.subtitle}>Find your next bus in seconds</Text>
          </View>
          <View style={styles.headerIcons}>
            <IconButton icon="bell-outline" size={24} iconColor={theme.colors.text} />
            <Avatar.Image size={40} source={{ uri: 'https://i.pravatar.cc/100' }} />
          </View>
        </View>

        {/* Search Card */}
        <Card style={styles.searchCard} elevation={2}>
          <Card.Content>
            <View style={styles.inputRow}>
              <MaterialIcons name="my-location" size={24} color={theme.colors.primary} style={styles.inputIcon} />
              <TextInput mode="outlined" placeholder="From" style={styles.searchInput} dense outlineColor="transparent" activeOutlineColor={theme.colors.primary} />
            </View>
            
            <View style={styles.swapContainer}>
              <IconButton icon="swap-vertical" size={20} style={styles.swapButton} iconColor={theme.colors.primary} mode="contained-tonal" />
            </View>

            <View style={styles.inputRow}>
              <MaterialIcons name="location-on" size={24} color={theme.colors.error} style={styles.inputIcon} />
              <TextInput mode="outlined" placeholder="To" style={styles.searchInput} dense outlineColor="transparent" activeOutlineColor={theme.colors.primary} />
            </View>

            <Button mode="contained" style={styles.searchBtn} contentStyle={{ paddingVertical: 8 }}>
              Search Buses
            </Button>
          </Card.Content>
        </Card>

        {/* Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
          {['Nearby', 'Favorites', 'Recent', 'AI Recommended'].map((label, i) => (
            <Chip key={i} style={styles.chip} selected={i === 0} mode="outlined">
              {label}
            </Chip>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
           <ActionCard icon="bus-clock" title="Live Tracking" color="#E3F2FD" iconColor="#1565C0" />
           <ActionCard icon="map-marker-radius" title="Nearby Stops" color="#FCE4EC" iconColor="#C2185B" />
           <ActionCard icon="star-circle" title="Favourite Routes" color="#FFF3E0" iconColor="#E65100" />
           <ActionCard icon="robot-outline" title="AI Suggestions" color="#E8F5E9" iconColor="#2E7D32" />
        </View>

        {/* Featured Section */}
        <Text style={styles.sectionTitle}>Upcoming Buses</Text>
        {dummyBuses.map((bus) => (
          <Card key={bus.id} style={styles.busCard} elevation={1}>
            <Card.Content style={styles.busCardContent}>
              <View style={styles.busIconBadge}>
                 <MaterialIcons name="directions-bus" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.busInfo}>
                <Text style={styles.busRoute}>{bus.route} - {bus.dest}</Text>
                <Text style={styles.busDetails}>ETA: {bus.eta} • {bus.status}</Text>
                <Text style={styles.busDetails}>{bus.capacity} • {bus.crowd} Crowd</Text>
              </View>
            </Card.Content>
          </Card>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({ icon, title, color, iconColor }: any) {
  return (
    <TouchableOpacity style={[styles.actionCard, { backgroundColor: color }]}>
       <IconButton icon={icon} size={28} iconColor={iconColor} />
       <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scrollContainer: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.secondaryText, marginTop: 4 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  searchCard: { backgroundColor: theme.colors.surface, borderRadius: 16, marginBottom: 24 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputIcon: { marginRight: 12 },
  searchInput: { flex: 1, backgroundColor: theme.colors.background },
  swapContainer: { alignItems: 'flex-end', paddingRight: 16, marginVertical: -10, zIndex: 1 },
  swapButton: { backgroundColor: '#E3F2FD' },
  searchBtn: { marginTop: 16, borderRadius: 12 },
  chipsContainer: { marginBottom: 24, flexDirection: 'row' },
  chip: { marginRight: 8, backgroundColor: theme.colors.surface },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  actionCard: { width: '48%', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  actionTitle: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: theme.colors.text },
  busCard: { marginBottom: 12, backgroundColor: theme.colors.surface, borderRadius: 12 },
  busCardContent: { flexDirection: 'row', alignItems: 'center' },
  busIconBadge: { backgroundColor: '#E3F2FD', padding: 12, borderRadius: 12, marginRight: 16 },
  busInfo: { flex: 1 },
  busRoute: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
  busDetails: { fontSize: 13, color: theme.colors.secondaryText, marginTop: 4 },
});
