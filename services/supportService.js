const { Category, SubCategory } = require('../models');

const categoriesWithDefaultSubcategory = [
  'Self collect / drop',
  'Cancel delivery / pickup',
  'Behaviour complaint against staff'
];

const selfHelpMappings = {
  incorrect_or_missing_pod: 'incorrect_or_missing_pod',
  damage_shipment: 'damage_shipment',
  missing_shipment: 'missing_shipment',
  mismatch_shipment: 'mismatch_shipment',
  raise_claim: 'raise_claim',
  weight_dispute: 'weight_dispute',
  download_invoices_cn: 'download_invoices_cn',
  bank_account_details: 'bank_account_details'
};

async function fetchCategories(raised_from) {
  return await Category.findAll({
    where: { raised_from },
    attributes: ['id', 'name'],
    include: [
      {
        model: SubCategory,
        as: 'sub_categories',
        attributes: ['id', 'name', 'self_help'],
        include: [
          { association: 'add_fields', attributes: ['field_name'] },
          { association: 'mandatory_fields', attributes: ['field_name'] }
        ]
      }
    ],
    order: [
      ['id', 'ASC'],
      [{ model: SubCategory, as: 'sub_categories' }, 'id', 'ASC']
    ]
  });
}

function createDefaultSubcategory(categoryName) {
  return {
    name: "",
    self_help: null,
    add_fields: [{ field_name: "list_awb" }],
    mandatory_fields: [
      { field_name: "waybill number" },
      ...(categoryName === "Behaviour complaint against staff" 
        ? [{ field_name: "Description" }] 
        : [])
    ]
  };
}

function formatSubCategory(subCategory) {
  return {
    name: subCategory.name,
    self_help: selfHelpMappings[subCategory.self_help] || null,
    add_fields: (subCategory.add_fields || []).map(f => f.field_name),
    mandatory_fields: (subCategory.mandatory_fields || []).map(f => f.field_name)
  };
}

function formatCategory(category) {
  let subCategoryList = category.sub_categories || [];
  
  if (subCategoryList.length === 0 && 
      categoriesWithDefaultSubcategory.includes(category.name)) {
    subCategoryList = [createDefaultSubcategory(category.name)];
  }

  return {
    name: category.name,
    sub_category_list: subCategoryList.map(formatSubCategory)
  };
}

module.exports = {
  async getSupportCategories(raised_from = 'ucp') {
    const categories = await fetchCategories(raised_from);
    return {
      category_list: (categories || []).map(formatCategory)
    };
  }
};