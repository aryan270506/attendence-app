import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Teacher credentials
const TEACHER_CREDENTIALS = [
  {
    email: 'john.smith@school.com',
    password: 'teacher123',
    name: 'John Smith'
  },
  {
    email: 'aryan',
    password: 'aryan',
    name: 'John Smith'
  },
  {
    email: 'sarah.jones@school.com',
    password: 'teacher456',
    name: 'Sarah Jones'
  },
  {
    email: 'mike.wilson@school.com',
    password: 'teacher789',
    name: 'Mike Wilson'
  },
  {
    email: 'emma.brown@school.com',
    password: 'teacher321',
    name: 'Emma Brown'
  },
  {
    email: 'david.miller@school.com',
    password: 'teacher654',
    name: 'David Miller'
  }
];

// Admin credentials
const ADMIN_CREDENTIALS = [
  {
    email: 'admin@company.com',
    password: 'admin123'
  },
  {
    email: 'supervisor@company.com',
    password: 'super123'
  },
  {
    email: 'manager@company.com',
    password: 'manager123'
  }
];

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const checkTeacherAuth = (email, password) => {
    return TEACHER_CREDENTIALS.some(
      teacher => teacher.email === email && teacher.password === password
    );
  };

  const checkAdminAuth = (email, password) => {
    return ADMIN_CREDENTIALS.some(
      admin => admin.email === email && admin.password === password
    );
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Check if it's a teacher login
    if (checkTeacherAuth(email, password)) {
      setError('');
      navigation.navigate('TeacherDashboard');
    } 
    // Check if it's an admin login
    else if (checkAdminAuth(email, password)) {
      setError('');
      navigation.navigate('AttendanceDashboard');
    } 
    // Invalid credentials
    else {
      setError('Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/6560083.jpg')}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.formContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Please sign in to continue</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>



            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword} 
              
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.loginButtonText}> Dont Have An Account? Sign up  </Text>
            </TouchableOpacity>

           
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: Platform.OS === 'web' ? 400 : '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Changed to black with some transparency
    color: 'black',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 12,
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  credentialsInfo: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  credentialsText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },

  credentialsInfo: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  credentialsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  credentialsHeader: {
    color: '#333',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  credentialsText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  // ... (rest of the previous styles)
});

export default LoginScreen;