import { CleanMode, CleanModeValue } from '@agnoc/domain';
import { flipObject } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

const DOMAIN_TO_ROBOT = {
  [CleanModeValue.Auto]: 1,
  [CleanModeValue.Border]: 3,
  [CleanModeValue.Mop]: 4,
};

const ROBOT_TO_DOMAIN = flipObject(DOMAIN_TO_ROBOT);

export class CleanModeMapper implements Mapper<CleanMode, number> {
  toDomain(cleanMode: number): CleanMode {
    return new CleanMode(ROBOT_TO_DOMAIN[cleanMode]);
  }

  fromDomain(cleanMode: CleanMode): number {
    return DOMAIN_TO_ROBOT[cleanMode.value];
  }
}
