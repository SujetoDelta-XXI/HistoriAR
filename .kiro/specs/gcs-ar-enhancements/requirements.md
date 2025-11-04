# Requirements Document

## Introduction

This specification covers the enhancement of the HistoriAR platform with Google Cloud Storage integration for 3D model management, GPS-based AR functionality, and advanced search capabilities for the mobile application. The system will migrate from Cloudinary to Google Cloud Storage for 3D model storage, implement real GPS validation for AR experiences, and provide comprehensive filtering and search functionality for monuments.

## Glossary

- **Admin_Panel**: React-based web administrative interface for managing HistoriAR content
- **Mobile_App**: Flutter-based mobile application for end users
- **Backend_API**: Node.js Express server providing REST API endpoints
- **GCS**: Google Cloud Storage service for file storage (Project: gen-lang-client-0583857862, Bucket: histori_ar)
- **AR_Viewer**: Augmented reality component for displaying 3D models
- **GPS_Service**: Geolocation service for determining user position
- **Monument_Filter**: Search and filtering system for monuments
- **Model_Upload**: File upload system for 3D models

## Requirements

### Requirement 1

**User Story:** As an administrator, I want to upload 3D models to Google Cloud Storage when creating monuments, so that the models are stored securely and can be accessed by the mobile application.

#### Acceptance Criteria

1. WHEN an administrator creates a new monument, THE Admin_Panel SHALL provide a file upload interface for 3D models
2. WHEN a 3D model file is selected, THE Backend_API SHALL validate the file format is GLB or GLTF
3. WHEN a 3D model file is validated, THE Backend_API SHALL verify the file size does not exceed 50MB
4. WHEN file validation passes, THE Backend_API SHALL upload the file to GCS bucket "histori_ar/models/"
5. WHEN the upload completes successfully, THE Backend_API SHALL store the GCS URL in the Monument document

### Requirement 2

**User Story:** As an administrator, I want to replace Cloudinary with Google Cloud Storage, so that all media assets are managed through a unified cloud platform.

#### Acceptance Criteria

1. THE Backend_API SHALL remove all Cloudinary dependencies from the codebase
2. THE Backend_API SHALL integrate Google Cloud Storage SDK for file operations
3. WHEN uploading files, THE Backend_API SHALL use GCS instead of Cloudinary
4. THE Backend_API SHALL generate public URLs in the format "https://storage.googleapis.com/histori_ar/models/{filename}" with 50MB file size limit
5. THE Backend_API SHALL configure service account authentication for GCS access

### Requirement 3

**User Story:** As a mobile user, I want AR functionality to activate only when I'm near a monument, so that the experience is location-appropriate and authentic.

#### Acceptance Criteria

1. WHEN a user attempts to view AR content, THE Mobile_App SHALL request GPS location permissions
2. WHEN GPS permissions are granted, THE GPS_Service SHALL determine the user's current coordinates
3. WHEN coordinates are obtained, THE Mobile_App SHALL calculate distance to the target monument
4. IF the user is within 100 meters of the monument, THEN THE AR_Viewer SHALL activate and display the 3D model
5. IF the user is beyond 100 meters, THEN THE Mobile_App SHALL display a proximity warning message

### Requirement 4

**User Story:** As a mobile user, I want to filter and search monuments by various criteria, so that I can easily find specific historical sites of interest.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a search interface with text input for monument names
2. THE Monument_Filter SHALL support filtering by district selection
3. THE Monument_Filter SHALL support filtering by historical category (Arqueológico, Colonial, Republicano, Contemporáneo)
4. THE Monument_Filter SHALL support filtering by associated institution
5. WHEN multiple filters are applied, THE Mobile_App SHALL display monuments matching all selected criteria

### Requirement 5

**User Story:** As a mobile user, I want to search monuments by text, so that I can find specific sites by name or description.

#### Acceptance Criteria

1. WHEN a user enters text in the search field, THE Backend_API SHALL perform case-insensitive search on monument names
2. WHEN search text is provided, THE Backend_API SHALL also search monument descriptions
3. THE Backend_API SHALL return search results ordered by relevance
4. WHEN no search results are found, THE Mobile_App SHALL display an appropriate "no results" message
5. THE Mobile_App SHALL highlight search terms in the results display

### Requirement 6

**User Story:** As a system administrator, I want to configure Google Cloud Storage authentication, so that the backend can securely upload files to the histori_ar bucket.

#### Acceptance Criteria

1. THE Backend_API SHALL create a service account for project "gen-lang-client-0583857862"
2. THE Backend_API SHALL configure service account with Storage Admin permissions for bucket "histori_ar"
3. THE Backend_API SHALL use environment variables for GCS configuration (PROJECT_ID, BUCKET_NAME, KEY_FILE)
4. THE Backend_API SHALL authenticate using service account JSON credentials
5. THE Backend_API SHALL validate GCS connection on server startup

### Requirement 7

**User Story:** As a system administrator, I want proper error handling for GPS and file upload operations, so that users receive clear feedback when operations fail.

#### Acceptance Criteria

1. WHEN GPS access is denied, THE Mobile_App SHALL display a clear permission request message
2. WHEN GPS is unavailable, THE Mobile_App SHALL provide an alternative access method for AR content
3. WHEN file upload fails, THE Admin_Panel SHALL display specific error messages indicating the failure reason
4. WHEN GCS is unavailable, THE Backend_API SHALL return appropriate HTTP status codes and error messages
5. THE Backend_API SHALL log all upload and GPS-related errors for debugging purposes