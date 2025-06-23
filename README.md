# Hierarchical Table React Application

A React-based application that displays and manages hierarchical data in a table format with value allocation and variance tracking features.

## Live Demo
You can view the live application here: [Hierarchical Table Demo](https://YOUR_USERNAME.github.io/hierarchical-table-assessment)

## Features

- Hierarchical data display with parent-child relationships
- Value allocation by percentage or direct value input
- Automatic variance calculation and display
- Data persistence across page refreshes
- Responsive design for various screen sizes
- Error handling and user feedback
- Reset functionality to restore original values

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Table Structure
- The table displays hierarchical data with parent-child relationships
- Each row contains:
  - Label
  - Current Value
  - Input field
  - Allocation % button
  - Allocation Value button
  - Variance %

### Features
1. **Value Input**:
   - Enter a value in the input field
   - Use either the Allocation % or Allocation Value button to apply changes

2. **Allocation Types**:
   - **Percentage**: Increases the current value by the entered percentage
   - **Value**: Sets the value directly to the entered amount

3. **Variance Calculation**:
   - Automatically calculated when values change
   - Formula: ((new value - original value) / original value) * 100
   - Displayed with + sign for positive variances

4. **Data Persistence**:
   - All changes are automatically saved
   - Data persists across page refreshes
   - Use the Reset button to restore original values

## Technical Details

### Data Structure
The application uses a JSON structure for data:
```json
{
  "rows": [
    {
      "id": "1",
      "label": "Parent",
      "value": 100,
      "children": [
        {
          "id": "1-1",
          "label": "Child",
          "value": 50
        }
      ]
    }
  ]
}
```

### State Management
- Uses React's useState and useEffect hooks
- Implements localStorage for data persistence
- Maintains original values for variance calculation

### Error Handling
- Validates input values
- Provides user feedback for failed operations
- Gracefully handles JSON parsing errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details