import { sleep } from '.';
import { PromiseFn } from '../../src/PromiseFn';

export default (ms: number): PromiseFn<void> => () => sleep(ms);
