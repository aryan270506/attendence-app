import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
  ScrollView,  
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const SignupScreen = ({ navigation }) => {
  const [logo, setLogo] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.ScrollView}>
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/6560083.jpg')}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Register Your Company</Text>

            {/* Logo Upload */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Logo</Text>
              <TouchableOpacity style={styles.logoUpload} onPress={pickImage}>
                {logo ? (
                  <Image source={{ uri: logo }} style={styles.logo} />
                ) : (
                  <Text style={styles.logoText}>Upload Image</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Company Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your company name"
                placeholderTextColor="#666"
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>

            {/* Slogan */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Slogan</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your slogan"
                placeholderTextColor="#666"
                value={slogan}
                onChangeText={setSlogan}
              />
            </View>

            {/* Registration Date */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Registration Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#666"
                value={registrationDate}
                onChangeText={setRegistrationDate}
              />
            </View>

            {/* Email Address */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Contact Number */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Contact No.</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your contact number"
                placeholderTextColor="#666"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
              />
            </View>

            {/* Owner's Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Owner's Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter owner's name"
                placeholderTextColor="#666"
                value={ownerName}
                onChangeText={setOwnerName}
              />
            </View>

            {/* User ID */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>User ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your user ID"
                placeholderTextColor="#666"
                value={userId}
                onChangeText={setUserId}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.createButton}
            onPress={() => navigation.navigate('Login')}>
              <Text style={styles.createButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ScrollView: {
    flex: 1,
    backgroundColor: '#121212',
  },
  formContainer: {
    width: Platform.OS === 'web' ? 450 : '90%',
    backgroundColor: 'rgba(28, 28, 30, 0.3)',
    borderRadius: 16,
    padding: 40,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  inputWrapper: { marginBottom: 16 },
  label: { color: '#fff', marginBottom: 6, fontSize: 14 },
  input: {
    backgroundColor: 'rgba(30, 30, 30, 0)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordInput: { flex: 1, padding: 12, color: '#fff' },
  eyeIcon: { padding: 12 },
  logoUpload: {
    backgroundColor: 'rgba(30, 30, 30, 0)',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  logoText: { color: '#666' },
  logo: { width: 100, height: 100, borderRadius: 50 },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default SignupScreen;
