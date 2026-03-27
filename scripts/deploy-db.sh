#!/bin/bash
# scripts/deploy-db.sh
# Run this LOCALLY to push Prisma schema to production Supabase.
# DO NOT run this on Vercel — it needs the direct connection.

echo "⚠️  WARNING: This will modify your PRODUCTION database."
echo "Make sure DIRECT_URL in .env points to your production Supabase."
echo ""
read -p "Continue? (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "Aborted."
  exit 0
fi

echo "📦 Pushing Prisma schema to production..."
npx prisma db push

echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Done! Verify tables in your Supabase dashboard:"
echo "   → User, Lead, GeneratedMessage, Subscription, ScraperCache, ProcessingJob"
echo ""
echo "🔒 Remember to switch DIRECT_URL back to your dev database in .env.local"
