# SDK Publishing Issues — Java & C# behind on 4.1.74

Hey Perry — while bumping `sdk_samples` to SDK **4.1.74** to write samples for the new `cancelAutoOrderItemByReferenceOrderId` method, I found that two language SDKs haven't been published up to that version. The other five are fine.

## Status across languages

| Language   | Target  | Latest published | Status   |
|------------|---------|------------------|----------|
| Ruby       | 4.1.74  | 4.1.74           | OK       |
| JavaScript | 4.1.74  | 4.1.74           | OK       |
| TypeScript | 4.1.74  | 4.1.74           | OK       |
| PHP        | 4.1.74  | 4.1.74           | OK       |
| Python     | 4.1.74  | 4.1.74           | OK       |
| **Java**   | 4.1.74  | **4.1.13**       | **Behind** |
| **C#**     | 4.1.74  | **4.1.66**       | **Behind** |

## Java — `com.ultracart:rest-sdk` on Maven Central

- Highest published version: **4.1.13** (timestamped 2025‑05‑20)
- Source: `https://search.maven.org/solrsearch/select?q=g:com.ultracart+AND+a:rest-sdk&core=gav&rows=20&wt=json`
- Error seen locally:
  ```
  [ERROR] Could not find artifact com.ultracart:rest-sdk:jar:4.1.74 in central
  ```
- Gap: **61 versions behind** (4.1.14 … 4.1.74)

Looks like Java publishing may have broken around 4.1.13 in May 2025.

## C# — `com.ultracart.admin.v2` on NuGet.org

- Highest published version: **4.1.66**
- Source: `https://api.nuget.org/v3-flatcontainer/com.ultracart.admin.v2/index.json`
- Error seen locally:
  ```
  Unable to find version '4.1.74' of package 'com.ultracart.admin.v2'.
  Package 'com.ultracart.admin.v2.4.1.74' is not found on source 'https://api.nuget.org/v3/index.json'.
  ```
- Gap: **8 versions behind** (4.1.67 … 4.1.74)

C# is much closer — likely just a few missed publishes rather than a broken pipeline.

## What I need

1. **Java**: republish `com.ultracart:rest-sdk` up through 4.1.74 on Maven Central (or confirm which version is the real "latest" if the pipeline needs fixing first).
2. **C#**: publish 4.1.67 → 4.1.74 of `com.ultracart.admin.v2` on NuGet.org.

Once published, I'll re‑run `mvn package` / `nuget restore` on my side and finish the Java and C# samples for `cancelAutoOrderItemByReferenceOrderId`. In the meantime I'm moving ahead with the other five languages.
