'use strict';

const categoryData = {
  "category_list": [
    {
      "name": "Reattempt or Delay in delivery / consignee pickup / return",
      "sub_category_list": [
        {
          "name": "Reattempt or Delay in delivery / consignee pickup",
          "self_help": null,
          "add_fields": ["bulk_awb"],
          "mandatory_fields": ["waybill number"]
        },
        {
          "name": "Delay in delivery to seller/merchant (DTO/RTO)",
          "self_help": null,
          "add_fields": ["bulk_awb"],
          "mandatory_fields": ["waybill number"]
        }
      ]
    },
    {
      "name": "Firstmile / Seller Pickup related issues",
      "sub_category_list": [
        {
          "name": "Pickup delayed / not done",
          "self_help": null,
          "add_fields": ["PUR ID"],
          "mandatory_fields": ["PUR ID"]
        },
        {
          "name": "Physical pickup done but status not updated",
          "self_help": null,
          "add_fields": ["PUR ID"],
          "mandatory_fields": ["PUR ID"]
        },
        {
          "name": "Unable to generate PUR",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["Description"]
        }
      ]
    },
    {
      "name": "Shipment not delivered (need POD) / Fake remark",
      "sub_category_list": [
        {
          "name": "Shipment marked delivered incorrectly / Need POD",
          "self_help": "incorrect_or_missing_pod",
          "add_fields": ["bulk_awb"],
          "mandatory_fields": ["waybill number"]
        },
        {
          "name": "Consignee pickup done but status not updated",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number"]
        },
        {
          "name": "Delivery or consignee pickup failed due to incorrect / fake remark",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number"]
        }
      ]
    },
    {
      "name": "Self collect / drop",
      "sub_category_list": [
        {
          "name": "",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number"]
        }
      ]
    },
    {
      "name": "Damage / Missing / Mismatch",
      "sub_category_list": [
        {
          "name": "Damage in delivered/returned shipment",
          "self_help": "damage_shipment",
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number"]
        },
        {
          "name": "Missing shipment delivered/returned",
          "self_help": "missing_shipment",
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number"]
        },
        {
          "name": "Mismatch in delivered/returned shipment",
          "self_help": "mismatch_shipment",
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number"]
        }
      ]
    },
    {
      "name": "Update shipment details",
      "sub_category_list": [
        {
          "name": "Update payment mode / COD amount",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number", "Description"]
        },
        {
          "name": "Update consignee address or phone number",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number", "Description"]
        },
        {
          "name": "Update other shipment details (E-waybill number, Pickup quantity, MOT)",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number", "Description"]
        }
      ]
    },
    {
      "name": "Cancel delivery / pickup",
      "sub_category_list": [
        {
          "name": "",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number", "Description"]
        }
      ]
    },
    {
      "name": "Claims / Finance (disputes, remittance, bank details, etc.)",
      "sub_category_list": [
        {
          "name": "Raise claim for damage/missing shipment",
          "self_help": "raise_claim",
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number", "Description"]
        },
        {
          "name": "Weight or zone dispute",
          "self_help": "weight_dispute",
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number", "Description"]
        },
        {
          "name": "Rate dispute",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number", "Description"]
        },
        {
          "name": "Download invoice / credit or debit notes",
          "self_help": "download_invoices_cn",
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "COD remittance",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Update bank account details",
          "self_help": "bank_account_details",
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Other claim/finance related queries",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        }
      ]
    },
    {
      "name": "Protect VAS",
      "sub_category_list": [
        {
          "name": "Protect fees dispute",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number"]
        },
        {
          "name": "Others",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        }
      ]
    },
    {
      "name": "Channel integration",
      "sub_category_list": [
        {
          "name": "Unable to integrate channel",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Unable to fetch order",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Unable to sync order statuses",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Other channel related issues",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        }
      ]
    },
    {
      "name": "Tech Support",
      "sub_category_list": [
        {
          "name": "Unable to manifest shipment/ create order",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "API / Plugin integration",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Unable to recharge wallet",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Request Panel training",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Schedule report / MIS",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Other tech related issues",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        }
      ]
    },
    {
      "name": "Account",
      "sub_category_list": [
        {
          "name": "Require additional services",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Contract related issue",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        },
        {
          "name": "Other account related issues",
          "self_help": null,
          "add_fields": [],
          "mandatory_fields": ["Description"]
        }
      ]
    },
    {
      "name": "Behaviour complaint against staff",
      "sub_category_list": [
        {
          "name": "",
          "self_help": null,
          "add_fields": ["list_awb"],
          "mandatory_fields": ["waybill number", "Description"]
        }
      ]
    }
  ]
};

'use strict';




module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // First, delete all existing data to avoid duplicates
      await queryInterface.bulkDelete('sub_category_mandatory_fields', null, {});
      await queryInterface.bulkDelete('sub_category_add_fields', null, {});
      await queryInterface.bulkDelete('sub_categories', null, {});
      await queryInterface.bulkDelete('categories', null, {});

      // Create categories and subcategories
      for (const categoryItem of categoryData.category_list) {
        if (!categoryItem || !categoryItem.name) continue;

        // Insert category
        const categoryInsertResult = await queryInterface.bulkInsert('categories', [{
          name: categoryItem.name,
          raised_from: 'ucp',
          created_at: new Date(),
          updated_at: new Date()
        }]);
        
        // Get the inserted category ID
        const categoryId = typeof categoryInsertResult === 'number' 
          ? categoryInsertResult 
          : (await queryInterface.sequelize.query(
              'SELECT id FROM categories ORDER BY id DESC LIMIT 1',
              { type: queryInterface.sequelize.QueryTypes.SELECT }
            ))[0].id;

        // Check if sub_category_list exists and is iterable
        if (!Array.isArray(categoryItem.sub_category_list)) {
          console.warn(`No subcategories found for category: ${categoryItem.name}`);
          continue;
        }

        // Insert subcategories for this category
        for (const subCategoryItem of categoryItem.sub_category_list) {
          if (!subCategoryItem) continue;
          
          // Skip if name is empty or null
          if (!subCategoryItem.name) {
            console.warn(`Skipping subcategory with empty name for category: ${categoryItem.name}`);
            continue;
          }

          const subCategoryInsertResult = await queryInterface.bulkInsert('sub_categories', [{
            name: subCategoryItem.name, // No longer allowing null
            self_help: subCategoryItem.self_help || null,
            category_id: categoryId,
            created_at: new Date(),
            updated_at: new Date()
          }]);

          // Get the inserted subcategory ID
          const subCategoryId = typeof subCategoryInsertResult === 'number'
            ? subCategoryInsertResult
            : (await queryInterface.sequelize.query(
                'SELECT id FROM sub_categories ORDER BY id DESC LIMIT 1',
                { type: queryInterface.sequelize.QueryTypes.SELECT }
              ))[0].id;

          // Insert add fields if they exist
          if (Array.isArray(subCategoryItem.add_fields)) {
            const addFields = subCategoryItem.add_fields
              .filter(field => typeof field === 'string')
              .map(field => ({
                field_name: field,
                sub_category_id: subCategoryId,
                created_at: new Date(),
                updated_at: new Date()
              }));
            
            if (addFields.length > 0) {
              await queryInterface.bulkInsert('sub_category_add_fields', addFields);
            }
          }

          // Insert mandatory fields if they exist
          if (Array.isArray(subCategoryItem.mandatory_fields)) {
            const mandatoryFields = subCategoryItem.mandatory_fields
              .filter(field => typeof field === 'string')
              .map(field => ({
                field_name: field,
                sub_category_id: subCategoryId,
                created_at: new Date(),
                updated_at: new Date()
              }));
            
            if (mandatoryFields.length > 0) {
              await queryInterface.bulkInsert('sub_category_mandatory_fields', mandatoryFields);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in seed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('sub_category_mandatory_fields', null, {});
    await queryInterface.bulkDelete('sub_category_add_fields', null, {});
    await queryInterface.bulkDelete('sub_categories', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};