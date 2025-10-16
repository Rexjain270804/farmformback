# Backend Changes for Multi-Crop Registration Feature

## Overview
This document details the backend schema changes implemented to support the multi-crop registration feature. The backend has been updated to accept and store multiple crop entries with detailed information for each crop.

## Schema Changes

### What Changed
The Registration schema has been updated to replace the single-crop fields with a flexible multi-crop array structure.

#### Old Schema (Removed Fields)
```javascript
presentCrop: String,
sowingDate: String,
harvestingDate: String,
cropTypes: String,
```

#### New Schema (Added)
```javascript
// Crop sub-schema for individual crop entries
const CropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  cropType: { type: String, required: true },
  variety: String,
  areaAllocated: { type: String, required: true },
  sowingDate: { type: String, required: true },
  expectedHarvestDate: String,
  irrigationMethod: String,
  expectedYield: String,
}, { _id: false })

// In RegistrationSchema
crops: [CropSchema],
```

### Crop Schema Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `cropName` | String | Yes | Name of the crop | "Rice", "Wheat", "Tomato" |
| `cropType` | String | Yes | Category of the crop | "Cereal (Rice, Wheat, Maize, etc.)", "Vegetable", "Fruit" |
| `variety` | String | No | Specific variety of the crop | "Basmati 370", "PBW-343", "Hybrid" |
| `areaAllocated` | String | Yes | Land area for this crop | "2.5 Acres", "1 Ha" |
| `sowingDate` | String | Yes | Date when crop was sown | "2025-06-15" |
| `expectedHarvestDate` | String | No | Expected harvest date | "2025-10-15" |
| `irrigationMethod` | String | No | Irrigation method used | "Drip", "Sprinkler", "Flood", "Rainfed", "Mixed" |
| `expectedYield` | String | No | Expected crop yield | "30 quintals/acre", "50 kg/ha" |

### Crop Types (Frontend Options)
- Cereal (Rice, Wheat, Maize, etc.)
- Pulse (Lentils, Chickpea, etc.)
- Vegetable
- Fruit
- Spice
- Oilseed
- Cash Crop
- Fiber Crop
- Medicinal Plant
- Other

## API Endpoints

### No Changes Required
The existing API endpoints continue to work without modification:

#### POST /api/create-order
**Purpose:** Create a registration record and Razorpay order

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "farmerName": "John Doe",
  "fatherSpouseName": "Richard Doe",
  "contactNumber": "9876543210",
  "village": "Sample Village",
  "district": "Sample District",
  "state": "Sample State",
  "totalLand": "5 Acres",
  "areaUnderNaturalHa": "2 Ha",
  "crops": [
    {
      "cropName": "Rice",
      "cropType": "Cereal (Rice, Wheat, Maize, etc.)",
      "variety": "Basmati 370",
      "areaAllocated": "2.5 Acres",
      "sowingDate": "2025-06-15",
      "expectedHarvestDate": "2025-10-15",
      "irrigationMethod": "Flood",
      "expectedYield": "30 quintals/acre"
    },
    {
      "cropName": "Wheat",
      "cropType": "Cereal (Rice, Wheat, Maize, etc.)",
      "areaAllocated": "1.5 Acres",
      "sowingDate": "2025-11-01"
    }
  ],
  "currentPractice": "Natural Farming",
  "yearsExperience": "5",
  "livestock": ["Cow", "Buffalo"]
}
```

**Response:**
```json
{
  "order": {
    "id": "order_xxx",
    "amount": 30000,
    "currency": "INR"
  },
  "registrationId": "registration_id_here"
}
```

#### POST /api/verify-payment
**Purpose:** Verify Razorpay payment and update registration status

**No changes** - Works with the new schema seamlessly.

## Data Migration (Optional)

If you have existing data with the old single-crop structure, you can migrate it using this MongoDB migration script:

```javascript
// Migration script to convert old single-crop data to new multi-crop format
db.registrations.find({
  presentCrop: { $exists: true }
}).forEach(function(doc) {
  // Create crop object from old fields
  const crop = {
    cropName: doc.presentCrop || "",
    cropType: doc.cropTypes || "",
    areaAllocated: "", // Not available in old schema
    sowingDate: doc.sowingDate || "",
    expectedHarvestDate: doc.harvestingDate || ""
  };
  
  // Update document
  db.registrations.updateOne(
    { _id: doc._id },
    {
      $set: { crops: [crop] },
      $unset: {
        presentCrop: "",
        sowingDate: "",
        harvestingDate: "",
        cropTypes: ""
      }
    }
  );
});
```

## Database Compatibility

### MongoDB Version
- Compatible with MongoDB 4.0+
- Tested with Mongoose 8.3.2

### Schema Options
- `{ _id: false }` on CropSchema: Prevents automatic ID generation for crop sub-documents
- `{ timestamps: true }` on RegistrationSchema: Automatically adds `createdAt` and `updatedAt` fields

## Validation

### Required Fields at Database Level
- Main Registration: `email`, `farmerName`, `fatherSpouseName`, `contactNumber`
- Each Crop: `cropName`, `cropType`, `areaAllocated`, `sowingDate`

### Frontend Validation
- Minimum 1 crop required (enforced by frontend Zod schema)
- All required fields validated before submission

## Testing

### Validation Tests Completed
✅ Single crop entry validation  
✅ Multiple crops validation  
✅ Missing required field rejection  
✅ Empty crops array handling  
✅ Old field removal verification  
✅ Crop data structure verification  

### Integration Tests Completed
✅ Create order endpoint simulation  
✅ Payment verification simulation  
✅ Multi-crop data storage  
✅ Payment status updates  

## Benefits of New Structure

1. **Flexibility**: Farmers can register unlimited crops
2. **Detail**: Rich information per crop (8 fields vs 4 fields)
3. **Accuracy**: Better land use tracking with area per crop
4. **Analytics**: Variety-level insights for recommendations
5. **Scalability**: Easy to add more crop-specific fields in the future

## Backward Compatibility

The new schema is **forward-compatible**:
- Old single-crop data can be migrated to the new format
- No breaking changes to API endpoints
- Existing payment flow remains unchanged

## Deployment Checklist

- [x] Update Registration schema in `src/models.registration.js`
- [x] Test schema validation
- [x] Verify API endpoints work with new structure
- [ ] Run migration script (if needed for existing data)
- [ ] Deploy backend changes
- [ ] Monitor logs for any issues
- [ ] Verify frontend-backend integration

## Support

For issues or questions regarding the backend changes, please refer to:
- Main repository: https://github.com/Rexjain270804/farmformback
- Frontend repository: https://github.com/Rexjain270804/farmformfront

## Version
Backend Version: 1.0.0 (with multi-crop support)  
Schema Last Updated: 2025-10-16
