import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useAppTheme, AppTheme } from '../../utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { MOCK_PLACES } from '../../data/mockPlaces';
import { useTranslation } from 'react-i18next';

type LocationPickerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocationPicker'>;

interface Props {
  navigation: LocationPickerScreenNavigationProp;
}

export default function LocationPickerScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filtered = MOCK_PLACES.filter(town => town.toLowerCase().includes(text.toLowerCase()));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLocation = (location: string) => {
    navigation.navigate('DestinationResults', { origin: location });
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
            <MaterialIcons name="my-location" size={80} color={theme.colors.primary} />
          </View>
          
          <Text style={styles.title}>
            {t('location.pickerTitle')}
          </Text>
          <Text style={styles.subtitle}>
            We'll show you buses near you in real time
          </Text>

          <Button 
            mode="contained" 
            onPress={() => handleSelectLocation('My Current Location')}
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.buttonContent}
            icon="crosshairs-gps"
          >
            {t('location.useCurrentLoc')}
          </Button>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Surface style={styles.searchContainer} >
            <MaterialIcons name="search" size={24} color={theme.colors.secondaryText} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('location.searchPlaceholder')}
              placeholderTextColor={theme.colors.secondaryText}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </Surface>

          {searchQuery.length > 0 && suggestions.length === 0 && (
            <Surface style={[styles.suggestionsContainer, { padding: 16 }]}>
              <Text style={{ color: theme.colors.secondaryText, textAlign: 'center' }}>No results found</Text>
            </Surface>
          )}

          {suggestions.length > 0 && (
            <Surface style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.suggestionItem} 
                    onPress={() => handleSelectLocation(item)}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = (theme: AppTheme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    color: theme.colors.secondaryText,
  },
  primaryButton: {
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outline,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: theme.colors.secondaryText,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {width:0, height:4},
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    color: theme.colors.text,
  },
  suggestionsContainer: {
    marginTop: 8,
    borderRadius: 16,
    maxHeight: 200,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width:0, height:6},
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.outline,
  }
});
