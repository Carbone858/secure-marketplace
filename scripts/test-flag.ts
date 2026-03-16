import { getFeatureFlag, FEATURE_FLAG_KEYS } from '../src/lib/feature-flags';

async function testFlag() {
  console.log('Testing isReviewModerationEnabled flag...');
  try {
    const val = await getFeatureFlag(FEATURE_FLAG_KEYS.isReviewModerationEnabled);
    console.log('RESULT_VALUE:', val);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

testFlag();
