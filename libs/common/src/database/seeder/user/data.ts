import { User } from '@app/entity/user/user.entity';
import { PartialType } from '@nestjs/mapped-types';

export class SeederDataUser extends PartialType(User) {
  id: number;
  teamsUid: string;
  teamsUsername: string;
}

export const users: SeederDataUser[] = [
  {
    id: 1,
    teamsUid: 'noviceUserGithubUid',
    teamsUsername: 'noviceGithubUserName',
  },
  {
    id: 2,
    teamsUid: 'cadetGithubUid',
    teamsUsername: 'cadetGithubUsername',
  },
  {
    id: 3,
    teamsUid: 'adminGithubUid',
    teamsUsername: 'adminGithubUsername',
  },
];
