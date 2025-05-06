const fs = require('fs');
const path = require('path');

// Helper function to read mock data
const readMockData = (filename) => {
    try {
        const filePath = path.join(__dirname, '..', 'mockData', filename);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading mock data from ${filename}:`, error);
        // Return empty array as fallback
        return [];
    }
};

// Helper function to write mock data (for updates)
const writeMockData = (filename, data) => {
    try {
        const filePath = path.join(__dirname, '..', 'mockData', filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing mock data to ${filename}:`, error);
        return false;
    }
};

module.exports = { readMockData, writeMockData };