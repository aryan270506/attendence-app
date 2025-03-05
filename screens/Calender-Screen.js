import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Dimensions 
} from 'react-native';

const AttendanceSheet = ({ navigation }) => {  // Add navigation prop
  const [currentDate, setCurrentDate] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const nameWidth = screenWidth * 0.25;
  const dateWidth = (screenWidth * 0.75) / 31;

  useEffect(() => {
    const date = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  const generateDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      dates.push(currentDate.toLocaleDateString('en-US', { day: 'numeric' }));
    }
    return dates;
  };

  const [students] = useState([
    { name: 'John Doe', attendance: Array(31).fill('') },
    { name: 'Jane Smith', attendance: Array(31).fill('') },
    { name: 'Mike Johnson', attendance: Array(31).fill('') }
  ]);

  const dates = generateDates();

  const handlePrint = () => {
    if (Platform.OS === 'web') {
      // Add print-specific styles
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          @page {
            size: landscape;
            margin: 20mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide non-essential elements during print */
          .no-print {
            display: none !important;
          }
          /* Ensure table fits on one page */
          .print-table {
            width: 100% !important;
            table-layout: fixed !important;
            page-break-inside: avoid !important;
          }
          .print-table td, .print-table th {
            padding: 8px !important;
            font-size: 12px !important;
            border: 1px solid #ddd !important;
            background-color: white !important;
          }
          .print-name-cell {
            width: 25% !important;
          }
          .print-date-cell {
            width: calc(75% / 31) !important;
          }
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.head.removeChild(style);
    } else {
      console.log('Printing functionality needs to be implemented for mobile');
    }
  };

  const renderDateHeader = () => {
    return (
      <View style={[styles.dateHeader, { className: 'print-table' }]}>
        <Text style={[styles.nameCell, { width: nameWidth, className: 'print-name-cell' }]}>Name</Text>
        {dates.map((date, index) => (
          <Text key={index} style={[styles.dateCell, { width: dateWidth, className: 'print-date-cell' }]}>{date}</Text>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.dateContainer, { className: 'no-print' }]}>
              <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('AttendanceDashboard')}  // Navigate to AttendanceDashboard
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
        <Text style={styles.currentDate}>{currentDate}</Text>
      </View>

      <View style={styles.mainHeader}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>ACME Corporation</Text>
          <Text style={styles.slogan}>Building Tomorrow Today</Text>
        </View>
        <TouchableOpacity 
          style={[styles.printButton, { className: 'no-print' }]}
          onPress={handlePrint}
        >
          <Text style={styles.printButtonText}>Print</Text>
        </TouchableOpacity>
      </View>

      {/* Add Back Button */}


      <View style={[styles.tableWrapper, { className: 'print-table' }]}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <View style={styles.tableContainer}>
            {renderDateHeader()}
            {students.map((student, studentIndex) => (
              <View key={studentIndex} style={[styles.tableRow, { className: 'print-table' }]}>
                <Text 
                  style={[styles.nameCell, { width: nameWidth, className: 'print-name-cell' }]} 
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                >
                  {student.name}
                </Text>
                {student.attendance.map((att, index) => (
                  <Text 
                    key={index} 
                    style={[styles.attendanceCell, { width: dateWidth, className: 'print-date-cell' }]}
                  >
                    {att || '-'}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dateContainer: {
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentDate: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  slogan: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  printButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  printButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tableWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
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
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  nameCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    fontWeight: '600',
    color: '#495057',
  },
  dateCell: {
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    color: '#495057',
    fontSize: 12,
  },
  attendanceCell: {
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    color: '#495057',
    fontSize: 12,
  },
  // Add styles for the back button
  backButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    margin: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AttendanceSheet;