import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Button, Platform } from 'react-native-web';
import { BarChart, LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Calendar, Users, Home, User, LogOut, Clock, Edit, Trash, Plus } from 'lucide-react';
import { useNavigation } from '@react-navigation/native';

// LiveClock Component
const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <View style={styles.clockContainer}>
      
      <Text style={styles.clockText}>{formattedTime}</Text>
    </View>
  );
};

const AttendanceDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', department: 'Engineering', role: 'Frontend Developer', attendance: 92 },
    { id: 2, name: 'Jane Smith', department: 'Design', role: 'UI Designer', attendance: 88 },
    { id: 3, name: 'Mike Johnson', department: 'Marketing', role: 'Marketing Manager', attendance: 95 },
    { id: 4, name: 'Sarah Williams', department: 'HR', role: 'HR Manager', attendance: 85 },
  ]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState(Date.now());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ name: '', department: '', role: '' });

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the current year and month
  const currentDatee = new Date();
  const currentYear = currentDatee.getFullYear();
  const currentMonth = currentDatee.getMonth(); // Months are 0-indexed (0 = January)

  // Generate monthlyLabels dynamically based on the number of days in the current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const monthlyLabels = Array.from({ length: daysInMonth }, (_, i) => ` ${i + 1}`);

  const navigation = useNavigation();

  useEffect(() => {
    if (isEditModalVisible || isAddModalVisible) {
      setModalKey(Date.now());
    }
  }, [isEditModalVisible, isAddModalVisible]);

  const attendanceData = [
    { day: 'Mon', onTime: 80, late: 20 },
    { day: 'Tue', onTime: 90, late: 10 },
    { day: 'Wed', onTime: 85, late: 15 },
    { day: 'Thu', onTime: 95, late: 5 },
    { day: 'Fri', onTime: 88, late: 12 },
    { day: 'Sat', onTime: 50, late: 0 },
    { day: 'Sun', onTime: 60, late: 0 },
  ];

  const onTimeData = attendanceData.map((item) => item.onTime);
  const lateData = attendanceData.map((item) => item.late);
  const labels = attendanceData.map((item) => item.day);

  console.log('onTimeData:', onTimeData); // Should log: [80, 90, 85, 95, 88, 50, 60]
console.log('lateData:', lateData); // Should log: [20, 10, 15, 5, 12, 0, 0]
console.log('labels:', labels); // Should log: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  const monthlyData = [
    85, 88, 90, 87, 92, 89, 86, 90, 88, 91, 87, 89, 90, 88, 92, 90, 89, 87, 88, 90, 91, 89, 88, 90, 87, 89, 90, 88, 89, 91
  ];

  const handleEditEmployee = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setSelectedEmployee(employee);
    setEditModalVisible(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
  };

  const handleAddEmployee = () => {
    setAddModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (selectedEmployee?.name && selectedEmployee?.department && selectedEmployee?.role) {
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id ? selectedEmployee : emp
      ));
      setEditModalVisible(false);
      setSelectedEmployee(null);
    }
  };

  const handleSaveAdd = () => {
    if (newEmployee.name && newEmployee.department && newEmployee.role) {
      const newEmployeeWithId = { 
        ...newEmployee, 
        id: employees.length + 1, 
        attendance: 0 
      };
      setEmployees([...employees, newEmployeeWithId]);
      setAddModalVisible(false);
      setNewEmployee({ name: '', department: '', role: '' });
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 80) return '#FFC107';
    return '#FF5722';
  };

  const EditEmployeeModal = () => (
    <Modal
      key={`edit-modal-${modalKey}`}
      animationType="slide"
      transparent={true}
      visible={isEditModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Employee</Text>
          <TextInput
            key="nameInput"
            style={styles.input}
            placeholder="Name"
            value={selectedEmployee?.name}
            onChangeText={(text) => setSelectedEmployee(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            key="deptInput"
            style={styles.input}
            placeholder="Department"
            value={selectedEmployee?.department}
            onChangeText={(text) => setSelectedEmployee(prev => ({ ...prev, department: text }))}
          />
          <TextInput
            key="roleInput"
            style={styles.input}
            placeholder="Role"
            value={selectedEmployee?.role}
            onChangeText={(text) => setSelectedEmployee(prev => ({ ...prev, role: text }))}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
            <Button title="Save" onPress={handleSaveEdit} />
          </View>
        </View>
      </View>
    </Modal>
  );
  
  const AddEmployeeModal = () => (
    <Modal
      key={`add-modal-${modalKey}`}
      animationType="slide"
      transparent={true}
      visible={isAddModalVisible}
      onRequestClose={() => setAddModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Employee</Text>
          <TextInput
            key="newNameInput"
            style={styles.input}
            placeholder="Name"
            value={newEmployee.name}
            onChangeText={(text) => setNewEmployee(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            key="newDeptInput"
            style={styles.input}
            placeholder="Department"
            value={newEmployee.department}
            onChangeText={(text) => setNewEmployee(prev => ({ ...prev, department: text }))}
          />
          <TextInput
            key="newRoleInput"
            style={styles.input}
            placeholder="Role"
            value={newEmployee.role}
            onChangeText={(text) => setNewEmployee(prev => ({ ...prev, role: text }))}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setAddModalVisible(false)} />
            <Button title="Save" onPress={handleSaveAdd} />
          </View>
        </View>
      </View>
    </Modal>
  );

  const UsersView = () => (
    <View style={styles.usersContainer}>
      <View style={styles.usersHeader}>
        <Text style={styles.headerTitle}>Employees</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddEmployee}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.employeesList}>
        <View style={styles.employeeHeader}>
          <Text style={styles.columnHeader}>Name</Text>
          <Text style={styles.columnHeader}>Department</Text>
          <Text style={styles.columnHeader}>Role</Text>
          <Text style={styles.columnHeader}>Attendance</Text>
          <Text style={styles.columnHeader}>Actions</Text>
        </View>
        
        {employees.map((employee) => (
          <View key={employee.id} style={styles.employeeRow}>
            <Text style={styles.employeeCell}>{employee.name}</Text>
            <Text style={styles.employeeCell}>{employee.department}</Text>
            <Text style={styles.employeeCell}>{employee.role}</Text>
            <View style={styles.employeeCell}>
              <View style={styles.attendanceContainer}>
                <View 
                  style={[
                    styles.attendanceBar, 
                    { 
                      width: `${employee.attendance}%`,
                      backgroundColor: getAttendanceColor(employee.attendance)
                    }
                  ]} 
                />
                <Text style={styles.attendanceText}>{employee.attendance}%</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEditEmployee(employee.id)}
              >
                <Edit size={16} color="#4475F2" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteEmployee(employee.id)}
              >
                <Trash size={16} color="#FF5C5C" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const DashboardView = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Dashboard</Text>
        <Text style={styles.date}>{currentDate} | 10:30 AM to 5:30 PM</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Total Employees</Text>
          <Text style={styles.statValue}>250</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Present Today</Text>
          <Text style={styles.statValue}>190</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Absent Today</Text>
          <Text style={styles.statValue}>40</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Recently Marked</Text>
          <Text style={styles.statValue}>Ranveer Kapoor</Text>
        </View>
      </View>


      <View style={styles.chartContainer}>
  <Text style={styles.chartTitle}>Weekly Attendance</Text>
  
  <View style={{ height: 250, flexDirection: 'row' }}>
    {/* YAxis for the BarChart */}
    <YAxis
      data={[0, 20, 40, 60, 80, 100]}// Use onTimeData or lateData for the scale
      contentInset={{ top: 20, bottom: 20 }}
      svg={{ fontSize: 12, fill: '#666' }}
      numberOfTicks={5} // Number of ticks on the y-axis
      formatLabel={(value) => `${value}%`} // Format the label as percentages
    />

    {/* BarChart */}
    <BarChart
      style={{ flex: 1, marginLeft: 10 }}
      data={[
        {
          data: onTimeData,
          svg: { fill: '#4475F2' }
        },
        {
          data: lateData,
          svg: { fill: '#FF5C5C' }
        }
      ]}
      yAccessor={({ item }) => item}
      contentInset={{ top: 20, bottom: 20 }}
      spacingInner={0.4} // Adjust spacing between bars
    >
      <Grid />
    </BarChart>
  </View>

  {/* XAxis */}
  <XAxis
    style={{ marginTop: 10 }}
    data={labels}
    formatLabel={(value, index) => labels[index]}
    contentInset={{ left: 30, right: 30 }} // Adjust contentInset to align labels with bars
    svg={{ fontSize: 12, fill: '#666' }}
  />

  {/* Legend */}
  <View style={styles.legendContainer}>
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: '#4475F2' }]} />
      <Text>On Time</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: '#FF5C5C' }]} />
      <Text>Late</Text>
    </View>
  </View>
</View>





<View style={styles.chartContainer}>
  <Text style={styles.chartTitle}>Monthly Attendance Trends</Text>
  
  <View style={{ height: 250, flexDirection: 'row' }}>
    {/* YAxis for the LineChart */}
    <YAxis
      data={[0, 20, 40, 60, 80, 100]}// Use onTimeData or lateData for the scale
      contentInset={{ top: 20, bottom: 20 }}
      svg={{ fontSize: 12, fill: '#666' }}
      numberOfTicks={5} // Number of ticks on the y-axis
      formatLabel={(value) => `${value}%`} // Format the label as percentages
    />

    {/* LineChart */}
    <LineChart
      style={{ flex: 1, marginLeft: 10 }}
      data={monthlyData}
      svg={{ stroke: '#4475F2', strokeWidth: 3 }}
      contentInset={{ top: 20, bottom: 20 }}
    >
      <Grid />
    </LineChart>
  </View>

  {/* XAxis for Monthly Data */}
  <XAxis
  style={{ marginTop: 10, height: 30 }}
  data={monthlyLabels}
  formatLabel={(value, index) => monthlyLabels[index]}
  contentInset={{ left: 30, right: 40 }}
  svg={{ 
    fontSize: 10,
    fill: '#666',
    y: 10,
    translateY: 10
  }}
  spacing={0.2}
  numberOfTicks={31}
/>

</View>


    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <TouchableOpacity 
          style={[styles.sidebarItem, activeView === 'dashboard' && styles.active]} 
          onPress={() => setActiveView('dashboard')}
        >
          <Home size={24} color={activeView === 'dashboard' ? "#4475F2" : "#666"} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sidebarItem, activeView === 'users' && styles.active]}
          onPress={() => setActiveView('users')}
        >
          <Users size={24} color={activeView === 'users' ? "#4475F2" : "#666"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <User size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sidebarItem, activeView === 'calendar' && styles.active]}
          onPress={() => navigation.navigate('AttendanceSheet')}
        >
          <Calendar size={24} color={activeView === 'calendar' ? "#4475F2" : "#666"} />
        </TouchableOpacity>

        <View style={styles.bottomSection}>
          <LiveClock />
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => navigation.navigate('Login')}
          >
            <LogOut size={24} color="#FF5C5C" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.mainContent}>
        {activeView === 'dashboard' ? <DashboardView /> : <UsersView />}
      </ScrollView>
      <EditEmployeeModal />
      <AddEmployeeModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8F9FB'
  },
  sidebar: {
    width: 80,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderRightWidth: 1,
    borderRightColor: '#EAEBEF'
  },
  sidebarItem: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
    borderRadius: 8
  },
  active: {
    backgroundColor: '#EBF0FF'
  },
  bottomSection: {
    marginTop: 'auto',
    alignItems: 'center'
  },
  mainContent: {
    flex: 1,
    padding: 24
  },
  header: {
    marginBottom: 24
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333'
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 8
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333'
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FB'
  },
  clockText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4475F2'
  },
  usersContainer: {
    flex: 1
  },
  usersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4475F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500'
  },
  employeesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  employeeHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEBEF',
    marginBottom: 12
  },
  columnHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEBEF'
  },
  employeeCell: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8
  },
  actionButton: {
    padding: 8,
    borderRadius: 6
  },
  editButton: {
    backgroundColor: '#EBF0FF'
  },
  deleteButton: {
    backgroundColor: '#FFE5E5'
  },
  attendanceContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative'
  },
  attendanceBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 10
  },
  attendanceText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333'
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#EAEBEF',
    borderRadius: 8,
    marginBottom: 16
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 20
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4
  }
  
});

export default AttendanceDashboard;
