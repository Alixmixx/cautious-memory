#!/bin/bash

# Generate TypeScript types from Supabase
npx supabase gen types typescript --project-id kdoavpelmfupojdxoynw > packages/database-types/src/database.types.ts

echo "✅ Database types generated successfully!"
echo "📁 Updated: packages/database-types/src/database.types.ts"