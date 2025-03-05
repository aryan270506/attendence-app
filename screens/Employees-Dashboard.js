import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from 'react-native-web';
import { Users, Edit, Trash, Plus, ArrowLeft } from 'lucide-react'; // Import ArrowLeft
import { useNavigation } from '@react-navigation/native';

const EmployeesDashboard = () => {
  const [showEmployeesList, setShowEmployeesList] = useState(true);
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', department: 'Engineering', role: 'Frontend Developer', present: true },
    { id: 2, name: 'Jane Smith', department: 'Design', role: 'UI Designer', present: false },
    { id: 3, name: 'Mike Johnson', department: 'Marketing', role: 'Marketing Manager', present: true },
    { id: 4, name: 'Sarah Williams', department: 'HR', role: 'HR Manager', present: false },
  ]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ name: '', department: '', role: '' });
  const [viewMode, setViewMode] = useState('all'); // 'all', 'present', 'absent'

  const navigation = useNavigation();

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
        present: true // Default to present when adding a new employee
      };
      setEmployees([...employees, newEmployeeWithId]);
      setAddModalVisible(false);
      setNewEmployee({ name: '', department: '', role: '' });
    }
  };

  const toggleAttendance = (employeeId) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId ? { ...emp, present: !emp.present } : emp
    ));
  };

  const EditEmployeeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isEditModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Employee</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={selectedEmployee?.name}
            onChangeText={(text) => setSelectedEmployee(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Department"
            value={selectedEmployee?.department}
            onChangeText={(text) => setSelectedEmployee(prev => ({ ...prev, department: text }))}
          />
          <TextInput
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
      animationType="slide"
      transparent={true}
      visible={isAddModalVisible}
      onRequestClose={() => setAddModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Employee</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newEmployee.name}
            onChangeText={(text) => setNewEmployee(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Department"
            value={newEmployee.department}
            onChangeText={(text) => setNewEmployee(prev => ({ ...prev, department: text }))}
          />
          <TextInput
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

  const EmployeesListView = ({ employees }) => (
    <View style={styles.employeesContainer}>
      <View style={styles.employeesList}>
        <View style={styles.employeeHeader}>
          <Text style={styles.columnHeader}>Name</Text>
          <Text style={styles.columnHeader}>Department</Text>
          <Text style={styles.columnHeader}>Role</Text>
          <Text style={styles.columnHeader}>Actions</Text>
        </View>
        
        {employees.map((employee) => (
          <View key={employee.id} style={styles.employeeRow}>
            <Text style={styles.employeeCell}>{employee.name}</Text>
            <Text style={styles.employeeCell}>{employee.department}</Text>
            <Text style={styles.employeeCell}>{employee.role}</Text>
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
              <TouchableOpacity 
                style={[styles.actionButton, employee.present ? styles.absentButton : styles.presentButton]}
                onPress={() => toggleAttendance(employee.id)}
              >
                <Text style={styles.attendanceButtonText}>
                  {employee.present ? 'Mark Absent' : 'Mark Present'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const PresentEmployeesView = () => {
    const presentEmployees = employees.filter(emp => emp.present);
    return <EmployeesListView employees={presentEmployees} />;
  };

  const AbsentEmployeesView = () => {
    const absentEmployees = employees.filter(emp => !emp.present);
    return <EmployeesListView employees={absentEmployees} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()} // Navigate back to the previous screen
          >
            <ArrowLeft size={24} color="#4475F2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employees Dashboard</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddEmployee}
          >
            <Plus size={16} color="#4475F2" />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleButtons}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'all' && styles.activeToggleButton]}
            onPress={() => setViewMode('all')}
          >
            <Text style={styles.toggleButtonText}>All Employees</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'present' && styles.activeToggleButton]}
            onPress={() => setViewMode('present')}
          >
            <Text style={styles.toggleButtonText}>Present Employees</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'absent' && styles.activeToggleButton]}
            onPress={() => setViewMode('absent')}
          >
            <Text style={styles.toggleButtonText}>Absent Employees</Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'all' && <EmployeesListView employees={employees} />}
        {viewMode === 'present' && <PresentEmployeesView />}
        {viewMode === 'absent' && <AbsentEmployeesView />}
      </View>
      <EditEmployeeModal />
      <AddEmployeeModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB'
  },
  mainContent: {
    flex: 1,
    padding: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333'
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EBF0FF'
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EBF0FF'
  },
  employeesContainer: {
    flex: 1
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
  presentButton: {
    backgroundColor: '#E5FFE5'
  },
  absentButton: {
    backgroundColor: '#FFE5E5'
  },
  attendanceButtonText: {
    fontSize: 12,
    color: '#333'
  },
  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EBF0FF',
    alignItems: 'center',
    marginHorizontal: 4
  },
  activeToggleButton: {
    backgroundColor: '#4475F2'
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#333'
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
  }
});

export default EmployeesDashboard;