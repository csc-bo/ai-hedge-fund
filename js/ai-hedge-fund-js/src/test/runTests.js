import { runTests } from './apiTest.js';

console.log('Starting API tests...');

runTests()
    .then(() => {
        console.log('All tests completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
