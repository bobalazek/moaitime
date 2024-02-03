import mitt from 'mitt';

import { GlobalEvents } from '@moaitime/shared-common';

export const globalEventsEmitter = mitt<GlobalEvents>();
