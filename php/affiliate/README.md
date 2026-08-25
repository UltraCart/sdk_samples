# Affiliate API

The Affiliate API lets you manage the affiliates in your UltraCart account's active affiliate
program: search them, retrieve a single affiliate, create new ones, update existing ones, and
remove (disable) them.

## Samples

| Sample | HTTP | Description |
|--------|------|-------------|
| getAffiliatesByQuery.php | POST /affiliate/affiliates/query | Search affiliates with a query object, with limit/offset/sort paging |
| getAffiliate.php | GET /affiliate/affiliates/{affiliate_oid} | Retrieve a single affiliate by oid |
| insertAffiliate.php | POST /affiliate/affiliates | Create a new affiliate |
| updateAffiliate.php | PUT /affiliate/affiliates/{affiliate_oid} | Update an existing affiliate (full replacement) |
| deleteAffiliate.php | DELETE /affiliate/affiliates/{affiliate_oid} | Disable (soft delete) an affiliate |

## Notes

- Affiliates are scoped to your account's active affiliate program.
- `updateAffiliate` is a full replacement (PUT): any field you omit is reset to its default, with the
  single exception of `password`, which is left unchanged when not supplied. The safe pattern is
  get -> modify -> update.
- `deleteAffiliate` is a soft delete: the affiliate is disabled within the program, but their click
  and ledger history is preserved and stops appearing in the default active-only listings.
- Read operations require the `affiliate_read` scope; write and delete operations require
  `affiliate_write`.

`getClicksByQuery` and `getLedgersByQuery` are also available on the Affiliate API for click and
ledger reporting.
