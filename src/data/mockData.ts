import { Assignment, Course, Notification, MarksEntry, UserSettings } from '../types';

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'React Components Assignment',
    course: 'Web Development',
    description: '# React Components Assignment\n\nCreate a fully functional React application with the following components:\n\n## Requirements\n- Use functional components with hooks\n- Implement proper state management\n- Add responsive design\n- Include error handling\n\n## Deliverables\n- Source code\n- Live demo\n- Documentation',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    status: 'pending',
    priority: 'high',
    downloadLink: '/files/react-assignment.pdf',
    aiResponseFile: '/files/react-solution.docx'
  },
  {
    id: '2',
    title: 'Database Design Project',
    course: 'Database Systems',
    description: '# Database Design Project\n\nDesign a comprehensive database for a library management system.\n\n## Tasks\n1. Create ER diagram\n2. Normalize to 3NF\n3. Write SQL queries\n4. Implement triggers',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    status: 'pending',
    priority: 'medium',
    downloadLink: '/files/database-project.pdf'
  },
  {
    id: '3',
    title: 'Machine Learning Model',
    course: 'Artificial Intelligence',
    description: '# ML Model Implementation\n\nBuild a classification model using Python and scikit-learn.\n\n## Requirements\n- Data preprocessing\n- Model training\n- Performance evaluation\n- Report generation',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    status: 'completed',
    priority: 'high',
    downloadLink: '/files/ml-assignment.pdf',
    aiResponseFile: '/files/ml-solution.py'
  },
  {
    id: '4',
    title: 'Network Security Analysis',
    course: 'Cybersecurity',
    description: '# Network Security Analysis\n\nAnalyze network vulnerabilities and propose security measures.\n\n## Deliverables\n- Vulnerability assessment\n- Security recommendations\n- Implementation plan',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Software Testing Report',
    course: 'Software Engineering',
    description: '# Software Testing Report\n\nComprehensive testing of a web application.\n\n## Testing Types\n- Unit testing\n- Integration testing\n- System testing\n- User acceptance testing',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    status: 'completed',
    priority: 'low'
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Web Development',
    color: '#0061f2',
    assignments: mockAssignments.filter(a => a.course === 'Web Development')
  },
  {
    id: '2',
    name: 'Database Systems',
    color: '#00b6ff',
    assignments: mockAssignments.filter(a => a.course === 'Database Systems')
  },
  {
    id: '3',
    name: 'Artificial Intelligence',
    color: '#28a745',
    assignments: mockAssignments.filter(a => a.course === 'Artificial Intelligence')
  },
  {
    id: '4',
    name: 'Cybersecurity',
    color: '#ffc107',
    assignments: mockAssignments.filter(a => a.course === 'Cybersecurity')
  },
  {
    id: '5',
    name: 'Software Engineering',
    color: '#dc3545',
    assignments: mockAssignments.filter(a => a.course === 'Software Engineering')
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    assignment: 'React Components Assignment',
    course: 'Web Development',
    sentTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    channel: 'email'
  },
  {
    id: '2',
    assignment: 'Database Design Project',
    course: 'Database Systems',
    sentTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
    channel: 'whatsapp'
  },
  {
    id: '3',
    assignment: 'Network Security Analysis',
    course: 'Cybersecurity',
    sentTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    channel: 'both'
  }
];

export const mockMarksEntries: MarksEntry[] = [
  {
    id: '1',
    assignmentName: 'React Basics Quiz',
    course: 'Web Development',
    marksObtained: 85,
    totalMarks: 100,
    dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    assignmentName: 'CSS Flexbox Assignment',
    course: 'Web Development',
    marksObtained: 92,
    totalMarks: 100,
    dateAdded: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    assignmentName: 'SQL Queries Test',
    course: 'Database Systems',
    marksObtained: 78,
    totalMarks: 100,
    dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    assignmentName: 'ER Diagram Design',
    course: 'Database Systems',
    marksObtained: 88,
    totalMarks: 100,
    dateAdded: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  },
  {
    id: '5',
    assignmentName: 'Neural Networks Lab',
    course: 'Artificial Intelligence',
    marksObtained: 90,
    totalMarks: 100,
    dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: '6',
    assignmentName: 'Decision Trees Implementation',
    course: 'Artificial Intelligence',
    marksObtained: 76,
    totalMarks: 100,
    dateAdded: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
  }
];

export const mockUserSettings: UserSettings = {
  email: 'student@university.edu',
  notificationPreferences: 'both',
  theme: 'light',
  name: 'Alex Johnson',
  studentId: 'ST2024001'
};