// Test script to verify address type validation
console.log('=== Address Type Validation Test ===');

// Valid address types according to backend
const validTypes = ['Home', 'Office', 'Others'];
const testTypes = ['Home', 'Office', 'Others', 'Work', 'Business', 'Other'];

console.log('Backend accepts these types:', validTypes);
console.log('Testing these types:', testTypes);

testTypes.forEach(type => {
    const isValid = validTypes.includes(type);
    const status = isValid ? '✅ VALID' : '❌ INVALID';
    console.log(`"${type}": ${status}`);
});

console.log('\n=== Test Data Examples ===');

// Valid test data
const validTestData = {
    type: "Home",
    address: "123 Main Street, Apt 4B",
    city: "Mumbai", 
    state: "Maharashtra",
    zipCode: "400001",
    isDefault: false
};

// Invalid test data (using "Work" instead of "Office")
const invalidTestData = {
    type: "Work", // This will cause validation error
    address: "Manyata tech park",
    city: "Bangalore",
    state: "Karnataka", 
    zipCode: "560001",
    isDefault: false
};

console.log('✅ Valid test data:');
console.log(JSON.stringify(validTestData, null, 2));

console.log('\n❌ Invalid test data (will fail):');
console.log(JSON.stringify(invalidTestData, null, 2));
console.log('Error: "Work" is not a valid type. Use "Office" instead.');

console.log('\n=== Validation Summary ===');
console.log('- Address Type: Must be exactly "Home", "Office", or "Others"');
console.log('- Case Sensitive: "home" or "HOME" will NOT work');
console.log('- ZIP Code: Must be exactly 6 numeric digits');
console.log('- All text fields: Respect character length limits');
