import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable, SafeAreaView, Modal, TextInput, Alert } from 'react-native-web';
import { BarChart, LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Calendar, Users, Home, User, LogOut, Clock, Building, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigation } from '@react-navigation/native';

// Teacher credentials
const TEACHER_CREDENTIALS = {
  email: 'teacher@school.com',
  password: 'teacher123'
};

// Authentication check function
export const checkTeacherAuth = (email, password) => {
  return email === TEACHER_CREDENTIALS.email && password === TEACHER_CREDENTIALS.password;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get the current year and month
const currentDatee = new Date();
const currentYear = currentDatee.getFullYear();
const currentMonth = currentDatee.getMonth(); 

const daysInMonth = getDaysInMonth(currentYear, currentMonth);
const monthlyLabels = Array.from({ length: daysInMonth }, (_, i) => ` ${i + 1}`);

// LiveClock Component (reused from AttendanceDashboard)
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

const TeacherDashboard = () => {
  const [activeView, setActiveView] = useState('companies');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [newCompany, setNewCompany] = useState({
    name: '',
    totalEmployees: 0,
    absentToday: 0
  });
  

  // Sample companies data
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      totalEmployees: 150,
      absentToday: 12,
      attendanceData: [
        { day: 'Mon', onTime: 130, late: 8 },
        { day: 'Tue', onTime: 135, late: 5 },
        { day: 'Wed', onTime: 128, late: 10 },
        { day: 'Thu', onTime: 138, late: 4 },
        { day: 'Fri', onTime: 125, late: 15 },
        { day: 'Sat', onTime: 80, late: 5 },
        { day: 'Sun', onTime: 40, late: 2 },
      ],
      monthlyData: [85, 88, 90, 87, 92, 89, 86, 90, 88, 91, 87, 89, 90, 88, 92, 90, 89, 87, 88, 90, 91, 89, 88, 90, 87, 89, 90, 88, 89, 91]
    },
    // Add more companies as needed
  ]);

  const handleAddCompany = () => {
    const sampleAttendanceData = [
      { day: 'Mon', onTime: 0, late: 0 },
      { day: 'Tue', onTime: 0, late: 0 },
      { day: 'Wed', onTime: 0, late: 0 },
      { day: 'Thu', onTime: 0, late: 0 },
      { day: 'Fri', onTime: 0, late: 0 },
      { day: 'Sat', onTime: 0, late: 0 },
      { day: 'Sun', onTime: 0, late: 0 },
    ];
    const sampleMonthlyData = Array(30).fill(0);
    
    const newCompanyWithId = {
      ...newCompany,
      id: Date.now(), // Generate unique ID
      attendanceData: sampleAttendanceData,
      monthlyData: sampleMonthlyData
    };
    
    setCompanies([...companies, newCompanyWithId]);
    setNewCompany({ name: '', totalEmployees: 0, absentToday: 0 });
    setModalVisible(false);
  };

  const handleEditCompany = (company) => {
    setEditingCompany({...company});
    setModalVisible(true);
  };

  const saveEditedCompany = () => {
    setCompanies(companies.map(company => 
      company.id === editingCompany.id ? editingCompany : company
    ));
    setEditingCompany(null);
    setModalVisible(false);
  };

  const handleDeleteCompany = (company) => {
    setCompanyToDelete(company);
    setDeleteModalVisible(true);
  };
  
  const confirmDeleteCompany = () => {
    if (companyToDelete) {
      setCompanies(companies.filter(company => company.id !== companyToDelete.id));
      setCompanyToDelete(null);
      setDeleteModalVisible(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  const generateDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      dates.push(currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
    }
    return dates;
  };

  const [students] = useState([
    { 
      name: 'John Doe', 
      attendance: Array(31).fill('') 
    },
    { 
      name: 'Jane Smith', 
      attendance: Array(31).fill('')
    },
    { 
      name: 'Mike Johnson', 
      attendance: Array(31).fill('')
    }
  ]);

  const dates = generateDates();

  const CompanyModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        setEditingCompany(null);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingCompany ? 'Edit Company' : 'Add New Company'}
          </Text>
          
          <Text style={styles.inputLabel}>Company Name</Text>
          <TextInput 
            style={styles.input}
            value={editingCompany ? editingCompany.name : newCompany.name}
            onChangeText={(text) => 
              editingCompany 
                ? setEditingCompany({...editingCompany, name: text}) 
                : setNewCompany({...newCompany, name: text})
            }
            placeholder="Enter company name"
          />
          
          <Text style={styles.inputLabel}>Total Employees</Text>
          <TextInput 
            style={styles.input}
            value={editingCompany 
              ? editingCompany.totalEmployees.toString() 
              : newCompany.totalEmployees.toString()}
            onChangeText={(text) => {
              const numValue = parseInt(text) || 0;
              editingCompany 
                ? setEditingCompany({...editingCompany, totalEmployees: numValue}) 
                : setNewCompany({...newCompany, totalEmployees: numValue});
            }}
            keyboardType="numeric"
            placeholder="Enter total employees"
          />
          
          <Text style={styles.inputLabel}>Absent Today</Text>
          <TextInput 
            style={styles.input}
            value={editingCompany 
              ? editingCompany.absentToday.toString() 
              : newCompany.absentToday.toString()}
            onChangeText={(text) => {
              const numValue = parseInt(text) || 0;
              editingCompany 
                ? setEditingCompany({...editingCompany, absentToday: numValue}) 
                : setNewCompany({...newCompany, absentToday: numValue});
            }}
            keyboardType="numeric"
            placeholder="Enter absent employees"
          />
          
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => {
                setModalVisible(false);
                setEditingCompany(null);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={editingCompany ? saveEditedCompany : handleAddCompany}
            >
              <Text style={styles.modalButtonText}>
                {editingCompany ? 'Save Changes' : 'Add Company'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const DeleteModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={deleteModalVisible}
      onRequestClose={() => {
        setDeleteModalVisible(false);
        setCompanyToDelete(null);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete Company</Text>
          <Text style={styles.deleteText}>
            Are you sure you want to delete {companyToDelete?.name}?
          </Text>
          
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => {
                setDeleteModalVisible(false);
                setCompanyToDelete(null);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.deleteButton]} 
              onPress={confirmDeleteCompany}
            >
              <Text style={[styles.modalButtonText, {color: 'white'}]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const CompanyListView = () => (
    <View style={styles.companyContainer}>
      <View style={styles.companyHeader}>
        <Text style={styles.headerTitle}>Companies Overview</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingCompany(null);
            setModalVisible(true);
          }}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Company</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.companiesList}>
        {companies.map((company) => (
          <View key={company.id} style={styles.companyCardWrapper}>
            <TouchableOpacity
              style={styles.companyCard}
              onPress={() => {
                setSelectedCompany(company);
                setActiveView('dashboard');
              }}
            >
              <Building size={24} color="#4475F2" />
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{company.name}</Text>
                <Text style={styles.companyStats}>
                  {company.totalEmployees} Employees | {company.absentToday} Absent Today
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEditCompany(company)}
              >
                <Edit size={20} color="#4475F2" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDeleteCompany(company)}
              >
                <Trash2 size={20} color="#FF5C5C" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
  
      <View style={styles.analyticsContainer}>
  <Text style={styles.analyticsTitle}>Overall Companies Attendance</Text>
  <View style={{ height: 300, flexDirection: 'row', marginTop: 20 }}>
    <YAxis
      data={[0, 20, 40, 60, 80, 100]}
      contentInset={{ top: 20, bottom: 60 }}
      svg={{ fontSize: 12, fill: '#666' }}
      numberOfTicks={5}
      formatLabel={(value) => `${value}%`}
    />
    <View style={{ flex: 1 }}>
      <LineChart
        style={{ flex: 1 }}
        data={companies.map(company => 
          ((company.totalEmployees - company.absentToday) / company.totalEmployees) * 100
        )}
        svg={{ stroke: '#4475F2', strokeWidth: 2 }}
        contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
      >
        <Grid />
      </LineChart>
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
  </View>
</View>

      <CompanyModal />
      <DeleteModal />
    </View>
  );

  const CompanyDashboardView = () => {
    if (!selectedCompany) return null;

    const onTimeData = selectedCompany.attendanceData.map((item) => item.onTime);
    const lateData = selectedCompany.attendanceData.map((item) => item.late);
    const labels = selectedCompany.attendanceData.map((item) => item.day);

    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setSelectedCompany(null);
              setActiveView('companies');
            }}
          >
            <Text style={styles.backButtonText}>← Back to Companies</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedCompany.name} Dashboard</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>

        <View style={styles.statsContainer} >
          <TouchableOpacity 
            style={styles.statBox} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EmployeesDashboard')}>
            <Text style={styles.statTitle}>Total Employees</Text>
            <Text style={styles.statValue}>{selectedCompany.totalEmployees}</Text>
          </TouchableOpacity>
          <View style={styles.statBox}>
           
              <Text style={styles.statTitle}>Present Today</Text>
              <Text style={styles.statValue}>
                {selectedCompany.totalEmployees - selectedCompany.absentToday}
              </Text>
           
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Absent Today</Text>
            <Text style={styles.statValue}>{selectedCompany.absentToday}</Text>
          </View>
        </View>

 <View style={styles.chartContainer}>
  <Text style={styles.chartTitle}>Weekly Attendance</Text>
  
  <View style={{ height: 250, flexDirection: 'row' }}>
  <YAxis
    data={[0, 20, 40, 60, 80, 100]}
    contentInset={{ top: 20, bottom: 30 }}
    svg={{ fontSize: 12, fill: '#666' }}
    numberOfTicks={6}
    formatLabel={(value) => `${value}%`}
  />

  <BarChart
    style={{ flex: 1, marginLeft: 10 }}
    data={[
      {
        data: onTimeData.map(value => (value / selectedCompany.totalEmployees) * 100),
        svg: { fill: '#4475F2' }
      },
      {
        data: lateData.map(value => (value / selectedCompany.totalEmployees) * 100),
        svg: { fill: '#FF5C5C' }
      }
    ]}
    yMax={100}
    yMin={0}
    contentInset={{ top: 20, bottom: 30 }}
    spacingInner={0.4}
  >
    <Grid />
  </BarChart>
</View>

<XAxis
  style={{ marginHorizontal: 30 }}
  data={labels}
  formatLabel={(value, index) => labels[index]}
  contentInset={{ left: 30, right: 30 }}
  svg={{ fontSize: 12, fill: '#666' }}
  spacingInner={0.4}
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
    <YAxis
      data={[0, 20, 40, 60, 80, 100]}
      contentInset={{ top: 20, bottom: 30 }}
      svg={{ fontSize: 12, fill: '#666' }}
      numberOfTicks={6}
      formatLabel={(value) => `${value}%`}
    />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <LineChart
        style={{ flex: 1 }}
        data={selectedCompany.monthlyData}
        svg={{ stroke: '#4475F2', strokeWidth: 3 }}
        contentInset={{ top: 20, bottom: 30 }}
      >
        <Grid />
      </LineChart>
      <XAxis
  style={{ marginTop: 10 }}
  data={Array.from({ length: daysInMonth }, (_, i) => i + 1)}
  formatLabel={(value, index) => `${index + 1}`}
  contentInset={{ left: 10, right: 10 }}
  svg={{ fontSize: 10, fill: '#666' }}
  numberOfTicks={daysInMonth}
/>
    </View>
  </View>
</View>

<View style={styles.tableWrapper}>
  <ScrollView showsVerticalScrollIndicator={true}>
    <View style={styles.tableContainer}>
      <View style={styles.dateHeader}>
        <Text style={styles.nameCell}>Name</Text>
        <View style={styles.datesContainer}>
          {Array.from({ length: daysInMonth }, (_, i) => (
            <Text key={i} style={styles.dateCell}>{i + 1}</Text>
          ))}
        </View>
      </View>
      {students.map((student, studentIndex) => (
        <View key={studentIndex} style={styles.tableRow}>
          <Text style={styles.nameCell}>{student.name}</Text>
          <View style={styles.datesContainer}>
            {student.attendance.slice(0, daysInMonth).map((att, index) => (
              <Text key={index} style={styles.attendanceCell}>
                {att || '-'}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  </ScrollView>
</View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <TouchableOpacity 
          style={[styles.sidebarItem, activeView === 'companies' && styles.active]} 
          onPress={() => {
            setSelectedCompany(null);
            setActiveView('companies');
          }}
        >
          <Building size={24} color={activeView === 'companies' ? "#4475F2" : "#666"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <User size={24} color="#666" />
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
        {activeView === 'companies' ? <CompanyListView /> : <CompanyDashboardView />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8F9FB'
  },
  deleteButton: {
    backgroundColor: '#FF5C5C'
  },
  deleteText: {
    fontSize: 16,
    marginBottom: 24
  },
  sidebar: {
    width: 80,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderRightWidth: 1,
    borderRightColor: '#EAEBEF'
  },
  companyContainer: {
    padding: 24
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4475F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500'
  },
  companiesList: {
    marginTop: 24,
    gap: 16
  },
  companyCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 16,
    flex: 1
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 12,
    gap: 8
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statBox: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  companyInfo: {
    flex: 1
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  companyStats: {
    fontSize: 14,
    color: '#666'
  },
  backButton: {
    marginBottom: 16
  },
  backButtonText: {
    fontSize: 16,
    color: '#4475F2',
    fontWeight: '500'
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
    flex: 1
  },
  header: {
    marginBottom: 24,
    padding: 24
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
    marginHorizontal: 24,
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
    padding: 24
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FB'
  },
  clockText: {
    fontSize: 14,
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
  tableWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tableContainer: {
    flexDirection: 'column',
  },
  dateHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  datesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  nameCell: {
    width: '20%',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    fontWeight: '600',
    color: '#495057',
  },
  dateCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    color: '#495057',
    fontSize: 12,
  },
  attendanceCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    color: '#495057',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333'
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#EAEBEF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    backgroundColor: '#f1f1f1'
  },
  saveButton: {
    backgroundColor: '#4475F2'
  },
  modalButtonText: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333'
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
  },
  analyticsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  }
  
});

export default TeacherDashboard;