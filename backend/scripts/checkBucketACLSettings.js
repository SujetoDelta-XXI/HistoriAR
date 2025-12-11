import { GetBucketOwnershipControlsCommand } from '@aws-sdk/client-s3';
import { getS3Client, getBucketName } from '../src/config/s3.js';

/**
 * Check S3 bucket ACL and Object Ownership settings
 */
async function checkBucketACLSettings() {
  try {
    const s3Client = getS3Client();
    const bucketName = getBucketName();

    console.log(`\n🔍 Checking bucket ACL settings for: ${bucketName}\n`);

    // Check Object Ownership Controls
    try {
      const command = new GetBucketOwnershipControlsCommand({
        Bucket: bucketName,
      });

      const response = await s3Client.send(command);
      
      console.log('✅ Object Ownership Controls:');
      console.log(JSON.stringify(response.OwnershipControls, null, 2));
      
      const rule = response.OwnershipControls?.Rules?.[0]?.ObjectOwnership;
      
      if (rule === 'BucketOwnerEnforced') {
        console.log('\n⚠️  ISSUE FOUND:');
        console.log('   Bucket has "BucketOwnerEnforced" ownership.');
        console.log('   This means ACLs are DISABLED for this bucket.');
        console.log('   Any attempt to set ACLs (even implicitly) will fail.');
        console.log('\n💡 SOLUTION:');
        console.log('   1. Remove ALL ACL parameters from PutObjectCommand');
        console.log('   2. Use bucket policies for public access instead');
        console.log('   3. Or change bucket ownership to "BucketOwnerPreferred"');
      } else {
        console.log(`\n✅ Bucket ownership: ${rule}`);
        console.log('   ACLs are allowed for this bucket.');
      }
    } catch (error) {
      if (error.name === 'OwnershipControlsNotFoundError') {
        console.log('ℹ️  No Object Ownership Controls set (default behavior)');
        console.log('   ACLs should be allowed.');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('\n❌ Error checking bucket settings:', error.message);
    console.error(error);
  }
}

checkBucketACLSettings();
