import type { UserStatus } from 'src/features/auth/api/authTypes';
import type {
  PrivilegeDto,
  PrivilegeItem,
} from 'src/features/privileges/model/privilegeTypes';

const RANK: Record<UserStatus, number> = {
  silver: 0,
  gold: 1,
  platinum: 2,
};

function isUserStatus(v: string): v is UserStatus {
  return v === 'silver' || v === 'gold' || v === 'platinum';
}

function lockedStatusText(requiredRole: UserStatus): string {
  if (requiredRole === 'gold') return 'откроется при Gold';
  if (requiredRole === 'platinum') return 'откроется при Platinum';
  return 'откроется при Silver';
}

export function splitPrivilegesByUser(
  list: PrivilegeDto[],
  userTier: UserStatus,
): { active: PrivilegeItem[]; blocked: PrivilegeItem[] } {
  const active: PrivilegeItem[] = [];
  const blocked: PrivilegeItem[] = [];

  const userR = RANK[userTier];

  for (const dto of list) {
    const role = isUserStatus(dto.role) ? dto.role : 'silver';
    const rub = Number(dto.financial_effect_rub);
    const financialRub = Number.isFinite(rub) ? rub : 0;
    const unlocked = userR >= RANK[role];

    const item: PrivilegeItem = {
      id: dto.name,
      title: dto.name,
      description: dto.short_description,
      financialRub,
      statusText: unlocked ? 'активна' : lockedStatusText(role),
    };

    if (unlocked) active.push(item);
    else blocked.push(item);
  }

  return { active, blocked };
}
