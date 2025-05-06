const athenaExpress = require("../athena");

async function getCustomerOutstanding(customer_id, as_on_date) {
  const date = as_on_date || new Date().toISOString().split("T")[0];

const query = `
SELECT 
      la.customer_id,
      sum(sl.emi_amt) as emi_amt,
      sum(cla.total_overdue) as total_overdue,
      mc.meeting_date as meeting_date
      
FROM dms_base_data.meeting_collection as mc
JOIN dms_base_data.collection_loan_application as cla
    ON mc.center_id = cla.center_id 
    and mc.id = cla.meeting_collection_id 
    and cast(mc.meeting_date AS DATE) = current_date
join dms_base_data.sanctioned_loans as sl
    on mc.center_id = sl.center_id and cla.loan_application_id = sl.loan_application_id
JOIN dms_base_data.loan_application as la
    ON la.id = cla.loan_application_id and la.status='DISBURSED'
where la.customer_id = CAST(${customer_id} AS INTEGER)
group by la.customer_id,mc.meeting_date`;
  const results = await athenaExpress.query(query);
  return results.Items[0];
}
module.exports = getCustomerOutstanding;
