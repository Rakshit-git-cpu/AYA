import { generateLevels } from './src/utils/levelGenerator';
import { IDOL_MINDSETS } from './src/data/idolMindsets';

const levels = generateLevels(18);
const missing = [];

levels.forEach(l => {
    if (l.personality && !IDOL_MINDSETS[l.personality]) {
        missing.push(l.personality);
    }
});

console.log('Missing personalities in IDOL_MINDSETS:', missing);
