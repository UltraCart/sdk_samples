Webhooks are asynchronous outbound notifications of events to an external server.  For a complete description of Webhooks, please see:

```
Topics -> Webhooks
```

The Webhook resource allows for programmatic configuration of Webhooks on an UltraCart account.  This document
only covers the configuration of webhooks.  Please consult each individual resource for details on the webhooks
that a particular resource supports.

An example usage of this webhook resource is a Wordpress plugin creating a webhook so that item related events
trigger webhook notifications to the Wordpress server so it can update it's local cache.