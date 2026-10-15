import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTranslation } from 'react-i18next';
import { getStops, Stop } from '../../api/client';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';

type LocationPickerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocationPicker'>;

interface Props {
  navigation: LocationPickerScreenNavigationProp;
}

export default function LocationPickerScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStops = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await getStops(query.trim() || undefined);
      setStops(results);
    } catch (err: any) {
      setError(err?.message || 'Failed to load stops.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch of popular / default stops from DB
    searchStops('');
  }, [searchStops]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    searchStops(text);
  };

  const handleSelectLocation = (locationName: string) => {
    navigation.navigate('DestinationResults', { origin: locationName });
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
        </View>

        <View style={styles.content}>
          <View style={styles.heroContainer}>
            <MaterialIcons name="my-location" size={72} color={theme.colors.primary} />
          </View>
          
          <Text style={styles.title}>
            {t('location.pickerTitle')}
          </Text>
          <Text style={styles.subtitle}>
            Select your origin stop to view connecting buses in real time
          </Text>

          <Button 
            mode="contained" 
            onPress={() => {
              if (stops.length > 0) {
                handleSelectLocation(stops[0].name);
              } else {
                handleSelectLocation('My Current Location');
              }
            }}
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.buttonContent}
            icon="crosshairs-gps"
          >
            {t('location.useCurrentLoc')}
          </Button>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or select a registered stop</Text>
            <View style={styles.divider} />
          </View>

          <Surface style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color={theme.colors.secondaryText} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('location.searchPlaceholder')}
              placeholderTextColor={theme.colors.secondaryText}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <MaterialIcons name="close" size={20} color={theme.colors.secondaryText} />
              </TouchableOpacity>
            )}
          </Surface>

          {loading ? (
            <LoadingState message="Searching verified stops..." />
          ) : error ? (
            <ErrorState message={error} onRetry={() => searchStops(searchQuery)} />
          ) : stops.length === 0 ? (
            <EmptyState 
              icon="map-marker-question-outline"
              title="No stops found"
              description={searchQuery ? `No stops match "${searchQuery}" in the database.` : 'No stops registered in database.'}
            />
          ) : (
            <Surface style={styles.suggestionsContainer}>
              <FlatList
                data={stops}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.suggestionItem} 
                    onPress={() => handleSelectLocation(item.name)}
                  >
                    <View style={[styles.stopIconBg, { backgroundColor: theme.colors.surfaceVariant }]}>
                      <MaterialIcons name="directions-bus" size={20} color={theme.colors.primary} />
                    </View>
                    <View style={styles.stopTextCol}>
                      <Text style={styles.suggestionText}>{item.name}</Text>
                      <Text style={styles.stopCoordText}>GPS: {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </Surface>
          )}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16 },
  backButton: { padding: 8, marginLeft: -8 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  heroContainer: { alignItems: 'center', marginVertical: 12 },
  title: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 8, color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.secondaryText, textAlign: 'center', marginBottom: 20 },
  primaryButton: { borderRadius: 16, marginBottom: 16 },
  buttonContent: { height: 50 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  divider: { flex: 1, height: 1, backgroundColor: theme.colors.outline },
  dividerText: { marginHorizontal: 12, color: theme.colors.secondaryText, fontSize: 12, fontWeight: '600' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 16, height: 54, backgroundColor: theme.colors.surface, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: {width:0, height:4}, elevation: 2, marginBottom: 12 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, height: '100%', color: theme.colors.text },
  suggestionsContainer: { flex: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: theme.colors.surface, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: {width:0, height:4}, elevation: 3, marginBottom: 16 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  stopIconBg: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stopTextCol: { flex: 1 },
  suggestionText: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  stopCoordText: { fontSize: 12, color: theme.colors.secondaryText, marginTop: 2 },
  separator: { height: 1, backgroundColor: theme.colors.outline },
});
