import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import SignupScreen from './screens/Signup-Page.js';
import LoginScreen from './screens/Login-Screen.js';
import AttendanceDashboard from './screens/attendance-dashboard.js';
import AttendanceSheet from './screens/Calender-Screen.js';
import TeacherDashboard from './screens/teacher-dashboard.js';
import EmployeesDashboard from './screens/Employees-Dashboard.js';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: {
              backgroundColor: '#000',
            },
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="AttendanceDashboard" component={AttendanceDashboard} />
          <Stack.Screen name="AttendanceSheet" component={AttendanceSheet} />
          <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
          <Stack.Screen name="EmployeesDashboard" component={EmployeesDashboard} />
          

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;


