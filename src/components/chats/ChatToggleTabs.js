import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ChatToggleTabs = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          activeTab === 'chats' && styles.activeToggle,
        ]}
        onPress={() => setActiveTab('chats')}
      >
        <Text style={[styles.toggleText, activeTab === 'chats' && styles.activeText]}>
          Chats
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          activeTab === 'groups' && styles.activeToggle,
        ]}
        onPress={() => setActiveTab('groups')}
      >
        <Text style={[styles.toggleText, activeTab === 'groups' && styles.activeText]}>
          Groups
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatToggleTabs;

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align to the left
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0', // Keep original
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 30,
    backgroundColor: '#e5e7eb',
    elevation: 2, // subtle shadow
  },
  toggleText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  activeToggle: {
    backgroundColor: '#2563eb',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
