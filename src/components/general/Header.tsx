import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../context/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = useNavigation();
  const { darkMode, toggleTheme } = useContext(ThemeContext); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogsHistory = () => {
    setIsMenuOpen(false);
    navigation.navigate('History');
  };

  return (
    <View style={[styles.header, { backgroundColor: darkMode ? '#222' : '#c2c' }]}>
      <TouchableOpacity onPress={toggleMenu}>
        <Icon name="menu" size={28} color={darkMode ? '#fff' : '#fff'} />
      </TouchableOpacity>

      <Text style={[styles.heading, { color: darkMode ? '#fff' : '#ccc' }]}>
        Health Flex
      </Text>

      <TouchableOpacity onPress={toggleTheme}>
        <Icon name={darkMode ? 'sunny' : 'moon'} size={26} color={darkMode ? '#fff' : '#fff'} />
      </TouchableOpacity>

      <Modal transparent visible={isMenuOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={closeMenu}>
          <View style={[styles.sidebar, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
            <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
              <Icon name="close" size={28} color={darkMode ? '#fff' : '#000'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogsHistory}>
              <Text style={[styles.menuText, { color: darkMode ? '#fff' : '#000' }]}>
                History
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    elevation: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  sidebar: {
    width: '70%',
    height: '100%',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 15,
  },
  heading: {
    fontSize: 22,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;
