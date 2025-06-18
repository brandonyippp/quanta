import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, List, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Wallet {
  id: string;
  name: string;
}

interface WalletSelectionModalProps {
  visible: boolean;
  onDismiss: () => void;
  wallets: Wallet[];
  onSelectWallet: (wallet: Wallet) => void;
  onAddWallet: () => void;
}

const WalletSelectionModal = ({
  visible,
  onDismiss,
  wallets,
  onSelectWallet,
  onAddWallet,
}: WalletSelectionModalProps) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onDismiss={onDismiss}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onDismiss}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Wallet</Text>
            </View>
            {wallets.map((wallet) => (
              <List.Item
                key={wallet.id}
                title={wallet.name}
                left={props => <List.Icon {...props} icon="wallet" />}
                onPress={() => onSelectWallet(wallet)}
                style={styles.walletItem}
              />
            ))}
            <List.Item
              title="Add Wallet"
              left={props => <List.Icon {...props} icon="plus" />}
              onPress={onAddWallet}
              style={styles.addWalletItem}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  walletItem: {
    paddingVertical: 12,
  },
  addWalletItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
});

export default WalletSelectionModal; 