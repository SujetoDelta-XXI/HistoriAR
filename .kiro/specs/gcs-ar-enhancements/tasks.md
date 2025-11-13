# Implementation Plan

- [x] 1. Set up Google Cloud Storage infrastructure and authentication

  - Create service account for project "gen-lang-client-0583857862" with Storage Admin permissions
  - Generate and configure service account JSON credentials
  - Set up environment variables for GCS configuration (PROJECT_ID, BUCKET_NAME, GOOGLE_APPLICATION_CREDENTIALS)
  - Verify bucket "histori_ar" access and create folder structure (models/, images/)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 2. Migrate backend from Cloudinary to Google Cloud Storage

- [x] 2.1 Remove Cloudinary dependencies and install GCS SDK

  - Remove cloudinary and multer-storage-cloudinary packages from package.json
  - Install @google-cloud/storage package
  - Update imports and remove Cloudinary configuration
  - _Requirements: 2.1, 2.2_

- [x] 2.2 Implement GCS service layer

  - Create services/gcsService.js with upload, delete, and URL generation methods
  - Implement file validation for GLB/GLTF formats and 50MB size limit
  - Add error handling for GCS operations
  - _Requirements: 1.2, 1.3, 2.4_

- [x] 2.3 Update upload middleware and routes

  - Replace Cloudinary upload middleware with GCS implementation
  - Update /api/uploads routes to use GCS service
  - Modify monument creation/update endpoints to handle GCS URLs
  - _Requirements: 1.1, 1.4, 1.5, 2.3_

- [x] 2.4 Write unit tests for GCS integration

  - Test file upload validation and size limits
  - Test GCS URL generation and file operations
  - Mock GCS service for testing environment
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Update database schema and migrate existing data

- [x] 3.1 Update Monument model for GCS URLs

  - Modify Monument schema to use GCS URLs instead of Cloudinary
  - Add gcsFileName field for file management
  - Update database indexes for search optimization
  - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2_

- [x] 3.2 Create data migration script

  - Script to update existing Monument records with placeholder GCS URLs
  - Keep HistoricalData model unchanged for now (future enhancement)
  - Backup existing data before migration

  - _Requirements: 2.1, 2.4_

- [x] 4. Enhance backend search and filtering API

- [x] 4.1 Implement advanced search endpoints

  - Create /api/monuments/search endpoint with text, district, category, institution filters
  - Add text indexing on Monument name and description fields
  - Implement case-insensitive search with relevance scoring
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3_

- [x] 4.2 Add pagination and query optimization

  - Implement pagination for search results
  - Add query performance optimization with proper indexing
  - Create endpoint for filter options (districts, categories, institutions)
  - _Requirements: 4.5, 5.4_

- [x] 4.3 Write API tests for search functionality

  - Test search with various filter combinations
  - Test pagination and performance with large datasets
  - Test error handling for invalid search parameters
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5. Update React admin panel for GCS integration


- [x] 5.1 Create 3D model upload component

  - Build file picker component for GLB/GLTF files with drag-and-drop
  - Add file validation (format and 50MB size limit) on frontend
  - Implement upload progress indicator and error handling
  - _Requirements: 1.1, 1.2, 1.3, 7.3_

- [x] 5.2 Update MonumentsManager for GCS uploads

  - Integrate 3D model upload in monument creation/edit forms
  - Display current model URL and preview option
  - Add replace model functionality for existing monuments
  - _Requirements: 1.1, 1.4, 1.5_

- [x] 5.3 Remove all Cloudinary references from admin panel

  - Update image upload components to use GCS
  - Remove Cloudinary configuration and dependencies
  - Update UI to show GCS URLs instead of Cloudinary URLs
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 6. Implement GPS service in Flutter mobile app






- [x] 6.1 Set up location permissions and GPS service



  - Add location permissions to Android manifest and iOS Info.plist
  - Implement GPSService class with getCurrentLocation and calculateDistance methods
  - Add permission request handling with user-friendly dialogs
  - _Requirements: 3.1, 3.2, 7.1_

- [x] 6.2 Create proximity validation logic



  - Implement 10-meter proximity check for AR activation
  - Add distance calculation between user location and monument coordinates
  - Create user feedback for proximity status (too far, getting closer, in range)
  - _Requirements: 3.3, 3.4, 3.5_

- [ ] 6.3 Write tests for GPS functionality



  - Unit tests for distance calculation algorithms
  - Integration tests for location permission flow
  - Mock location services for testing
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 7. Integrate ARCore for 3D model rendering
- [ ] 7.1 Set up ARCore dependencies and configuration

  - Add ARCore plugin to Flutter pubspec.yaml
  - Configure Android manifest for ARCore requirements
  - Add ARCore availability check and fallback handling
  - _Requirements: 3.4, 7.2, 7.5_

- [ ] 7.2 Implement AR viewer with GCS model loading

  - Create ARViewerScreen with ARCore session initialization
  - Implement 3D model loading from GCS URLs
  - Add model placement and interaction in AR space
  - _Requirements: 1.5, 3.4, 3.5_

- [ ] 7.3 Add AR error handling and fallbacks

  - Handle ARCore not supported devices with 2D model viewer fallback
  - Implement GPS accuracy requirements for AR activation
  - Add user guidance for optimal AR experience
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 8. Implement advanced search and filtering in Flutter
- [ ] 8.1 Create search and filter UI components

  - Build search bar with text input and real-time suggestions
  - Create filter chips for district, category, and institution selection
  - Implement filter combination and clear filters functionality
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 8.2 Integrate search API with Flutter app

  - Connect search UI to backend search endpoints
  - Implement debounced search to optimize API calls
  - Add loading states and error handling for search operations
  - _Requirements: 4.5, 5.1, 5.2, 5.3, 5.4_

- [ ] 8.3 Update monument list and map views with filtering

  - Apply search filters to monument list display
  - Update map markers based on active filters
  - Add search result highlighting and "no results" messaging
  - _Requirements: 4.5, 5.4, 5.5_

- [ ] 8.4 Write widget tests for search components

  - Test filter UI interactions and state management
  - Test search input validation and API integration
  - Test filter combination logic and result display
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 9. Implement comprehensive error handling and logging
- [ ] 9.1 Add backend error handling for GCS and GPS operations

  - Implement structured error responses for GCS upload failures
  - Add logging for all GCS operations and search queries
  - Create health check endpoint for GCS connectivity
  - _Requirements: 7.3, 7.4, 7.5_

- [ ] 9.2 Enhance Flutter error handling

  - Add user-friendly error messages for GPS and AR failures
  - Implement retry mechanisms for network operations
  - Add offline mode detection and appropriate messaging
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 10. Integration testing and deployment preparation
- [ ] 10.1 End-to-end testing of complete workflow

  - Test admin panel: create monument with 3D model upload to GCS
  - Test mobile app: search monuments, GPS proximity check, AR activation
  - Verify GCS URLs work correctly in both admin and mobile environments
  - _Requirements: All requirements integration_

- [ ] 10.2 Performance testing and optimization

  - Load test GCS upload with multiple concurrent files
  - Test search performance with large monument datasets
  - Optimize AR model loading and rendering performance
  - _Requirements: Performance considerations_

- [ ] 10.3 Update documentation and deployment configuration
  - Update environment variable documentation for GCS configuration
  - Create deployment guide for service account setup
  - Document new API endpoints and Flutter app features
  - _Requirements: 6.1, 6.2, 6.3, 6.4_
