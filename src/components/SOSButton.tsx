import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Surface } from 'react-native-paper';

// TEMPORARY: SOS does not yet send real location data or contact emergency services. Wire to backend + real contacts before production.

interface SOSButtonProps {
  onSOSConfirmed: () => void;
}

export default function SOSButton({ onSOSConfirmed }: SOSButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    setModalVisible(false);
    onSOSConfirmed();
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.floatingButton} 
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="alert-octagon" size={28} color="#FFFFFF" />
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="alert-octagon-outline" size={32} color="#EF4444" />
              </View>
              <Text style={styles.modalTitle}>Emergency SOS</Text>
            </View>
            
            <Text style={styles.modalText}>
              Send SOS alert with your current location?
            </Text>
            
            <View style={styles.buttonRow}>
              <Button 
                mode="outlined" 
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
                textColor="#64748B"
                contentStyle={styles.btnContent}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleConfirm}
                style={styles.confirmBtn}
                buttonColor="#EF4444"
                contentStyle={styles.btnContent}
              >
                Send SOS
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    zIndex: 100,
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 12,
  },
  btnContent: {
    paddingVertical: 6,
  },
});
