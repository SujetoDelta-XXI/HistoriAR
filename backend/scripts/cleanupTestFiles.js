import { deleteFileFromS3 } from '../src/services/s3Service.js';

/**
 * Clean up test files from S3
 */
async function cleanupTestFiles() {
  try {
    console.log('\n🧹 Cleaning up test files from S3...\n');

    const testFiles = [
      'https://historiar-storage.s3.us-east-2.amazonaws.com/images/monuments/test_1765329023309.png',
      'https://historiar-storage.s3.us-east-2.amazonaws.com/images/institutions/institution_test_1765329023309.png'
    ];

    for (const fileUrl of testFiles) {
      try {
        await deleteFileFromS3(fileUrl);
        console.log(`✅ Deleted: ${fileUrl.split('/').pop()}`);
      } catch (error) {
        console.log(`⚠️  Could not delete: ${fileUrl.split('/').pop()} - ${error.message}`);
      }
    }

    console.log('\n✨ Cleanup complete!\n');
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error.message);
  }
}

cleanupTestFiles();
