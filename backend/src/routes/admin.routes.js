/**
 * Admin routes for maintenance tasks
 */

import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'historiar-storage';
const REGION = process.env.AWS_REGION || 'us-east-2';

/**
 * Convert a partial path, GCS URL, or filename to a full S3 URL
 */
function toFullS3Url(value) {
  if (!value || typeof value !== 'string') {
    return value;
  }

  // Already a full S3 URL
  if (value.startsWith(`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/`)) {
    return value;
  }

  // Convert Google Cloud Storage URL to S3 URL
  // Format: https://storage.googleapis.com/bucket_name/path/to/file
  const gcsPattern = /https:\/\/storage\.googleapis\.com\/[^\/]+\/(.+)/;
  const gcsMatch = value.match(gcsPattern);
  
  if (gcsMatch) {
    const path = decodeURIComponent(gcsMatch[1]);
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${path}`;
  }

  // It's a key path (images/, models/, etc.)
  if (value.startsWith('images/') || value.startsWith('models/') || value.startsWith('documents/')) {
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${value}`;
  }

  // Can't determine the full path - return as is
  return value;
}

/**
 * GET /api/admin/check-urls
 * Check for malformed S3 URLs in the database
 */
router.get('/check-urls', async (req, res) => {
  try {
    const Monument = mongoose.model('Monument');
    
    // Find monuments with partial URLs
    const badImageUrls = await Monument.find({
      imageUrl: { $exists: true, $regex: /^[^h]/ }
    }).select('name imageUrl').limit(20);
    
    const badModelUrls = await Monument.find({
      model3DUrl: { $exists: true, $regex: /^[^h]/ }
    }).select('name model3DUrl').limit(20);

    const totalBadImages = await Monument.countDocuments({
      imageUrl: { $exists: true, $regex: /^[^h]/ }
    });
    
    const totalBadModels = await Monument.countDocuments({
      model3DUrl: { $exists: true, $regex: /^[^h]/ }
    });

    res.json({
      summary: {
        totalBadImageUrls: totalBadImages,
        totalBadModelUrls: totalBadModels,
        needsFix: totalBadImages > 0 || totalBadModels > 0
      },
      examples: {
        badImageUrls: badImageUrls.map(m => ({
          name: m.name,
          imageUrl: m.imageUrl
        })),
        badModelUrls: badModelUrls.map(m => ({
          name: m.name,
          model3DUrl: m.model3DUrl
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/fix-urls
 * Fix malformed S3 URLs in the database
 */
router.post('/fix-urls', async (req, res) => {
  try {
    const Monument = mongoose.model('Monument');
    const Institution = mongoose.model('Institution');
    
    const results = {
      monuments: { fixed: 0, errors: [] },
      institutions: { fixed: 0, errors: [] }
    };

    // Fix Monuments
    const monuments = await Monument.find({
      $or: [
        { imageUrl: { $exists: true, $ne: null } },
        { model3DUrl: { $exists: true, $ne: null } },
        { model3DTilesUrl: { $exists: true, $ne: null } }
      ]
    });

    for (const monument of monuments) {
      try {
        let updated = false;
        const updates = {};

        // Fix imageUrl
        if (monument.imageUrl && !monument.imageUrl.startsWith('https://')) {
          const newUrl = toFullS3Url(monument.imageUrl);
          if (newUrl !== monument.imageUrl) {
            updates.imageUrl = newUrl;
            updated = true;
          }
        }

        // Fix model3DUrl
        if (monument.model3DUrl && !monument.model3DUrl.startsWith('https://')) {
          const newUrl = toFullS3Url(monument.model3DUrl);
          if (newUrl !== monument.model3DUrl) {
            updates.model3DUrl = newUrl;
            updated = true;
          }
        }

        // Fix model3DTilesUrl
        if (monument.model3DTilesUrl && !monument.model3DTilesUrl.startsWith('https://')) {
          const newUrl = toFullS3Url(monument.model3DTilesUrl);
          if (newUrl !== monument.model3DTilesUrl) {
            updates.model3DTilesUrl = newUrl;
            updated = true;
          }
        }

        if (updated) {
          await Monument.updateOne({ _id: monument._id }, { $set: updates });
          results.monuments.fixed++;
        }
      } catch (error) {
        results.monuments.errors.push({
          monumentId: monument._id,
          name: monument.name,
          error: error.message
        });
      }
    }

    // Fix Institutions
    const institutions = await Institution.find({
      imageUrl: { $exists: true, $ne: null }
    });

    for (const institution of institutions) {
      try {
        if (institution.imageUrl && !institution.imageUrl.startsWith('https://')) {
          const newUrl = toFullS3Url(institution.imageUrl);
          if (newUrl !== institution.imageUrl) {
            await Institution.updateOne(
              { _id: institution._id },
              { $set: { imageUrl: newUrl } }
            );
            results.institutions.fixed++;
          }
        }
      } catch (error) {
        results.institutions.errors.push({
          institutionId: institution._id,
          name: institution.name,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'URL fix completed',
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
