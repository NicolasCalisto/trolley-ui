import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

interface CreateOrCopyModal {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (type: 'NEW' | 'DUPLICATE') => void;
}

export const CreateListModal: React.FC<CreateOrCopyModal> = ({
  visible,
  onClose,
  onSelectOption,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Clicar fora fecha o modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.indicator} />
              
              <Text style={styles.title}>Criar Nova Lista</Text>
              <Text style={styles.subtitle}>
                Como você deseja criar a lista?
              </Text>

              {/* Opção 1: Duplicar Última Compra */}
              <TouchableOpacity
                style={[styles.optionCard, styles.primaryCard]}
                activeOpacity={0.7}
                onPress={() => onSelectOption('DUPLICATE')}
              >
                <Text style={styles.icon}>
                  <FontAwesome5 name="history" size={20}/>
                </Text>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.primaryCardTitle}>
                    Copiar de uma lista existente
                  </Text>
                  <Text style={styles.primaryCardSub}>
                    Traz os itens de uma lista de compras.
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Opção 2: Do Zero */}
              <TouchableOpacity
                style={styles.optionCard}
                activeOpacity={0.7}
                onPress={() => onSelectOption('NEW')}
              >
                <Text style={styles.icon}>
                  <FontAwesome5 name="plus-circle" size={20}/>
                </Text>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Criar Lista em Branco</Text>
                  <Text style={styles.cardSub}>
                    Adicione itens manualmente do catálogo.
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Botão Cancelar */}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E2C', // Fundo escuro seguindo o padrão
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#44445A',
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0B0',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3C',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A3A50',

  },
  primaryCard: {
    borderColor: '#2ECC71', // Destaque em verde para a ação mais comum
    backgroundColor: '#1C2E2A',
  },
  icon: {
    marginRight: 16,
    color: '#F59E0B',
  },
  cardTextContainer: {
    flex: 1,
  },
  primaryCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00E676',
  },
  primaryCardSub: {
    fontSize: 12,
    color: '#B0BEC5',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardSub: {
    fontSize: 12,
    color: '#A0A0B0',
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
  },
  cancelText: {
    color: '#FF5252',
    fontSize: 15,
    fontWeight: '600',
  },
});