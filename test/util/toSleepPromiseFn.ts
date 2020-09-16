import { sleep } from '.';
import { PromiseFn } from '../../src/type/PromiseFn';

export default (ms: number): PromiseFn<void> => () => sleep(ms);
